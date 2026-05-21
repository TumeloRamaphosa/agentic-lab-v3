# Vault Knowledge Sphere — 3D + XREAL One Pro

A rotating 3D sphere of your Obsidian **2nd Brain** graph, rendered with
Remotion. Two compositions:

| Composition | Size | For |
|---|---|---|
| `VaultSphere` | 1920×1080 | Monoscopic — plays as a big floating screen on XREAL (looks 3D via the orbit) |
| `VaultSphereSBS` | 3840×1080 | **Stereoscopic Side-by-Side** — real depth in XREAL One Pro's 3D mode |

Driven by `src/data/graph.json` (networkx node-link from graphify). Ships with
the StudEx Valley OS spec graph (71 notes, 9 communities) so it renders out of
the box. Swap in your own vault below.

## Render

```bash
cd promo/remotion
npm install
# monoscopic (floating screen)
npx remotion render VaultSphere out/vault-sphere.mp4
# stereoscopic SBS (XREAL 3D mode)
npx remotion render VaultSphereSBS out/vault-sphere-sbs.mp4
```

On macOS, Remotion downloads its own Chrome — no extra flags needed. (In a
locked-down sandbox you'd pass `--browser-executable=... --chrome-mode=chrome-for-testing`.)

## Watch it on XREAL One Pro

XREAL One Pro is a virtual-display glass — it shows your Mac's screen (or a
played video) as a large floating panel, and supports **Side-by-Side 3D**.

1. Connect the glasses (USB-C) — they appear as an external display.
2. Open `out/vault-sphere-sbs.mp4` full-screen on that display.
3. In the **XREAL / Nebula** app, set display mode to **3D → Side-by-Side (Full)**.
4. Optionally enable **Anchor / Spatial** mode so the globe stays fixed in space
   while you turn your head.
5. The graph becomes a globe floating in front of you with real depth.

For the plain floating-screen experience (no 3D toggle), use the monoscopic
`out/vault-sphere.mp4`.

> Note: this is pre-rendered video, so you orbit *with* the camera — you can't
> walk around it. True interactive fly-through (look anywhere, grab nodes) needs
> a WebXR/Three.js build, which is a separate project from Remotion.

## Use YOUR vault

Generate a graph from your real 2nd Brain, then drop it in:

```bash
# from a Claude Code session with the graphify skill installed:
/graphify "/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain"
# → produces graphify-out/graph.json (+ labels)

cp graphify-out/graph.json   promo/remotion/src/data/graph.json
cp graphify-out/.graphify_labels.json promo/remotion/src/data/labels.json

# re-render
npx remotion render VaultSphereSBS out/vault-sphere-sbs.mp4
```

The sphere auto-lays-out however many nodes/communities your vault has
(Fibonacci distribution, sized by degree, coloured by community).

## Tuning

- Eye separation (depth strength): `SEP` in `src/scenes/VaultSphereSBS.tsx`
  (bigger = more pop-out; too big = eye strain).
- Orbit speed / duration: `durationInFrames` for the compositions in `src/Root.tsx`.
- Node size, fog, labels, palette: `src/sphere/SphereView.tsx` + `src/sphere/graph3d.ts`.
