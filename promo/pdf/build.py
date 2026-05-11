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

# Brand
BG = "#0B0E14"
SURFACE = "#11151F"
INK = "#F2F4F8"
INK_DIM = "#9CA6B8"
ACCENT = "#FFD60A"         # tech yellow
ACCENT_SOFT = "#FFE45C"
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


def rounded(ax, x, y, w, h, label, sub=None, fill=SURFACE, border=ACCENT, text=INK, text_size=14, sub_size=10):
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
            ha="center", color=ACCENT, fontsize=15, weight="bold")

    layers = [
        ("VAULT",     "single source of truth (your Obsidian 2nd Brain)",       5.3, ACCENT),
        ("HIVE MIND", "classifier · memory · audit · kill switches",            4.1, ACCENT),
        ("AGENTS",    "six roles · eleven codenames · one voice each",          2.9, ACCENT),
        ("BRIDGES",   "Slack · Discord · Voice (ElevenLabs)",                   1.7, ACCENT),
        ("MUSCLE",    "Ollama on your Macs · Claude only on escalation",        0.5, ACCENT),
    ]
    for label, sub, y, color in layers:
        rounded(ax, 0.7, y, 9.6, 1.0, label, sub=sub, border=color, text_size=18, sub_size=12)

    for y in [5.3, 4.1, 2.9, 1.7]:
        arrow(ax, 5.5, y, 5.5, y - 0.2, color=ACCENT_SOFT, lw=2.0)

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
            ha="center", color=ACCENT, fontsize=15, weight="bold")

    roles = [
        ("CHIEF OF STAFF", "Robusca",                       0.4, 5.0),
        ("SALES",          "Adam · CashClaw",               5.6, 5.0),
        ("CUSTOMER",       "Charlie · DenchClaw",           0.4, 3.4),
        ("RESEARCH",       "Research · OpenFang",           5.6, 3.4),
        ("DEVOPS",         "CTO · Skunk Works · Dr Fix-It", 0.4, 1.8),
        ("MEDIA",          "The Lady",                      5.6, 1.8),
    ]
    for role, codenames, x, y in roles:
        rounded(ax, x, y, 5.0, 1.2, role, sub=codenames, border=ACCENT, text_size=17, sub_size=13)

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
            ha="center", color=ACCENT, fontsize=15, weight="bold")

    # timeline bar
    ax.add_patch(FancyBboxPatch((0.5, 2.4), 10, 0.22,
                                boxstyle="round,pad=0,rounding_size=0.08",
                                facecolor=ACCENT, edgecolor=ACCENT))

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
        ax.add_patch(mpatches.Circle((x, 2.51), 0.13, color=ACCENT_SOFT, ec=BG, lw=2, zorder=5))
        y_text = 3.0 if above else 1.9
        y_label = 3.55 if above else 1.45
        ax.plot([x, x], [2.65 if above else 2.37, y_text - 0.1 if above else y_text + 0.1],
                color=INK_DIM, lw=1.0)
        ax.text(x, y_text, t, ha="center", va="bottom" if above else "top",
                color=ACCENT, fontsize=13, weight="bold", family="monospace")
        ax.text(x, y_label, label, ha="center", va="bottom" if above else "top",
                color=INK, fontsize=12)
        above = not above

    ax.add_patch(mpatches.Rectangle((7.3, 0.3), 2.7, 5.0, color=ACCENT, alpha=0.08))
    ax.text(8.65, 0.55, "IDLE HOURS — local Ollama only, no Claude, no outbound",
            ha="center", color=ACCENT_SOFT, fontsize=11, style="italic")

    plt.savefig(DIAGRAMS / "ritual.png", facecolor=BG, bbox_inches="tight", pad_inches=0.3)
    plt.close()


if __name__ == "__main__":
    print("Building diagrams...")
    build_architecture()
    build_roles()
    build_ritual()
    print(f"Wrote {DIAGRAMS}/architecture.png")
    print(f"Wrote {DIAGRAMS}/roles.png")
    print(f"Wrote {DIAGRAMS}/ritual.png")
