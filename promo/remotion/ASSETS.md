# Generating HD agent art with NanoBanana (Gemini 2.5 Flash Image)

Inline SVG pixel sprites ship by default and are fine. To upgrade to "painted-pixel" HD characters that look like Avengers-meets-pixel-art, generate each agent with NanoBanana and drop the PNG into `public/agents/<key>.png`. The Remotion components auto-pick up the upgrade.

## Shared style prompt (paste once, then add the per-character line below)

> A high-definition 3D pixel-art character, painted-illustration finish, soft cinematic lighting, transparent background, full body standing pose facing camera, 3/4 view, slight rim light from above. Iconic comic-book-hero proportions like a Marvel Avenger. Vivid colour palette: orange `#FF7A1A` accents, tech yellow `#FFD60A` glow, deep night-sky background-fade `#0B0E14`. Subject occupies centre frame. Crisp edges, voxel-meets-oil-paint texture, no text, no signature, no watermark. Aspect 4:5. The character has a confident, ready-to-work stance — they are part of a futuristic AI agent factory.

Append the per-character line to that paragraph when calling the model.

## Per-character prompts

| Save as | Add this to the shared prompt |
|---|---|
| `public/agents/robusca.png` | **Robusca, Chief of Staff.** Warm South African woman, mid-30s, long black hair in a low bun, gold hoop earrings, mustard-yellow blouse with a thin orange jacket draped over shoulders, calm authoritative expression, holding a leather-bound planner. Soft golden aura. |
| `public/agents/adam.png` | **Adam (CashClaw), Sales.** Confident black-haired man, mid-30s, sharp navy suit with a yellow silk tie, gold pocket-square, briefcase in left hand, slight smirk, dynamic dealmaker stance. Faint dollar-sign glow at chest level. |
| `public/agents/charlie.png` | **Charlie, Studex Meat customer agent.** Friendly South African man, late 20s, butcher's apron stamped "STUDEX MEAT" in yellow, cap pushed back, headset on, smartphone in hand showing a WhatsApp bubble. Warm earthy palette with orange highlights. |
| `public/agents/denchclaw.png` | **DenchClaw, customer relations.** Approachable woman, 20s, modern call-centre headset, casual but stylish green top, tablet under one arm, mid-laugh expression. Orange notification halo around the headset. |
| `public/agents/research.png` | **Research analyst.** Mid-30s person of indeterminate gender, round wire-rim glasses, purple hooded researcher's robe, magnifying glass in right hand, open book in left. Yellow data-glyph particles floating around them. |
| `public/agents/openfang.png` | **OpenFang, web/social researcher.** Punk-leaning 20s figure, asymmetric haircut with one side dyed bright orange, black hoodie with the StudEx bull-skull logo, holographic phone projecting social-feed icons in the air. |
| `public/agents/cto.png` | **CTO, DevOps lead.** Brown-skinned man in his 30s, slim black hoodie, laptop open in front of him with a glowing yellow Cursor IDE on the screen, terminal text reflecting in his glasses, confident posture. Soft cyan arc-reactor-style glow behind. |
| `public/agents/skunkworks.png` | **Skunk Works, build engineer.** Wiry engineer, 40s, yellow hard hat with a black skunk silhouette, blue overalls, blueprint roll tucked under arm, wrench in opposite hand, ready-to-build pose. |
| `public/agents/drfixit.png` | **Dr Fix-It, heartbeat & repair.** Older man in a long white lab coat, stethoscope around neck made of fibre-optic cable, large adjustable wrench in right hand, a small server-rack heart-monitor displaying a steady green pulse beside him. |
| `public/agents/the-lady.png` | **The Lady, Media.** Polished woman in her 30s, deep burgundy blazer, gold-rimmed sunglasses pushed up on her head, professional broadcast microphone in one hand, a sleek camera on a strap. Yellow ring-light glow around her. |
| `public/agents/tumelo-ironman.png` | **Tumelo as Iron Man, Commander.** Full red-and-gold Iron Man armour painted in pixel-art style, cyan arc reactor centre-chest, helmet visor open showing Tumelo's face (warm-brown skin, neat goatee, focused eyes). Confident heroic stance, slight flight-ready lift on the heels. Larger and more detailed than the others — he is the centre of the factory. |

## Workflow

1. Open NanoBanana (Gemini 2.5 Flash Image) or any equivalent image model.
2. Paste the shared style prompt, then append one per-character line.
3. Generate 4 candidates, pick the best, **remove background if needed** (Photoroom, remove.bg, or rembg CLI).
4. Save with the exact filename in the left column.
5. Drop into `promo/remotion/public/agents/`.
6. Run `npm run preview` — Remotion auto-picks up the new asset.

## Tips

- For consistent style across all eleven, set a seed in NanoBanana and reuse.
- Keep aspect 4:5 (portrait) — matches the Character component's bounding box (`size × size*1.25`).
- Tumelo-Iron-Man at 1024×1280 looks especially good as the centrepiece of the Factory scene.
- If you want a different commander persona for Tumelo (Captain America style with yellow shield, or pixel-Hulk), swap the prompt — the filename `tumelo-ironman.png` is just a slot; rename the file & update the import in `src/sprites/characters.ts` if you choose a non-Iron-Man theme.

## Brand consistency

All HD assets should pull from the same palette as the SVG fallbacks:

| Token | Hex |
|---|---|
| Orange (structural) | `#FF7A1A` |
| Yellow (text/glow) | `#FFD60A` |
| Soft yellow | `#FFE066` |
| Background | `#0B0E14` |
| Arc-reactor cyan | `#7DF9FF` |
