import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Mission Control store (JSON-backed for the reference engine; SQLite `mission`
 * table in agents-dr.fixit). Columns: Queued / Running / Done. Auto-assign via
 * the classifier when no agent is given.
 */
const COLS = ["Queued", "Running", "Done"];

export class Mission {
  constructor(path = process.env.MISSION_PATH || "valley/mission.json") {
    this.path = path;
    if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true });
    this.data = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : { seq: 0, items: [] };
  }
  _save() { writeFileSync(this.path, JSON.stringify(this.data, null, 2)); }

  add(title, agent = null) {
    const id = ++this.data.seq;
    this.data.items.push({ id, title, agent, col: "Queued", ts: new Date().toISOString() });
    this._save();
    return id;
  }
  move(id, col) {
    if (!COLS.includes(col)) throw new Error(`bad column: ${col}`);
    const it = this.data.items.find((i) => i.id === id);
    if (!it) throw new Error(`no mission ${id}`);
    it.col = col; this._save();
    return it;
  }
  assign(id, agent) {
    const it = this.data.items.find((i) => i.id === id);
    if (!it) throw new Error(`no mission ${id}`);
    it.agent = agent; this._save();
    return it;
  }
  list(col) { return col ? this.data.items.filter((i) => i.col === col) : this.data.items; }
  board() { return Object.fromEntries(COLS.map((c) => [c, this.list(c)])); }
}
