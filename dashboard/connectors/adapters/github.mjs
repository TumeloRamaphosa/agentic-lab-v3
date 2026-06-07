/**
 * GitHub — owned by CTO/Skunk Works. Calls the GitHub API when GITHUB_TOKEN is
 * present (server-side; never reaches the browser).
 */
export default {
  name: "github",
  display: "GitHub",
  role: "devops",
  agentHint: "skunkworks",
  description: "Code repositories and PRs. Skunk Works pushes feature branches; Dr Fix-It surfaces failing CI.",
  envKey: "GITHUB_TOKEN",
  docsUrl: "https://docs.github.com/rest",
  async status() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return { configured: false, sample: { repos: 0, note: "Set GITHUB_TOKEN (fine-grained, scoped to your repos)." } };
    }
    try {
      const r = await fetch("https://api.github.com/user/repos?per_page=3&sort=updated", {
        headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "user-agent": "studex-dashboard" },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) return { configured: true, error: `${r.status}` };
      const repos = await r.json();
      return {
        configured: true, lastSync: new Date().toISOString(),
        sample: { repos: repos.length, recent: repos.map((x) => x.full_name).slice(0, 3) },
      };
    } catch (e) { return { configured: true, error: e.message }; }
  },
};
