#!/usr/bin/env python3
"""Build the StudEx Valley OS business overview PDF.

Requires diagrams to already be built (run build.py first).

Run:
    python3 build_pdf.py

Output:
    business-overview.pdf
"""
from pathlib import Path
import base64
from weasyprint import HTML, CSS

HERE = Path(__file__).parent
DIAGRAMS = HERE / "diagrams"


def img_data_uri(path: Path) -> str:
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{b64}"


ARCH = img_data_uri(DIAGRAMS / "architecture.png")
ROLES = img_data_uri(DIAGRAMS / "roles.png")
RITUAL = img_data_uri(DIAGRAMS / "ritual.png")


CSS_STR = """
@page {
    size: A4;
    margin: 18mm 18mm 22mm 18mm;
    background: #0B0E14;
    @bottom-right {
        content: "StudEx Valley OS  ·  Page " counter(page) " / " counter(pages);
        color: #8A95A6;
        font-family: "Helvetica", "Arial", sans-serif;
        font-size: 9pt;
    }
    @bottom-left {
        content: "studex.valley";
        color: #FF7A1A;
        font-family: "Helvetica", "Arial", sans-serif;
        font-size: 9pt;
        font-weight: bold;
    }
}

* { box-sizing: border-box; }
body {
    font-family: "Helvetica", "Arial", sans-serif;
    color: #F2F4F8;
    background: #0B0E14;
    font-size: 10.5pt;
    line-height: 1.55;
    margin: 0;
}
h1 { color: #F2F4F8; font-size: 32pt; margin: 0 0 6pt 0; line-height: 1.05; }
h2 { color: #FF7A1A; font-size: 11pt; letter-spacing: 4pt; margin: 32pt 0 4pt 0; text-transform: uppercase; }
h3 { color: #F2F4F8; font-size: 18pt; margin: 4pt 0 12pt 0; line-height: 1.15; }
h4 { color: #FF7A1A; font-size: 12pt; margin: 18pt 0 6pt 0; letter-spacing: 1pt; }
p { margin: 0 0 10pt 0; color: #C7CED9; }
strong { color: #F2F4F8; }
em { color: #FFB47A; font-style: normal; }
ul { margin: 0 0 10pt 0; padding-left: 16pt; color: #C7CED9; }
li { margin-bottom: 4pt; }

.cover {
    height: 95vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40pt 20pt;
    page-break-after: always;
}
.kicker {
    color: #FF7A1A;
    font-size: 10pt;
    letter-spacing: 5pt;
    margin-bottom: 18pt;
    text-transform: uppercase;
}
.cover-sub {
    color: #8A95A6;
    font-size: 14pt;
    margin-top: 16pt;
    max-width: 480pt;
}
.cover-meta {
    margin-top: 60pt;
    color: #8A95A6;
    font-size: 10pt;
}
.cover-meta strong { color: #FF7A1A; }

.page-break { page-break-before: always; }

.diagram {
    background: #11151F;
    border-radius: 10pt;
    padding: 10pt;
    margin: 14pt 0 18pt 0;
    text-align: center;
}
.diagram img {
    width: 100%;
    border-radius: 6pt;
}
.caption {
    color: #8A95A6;
    font-size: 9pt;
    font-style: italic;
    margin-top: 6pt;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 16pt 0;
    color: #C7CED9;
}
th {
    background: #11151F;
    color: #FF7A1A;
    text-align: left;
    padding: 8pt 10pt;
    font-size: 9pt;
    letter-spacing: 1pt;
    text-transform: uppercase;
    border-bottom: 1pt solid #FF7A1A;
}
td {
    padding: 8pt 10pt;
    border-bottom: 1pt solid #1F2632;
    vertical-align: top;
    font-size: 10pt;
}
td strong { color: #F2F4F8; }

.tier {
    background: #11151F;
    border: 1pt solid #2A3140;
    border-radius: 10pt;
    padding: 14pt 16pt;
    margin-bottom: 10pt;
}
.tier.featured {
    border: 1.5pt solid #FF7A1A;
    background: #1A1208;
}
.tier-name {
    color: #FF7A1A;
    font-size: 10pt;
    letter-spacing: 3pt;
    text-transform: uppercase;
    margin-bottom: 4pt;
}
.tier-price {
    color: #F2F4F8;
    font-size: 22pt;
    font-weight: bold;
    margin-bottom: 4pt;
}
.tier-price small {
    color: #8A95A6;
    font-size: 11pt;
    font-weight: normal;
}
.tier-who {
    color: #8A95A6;
    font-size: 9pt;
    margin-bottom: 8pt;
}
.tier ul {
    margin: 0;
    padding-left: 14pt;
    font-size: 9.5pt;
}

.callout {
    background: #11151F;
    border-left: 3pt solid #FF7A1A;
    padding: 12pt 16pt;
    margin: 14pt 0;
    border-radius: 0 6pt 6pt 0;
}
.callout-title {
    color: #FF7A1A;
    font-size: 9pt;
    letter-spacing: 2pt;
    text-transform: uppercase;
    margin-bottom: 4pt;
}

.cta {
    margin-top: 40pt;
    padding: 24pt;
    background: #FF7A1A;
    color: #0B0E14;
    border-radius: 12pt;
    text-align: center;
}
.cta-line { font-size: 20pt; font-weight: bold; margin-bottom: 6pt; }
.cta-sub { font-size: 11pt; color: #0B0E14; opacity: 0.85; }

.signature {
    margin-top: 30pt;
    color: #8A95A6;
    font-size: 9pt;
    text-align: center;
}
"""


HTML_DOC = f"""
<!doctype html>
<html>
<head><meta charset="utf-8"><title>StudEx Valley OS</title></head>
<body>

<!-- COVER -->
<section class="cover">
    <div class="kicker">StudEx Valley</div>
    <h1>Your company,<br/>running itself.</h1>
    <div class="cover-sub">
        An AI operating system that handles sales, customer support, content, research and code — while you sleep. Local-first on your own Mac. Cloud only when you need it.
    </div>
    <div class="cover-meta">
        <strong>Client briefing · v1.0</strong><br/>
        StudEx Global Markets · May 2026
    </div>
</section>

<!-- 1. What it is -->
<h2>What it is</h2>
<h3>An operating system for small businesses, built on AI agents.</h3>
<p>
    StudEx Valley OS is not another chatbot. It is the operating layer that wraps a whole company: the agents, their memory, their meetings, their daily rituals, and the knowledge they share. It runs on the founder's own Mac, with local AI models by default, and uses cloud models like Claude only when necessary.
</p>

<div class="callout">
    <div class="callout-title">The one-line pitch</div>
    A fleet of small AI agents that handle sales, customers, content, research and code. They run a morning standup at 8am, a council meeting at 9am, and build two new prototypes for you between 10pm and 2am.
</div>

<h2>The problem</h2>
<h3>Running a business in 2026 means doing a hundred jobs at once.</h3>
<p>
    The founder replies to customers at 11pm. Forgets where they saved the deck. Watches costs climb without knowing why. Can't afford to hire a team yet. AI tools exist, but they are scattered: ChatGPT in one tab, Claude in another, a CRM in a third, Notion in a fourth, automation in Zapier somewhere. Nothing connects. Nothing remembers. Nothing happens unless the founder pushes a button.
</p>
<p>
    <strong>Valley OS connects them.</strong> It turns the founder's existing tools — Obsidian vault, Slack, Discord, Mac — into one operating system run by a fleet of agents that each do one job.
</p>

<!-- 2. Architecture -->
<div class="page-break"></div>

<h2>The architecture</h2>
<h3>Five layers. Each one stacks on the one below.</h3>

<div class="diagram">
    <img src="{ARCH}" alt="Architecture diagram"/>
    <div class="caption">Vault is canonical. The brain is replaceable. The wrapper stays.</div>
</div>

<p>
    <strong>Vault</strong> — the founder's existing Obsidian "2nd Brain" is the single source of truth. Every decision, every customer message, every cost line, every meeting transcript ends up here.
</p>
<p>
    <strong>Hive Mind</strong> — the wrapper. A classifier that routes any incoming task to the right agent. Three-layer memory (keyword + embeddings + salience). Append-only audit log. Kill switches the founder can flip at any time.
</p>
<p>
    <strong>Agents</strong> — six roles, eleven codenames. Each agent is a folder with a YAML config and a persona file.
</p>
<p>
    <strong>Bridges</strong> — Slack, Discord, voice via ElevenLabs. Every channel funnels into one chat history.
</p>
<p>
    <strong>Muscle</strong> — Ollama runs local AI models on the founder's Mac (free, private, fast). Claude is reserved for escalation. Most days the cloud bill is zero.
</p>

<!-- 3. Roles -->
<div class="page-break"></div>

<h2>The agents</h2>
<h3>Six roles, eleven codenames, each with their own voice.</h3>

<div class="diagram">
    <img src="{ROLES}" alt="Roles diagram"/>
    <div class="caption">Roles are stable. Codenames give each agent a recognisable identity.</div>
</div>

<table>
    <thead>
        <tr><th>Role</th><th>Codenames</th><th>What they do</th></tr>
    </thead>
    <tbody>
        <tr><td><strong>Chief of Staff</strong></td><td>Robusca</td><td>Runs the 8am standup. Reads yesterday's notes, the ledger, the kanban, and overnight proposals. Writes today's note.</td></tr>
        <tr><td><strong>Sales</strong></td><td>CashClaw (Adam)</td><td>Closes deals. Watches the pipeline. Anchored to Studex Meat.</td></tr>
        <tr><td><strong>Customer</strong></td><td>DenchClaw, Charlie</td><td>Replies on WhatsApp. Books calls. Charlie is Studex Meat's customer agent.</td></tr>
        <tr><td><strong>Research</strong></td><td>Research, OpenFang</td><td>Reads the internet and the ledger. Owns the overnight research loop.</td></tr>
        <tr><td><strong>DevOps</strong></td><td>CTO, Skunk Works, Dr Fix-It</td><td>Writes code in Cursor with local Ollama. Skunk Works runs builds. Dr Fix-It is the heartbeat.</td></tr>
        <tr><td><strong>Media</strong></td><td>The Lady</td><td>Posts content. Tracks performance. Reports audience reactions at the morning council.</td></tr>
    </tbody>
</table>

<!-- 4. Ritual -->
<div class="page-break"></div>

<h2>The daily ritual</h2>
<h3>One day. One loop. The heartbeat of the company.</h3>

<div class="diagram">
    <img src="{RITUAL}" alt="Daily ritual timeline"/>
    <div class="caption">Three moments matter: 08:00 standup · 09:00 council · 22:00 Night Build.</div>
</div>

<h4>08:00 — Robusca Standup</h4>
<p>
    Robusca reads yesterday's daily note, the ledger, the open missions, and any overnight proposals. She writes today's note: yesterday's wins and misses, the sales/social/costs delta, today's three priorities, and a clearly labelled block of items that need the founder's yes/no.
</p>

<h4>09:00 — StudEx Agent Council Meeting</h4>
<p>
    Every agent reports in order, each under 90 seconds, all in voice via ElevenLabs. Robusca chairs. The CTO covers infra and last night's build. Adam covers sales. Charlie covers Studex Meat customers. The Lady covers content. The transcript saves to the vault. Action items append to the kanban. The founder can interject at any moment.
</p>

<h4>22:00 — Night Build</h4>
<p>
    Between 10pm and 2am every night, agents build. Strictly two prototypes per night. Local Ollama only. No Claude calls. No outbound messages. No real-money operations. Each prototype gets a 3-page plan, working code in a sandboxed folder, passing tests, and a Cursor configuration so the project opens cleanly when the founder wakes up. At 8am, Robusca surfaces them: <em>"Approve, revise, or discard?"</em>
</p>

<!-- 5. Pricing -->
<div class="page-break"></div>

<h2>Pricing for clients</h2>
<h3>Cheaper than one part-time hire. POPIA-compliant. Load-shedding friendly.</h3>

<div class="tier">
    <div class="tier-name">Starter</div>
    <div class="tier-price">R 2 999 <small>/ month</small></div>
    <div class="tier-who">Solo founder · one business</div>
    <ul>
        <li>3 agents</li>
        <li>1 channel (Slack <em>or</em> Discord)</li>
        <li>Cloud models</li>
        <li>Daily 08:00 standup</li>
    </ul>
</div>

<div class="tier featured">
    <div class="tier-name">Pro &nbsp;·&nbsp; most popular</div>
    <div class="tier-price">R 6 999 <small>/ month</small></div>
    <div class="tier-who">Small team · multiple businesses</div>
    <ul>
        <li>6 agents</li>
        <li>Slack + Discord</li>
        <li>Local models on your Mac (zero cloud spend on routine work)</li>
        <li>Night Build (two prototypes per night)</li>
        <li>Daily standup + weekly council</li>
    </ul>
</div>

<div class="tier">
    <div class="tier-name">Premium</div>
    <div class="tier-price">R 13 999 <small>/ month</small></div>
    <div class="tier-who">Operator · several brands</div>
    <ul>
        <li>All eleven agents</li>
        <li>Mesh across multiple machines</li>
        <li>Cursor Background Agents (parallel coding via API)</li>
        <li>Daily standup + daily council</li>
        <li>White-label branding</li>
    </ul>
</div>

<div class="callout">
    <div class="callout-title">Included with every tier</div>
    7-day free trial · POPIA-compliant by default · runs on your own hardware · onboarding session · setup in one afternoon
</div>

<!-- 6. Why different -->
<h2>What makes this different</h2>
<ul>
    <li><strong>Vault-first.</strong> Most AI tools are stateless. Valley OS reads from your existing Obsidian vault on every turn. Nothing forgotten.</li>
    <li><strong>Local-first.</strong> Cloud AI is expensive. We default to local Ollama on your own Mac. Claude is escalation only.</li>
    <li><strong>Voice-first.</strong> Every agent has a distinct ElevenLabs voice. The 9am council sounds like a real boardroom.</li>
    <li><strong>Build-first.</strong> Every night, two new prototypes get built. You wake up to working code, not just suggestions.</li>
    <li><strong>Replaceable brain.</strong> Claude today. GPT or Gemini or open-source tomorrow. The vault stays.</li>
</ul>

<div class="cta">
    <div class="cta-line">Let it run.</div>
    <div class="cta-sub">7-day free trial · studex.valley / start</div>
</div>

<div class="signature">
    StudEx Global Markets · studex.valley · Cape Town · 2026
</div>

</body>
</html>
"""


if __name__ == "__main__":
    out = HERE / "business-overview.pdf"
    HTML(string=HTML_DOC, base_url=str(HERE)).write_pdf(
        str(out),
        stylesheets=[CSS(string=CSS_STR)],
    )
    print(f"Wrote {out} ({out.stat().st_size // 1024} KB)")
