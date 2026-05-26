import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROSTER = join(here, "../../agents/roster.json");

/** Load the agent roster. Returns array of agent defs + a byCodename index. */
export function loadAgents(path = process.env.VALLEY_ROSTER || DEFAULT_ROSTER) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  const agents = data.agents;
  const byCodename = new Map(agents.map((a) => [a.codename, a]));
  return { agents, byCodename };
}
