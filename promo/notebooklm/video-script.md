# StudEx Valley OS — Video / Audio Promo Script

**Format:** two-host conversational. Host A = curious, friendly. Host B = the explainer. Both South African.

**Length:** ~8 minutes spoken (matches a NotebookLM Audio Overview default).

**Use:** drop this as a second source in NotebookLM after `source-document.md`, and paste the Customisation Prompt from `README.md` into the Studio panel. NotebookLM will follow this beat order while making it feel natural.

---

## Cold open (0:00 – 0:30)

**A:** You ever look at your laptop at 11pm and just feel… buried?

**B:** Every founder I know has had that moment. Customers still messaging. The deck for tomorrow's meeting saved in some folder you can't remember. Three AI subscriptions you forgot to cancel.

**A:** Right. And the answer's supposed to be "use AI". But "AI" is just a thousand more tabs.

**B:** That's exactly the problem StudEx Valley OS is solving. So let's talk about it. There's a brand image you need in your head first — it's Michelangelo's Creation of Adam, but in the middle of the painting, where Adam's finger almost touches God's, there's a Studex bull-and-circuit medallion glowing like a sun. That's the whole pitch in one frame: the bridge between human ambition and machine intelligence.

**A:** Okay, I'm picturing it.

**B:** Good. Now hold that, because everything we describe today sits underneath that image.

---

## The pitch in one line (0:30 – 1:00)

**A:** Okay — give me the one line.

**B:** It's an operating system for your business that runs on your own Mac. A fleet of small AI agents that handle sales, customers, content, research, and code. They have a morning standup at 8am, a board meeting at 9am, and they build new products for you while you sleep.

**A:** While you sleep.

**B:** Two prototypes a night. Strictly two. We'll get there.

---

## The one picture (1:00 – 2:30)

**A:** Before the agents — give me the architecture. How does it fit together?

**B:** Five layers, stacked. From the bottom up: vault, hive mind, agents, bridges, muscle.

**A:** Vault first.

**B:** The vault is your Obsidian "second brain" — the notes you already keep. Every decision, every customer chat, every cost line ends up there. It's the single source of truth. If it's not in the vault, it didn't happen.

**A:** Then?

**B:** The hive mind sits on top. It's the wrapper — the classifier that routes any incoming task to the right agent, a three-layer memory, an audit log, and kill switches you can flip if you ever want to pause everything.

**A:** Then the agents.

**B:** Six roles, eleven codenamed personas. Each one is a folder with a YAML file and a personality file. Easy to edit, easy to add new ones.

**A:** Bridges?

**B:** Slack, Discord, voice. Every channel feeds into one chat history. You can talk to any agent from anywhere.

**A:** And muscle.

**B:** Ollama running on your own Mac — local, free, private. Mesh-LLM across multiple machines if you want heavy models. Claude only when local can't handle it. Most days your cloud bill is zero.

---

## The six roles (2:30 – 4:00)

**A:** Walk me through the agents. Six roles, eleven personas.

**B:** Robusca is Chief of Staff. Female voice, warm South African accent. She runs the 8am standup. Reads yesterday's notes, the ledger, the kanban — writes today's note.

**A:** Not the CTO.

**B:** Definitely not. CTO is a different agent under DevOps. He develops in Cursor IDE with local Ollama models. For short tasks he uses the Cursor CLI. For long, multi-file work he spawns Cursor Background Agents through the API. He delegates build automation to Skunk Works and monitoring to Dr Fix-It.

**A:** Sales?

**B:** Adam — codename CashClaw. Confident, practical. Anchored to the meat business right now. Closes deals, watches the pipeline.

**A:** Customer side?

**B:** DenchClaw handles signups across all the brands. Charlie is dedicated to the meat business — replies to every WhatsApp, books calls, escalates the hard ones.

**A:** Research?

**B:** Two agents. Research reads the internet and the ledger. OpenFang scrapes social media and partner news. They feed the morning council with what's new.

**A:** Media?

**B:** The Lady. Female persona. Posts content, tracks performance, reports audience reactions.

**A:** Eleven personas total. Each with its own voice.

**B:** Each with its own ElevenLabs voice. And each with a face. Inside the dashboard and the promo video, every agent shows up as a painted-pixel character — Marvel-Avenger style, high definition, generated with NanoBanana from a prompt library we wrote. Robusca looks like Robusca. Adam looks like Adam.

**A:** And Tumelo himself?

**B:** Tumelo is the Commander. He shows up as Iron Man — red and gold armour, cyan arc reactor at the chest. He sits at the centre of the Factory, agents at numbered workstations around him, conveyor belts running between them.

**A:** That's a vibe.

**B:** It's deliberate. The whole product looks like a Marvel movie ran into a Bloomberg terminal. Speaking of which — the dashboard.

---

## The dashboard (4:00 – 5:00)

**A:** Walk me through what the founder actually looks at.

**B:** One screen, `localhost:3141`, Cloudflare-tunnelled so it works from anywhere. Top of the screen — and this is one of my favourite touches — eight world clocks in transparent bold white. Cape Town, Dubai, London, Shanghai, Beijing, Hong Kong, New York, San Francisco.

**A:** A trading-floor strip.

**B:** Exactly. Because StudEx Global Markets is by definition cross-timezone. You always know what time it's becoming somewhere your partners or customers care about. Under that, a row of tabs — Council, Mission, War Room, Agents, Ledger, Night Build — each one a full view. Yellow border when idle, fills orange when active.

**A:** And the main panel?

**B:** The kanban. Three columns. Queued and Done get the yellow band treatment. Running gets the orange band. Each task card carries the responsible agent's pixel face on the left and the title on the right. You can drag tasks between columns. The classifier auto-routes anything that doesn't have an agent attached.

**A:** Status bar?

**B:** One line of mono font at the bottom. Agents online, errors today, PRs waiting on you, time until Night Build, and the killer metric — local tokens spent today versus Claude tokens spent today. Most days it reads zero Claude. That's the local-first promise made visible.

**A:** And the Genesis painting?

**B:** Faintly behind it all. Eighteen percent opacity. The brand is always present without competing with the data.

---

## The daily ritual (5:00 – 6:00)

**A:** Walk me through a day.

**B:** 8am, Robusca opens the standup. Reads yesterday, reads the ledger, writes today's plan. Three priorities, plus a clearly labelled block of decisions you need to make.

**A:** Then?

**B:** 9am — StudEx Agent Council Meeting. Every agent reports, in order, each under 90 seconds. Voice in the room. CTO on infra, Skunk Works on builds, Dr Fix-It on heartbeats, Adam on sales, DenchClaw on signups, Charlie on customers, Research and OpenFang on findings, The Lady on content.

**A:** Sounds like a real boardroom.

**B:** It is. You can interject any time. "@Charlie, give me more on that complaint." "@Adam, show me the Mozambique pipeline." "/decide ship the new landing page Tuesday." The transcript saves to your vault. Action items go to the kanban.

**A:** Drop-in documents?

**B:** Yeah — you can drop a PDF or a link into the meeting mid-flow, the system chunks it into memory, and the agents reference it for the rest of the session.

**A:** Then the rest of the day?

**B:** Snapshots at noon and 5pm. The agents work the queue. You work on what you're good at. At 10pm — Night Build.

---

## The Night Build (6:00 – 7:00)

**A:** This is the bit that sounds magical.

**B:** It's the bit that does the real work. 10pm to 2am. Four hours. Strict mode — two prototypes per night, every night.

**A:** What stops it going off the rails?

**B:** Local models only. No Claude API calls. No outbound messages. No real money operations. The system literally cannot spend a cent during night build.

**A:** And the deliverable?

**B:** Each prototype gets a 3-page plan, working code in a sandboxed folder, passing tests, and a Cursor configuration so the project opens cleanly in Cursor when you wake up.

**A:** At 8am Robusca surfaces them?

**B:** "Two prototypes from last night. First one passed all tests, ready to demo. Second one passed most tests with one documented issue. Open them in Cursor. Approve, revise, or discard?"

**A:** Three decisions before your second coffee.

**B:** That's the pitch.

---

## Pricing (7:00 – 7:30)

**A:** What does it cost a client?

**B:** Three tiers. Starter is R2,999 a month — solo founder, three agents, one channel, cloud models. Pro is R6,999 — small team, six agents, Slack and Discord, local models on your own Mac, Night Build included. Premium is R13,999 — all eleven agents, mesh across multiple machines, Cursor Background Agents, white-label branding.

**A:** All cheaper than one hire.

**B:** Cheaper than one part-time hire. And the local-first stack means most months your cloud bill is zero rand. Plus 7-day free trial, POPIA-compliant, load-shedding friendly because it runs on your own hardware.

---

## Close (7:30 – 8:30)

**A:** If somebody listening is the founder we described at the start — bottlenecked, answering customers at midnight — what do they do?

**B:** Open studex dot valley slash start. Free trial. Setup takes an afternoon. Your first morning standup runs at 8am the next day. Robusca will introduce herself.

**A:** And then?

**B:** Let it run.

**A:** Let it run. I like that. Thanks Brian.

**B:** Thanks for having me.

---

## Notes for the recording

- Speak slightly faster than usual — this is a podcast, not a documentary.
- Hosts laugh occasionally at the dry bits ("definitely not [the CTO]").
- Pause for half a beat after every transition heading.
- South African accents both — Cape Town or Joburg, not exaggerated.
- Background: clean. No music under voice, optional soft music in cold open and close only.
- Sound design: a single "ding" between sections (optional).
