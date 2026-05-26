#!/usr/bin/env node
/**
 * Valley OS engine CLI (reference). Runs the loop OFFLINE with the fake provider
 * unless real model keys/Ollama are configured.
 *
 *   VALLEY_FAKE_MODEL=1 node valley/cli.mjs standup
 *   VALLEY_FAKE_MODEL=1 node valley/cli.mjs council
 *   node valley/cli.mjs route "a customer asks about a beef order"
 *   node valley/cli.mjs mission add "Reply to meat customer"
 *   node valley/cli.mjs mission list
 */
import { loadAgents } from "./src/agents/loader.mjs";
import { classify } from "./src/core/classifier.mjs";
import { Audit } from "./src/core/audit.mjs";
import { Mission } from "./src/core/mission.mjs";
import { standup } from "./src/rituals/standup.mjs";
import { council } from "./src/rituals/council.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const roster = loadAgents();
const audit = new Audit();

async function main() {
  if (cmd === "standup") {
    const su = await standup(roster.byCodename.get("robusca"), { audit, queued: [{ title: "Demo priority" }] });
    console.log("— Robusca (voice:" + su.voice + ") —\n" + su.spoken + "\n\n" + su.footer);
  } else if (cmd === "council") {
    const co = await council(roster, { audit });
    for (const r of co.reports) console.log(`[${r.codename}] ${r.report}`);
    console.log("\n— Robusca consolidates —\n" + co.consolidation.text);
  } else if (cmd === "route") {
    const task = rest.join(" ");
    const c = await classify(task, roster.agents);
    console.log(`→ ${c.codename} (via ${c.via})`);
  } else if (cmd === "mission") {
    const m = new Mission();
    const [sub, ...a] = rest;
    if (sub === "add") {
      const id = m.add(a.join(" "));
      const c = await classify(a.join(" "), roster.agents);
      m.assign(id, c.codename);
      console.log(`#${id} queued → ${c.codename}`);
    } else if (sub === "list") {
      const b = m.board();
      for (const col of Object.keys(b)) {
        console.log(`\n${col} (${b[col].length})`);
        b[col].forEach((i) => console.log(`  #${i.id} [${i.agent || "?"}] ${i.title}`));
      }
    } else if (sub === "move") {
      console.log(JSON.stringify(m.move(Number(a[0]), a[1])));
    } else console.log("mission: add <title> | list | move <id> <col>");
  } else {
    console.log("usage: node valley/cli.mjs <standup|council|route|mission> [...]");
    process.exit(1);
  }
}
main().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
