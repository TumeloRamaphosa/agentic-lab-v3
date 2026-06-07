/**
 * Slack — primary bridge. Real auth.test is cheap; we hit it when the bot token
 * is set so the dashboard shows the bot's identity + workspace name.
 */
export default {
  name: "slack",
  display: "Slack",
  role: "exec",
  agentHint: "robusca",
  description: "Channel bridge — agents speak here. Allowlist + kill-phrase enforced before any send.",
  envKey: "SLACK_BOT_TOKEN",
  docsUrl: "https://api.slack.com",
  async status() {
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) return { configured: false, sample: { note: "Set SLACK_BOT_TOKEN to surface bot identity." } };
    try {
      const r = await fetch("https://slack.com/api/auth.test", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });
      const j = await r.json();
      if (!j.ok) return { configured: true, error: j.error };
      return { configured: true, lastSync: new Date().toISOString(),
        sample: { team: j.team, user: j.user } };
    } catch (e) { return { configured: true, error: e.message }; }
  },
};
