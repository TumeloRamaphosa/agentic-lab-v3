# Remotion `public/` — drop your assets here

Anything in `public/` is served at the root of the Remotion bundle. The components below auto-load these files when present and fall back to generated graphics if absent.

## Required (drop these in)

```
public/
├─ studex-genesis.png            ← Save the Studex × Creation-of-Adam painting here
└─ agents/                       ← HD pixel characters from NanoBanana (see ../ASSETS.md)
   ├─ robusca.png
   ├─ adam.png
   ├─ charlie.png
   ├─ denchclaw.png
   ├─ research.png
   ├─ openfang.png
   ├─ cto.png
   ├─ skunkworks.png
   ├─ drfixit.png
   ├─ the-lady.png
   └─ tumelo-ironman.png
```

## Optional

```
public/
├─ voice.mp3                     ← Voiceover (NotebookLM export or your own)
└─ music.mp3                     ← Background music (low volume)
```

## What happens if a file is missing

| Missing file | Fallback |
|---|---|
| `studex-genesis.png` | Procedural radial gradient (still renders, no painting) |
| `agents/<key>.png` | Inline SVG pixel sprite (smaller, retro-pixel look) |
| `voice.mp3` | Silent |
| `music.mp3` | Silent |

You can ship the video with NO files in `public/` and it will still render — just less rich. Add files progressively.

## Sizing

- `studex-genesis.png`: 1920×1080 or larger, landscape. The component covers + zooms.
- `agents/*.png`: 256×320 or 512×640, transparent background recommended. Will be scaled.
- `voice.mp3`: any sample rate, mono or stereo.
