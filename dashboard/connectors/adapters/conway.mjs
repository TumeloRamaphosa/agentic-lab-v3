/**
 * Conway — lead-gen + traffic. Maps to CashClaw (Sales) + OpenFang (Research).
 * Real adapter: pending Conway API docs. When wired, expose:
 *   - leads this week / month + sources
 *   - traffic delta (sessions / referrers)
 *   - top-performing channels
 */
export default {
  name: "conway",
  display: "Conway",
  role: "sales",
  agentHint: "cashclaw",
  description: "Lead generation + traffic engine — surfaces qualified leads, source attribution and weekly traffic delta.",
  envKey: "CONWAY_API_KEY",
  docsUrl: "https://conway.tech",
  async status() {
    const configured = !!process.env.CONWAY_API_KEY;
    if (!configured) {
      return {
        configured: false,
        sample: { leadsThisWeek: 0, sources: [], note: "Set CONWAY_API_KEY + paste API docs to wire." },
      };
    }
    return {
      configured: true,
      lastSync: new Date().toISOString(),
      sample: { note: "Key detected — adapter awaits Conway API spec." },
    };
  },
};
