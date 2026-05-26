/**
 * Proves the Valley OS core engine runs end-to-end OFFLINE with the fake model
 * provider. No Ollama, no Claude, no network. Run: node valley/test/valley.test.mjs
 */
import assert from "node:assert";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rmSync } from "node:fs";

process.env.VALLEY_FAKE_MODEL = "1"; // force offline fake provider

const { flags, isKillPhrase } = await import("../src/core/killswitches.mjs");
const { Audit } = await import("../src/core/audit.mjs");
const { complete } = await import("../src/core/model.mjs");
const { route, scoreModel } = await import("../src/core/cost-footer.mjs");
const { scan, isClean } = await import("../src/core/exfil-guard.mjs");
const { loadAgents } = await import("../src/agents/loader.mjs");
const { classify, routeByKeywords } = await import("../src/core/classifier.mjs");
const { runAgent } = await import("../src/agents/runner.mjs");
const { Mission } = await import("../src/core/mission.mjs");
const { standup } = await import("../src/rituals/standup.mjs");
const { council } = await import("../src/rituals/council.mjs");

let pass = 0;
const ok = (n) => { console.log("  ok -", n); pass++; };
const tmp = (n) => join(tmpdir(), `valley-${n}-${Date.now()}.json`);

// 1. Kill switches default-safe + kill phrase
assert.strictEqual(flags({}).scheduler, false, "scheduler off by default");
assert.strictEqual(flags({ SCHEDULER_ENABLED: "true" }).scheduler, true);
assert.ok(isKillPhrase("ok everyone, studex stop the world now", {}));
assert.ok(!isKillPhrase("carry on", {}));
ok("kill switches default-safe; kill phrase detected");

// 2. Model fake provider works offline
const m = await complete({ provider: "fake", name: "qwen2.5:7b" }, "hello world");
assert.ok(m.text.includes("qwen2.5:7b") && m.provider === "fake");
ok("model fake provider completes offline");

// 3. Cost-footer routes to cheapest that clears the bar (local Ollama for general)
const r = route([{ provider: "anthropic", name: "claude-sonnet-4-6" }, { provider: "ollama", name: "qwen2.5:7b" }], "general");
assert.strictEqual(r.chosen.provider, "ollama", "general task -> local Ollama (cheaper, clears bar)");
const rEsc = route([{ provider: "ollama", name: "qwen2.5:7b" }, { provider: "anthropic", name: "claude-sonnet-4-6" }], "needs-escalation");
assert.strictEqual(rEsc.chosen.provider, "anthropic", "escalation task -> Claude (only one clearing 0.9 bar)");
ok("cost-footer routes local by default, escalates when quality bar demands");

// 4. Exfil guard catches secrets
assert.deepStrictEqual(scan("key is pcsk_" + "a".repeat(24)), ["pinecone_key"]);
assert.ok(isClean("just a normal sentence"));
ok("exfil-guard flags a pinecone key, passes clean text");

// 5. Audit append-only + integrity
const aud = new Audit(tmp("audit").replace(".json", ".jsonl"));
const c = aud.turn();
aud.record("test.event", { corr: c, actor: "tester", payload: { x: 1 } });
assert.strictEqual(aud.all().length, 1);
assert.ok(aud.verifyIntegrity());
ok("audit log appends + verifies integrity");

// 6. Loader + classifier route a meat question to Charlie
const roster = loadAgents();
assert.strictEqual(roster.agents.length, 10);
const kw = routeByKeywords("a customer is asking about a whatsapp beef order delivery", roster.agents);
assert.strictEqual(kw.codename, "charlie", `expected charlie, got ${kw.codename}`);
const cls = await classify("help me write code and a build pipeline", roster.agents);
assert.ok(["cto", "skunkworks"].includes(cls.codename), `code task -> devops, got ${cls.codename}`);
ok("classifier routes meat->charlie, code->devops");

// 7. runAgent produces output + audits
const charlie = roster.byCodename.get("charlie");
const turn = await runAgent(charlie, "Do you deliver lamb to Cape Town?", { audit: aud });
assert.ok(turn.text.length > 0 && !turn.blocked);
ok("runAgent completes a turn with cost-routing + audit");

// 8. Mission store: add, auto-assign via classifier, move
const mission = new Mission(tmp("mission"));
const id = mission.add("Reply to a meat customer on WhatsApp");
const routed = await classify(mission.list("Queued")[0].title, roster.agents);
mission.assign(id, routed.codename);
mission.move(id, "Running");
assert.strictEqual(mission.list("Running")[0].agent, "charlie");
ok("mission store adds, classifier auto-assigns to charlie, moves to Running");

// 9. Standup runs end-to-end
const su = await standup(roster.byCodename.get("robusca"), {
  audit: aud, queued: [{ title: "Ship coffee landing" }, { title: "Call Uvelka" }],
  ledger: { sales: "R12k", costsVsBreakEven: "-R3k" }, social: "+40 followers",
});
assert.ok(su.spoken.length > 0 && su.sections.priorities.length === 2);
ok("08:00 standup composes digest + Robusca speaks it");

// 10. Council runs all agents + consolidates
const co = await council(roster, { audit: aud });
assert.strictEqual(co.reports.length, 9, `expected 9 reports, got ${co.reports.length}`);
assert.ok(co.consolidation.text.length > 0);
ok("09:00 council: 9 agent reports + Robusca consolidation");

// cleanup
try { rmSync(aud.path); rmSync(mission.path); } catch {}

console.log(`\nPASS ${pass}/10 — Valley OS core engine runs end-to-end offline`);
