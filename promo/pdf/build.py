#!/usr/bin/env python3
"""Build the StudEx Valley OS business overview PDF with embedded diagrams.

Run:
    python3 build.py

Outputs:
    diagrams/architecture.png
    diagrams/roles.png
    diagrams/ritual.png
    business-overview.pdf
"""
from __future__ import annotations

import os
from pathlib import Path

import matplotlib.patches as mpatches
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

# Brand — orange structure, yellow text
BG = "#0B0E14"
SURFACE = "#11151F"
INK = "#FFD60A"            # tech yellow — primary text
INK_DIM = "#FFE066"        # softer yellow — sub-text
BORDER = "#FF7A1A"         # orange — box borders, arrows, CTAs
BORDER_SOFT = "#FFB47A"    # soft orange — arrow tails
ACCENT = BORDER            # alias for legacy callsites
ACCENT_SOFT = BORDER_SOFT
GOOD = "#4ADE80"

HERE = Path(__file__).parent
DIAGRAMS = HERE / "diagrams"
DIAGRAMS.mkdir(exist_ok=True)


def stylise(ax):
    ax.set_facecolor(BG)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.set_xticks([])
    ax.set_yticks([])


def rounded(ax, x, y, w, h, label, sub=None, fill=SURFACE, border=BORDER, text=INK, text_size=14, sub_size=10):
    box = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.02,rounding_size=0.08",
        linewidth=2.0,
        edgecolor=border,
        facecolor=fill,
    )
    ax.add_patch(box)
    if sub:
        ax.text(x + w / 2, y + h * 0.62, label, ha="center", va="center",
                color=text, fontsize=text_size, weight="bold")
        ax.text(x + w / 2, y + h * 0.30, sub, ha="center", va="center",
                color=INK_DIM, fontsize=sub_size)
    else:
        ax.text(x + w / 2, y + h / 2, label, ha="center", va="center",
                color=text, fontsize=text_size, weight="bold")


def arrow(ax, x1, y1, x2, y2, color=ACCENT_SOFT, lw=2.0, style="->"):
    a = FancyArrowPatch((x1, y1), (x2, y2),
                        arrowstyle=style, color=color,
                        mutation_scale=18, lw=lw)
    ax.add_patch(a)


# ---------------------------------------------------------------------------
# Diagram 1: Architecture (five layers)
# ---------------------------------------------------------------------------
def build_architecture():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=180)
    fig.patch.set_facecolor(BG)
    stylise(ax)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)

    ax.text(5.5, 6.65, "S T U D E X   V A L L E Y   O S   —   A R C H I T E C T U R E",
            ha="center", color=INK, fontsize=15, weight="bold")

    layers = [
        ("VAULT",     "single source of truth (your Obsidian 2nd Brain)",       5.3),
        ("HIVE MIND", "classifier · memory · audit · kill switches",            4.1),
        ("AGENTS",    "six roles · eleven codenames · one voice each",          2.9),
        ("BRIDGES",   "Slack · Discord · Voice (ElevenLabs)",                   1.7),
        ("MUSCLE",    "Ollama on your Macs · Claude only on escalation",        0.5),
    ]
    for label, sub, y in layers:
        rounded(ax, 0.7, y, 9.6, 1.0, label, sub=sub, border=BORDER, text=INK, text_size=18, sub_size=12)

    for y in [5.3, 4.1, 2.9, 1.7]:
        arrow(ax, 5.5, y, 5.5, y - 0.2, color=BORDER_SOFT, lw=2.0)

    plt.savefig(DIAGRAMS / "architecture.png", facecolor=BG, bbox_inches="tight", pad_inches=0.3)
    plt.close()


# ---------------------------------------------------------------------------
# Diagram 2: Roles
# ---------------------------------------------------------------------------
def build_roles():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=180)
    fig.patch.set_facecolor(BG)
    stylise(ax)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)

    ax.text(5.5, 6.65, "S I X   R O L E S   ·   E L E V E N   C O D E N A M E S",
            ha="center", color=INK, fontsize=15, weight="bold")

    roles = [
        ("CHIEF OF STAFF", "Robusca",                       0.4, 5.0),
        ("SALES",          "Adam · CashClaw",               5.6, 5.0),
        ("CUSTOMER",       "Charlie · DenchClaw",           0.4, 3.4),
        ("RESEARCH",       "Research · OpenFang",           5.6, 3.4),
        ("DEVOPS",         "CTO · Skunk Works · Dr Fix-It", 0.4, 1.8),
        ("MEDIA",          "The Lady",                      5.6, 1.8),
    ]
    for role, codenames, x, y in roles:
        rounded(ax, x, y, 5.0, 1.2, role, sub=codenames, border=BORDER, text=INK, text_size=17, sub_size=13)

    ax.text(5.5, 0.6, "Each codename has its own ElevenLabs voice. Voice routes to channel; channel routes to role.",
            ha="center", color=INK_DIM, fontsize=12, style="italic")

    plt.savefig(DIAGRAMS / "roles.png", facecolor=BG, bbox_inches="tight", pad_inches=0.3)
    plt.close()


# ---------------------------------------------------------------------------
# Diagram 3: Daily ritual timeline
# ---------------------------------------------------------------------------
def build_ritual():
    fig, ax = plt.subplots(figsize=(11, 6), dpi=180)
    fig.patch.set_facecolor(BG)
    stylise(ax)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6)

    ax.text(5.5, 5.55, "O N E   D A Y   ·   O N E   L O O P   (S A S T)",
            ha="center", color=INK, fontsize=15, weight="bold")

    # timeline bar (orange)
    ax.add_patch(FancyBboxPatch((0.5, 2.4), 10, 0.22,
                                boxstyle="round,pad=0,rounding_size=0.08",
                                facecolor=BORDER, edgecolor=BORDER))

    slots = [
        (0.7,  "07:00", "Snapshot"),
        (1.7,  "08:00", "Robusca Standup"),
        (2.9,  "09:00", "Agent Council"),
        (4.4,  "12:00", "Midday"),
        (5.7,  "17:00", "EOD"),
        (7.5,  "22:00", "Night Build"),
        (8.7,  "00:00", "Snapshot"),
        (9.8,  "02:00", "Hard Stop"),
    ]
    above = True
    for x, t, label in slots:
        ax.add_patch(mpatches.Circle((x, 2.51), 0.13, color=BORDER_SOFT, ec=BG, lw=2, zorder=5))
        y_text = 3.0 if above else 1.9
        y_label = 3.55 if above else 1.45
        ax.plot([x, x], [2.65 if above else 2.37, y_text - 0.1 if above else y_text + 0.1],
                color=BORDER_SOFT, lw=1.0)
        ax.text(x, y_text, t, ha="center", va="bottom" if above else "top",
                color=INK, fontsize=13, weight="bold", family="monospace")
        ax.text(x, y_label, label, ha="center", va="bottom" if above else "top",
                color=INK, fontsize=12)
        above = not above

    ax.add_patch(mpatches.Rectangle((7.3, 0.3), 2.7, 5.0, color=BORDER, alpha=0.08))
    ax.text(8.65, 0.55, "IDLE HOURS — local Ollama only, no Claude, no outbound",
            ha="center", color=INK_DIM, fontsize=11, style="italic")

    plt.savefig(DIAGRAMS / "ritual.png", facecolor=BG, bbox_inches="tight", pad_inches=0.3)
    plt.close()


# ---------------------------------------------------------------------------
# Diagram 4: Dashboard mockup
# ---------------------------------------------------------------------------
def build_dashboard():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=180)
    fig.patch.set_facecolor(BG)
    stylise(ax)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)

    # Top: world clock strip (transparent bold white)
    cities = [
        ("Cape Town", "08:30", "SAST"),
        ("Dubai",      "10:30", "GST"),
        ("London",     "06:30", "GMT"),
        ("Shanghai",   "14:30", "CST"),
        ("Beijing",    "14:30", "CST"),
        ("Hong Kong",  "14:30", "HKT"),
        ("New York",   "02:30", "EST"),
        ("San Fran.",  "23:30", "PST"),
    ]
    strip_y = 6.25
    ax.add_patch(FancyBboxPatch((0.2, strip_y - 0.25), 10.6, 0.55,
                                 boxstyle="round,pad=0,rounding_size=0.05",
                                 facecolor="#11151F", edgecolor="#FFFFFF22", lw=0.6))
    for i, (city, time, abbr) in enumerate(cities):
        x = 0.85 + i * 1.31
        ax.text(x, strip_y + 0.10, city.upper(), ha="center", color="#FFFFFFB0",
                fontsize=7, weight="bold")
        ax.text(x, strip_y - 0.13, f"{time} {abbr}", ha="center", color="#FFFFFF",
                fontsize=10, weight="bold", family="monospace")

    # Title row
    ax.text(0.4, 5.65, "STUDEX VALLEY OS", color=BORDER, fontsize=10,
            weight="bold")
    ax.text(0.4, 5.25, "Mission Control", color=INK, fontsize=22, weight="bold")

    # Tabs row (right side)
    tabs = ["Council", "Mission", "War Room", "Agents", "Ledger", "Night Build"]
    tab_x = 4.8
    for i, t in enumerate(tabs):
        active = (t == "Mission")
        tw = 1.02
        x = tab_x + i * (tw + 0.05)
        ax.add_patch(FancyBboxPatch((x, 5.25), tw, 0.45,
                                     boxstyle="round,pad=0,rounding_size=0.06",
                                     facecolor=BORDER if active else "none",
                                     edgecolor=BORDER if active else INK,
                                     lw=1.4))
        ax.text(x + tw / 2, 5.47, t.upper(), ha="center", va="center",
                color=BG if active else INK, fontsize=8, weight="bold")

    # Kanban bands
    bands = [
        ("QUEUED",  INK,    3, ["SGM follow-ups", "Coffee A/B test", "Moz pipeline"]),
        ("RUNNING", BORDER, 2, ["Cursor BG · refactor", "Sandbox template"]),
        ("DONE",    INK,    2, ["WhatsApp cleared", "Restart · DenchClaw"]),
    ]
    band_width = 3.45
    band_x = 0.4
    for col_i, (label, tint, count, items) in enumerate(bands):
        x = band_x + col_i * (band_width + 0.1)
        y = 0.4
        h = 4.5

        # Card frame
        ax.add_patch(FancyBboxPatch((x, y), band_width, h,
                                     boxstyle="round,pad=0,rounding_size=0.08",
                                     facecolor="#0B0E14CC", edgecolor=tint, lw=2))
        # Header
        ax.add_patch(FancyBboxPatch((x, y + h - 0.55), band_width, 0.55,
                                     boxstyle="round,pad=0,rounding_size=0.08",
                                     facecolor=tint, edgecolor=tint, lw=0))
        ax.text(x + 0.2, y + h - 0.28, label, ha="left", va="center",
                color=BG, fontsize=11, weight="bold")
        # Count chip
        ax.add_patch(mpatches.Circle((x + band_width - 0.3, y + h - 0.28), 0.18,
                                      color=BG))
        ax.text(x + band_width - 0.3, y + h - 0.28, str(count), ha="center",
                va="center", color=tint, fontsize=10, weight="bold")

        # Items
        for j, item in enumerate(items):
            iy = y + h - 1.0 - j * 0.85
            ax.add_patch(FancyBboxPatch((x + 0.15, iy - 0.3), band_width - 0.3, 0.6,
                                         boxstyle="round,pad=0,rounding_size=0.05",
                                         facecolor=SURFACE, edgecolor=tint, lw=0.8))
            # Mini pixel avatar (just a small orange square as proxy)
            ax.add_patch(mpatches.Rectangle((x + 0.25, iy - 0.15), 0.32, 0.4,
                                             color=BORDER, alpha=0.5))
            ax.text(x + 0.7, iy, item, ha="left", va="center",
                    color=INK, fontsize=9)

    plt.savefig(DIAGRAMS / "dashboard.png", facecolor=BG,
                bbox_inches="tight", pad_inches=0.3)
    plt.close()


if __name__ == "__main__":
    print("Building diagrams...")
    build_architecture()
    build_roles()
    build_ritual()
    build_dashboard()
    for n in ["architecture", "roles", "ritual", "dashboard"]:
        print(f"Wrote {DIAGRAMS}/{n}.png")
