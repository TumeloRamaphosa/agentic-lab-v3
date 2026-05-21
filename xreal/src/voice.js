/**
 * Voice output. Prefers ElevenLabs via the local /tts proxy (key stays
 * server-side — see server.mjs). Falls back to the browser's built-in
 * Web Speech API so it still talks with no key / no server.
 *
 * Optional per-agent voices: pass a voiceId to speak() to route a specific
 * agent (Robusca, Charlie, …) to their ElevenLabs voice.
 */
let enabled = false;
let current = null;

export function setVoiceEnabled(v) { enabled = v; if (!v) stop(); }
export function voiceEnabled() { return enabled; }

export function stop() {
  if (current) { current.pause(); current = null; }
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

export async function speak(text, voiceId) {
  if (!enabled || !text) return;
  stop();
  // 1) ElevenLabs proxy
  try {
    const url = `/tts?text=${encodeURIComponent(text)}${voiceId ? `&voice=${encodeURIComponent(voiceId)}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    if (res.ok && (res.headers.get("content-type") || "").includes("audio")) {
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      current = audio;
      await audio.play();
      return;
    }
  } catch { /* fall through to Web Speech */ }
  // 2) Web Speech fallback
  if (typeof speechSynthesis !== "undefined") {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0; u.pitch = 1.0;
    speechSynthesis.speak(u);
  }
}
