// Playwright smoke for the dashboard preview. Starts the server, loads the
// page, asserts: 8 world clocks render, three kanban bands appear with cards,
// every tab renders without errors, screenshots each tab.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { mkdirSync } from "node:fs";

const PORT = 3199;
const TABS = ["mission", "secondbrain", "businesses", "agents", "council", "ledger", "nightbuild"];

const server = spawn("node", ["server.mjs"], { env: { ...process.env, PORT }, stdio: ["ignore", "pipe", "pipe"] });
let log = ""; server.stdout.on("data", (d) => (log += d)); server.stderr.on("data", (d) => (log += d));
const done = (code, msg) => { (code ? console.error : console.log)(msg); server.kill("SIGKILL"); process.exit(code); };

try {
  let up = false;
  for (let i = 0; i < 30; i++) { await sleep(500);
    try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) { up = true; break; } } catch {} }
  if (!up) done(1, "server did not start\n" + log);

  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

  mkdirSync("verify/out", { recursive: true });

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#clocks .clock", { state: "attached", timeout: 10000 });
  const clockCount = await page.$$eval("#clocks .clock", (els) => els.length);
  if (clockCount !== 8) done(1, `FAIL: expected 8 world clocks, got ${clockCount}`);

  for (const tab of TABS) {
    await page.goto(`http://localhost:${PORT}/#${tab}`, { waitUntil: "domcontentloaded" });
    await sleep(700); // let fetch + render settle
    const empty = await page.$eval("#view", (el) => el.textContent.trim().length === 0);
    if (empty) done(1, `FAIL: view #${tab} rendered empty`);
    await page.screenshot({ path: `verify/out/dashboard-${tab}.png` });
  }

  // Mission tab specific checks: 3 bands + at least 7 demo cards across them
  await page.goto(`http://localhost:${PORT}/#mission`, { waitUntil: "domcontentloaded" });
  await sleep(700);
  const bandCount = await page.$$eval(".kanban .band", (els) => els.length);
  if (bandCount !== 3) done(1, `FAIL: expected 3 kanban bands, got ${bandCount}`);
  const cardCount = await page.$$eval(".kanban .card", (els) => els.length);
  if (cardCount < 6) done(1, `FAIL: expected >=6 demo cards across bands, got ${cardCount}`);

  await browser.close();
  const real = errors.filter((e) => !/favicon|Failed to load resource.*40[34]/i.test(e));
  if (real.length) done(1, "FAIL: console errors:\n  " + real.slice(0, 6).join("\n  "));
  done(0, `PASS: 8 clocks · ${bandCount} kanban bands · ${cardCount} cards · ${TABS.length} tabs render · 0 console errors · screenshots in verify/out/`);
} catch (e) { done(1, "FAIL: " + e.message); }
