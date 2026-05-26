/**
 * Multi-provider model client. Speaks OpenAI-compatible to
 * {ollama, mesh-llm, openai, groq, openrouter, custom}, Anthropic-native to
 * {anthropic}, and includes a zero-network `fake` provider so the whole engine
 * runs and is testable offline (CI / this sandbox).
 *
 * @typedef {{provider:string, name:string, base_url?:string}} ModelRef
 */

const OPENAI_COMPAT = {
  ollama: () => (process.env.OLLAMA_BASE_URL || "http://localhost:11434") + "/v1",
  "mesh-llm": () => process.env.MESH_LLM_BASE_URL || "http://localhost:9337/v1",
  openai: () => "https://api.openai.com/v1",
  groq: () => "https://api.groq.com/openai/v1",
  openrouter: () => "https://openrouter.ai/api/v1",
};

const KEY_ENV = {
  openai: "OPENAI_API_KEY", groq: "GROQ_API_KEY", openrouter: "OPENROUTER_API_KEY",
};

/** Deterministic offline provider — echoes a structured "answer" so loops run. */
function fakeComplete(ref, prompt) {
  const head = prompt.slice(0, 80).replace(/\s+/g, " ");
  return `[${ref.name}] ${head}${prompt.length > 80 ? "…" : ""}`;
}

/**
 * Complete a prompt with the given model ref. Returns { text, provider, model }.
 * @param {ModelRef} ref @param {string} prompt @param {{system?:string, timeoutMs?:number}} [opts]
 */
export async function complete(ref, prompt, opts = {}) {
  const { provider, name } = ref;
  if (provider === "fake" || process.env.VALLEY_FAKE_MODEL) {
    return { text: fakeComplete(ref, prompt), provider: "fake", model: name };
  }
  const timeout = AbortSignal.timeout(opts.timeoutMs ?? 30000);

  if (provider === "anthropic") {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY not set");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: name, max_tokens: 1024,
        system: opts.system, messages: [{ role: "user", content: prompt }] }),
      signal: timeout,
    });
    if (!r.ok) throw new Error(`anthropic ${r.status}: ${await r.text()}`);
    const j = await r.json();
    return { text: (j.content?.[0]?.text ?? "").trim(), provider, model: name };
  }

  // OpenAI-compatible path (ollama, mesh-llm, openai, groq, openrouter, custom)
  const base = ref.base_url || OPENAI_COMPAT[provider]?.();
  if (!base) throw new Error(`unknown provider: ${provider}`);
  const headers = { "content-type": "application/json" };
  const keyEnv = KEY_ENV[provider];
  if (keyEnv) {
    const key = process.env[keyEnv];
    if (!key) throw new Error(`${keyEnv} not set`);
    headers.authorization = `Bearer ${key}`;
  }
  const msgs = [];
  if (opts.system) msgs.push({ role: "system", content: opts.system });
  msgs.push({ role: "user", content: prompt });
  const r = await fetch(`${base}/chat/completions`, {
    method: "POST", headers,
    body: JSON.stringify({ model: name, messages: msgs }),
    signal: timeout,
  });
  if (!r.ok) throw new Error(`${provider} ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return { text: (j.choices?.[0]?.message?.content ?? "").trim(), provider, model: name };
}
