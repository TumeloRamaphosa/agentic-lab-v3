/**
 * ElevenLabs — voice for every agent. Configured = key present.
 * Real status hit deferred; we don't probe per request to avoid quota.
 */
export default {
  name: "elevenlabs",
  display: "ElevenLabs",
  role: "media",
  agentHint: "the-lady",
  description: "TTS voice plane. Robusca's morning briefing, the 09:00 Council, Charlie on WhatsApp — each agent has its own voice id.",
  envKey: "ELEVENLABS_API_KEY",
  docsUrl: "https://elevenlabs.io/docs",
  async status() {
    const configured = !!process.env.ELEVENLABS_API_KEY;
    return {
      configured,
      sample: { defaultVoice: process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM (Rachel)",
        perAgent: configured ? "voiceId in factory/config/agents.json" : "set ELEVENLABS_API_KEY to enable" },
    };
  },
};
