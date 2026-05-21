# StudEx XREAL Viewer — interactive 3D vault graph + voice

A real-time, **interactive** 3D knowledge graph of your Obsidian 2nd Brain,
built for the **XREAL One Pro**. Orbit, zoom, click a node to open the note —
and it can **speak** (ElevenLabs, with a Web Speech fallback).

Unlike the pre-rendered Remotion sphere (`../promo/remotion` → `VaultSphere`),
this is live: you control the camera and pick nodes.

## Run it

```bash
cd xreal
npm install
npm run build          # → dist/
ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run serve   # http://localhost:4321
# no key? still works — voice falls back to the browser's built-in speech
```

Dev mode with hot reload: `npm run dev` (run `npm run serve` alongside if you
want ElevenLabs voice during dev).

## On the XREAL One Pro

The One Pro is a virtual-display glass with a built-in **3D / Side-by-Side**
mode. This app gives you *interactive* depth without needing WebXR:

1. Connect the glasses (USB-C) — they appear as an external display.
2. Open `http://localhost:4321` full-screen on that display.
3. Click **SBS 3D** in the app — it splits the render into left/right eyes in
   real time (Three.js `StereoEffect`).
4. In the **XREAL / Nebula** app set the display to **3D → Side-by-Side**.
5. Now you have a live 3D graph floating in front of you. Orbit with the
   trackpad/mouse, click nodes, hear them spoken.
6. **Enter XR** lights up only on devices with WebXR `immersive-vr` (e.g. Quest).
   On XREAL it shows "XR n/a" — use **SBS 3D** instead (that's the supported path).

## Voice (ElevenLabs)

- Click **🔊 Voice** to enable. Then clicking a node speaks its label + community
  + link count.
- The ElevenLabs key stays **server-side** in `server.mjs` (`/tts` proxy) — it is
  never shipped to the browser.
- Per-agent voices: `speak(text, voiceId)` accepts an ElevenLabs voice id, so
  Robusca / Charlie / each agent can narrate in their own voice. Wire the agent's
  `elevenlabs_id` (from `factory/config/agents.json`) into the click handler.
- No key → automatic fallback to the browser's Web Speech API, so it still talks.

## Use YOUR vault

```bash
# in a Claude Code session with the graphify skill:
/graphify "/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain"
cp graphify-out/graph.json  xreal/public/graph.json
cp graphify-out/.graphify_labels.json xreal/public/labels.json
npm run build
```

Nodes auto-cluster by community in 3D, sized by degree, coloured per community.

## Layout / files

```
xreal/
├── index.html            HUD + control bar
├── server.mjs            static server + ElevenLabs /tts proxy (key server-side)
├── vite.config.js
├── public/{graph.json,labels.json}   graph data (swap in your vault)
├── src/
│   ├── main.js           scene, OrbitControls, raycast-click, StereoEffect, WebXR
│   ├── graph.js          community-clustered 3D layout + meshes + edges
│   └── voice.js          speak(): ElevenLabs proxy → Web Speech fallback
└── verify/check.mjs      Playwright smoke (canvas+WebGL+graph+0 errors)
```

Verified: `vite build` clean; Playwright → "canvas+WebGL up, graph loaded
(71 notes · 116 links · 9 communities), 0 console errors".

## Honest scope

- **Interactive 3D + SBS stereo on XREAL: works** (proven by the Playwright
  render + the StereoEffect path).
- **WebXR immersive (room-scale, head-tracked 6DoF): only where the device/runtime
  supports it.** XREAL One Pro's browser runtime is not a full WebXR headset, so
  the SBS path is the reliable one there. On a Quest, "Enter XR" gives full immersive.
- **Hardware not testable from CI** — the SwiftShader render proves the scene; the
  actual glasses experience is verified on your device.
