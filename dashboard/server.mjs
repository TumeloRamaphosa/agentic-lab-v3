/**
 * Dashboard preview server. Serves dashboard/public/ + small JSON endpoints
 * over the registry configs we already have. Zero deps.
 *
 *   node dashboard/server.mjs           # http://localhost:3141
 *
 * Endpoints:
 *   GET /api/businesses   -> factory/config/businesses.json
 *   GET /api/roster       -> valley/agents/roster.json
 *   GET /api/rag-status   -> rag/status.json (404 if no sync yet)
 *   GET /api/missions     -> valley/mission.json (or a small demo board)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..");
const PUB = join(here, "public");
const PORT = Number(process.env.PORT || 3141);

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

const DEMO_BOARD = {
  Queued: [
    { id: 101, title: "Reply to meat customer on WhatsApp",   agent: "charlie" },
    { id: 102, title: "Draft SGM partner follow-up",          agent: "research" },
    { id: 103, title: "Studex Coffee landing A/B variants",   agent: "the-lady" },
  ],
  Running: [
    { id: 100, title: "Cursor BG · refactor memory layer",    agent: "cto" },
    { id: 99,  title: "Night Build sandbox template polish",  agent: "skunkworks" },
  ],
  Done: [
    { id: 98, title: "WhatsApp queue cleared (12 msgs)",      agent: "charlie" },
    { id: 97, title: "Restart DenchClaw · OOM fixed",         agent: "drfixit" },
  ],
};

async function serveJson(res, path) {
  if (!existsSync(path)) { res.writeHead(404, { "content-type": "application/json" }).end("null"); return; }
  res.writeHead(200, { "content-type": "application/json" });
  res.end(await readFile(path));
}

async function serveMissions(res) {
  const p = join(repo, "valley/mission.json");
  if (existsSync(p)) {
    const data = JSON.parse(await readFile(p, "utf8"));
    const board = { Queued: [], Running: [], Done: [] };
    for (const it of data.items ?? []) (board[it.col] ??= []).push(it);
    res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ board }));
    return;
  }
  res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ board: DEMO_BOARD }));
}

createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://localhost:${PORT}`);
    if (u.pathname === "/api/businesses") return serveJson(res, join(repo, "factory/config/businesses.json"));
    if (u.pathname === "/api/roster")     return serveJson(res, join(repo, "valley/agents/roster.json"));
    if (u.pathname === "/api/rag-status") return serveJson(res, join(repo, "rag/status.json"));
    if (u.pathname === "/api/missions")   return serveMissions(res);

    let p = normalize(u.pathname === "/" ? "/index.html" : u.pathname).replace(/^(\.\.[/\\])+/, "");
    const buf = await readFile(join(PUB, p));
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" }).end("not found");
  }
}).listen(PORT, () => console.log(`StudEx dashboard preview on http://localhost:${PORT}`));
