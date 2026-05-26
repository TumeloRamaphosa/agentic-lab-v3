/**
 * Optimization-scored router (the OpenJarvis steal). Given a task class and a
 * list of candidate model refs, score each on quality - $ - latency - energy
 * and pick the cheapest that clears the task's quality bar. Local Ollama wins
 * unless the task class needs escalation. Also formats the daily cost summary.
 *
 * Priors are coarse on purpose — refine in factory/config/cost-policy.json.
 */

const DEFAULT_WEIGHTS = { quality: 1.0, dollar: 1.2, latency: 0.15, energy: 0.1 };

// Rough capability prior per provider family (0..1) for a "general" task.
const QUALITY_PRIOR = {
  anthropic: 0.95, openai: 0.9, openrouter: 0.88, groq: 0.8,
  "mesh-llm": 0.78, ollama: 0.72, fake: 0.5, custom: 0.7,
};
// $ per call (coarse) — local = 0.
const DOLLAR = { ollama: 0, "mesh-llm": 0, fake: 0, groq: 0.001, openrouter: 0.01, openai: 0.02, anthropic: 0.03, custom: 0.01 };
const LATENCY_S = { ollama: 2.5, "mesh-llm": 3, fake: 0, groq: 0.6, openrouter: 1.2, openai: 1.5, anthropic: 1.8, custom: 1.5 };
const ENERGY = { ollama: 0.6, "mesh-llm": 1.0, fake: 0, groq: 0.05, openrouter: 0.05, openai: 0.05, anthropic: 0.05, custom: 0.05 };

const MIN_QUALITY = { general: 0.6, code: 0.7, reasoning: 0.8, "needs-escalation": 0.9 };

export function scoreModel(ref, taskClass = "general", weights = DEFAULT_WEIGHTS) {
  const p = ref.provider;
  const quality = QUALITY_PRIOR[p] ?? 0.6;
  const dollar = DOLLAR[p] ?? 0.01;
  return {
    ref,
    quality,
    dollar,
    // blended score (used only as a tiebreak / for reporting)
    score: weights.quality * quality
      - weights.dollar * dollar
      - weights.latency * (LATENCY_S[p] ?? 1.5)
      - weights.energy * (ENERGY[p] ?? 0.05),
  };
}

/**
 * Pick the best model for a task: the CHEAPEST ($, the #1 goal) that clears the
 * task's quality bar. Local Ollama ($0) therefore wins any task it's allowed to
 * handle; cloud is used only for task classes whose quality bar local can't meet
 * (e.g. "needs-escalation"). Ties on $ break by quality.
 * @param {ModelRef[]} candidates @param {string} taskClass
 * @returns {{chosen:ModelRef, runnerUp:ModelRef|null, reason:string}}
 */
export function route(candidates, taskClass = "general", weights = DEFAULT_WEIGHTS) {
  if (!candidates.length) throw new Error("no candidate models");
  const minQ = MIN_QUALITY[taskClass] ?? 0.6;
  const scored = candidates.map((c) => scoreModel(c, taskClass, weights));
  const eligible = scored.filter((s) => s.quality >= minQ);

  let pick, pool, reason;
  if (eligible.length) {
    pool = eligible.slice().sort((a, b) => a.dollar - b.dollar || b.quality - a.quality);
    pick = pool[0];
    reason = `cheapest clearing quality>=${minQ}: ${pick.ref.provider} ($${pick.dollar}, q${pick.quality})`;
  } else {
    pool = scored.slice().sort((a, b) => b.quality - a.quality);
    pick = pool[0];
    reason = `none meet quality>=${minQ}; best available: ${pick.ref.provider} (q${pick.quality})`;
  }
  const runnerUp = pool.find((s) => s.ref !== pick.ref) ?? null;
  return { chosen: pick.ref, runnerUp: runnerUp?.ref ?? null, reason };
}

/** One-line daily cost summary for the journal (NOT per-message). */
export function dailyFooter({ localCalls = 0, cloudCalls = 0, dollars = 0 } = {}) {
  return `Cost: ${localCalls} local · ${cloudCalls} cloud · ~$${dollars.toFixed(2)} today`;
}
