# StudEx Valley OS — Promo Pack

Three client-facing assets for selling Valley OS, built side-by-side so they share one voice.

| Asset | Where | What it is | How to use |
|---|---|---|---|
| **Business overview PDF** | `pdf/business-overview.pdf` | 6-page client briefing with three diagrams (architecture, roles, ritual) | Email it to prospects. Attach to proposals. Print for in-person meetings. |
| **Remotion promo video** | `remotion/` | 60-second 1080p MP4 with seven animated scenes | Render with `npm run build` on your Mac. Drop on landing page, LinkedIn, X. |
| **NotebookLM source + script** | `notebooklm/` | Source doc + two-host conversational script for NotebookLM | Upload to NotebookLM → generate Audio Overview (8 min podcast) or Video Overview. |

## Recommended workflow

1. **Print the PDF first.** Give it to your first 3 clients in-person. Read their faces. Iterate the copy in `pdf/build_pdf.py` if anything lands flat. Rebuild with `python3 pdf/build_pdf.py`.
2. **Generate the NotebookLM audio.** This is your "lazy podcast" — drop the link in DMs. Pair with the Remotion video for landing-page muscle.
3. **Render the Remotion video.** Add the NotebookLM audio as voiceover (see `remotion/README.md` for the ffmpeg one-liner).

## Rebuilding the PDF

```bash
cd promo/pdf
python3 build.py            # regenerate the three PNG diagrams
python3 build_pdf.py        # regenerate business-overview.pdf
```

Diagram source is in `pdf/build.py`. Copy + layout source is in `pdf/build_pdf.py`. Both pure Python with matplotlib + weasyprint.

## Editing the Remotion video

```bash
cd promo/remotion
npm install
npm run preview             # live editor in browser
# edit src/scenes/*.tsx, src/theme.ts
npm run build               # renders out/studex-valley-os-promo.mp4
```

## Refreshing the NotebookLM podcast

NotebookLM regenerates on each upload. To refresh:

1. Edit `notebooklm/source-document.md` (the truth) or `notebooklm/video-script.md` (the steering)
2. Re-upload to your NotebookLM notebook (replaces the source)
3. Click *Generate* again on Audio Overview or Video Overview

## Shared brand tokens

All three assets use the same palette so the pack looks like one piece:

| Token | Value | Where |
|---|---|---|
| Background | `#0B0E14` | PDF page, video bg |
| Surface | `#11151F` | Cards |
| Ink | `#F2F4F8` | Primary text |
| Ink Dim | `#9CA6B8` | Secondary text |
| Accent | `#FFD60A` | Tech yellow — headings, CTAs |
| Accent Soft | `#FFE45C` | Arrows, highlights |

Change them in three places to rebrand: `pdf/build.py` (top constants), `pdf/build_pdf.py` (CSS_STR), `remotion/src/theme.ts`.
