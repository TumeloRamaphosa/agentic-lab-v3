/**
 * Adapter contract:
 *
 *   export default {
 *     name, display, role, agentHint,         // routing + ownership
 *     description, envKey, docsUrl,           // human + config
 *     async status() {                         // server-side; never expose key
 *       return { configured, lastSync?, sample?, error?, link? };
 *     }
 *   }
 *
 * Real impl: when its envKey is set, the adapter calls the real API.
 * Fake impl: when the envKey is missing, return synthetic sample data so the
 * Connectors tab is visible end-to-end pre-credentials.
 */
import polsia from "./adapters/polsia.mjs";
import conway from "./adapters/conway.mjs";
import composio from "./adapters/composio.mjs";
import github from "./adapters/github.mjs";
import linear from "./adapters/linear.mjs";
import pinecone from "./adapters/pinecone.mjs";
import elevenlabs from "./adapters/elevenlabs.mjs";
import slack from "./adapters/slack.mjs";
import discord from "./adapters/discord.mjs";

export const adapters = [polsia, conway, composio, github, linear, pinecone, elevenlabs, slack, discord];

export async function statusAll() {
  return Promise.all(adapters.map(async (a) => {
    let s;
    try { s = await a.status(); } catch (e) { s = { configured: false, error: e.message }; }
    return {
      name: a.name, display: a.display, role: a.role, agentHint: a.agentHint,
      description: a.description, envKey: a.envKey, docsUrl: a.docsUrl, ...s,
    };
  }));
}
