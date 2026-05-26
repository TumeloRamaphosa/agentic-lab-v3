/**
 * Classifier — routes an incoming task to the best agent. In production it asks
 * a small local model (gemma2) to pick from the agents' descriptions. Offline /
 * deterministic fallback: keyword-overlap scoring against each agent's
 * description (so the engine routes sensibly with no model running).
 */

const STOP = new Set("the a an of to for and or in on with about how do does is are this that our we i you can".split(" "));

function tokens(s) {
  return String(s).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t && !STOP.has(t));
}

/** Deterministic keyword-overlap routing. Returns {codename, score, scores}. */
export function routeByKeywords(task, agents) {
  const tt = new Set(tokens(task));
  const scores = agents.map((a) => {
    const at = tokens(a.description + " " + a.display + " " + a.codename + " " + a.role);
    let overlap = 0;
    for (const t of at) if (tt.has(t)) overlap += 1;
    return { codename: a.codename, score: overlap };
  }).sort((x, y) => y.score - x.score);
  return { codename: scores[0].codename, score: scores[0].score, scores };
}

/**
 * Route a task to an agent. Uses the model when `model` is provided and not
 * fake; otherwise keyword routing. Always returns a valid codename.
 * @param {string} task @param {Array} agents @param {{complete?:Function, modelRef?:object}} [opts]
 */
export async function classify(task, agents, opts = {}) {
  const kw = routeByKeywords(task, agents);
  // If no model or fake/zero-signal, trust keywords (defaulting to robusca).
  if (!opts.complete || !opts.modelRef || opts.modelRef.provider === "fake") {
    return { codename: kw.score > 0 ? kw.codename : "robusca", via: "keywords", scores: kw.scores };
  }
  // Model-assisted: ask the model to pick a codename.
  const list = agents.map((a) => `- ${a.codename}: ${a.description}`).join("\n");
  const prompt = `Route this task to ONE agent. Reply with only the codename.\n\nAgents:\n${list}\n\nTask: ${task}\nCodename:`;
  try {
    const { text } = await opts.complete(opts.modelRef, prompt);
    const picked = text.toLowerCase().match(/[a-z-]+/)?.[0];
    if (picked && agents.some((a) => a.codename === picked)) {
      return { codename: picked, via: "model", scores: kw.scores };
    }
  } catch { /* fall back to keywords */ }
  return { codename: kw.score > 0 ? kw.codename : "robusca", via: "keywords-fallback", scores: kw.scores };
}
