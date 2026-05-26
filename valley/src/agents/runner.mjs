import { complete } from "../core/model.mjs";
import { route } from "../core/cost-footer.mjs";
import { scan } from "../core/exfil-guard.mjs";

/**
 * Run one agent turn:
 *  1. cost-footer routes among the agent's candidate models for its task class
 *  2. the chosen model completes the prompt (persona as system)
 *  3. exfil-guard scans the output; audit records the turn
 * Returns { codename, model, text, blocked, corr }.
 *
 * @param {object} agent  roster entry
 * @param {string} task
 * @param {{audit?:object, corr?:string, weights?:object, context?:string}} [opts]
 */
export async function runAgent(agent, task, opts = {}) {
  const corr = opts.corr || opts.audit?.turn?.() || "no-corr";
  const { chosen, runnerUp, reason } = route(agent.models, agent.taskClass || "general", opts.weights);

  opts.audit?.record("model.route", { corr, actor: agent.codename,
    payload: { chosen, runnerUp, reason } });

  const system = `You are ${agent.display} (${agent.codename}), ${agent.description} Answer briefly and in character.`;
  const prompt = opts.context ? `Context:\n${opts.context}\n\nTask: ${task}` : task;

  let text = "";
  try {
    const res = await complete(chosen, prompt, { system });
    text = res.text;
  } catch (e) {
    opts.audit?.record("agent.error", { corr, actor: agent.codename, payload: { error: e.message } });
    return { codename: agent.codename, model: chosen, text: "", blocked: false, error: e.message, corr };
  }

  const leaks = scan(text);
  const blocked = leaks.length > 0;
  opts.audit?.record("agent.turn", { corr, actor: agent.codename,
    payload: { model: chosen, taskClass: agent.taskClass, blocked, leaks, chars: text.length } });

  return { codename: agent.codename, model: chosen, text: blocked ? "[blocked by exfil-guard]" : text, blocked, corr };
}
