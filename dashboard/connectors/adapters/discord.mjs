/**
 * Discord — secondary bridge. We don't keep a websocket here; just report
 * configured-or-not via env presence.
 */
export default {
  name: "discord",
  display: "Discord",
  role: "exec",
  agentHint: "robusca",
  description: "Secondary channel bridge. Mirrors the Slack contract; same allowlist + kill-phrase.",
  envKey: "DISCORD_BOT_TOKEN",
  docsUrl: "https://discord.com/developers/docs",
  async status() {
    const configured = !!process.env.DISCORD_BOT_TOKEN;
    return {
      configured,
      sample: { guild: process.env.DISCORD_GUILD_ID || (configured ? "set DISCORD_GUILD_ID" : "not configured") },
    };
  },
};
