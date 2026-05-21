// Playwright smoke for the XREAL viewer: serve dist, load it, assert the
// WebGL canvas mounts, the graph metadata renders, no console errors, screenshot.
// Run: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node verify/check.mjs
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 4321;
const server = spawn("node", ["server.mjs"], { env: { ...process.env, PORT }, stdio: ["ignore", "pipe", "pipe"] });
let log = ""; server.stdout.on("data", (d) => (log += d)); server.stderr.on("data", (d) => (log += d));

const done = (code, msg) => { console[code ? "error" : "log"](msg); server.kill("SIGKILL"); process.exit(code); };

try {
  let up = false;
  for (let i = 0; i < 30; i++) { await sleep(500);
    try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) { up = true; break; } } catch {} }
  if (!up) done(1, "server did not start\n" + log);

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector("#app canvas", { state: "attached", timeout: 20000 });
  // wait until the graph metadata text resolves (proves graph.json fetched + parsed)
  await page.waitForFunction(() => {
    const t = document.getElementById("meta")?.textContent || "";
    return /notes/.test(t) && !/loading/.test(t);
  }, { timeout: 20000 });
  const metaText = await page.$eval("#meta", (e) => e.textContent);

  const webgl = await page.evaluate(() => {
    const c = document.querySelector("#app canvas");
    if (!c) return false;
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  });

  await sleep(1500);
  await page.screenshot({ path: "dist/xreal-verify.png" });
  await browser.close();

  // favicon.ico 404 and the no-key /tts 204 are environmental, not app errors.
  const realErrors = errors.filter((e) => !/favicon|tts|\b204\b|Failed to load resource.*40[34]/i.test(e));
  if (!webgl) done(1, "FAIL: no WebGL context on canvas");
  if (realErrors.length) done(1, "FAIL: console errors:\n  " + realErrors.slice(0, 6).join("\n  "));
  done(0, `PASS: canvas+WebGL up, graph loaded (${metaText}), 0 console errors, screenshot dist/xreal-verify.png`);
} catch (e) { done(1, "FAIL: " + e.message); }
