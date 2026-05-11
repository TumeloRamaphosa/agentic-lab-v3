# StudEx Valley OS — Promo Video (Remotion)

A 60-second, 1080p / 30fps promo video for StudEx Valley OS, built with [Remotion](https://www.remotion.dev/).

## Scenes (60 sec total)

1. **Intro** (0–6s) — Brand drop · "Your company, running itself."
2. **Problem** (6–14s) — Four pains that hit every founder
3. **The Picture** (14–24s) — The five-layer architecture (Vault → Hive Mind → Agents → Bridges → Muscle)
4. **Roles** (24–34s) — Six roles, eleven codenames
5. **Ritual** (34–44s) — One day, one loop (07:00 → 02:00)
6. **Pricing** (44–52s) — Starter / Pro / Premium tiers
7. **CTA** (52–60s) — Let it run.

## Run on your Mac

```bash
cd promo/remotion
npm install                    # installs Remotion + React
npm run preview                # opens Remotion Studio in your browser
npm run build                  # renders out/studex-valley-os-promo.mp4
npm run render:still           # renders out/poster.png (frame 60)
```

The first `npm install` will download Chromium for Puppeteer (~150 MB). Subsequent builds are fast.

## Adding voiceover + music

1. Record a voiceover (use the NotebookLM script in `../notebooklm/video-script.md` as a guide).
2. Drop the audio file at `public/voice.mp3`.
3. In `src/Composition.tsx`, add:
   ```tsx
   import { Audio, staticFile } from "remotion";
   // inside <AbsoluteFill>:
   <Audio src={staticFile("voice.mp3")} />
   ```
4. Add background music the same way at `public/music.mp3` with `<Audio src={...} volume={0.15} />`.

## Customising

- Colours, fonts, scene durations → `src/theme.ts`
- Copy on each scene → `src/scenes/*.tsx`
- Resolution / fps → `src/Root.tsx`

## Export targets

```bash
# 1080p MP4 (default)
npm run build

# WebM for the web
npm run build:web

# Still frame (poster image)
npm run render:still
```

## License

Internal — StudEx Global Markets. Not for redistribution.
