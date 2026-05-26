import { appendFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Append-only audit log (JSONL — zero-dep, white-box debuggable). Every tool
 * call, kill-switch flip, mission move, model choice, and ritual event lands
 * here with a correlation id grouping one user-initiated turn.
 *
 * In agents-dr.fixit this is ported to the SQLite `audit_log` table; the
 * contract (append-only, correlation ids, pinned rows survive prune) is the same.
 */
export class Audit {
  constructor(path = process.env.AUDIT_PATH || "valley/audit.log.jsonl") {
    this.path = path;
    if (!existsSync(dirname(path))) mkdirSync(dirname(path), { recursive: true });
  }
  /** Start a correlation scope for one turn. */
  turn() {
    return randomUUID().slice(0, 8);
  }
  record(event, { corr, actor, payload, pinned = false } = {}) {
    const row = {
      ts: new Date().toISOString(),
      corr: corr || this.turn(),
      event,
      actor: actor || "system",
      pinned,
      payload: payload ?? null,
    };
    appendFileSync(this.path, JSON.stringify(row) + "\n");
    return row;
  }
  all() {
    if (!existsSync(this.path)) return [];
    return readFileSync(this.path, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
  }
  /** Append-only invariant check: every row has ts+corr+event and is parseable. */
  verifyIntegrity() {
    const rows = this.all();
    return rows.every((r) => r.ts && r.corr && r.event);
  }
}
