# NotebookLM Promo Package

Two files, two jobs:

| File | What it is | Where it goes |
|---|---|---|
| `source-document.md` | The full briefing document. **Upload this to NotebookLM as a source.** It contains everything NotebookLM needs to generate an audio overview, a video overview, a podcast, or a study guide. |
| `video-script.md` | A two-host conversational script tuned for NotebookLM's "Audio Overview" style. Use it as a steering prompt OR record it yourself. |

## How to use with NotebookLM

1. Open https://notebooklm.google.com and create a new notebook called **"StudEx Valley OS — Client Promo"**.
2. Click **Add source** → **Upload** → drop `source-document.md`.
3. (Optional but recommended) Add a second source: drop `video-script.md` so NotebookLM follows the structure.
4. In the **Studio** panel on the right, choose one:
   - **Audio Overview** → click *Generate*. NotebookLM produces a ~6–10 min podcast with two AI hosts. Click *Customize* first and paste the **Customisation Prompt** from the bottom of this file.
   - **Video Overview** → click *Generate* under Video. Slides + narration based on the source.
   - **Study Guide / Briefing Doc** → for handing to clients.
5. Download the audio (MP3) or video (MP4) and use it as your sales asset.

## Customisation Prompt (paste into NotebookLM "Customize")

> Make this an upbeat, founder-to-founder conversation between two South African hosts. Tone: practical, warm, no hype. Length: 8 minutes. Cover (in order) the problem ("running a 2026 business is a hundred jobs at once"), the one-picture architecture (vault → hive mind → agents → bridges → muscle), the six agent roles with codenames, the daily ritual (08:00 standup, 09:00 council, 22:00 night build), pricing tiers, and end on the call to action "let it run". Emphasise that it runs on the founder's own Mac with local Ollama models, escalating to Claude only when needed. Keep technical jargon out. Speak to a Cape Town small-business owner, not a Silicon Valley engineer.

## What NotebookLM does best (and where it struggles)

- ✅ Two-host audio overviews with natural back-and-forth — perfect for "what's this thing" promos
- ✅ Synthesising a long source doc into a 5-10 min listen
- ✅ Adding curiosity hooks and analogies the source didn't have
- ❌ Following an exact script word-for-word — treat the script as direction, not literal text
- ❌ Citing exact numbers reliably — keep the source doc tight on pricing

## Pairing with the Remotion video

The Remotion video at `../remotion/` is silent by default. The NotebookLM audio is perfect voiceover material:

1. Render the Remotion video with `npm run build` in `../remotion/`
2. Download the NotebookLM audio
3. Use ffmpeg to mux them:
   ```bash
   ffmpeg -i ../remotion/out/studex-valley-os-promo.mp4 -i ./notebooklm-audio.mp3 \
     -c:v copy -c:a aac -shortest ./final-promo.mp4
   ```

Done — one promo, two AI tools, zero hire.
