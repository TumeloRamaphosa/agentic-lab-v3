import { runAgent } from "../agents/runner.mjs";

/**
 * 09:00 StudEx Agent Council. Each agent reports in order; Robusca consolidates
 * the top decisions. Agents run in isolation (don't see each other's drafts);
 * the consolidator runs last and sees everything (ClaudeClaw V3 pattern).
 *
 * @param {{agents:Array, byCodename:Map}} roster
 * @param {{audit?:object, order?:string[]}} [opts]
 */
export async function council(roster, opts = {}) {
  const corr = opts.audit?.turn?.();
  opts.audit?.record("ritual.council.start", { corr });

  const order = opts.order || [
    "cto", "skunkworks", "drfixit", "cashclaw", "denchclaw", "charlie", "research", "openfang", "the-lady",
  ];

  const reports = [];
  for (const codename of order) {
    const agent = roster.byCodename.get(codename);
    if (!agent) continue;
    const turn = await runAgent(agent, `Give your 90-second council report: what you wrapped, what's queued, what's blocked.`,
      { audit: opts.audit, corr });
    reports.push({ codename, voice: agent.voice, report: turn.text, model: turn.model });
  }

  // Robusca consolidates.
  const robusca = roster.byCodename.get("robusca");
  const digest = reports.map((r) => `${r.codename}: ${r.report}`).join("\n");
  const close = await runAgent(robusca, `Consolidate the council into the top 3 decisions Tumelo must make today.`,
    { audit: opts.audit, corr, context: digest });

  opts.audit?.record("ritual.council.done", { corr, payload: { reports: reports.length } });

  return { reports, consolidation: { voice: robusca.voice, text: close.text }, corr };
}
