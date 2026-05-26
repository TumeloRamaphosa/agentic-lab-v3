/**
 * Exfil guard — scans outbound text for secrets before any tool call leaves the
 * machine (Slack/Discord/Composio/Cursor). Returns matches; the caller blocks
 * or redacts. Conservative patterns; extend as needed.
 */
const PATTERNS = [
  { name: "anthropic_key", re: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/ },
  { name: "openai_key", re: /\bsk-[A-Za-z0-9]{32,}\b/ },
  { name: "pinecone_key", re: /\bpcsk_[A-Za-z0-9_]{20,}\b/ },
  { name: "cursor_key", re: /\bcrsr_[A-Za-z0-9]{32,}\b/ },
  { name: "elevenlabs_key", re: /\bsk_[a-f0-9]{40,}\b/ },
  { name: "slack_token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "aws_key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "private_key", re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
  { name: "bearer", re: /\bBearer\s+[A-Za-z0-9._-]{20,}\b/ },
];

export function scan(text) {
  const s = String(text || "");
  return PATTERNS.filter((p) => p.re.test(s)).map((p) => p.name);
}

export function isClean(text) {
  return scan(text).length === 0;
}

/** Redact any detected secrets (for safe logging). */
export function redact(text) {
  let s = String(text || "");
  for (const p of PATTERNS) s = s.replace(new RegExp(p.re, "g"), `[REDACTED:${p.name}]`);
  return s;
}
