import { runAgent } from "../agents/runner.mjs";
import { dailyFooter } from "../core/cost-footer.mjs";

/**
 * 08:00 Robusca Standup (Morning Digest structure). Composes today's note from
 * the inputs and has Robusca deliver it. Pure logic + one agent turn — runs
 * offline with the fake provider.
 *
 * @param {object} robusca roster entry
 * @param {{yesterday?:string, ledger?:object, queued?:Array, proposals?:string, audit?:object}} inputs
 */
export async function standup(robusca, inputs = {}) {
  const corr = inputs.audit?.turn?.();
  inputs.audit?.record("ritual.standup.start", { corr, actor: "robusca" });

  const sections = {
    inbox: inputs.inbox ?? "No inbox connected (Composio Gmail off).",
    calendar: inputs.calendar ?? "No calendar connected.",
    numbers: {
      sales: inputs.ledger?.sales ?? "n/a",
      costsVsBreakEven: inputs.ledger?.costsVsBreakEven ?? "n/a",
      social: inputs.social ?? "n/a",
    },
    overnight: inputs.proposals ?? "No Night Build proposals.",
    priorities: (inputs.queued ?? []).slice(0, 3).map((q) => q.title || q),
  };

  const brief =
    `Inbox: ${sections.inbox}\n` +
    `Calendar: ${sections.calendar}\n` +
    `Numbers: sales ${sections.numbers.sales}, costs ${sections.numbers.costsVsBreakEven}, social ${sections.numbers.social}\n` +
    `Overnight: ${sections.overnight}\n` +
    `Today's 3 priorities: ${sections.priorities.join("; ") || "none queued"}`;

  const turn = await runAgent(robusca, `Give the morning standup. Summarise and call out what needs Tumelo's yes/no.`,
    { audit: inputs.audit, corr, context: brief });

  inputs.audit?.record("ritual.standup.done", { corr, actor: "robusca",
    payload: { priorities: sections.priorities.length } });

  return {
    note: brief,
    spoken: turn.text,
    voice: robusca.voice,
    footer: dailyFooter(inputs.cost ?? {}),
    sections,
  };
}
