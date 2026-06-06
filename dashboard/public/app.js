// StudEx Valley OS dashboard — preview / reference.
// Reads the registry + roster + RAG sync status from the running server.
// Tabs: Council · Mission · 2nd Brain · Businesses · Agents · Ledger · Night Build.

const CITIES = [
  { city: "Cape Town",     tz: "Africa/Johannesburg", abbr: "SAST" },
  { city: "Dubai",         tz: "Asia/Dubai",          abbr: "GST"  },
  { city: "London",        tz: "Europe/London",       abbr: "GMT"  },
  { city: "Shanghai",      tz: "Asia/Shanghai",       abbr: "CST"  },
  { city: "Beijing",       tz: "Asia/Shanghai",       abbr: "CST"  },
  { city: "Hong Kong",     tz: "Asia/Hong_Kong",      abbr: "HKT"  },
  { city: "New York",      tz: "America/New_York",    abbr: "EST"  },
  { city: "San Francisco", tz: "America/Los_Angeles", abbr: "PST"  },
];

const TABS = [
  { id: "council",     label: "Council" },
  { id: "mission",     label: "Mission" },
  { id: "secondbrain", label: "2nd Brain" },
  { id: "businesses",  label: "Businesses" },
  { id: "agents",      label: "Agents" },
  { id: "ledger",      label: "Ledger" },
  { id: "nightbuild",  label: "Night Build" },
];

// ---------- helpers ----------
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const k of kids.flat()) if (k != null) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
};

const fmt = (d, tz) => new Intl.DateTimeFormat("en-GB", {
  timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
}).format(d);

async function jget(p) {
  const r = await fetch(p);
  if (!r.ok) throw new Error(`${p} ${r.status}`);
  return r.json();
}

// ---------- clocks ----------
function renderClocks() {
  const root = document.getElementById("clocks");
  root.innerHTML = "";
  const now = new Date();
  for (const c of CITIES) {
    root.append(el("div", { class: "clock" },
      el("div", { class: "city" }, c.city),
      el("div", { class: "t" }, fmt(now, c.tz), el("span", { class: "abbr" }, c.abbr)),
    ));
  }
}
renderClocks();
setInterval(renderClocks, 30 * 1000);

// ---------- tabs ----------
let active = location.hash.replace("#", "") || "mission";
function renderTabs() {
  const root = document.getElementById("tabs");
  root.innerHTML = "";
  for (const t of TABS) {
    root.append(el("button", {
      class: "tab" + (t.id === active ? " active" : ""),
      onclick: () => { active = t.id; location.hash = t.id; render(); },
    }, t.label));
  }
  document.getElementById("page-title").textContent = ({
    council: "Agent Council", mission: "Mission Control",
    secondbrain: "2nd Brain", businesses: "Businesses",
    agents: "Agents", ledger: "Ledger", nightbuild: "Night Build",
  })[active] || "Mission Control";
}

// ---------- views ----------
const EMOJI = { robusca: "👩🏽‍💼", cto: "👨🏽‍💻", skunkworks: "🛠️", drfixit: "🩺",
  cashclaw: "💰", denchclaw: "📞", charlie: "🥩", research: "🔍", openfang: "🌐",
  "the-lady": "🎬" };

async function viewMission() {
  const { board } = await jget("/api/missions");
  const renderBand = (label, tint, items) => {
    const band = el("section", { class: `band ${tint}` },
      el("header", {},
        el("span", {}, label),
        el("span", { class: "count" }, String(items.length)),
      ),
      el("div", { class: "body" },
        items.length === 0 ? el("div", { class: "muted" }, "— empty —") :
        items.map((i) => el("div", { class: "card" },
          el("div", { class: "avatar" }, EMOJI[i.agent] ?? "•"),
          el("div", { class: "meta" },
            el("div", { class: "title" }, i.title),
            el("div", { class: "note" }, `#${i.id} · ${i.agent ?? "unassigned"}`),
          ),
        )),
      ),
    );
    return band;
  };
  return el("div", { class: "kanban" },
    renderBand("Queued",  "yellow", board.Queued ?? []),
    renderBand("Running", "",       board.Running ?? []),
    renderBand("Done",    "yellow", board.Done ?? []),
  );
}

async function viewSecondBrain() {
  let status = await jget("/api/rag-status").catch(() => null);
  if (!status) {
    return el("div", {},
      el("div", { class: "muted" },
        "No sync yet. Run ", el("b", {}, "VAULT_PATH=… node rag/sync.mjs"),
        " on your Mac to populate this page (cron 07:00 SAST)."),
    );
  }
  const ageHrs = (Date.now() - new Date(status.lastSync).getTime()) / 36e5;
  const ageCls = ageHrs < 25 ? "ok" : ageHrs < 49 ? "stale" : "miss";
  const head = el("div", { class: "section" },
    el("div", { class: "h2" }, "Obsidian 2nd Brain ↔ Vector Index"),
    el("div", { class: "note-row" },
      "Vault: ", el("b", {}, status.vaultRoot),
      " · Backend: ", el("b", {}, status.backend),
      " · Embedder: ", el("b", {}, status.embedder),
    ),
    el("div", { class: "note-row" },
      "Last sync: ",
      el("b", { class: ageCls },
        new Date(status.lastSync).toLocaleString() + ` (${ageHrs.toFixed(1)}h ago)`),
      " · Total chunks: ", el("b", {}, String(status.totalChunks)),
    ),
  );
  const tbl = el("table", {},
    el("thead", {}, el("tr", {},
      el("th", {}, "Namespace"), el("th", {}, "Business"),
      el("th", {}, "Files"), el("th", {}, "Chunks"), el("th", {}, "Machine"),
    )),
    el("tbody", {}, ...status.businesses.map((b) => el("tr", {},
      el("td", {}, b.namespace),
      el("td", {}, b.name),
      el("td", {}, String(b.files ?? 0)),
      el("td", { class: b.chunks > 0 ? "ok" : "stale" }, String(b.chunks ?? 0)),
      el("td", {}, b.machine ?? "—"),
    ))),
  );
  return el("div", {}, head, tbl);
}

async function viewBusinesses() {
  const { businesses, machines } = await jget("/api/businesses");
  const mach = new Map(machines.map((m) => [m.id, m]));
  return el("div", { class: "grid" }, businesses.map((b) => {
    const m = mach.get(b.machine);
    return el("div", { class: "tile" },
      el("div", { class: "swatch", style: `background:${b.color}` }),
      el("div", { class: "tag" }, b.slug),
      el("div", { class: "name" }, b.name),
      el("div", { class: "note-row" }, b.tagline),
      el("div", { class: "row" }, "Machine", el("b", {}, m?.name ?? b.machine)),
      el("div", { class: "row" }, "Vault folder", el("b", {}, b.vaultFolder)),
      el("div", { class: "row" }, "Namespace", el("b", {}, b.vectorNamespace)),
      el("div", { class: "pills" },
        ...b.agents.map((a) => el("span", { class: "pill" }, a)),
        ...b.channels.map((c) => el("span", { class: "pill dim" }, c)),
      ),
    );
  }));
}

async function viewAgents() {
  const { agents } = await jget("/api/roster");
  return el("div", { class: "grid" }, agents.map((a) => el("div", { class: "tile" },
    el("div", { class: "tag" }, a.role),
    el("div", { class: "name" }, `${EMOJI[a.codename] ?? "•"}  ${a.display}`),
    el("div", { class: "note-row" }, a.description),
    el("div", { class: "row" }, "Voice", el("b", {}, a.voice)),
    el("div", { class: "row" }, "Task class", el("b", {}, a.taskClass)),
    el("div", { class: "pills" }, a.models.map((m) => el("span", { class: "pill" }, `${m.provider}/${m.name}`))),
  )));
}

async function viewCouncil() {
  const { agents } = await jget("/api/roster");
  const order = ["robusca", "cto", "skunkworks", "drfixit", "cashclaw", "denchclaw", "charlie", "research", "openfang", "the-lady"];
  const seated = order.map((c) => agents.find((a) => a.codename === c)).filter(Boolean);
  return el("div", {},
    el("div", { class: "h2" }, "Next council: 09:00 SAST · 10 seats"),
    el("div", { class: "grid" }, seated.map((a, i) => el("div", { class: "tile" },
      el("div", { class: "tag" }, `Seat ${i + 1} · ${a.role}`),
      el("div", { class: "name" }, `${EMOJI[a.codename] ?? "•"}  ${a.display}`),
      el("div", { class: "note-row" }, "Reports for ≤90s."),
    ))),
  );
}

function viewStub(text) {
  return el("div", { class: "muted" }, text);
}

const VIEWS = {
  council:    viewCouncil,
  mission:    viewMission,
  secondbrain: viewSecondBrain,
  businesses: viewBusinesses,
  agents:     viewAgents,
  ledger:     async () => viewStub("Ledger view — wires into the cost-footer daily summary + sales (CashClaw) when valley/cost.json exists."),
  nightbuild: async () => viewStub("Night Build view — surfaces vault/proposals/<tomorrow>/INDEX.md with approve / revise / discard."),
};

// ---------- shell ----------
async function render() {
  renderTabs();
  const view = document.getElementById("view");
  view.innerHTML = "";
  view.append(el("div", { class: "muted" }, "Loading…"));
  try {
    const node = await VIEWS[active]();
    view.innerHTML = "";
    view.append(node);
  } catch (e) {
    view.innerHTML = "";
    view.append(el("div", { class: "muted" }, `ERROR: ${e.message}`));
  }
}

async function renderStatusBar() {
  const { agents } = await jget("/api/roster");
  const { board } = await jget("/api/missions");
  const open = (board.Queued?.length ?? 0) + (board.Running?.length ?? 0);
  const sb = document.getElementById("statusbar");
  sb.innerHTML = "";
  sb.append(
    el("span", {}, el("span", { class: "dot" }, "● "),
      el("b", {}, `${agents.length} agents`), " online · 0 errors · ", el("b", {}, `${open} open missions`)),
    el("span", {}, "Night Build at 22:00 SAST"),
    el("span", {}, "Local tokens today: ", el("b", {}, "1.2M"), " · Claude: ", el("b", {}, "0")),
  );
}

window.addEventListener("hashchange", () => { active = location.hash.replace("#", "") || "mission"; render(); });
render();
renderStatusBar();
