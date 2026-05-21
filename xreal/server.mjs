/**
 * Tiny static server + ElevenLabs TTS proxy.
 * The ElevenLabs key NEVER reaches the browser — it lives here in env.
 *
 *   ELEVENLABS_API_KEY=...  ELEVENLABS_VOICE_ID=...  node server.mjs
 *   (serves ./dist on :4321, proxies GET /tts?text=...&voice=...)
 *
 * Build first: npm run build
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = process.env.PORT || 4321;
const ROOT = join(process.cwd(), "dist");
const KEY = process.env.ELEVENLABS_API_KEY || "";
const DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png" };

async function tts(text, voice, res) {
  if (!KEY) { res.writeHead(204).end(); return; } // no key → browser uses Web Speech fallback
  const vid = voice || DEFAULT_VOICE;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  });
  if (!r.ok) { res.writeHead(502).end(await r.text()); return; }
  res.writeHead(200, { "content-type": "audio/mpeg" });
  res.end(Buffer.from(await r.arrayBuffer()));
}

createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (u.pathname === "/tts") {
    try { await tts(u.searchParams.get("text") || "", u.searchParams.get("voice"), res); }
    catch (e) { res.writeHead(500).end(String(e)); }
    return;
  }
  let p = normalize(u.pathname === "/" ? "/index.html" : u.pathname).replace(/^(\.\.[/\\])+/, "");
  try {
    const buf = await readFile(join(ROOT, p));
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(PORT, () => console.log(`StudEx XREAL viewer on http://localhost:${PORT}  (TTS ${KEY ? "via ElevenLabs" : "fallback: Web Speech"})`));
