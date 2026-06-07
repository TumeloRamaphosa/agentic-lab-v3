/**
 * Linear — issue tracker owned by Skunk Works. Real adapter calls Linear's
 * GraphQL when LINEAR_API_KEY is set.
 */
export default {
  name: "linear",
  display: "Linear",
  role: "devops",
  agentHint: "skunkworks",
  description: "Work ledger. Skunk Works churns tickets; the Council references issue status.",
  envKey: "LINEAR_API_KEY",
  docsUrl: "https://developers.linear.app",
  async status() {
    const token = process.env.LINEAR_API_KEY;
    if (!token) return { configured: false, sample: { issues: 0 } };
    try {
      const r = await fetch("https://api.linear.app/graphql", {
        method: "POST",
        headers: { authorization: token, "content-type": "application/json" },
        body: JSON.stringify({ query: "{ viewer { name email } }" }),
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) return { configured: true, error: `${r.status}` };
      const j = await r.json();
      return { configured: true, lastSync: new Date().toISOString(), sample: { viewer: j.data?.viewer?.name } };
    } catch (e) { return { configured: true, error: e.message }; }
  },
};
