/**
 * Composio — the connector ledger we already maintain in factory/config.
 * Surfaces what's connected (Facebook live, others pending).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const REGISTRY = join(here, "../../..", "factory/config/composio.json");

export default {
  name: "composio",
  display: "Composio",
  role: "devops",
  agentHint: "cto",
  description: "Tool-connector hub — Facebook, Gmail, Calendar, Slack, X, Instagram. Powers Composio-backed agent tool calls.",
  envKey: "COMPOSIO_API_KEY",
  docsUrl: "https://app.composio.dev",
  async status() {
    let reg = {}; try { reg = JSON.parse(readFileSync(REGISTRY, "utf8")); } catch {}
    const connected = Object.entries(reg).filter(([, v]) => v?.status === "connected").map(([k]) => k);
    const pending = Object.entries(reg).filter(([, v]) => v?.status === "pending").map(([k]) => k);
    return {
      configured: !!process.env.COMPOSIO_API_KEY || connected.length > 0,
      sample: { connected, pending },
    };
  },
};
