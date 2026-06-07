/**
 * Polsia — AI company-builder. Maps to Robusca + CTO (Exec/DevOps).
 * Real adapter: pending Polsia API docs. When wired, expose:
 *   - active build (stage, % complete)
 *   - generated artifacts (incorporation docs, ops plans, brand assets)
 *   - next-action queue
 */
export default {
  name: "polsia",
  display: "Polsia",
  role: "exec",
  agentHint: "robusca",
  description: "AI co-founder — builds the company: legal/ops/brand artifacts and a next-action queue.",
  envKey: "POLSIA_API_KEY",
  docsUrl: "https://polsia.com",
  async status() {
    const configured = !!process.env.POLSIA_API_KEY;
    if (!configured) {
      return {
        configured: false,
        sample: { stage: "stub", note: "Set POLSIA_API_KEY + paste API docs to wire the real adapter." },
      };
    }
    // TODO real fetch when API shape is known
    return {
      configured: true,
      lastSync: new Date().toISOString(),
      sample: { stage: "real-pending", note: "Key detected — adapter awaits Polsia API spec." },
    };
  },
};
