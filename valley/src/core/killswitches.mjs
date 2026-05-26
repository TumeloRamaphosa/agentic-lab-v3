/**
 * Kill switches — read from env, default-safe (off). The OS checks these before
 * acting; flipping one to "false" must immediately stop that subsystem.
 *
 * A kill PHRASE from an allowlisted user halts everything at once.
 */
const truthy = (v) => String(v).toLowerCase() === "true" || v === "1";

export function flags(env = process.env) {
  return {
    scheduler: truthy(env.SCHEDULER_ENABLED),
    autoAssign: truthy(env.MISSION_AUTO_ASSIGN_ENABLED ?? "true"),
    exfilGuard: truthy(env.EXFIL_GUARD_ENABLED ?? "true"),
    warRoom: truthy(env.WAR_ROOM_ENABLED ?? "true"),
    council: truthy(env.COUNCIL_ENABLED),
    nightBuild: truthy(env.NIGHT_BUILD_ENABLED),
    cursorBg: truthy(env.CURSOR_BACKGROUND_AGENTS_ENABLED),
    idleHours: env.IDLE_HOURS ?? "22-02",
    killPhrase: env.KILL_PHRASE ?? "studex stop the world",
  };
}

/** Returns true if a message contains the kill phrase (case-insensitive). */
export function isKillPhrase(text, env = process.env) {
  const phrase = (flags(env).killPhrase || "").toLowerCase().trim();
  return !!phrase && String(text || "").toLowerCase().includes(phrase);
}

/** Throws if a required subsystem flag is off — call before acting. */
export function requireEnabled(name, env = process.env) {
  const f = flags(env);
  if (!f[name]) throw new Error(`kill-switch: ${name} is disabled`);
}
