import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { GenesisBackdrop } from "../components/GenesisBackdrop";
import { WorldClockStrip } from "../components/WorldClockStrip";
import { Character } from "../sprites/Character";
import { CharacterKey } from "../sprites/characters";

/**
 * Dashboard scene — a mockup of the live StudEx Valley OS dashboard.
 * Demonstrates the design system that the build agent will implement
 * in Hono at port :3141 inside agents-dr.fixit.
 */

type Tab = { id: string; label: string };
const TABS: Tab[] = [
  { id: "council",   label: "Council" },
  { id: "kanban",    label: "Mission" },
  { id: "warroom",   label: "War Room" },
  { id: "agents",    label: "Agents" },
  { id: "ledger",    label: "Ledger" },
  { id: "proposals", label: "Night Build" },
];

type Card = { who: CharacterKey; title: string; note?: string };
const QUEUED: Card[] = [
  { who: "research",   title: "SGM partner follow-ups",        note: "14d avg gap" },
  { who: "the-lady",   title: "Coffee landing A/B test",       note: "Idea by OpenFang" },
  { who: "adam",       title: "Mozambique pipeline review",    note: "Q2 close" },
];
const RUNNING: Card[] = [
  { who: "cto",        title: "Cursor BG: refactor memory",    note: "PR #42" },
  { who: "skunkworks", title: "Build · sandbox-node template", note: "67%" },
];
const DONE: Card[] = [
  { who: "charlie",    title: "WhatsApp reply queue cleared",  note: "12 msgs" },
  { who: "drfixit",    title: "Restart · DenchClaw",           note: "OOM fixed" },
];

const Band: React.FC<{ label: string; count: number; tint: "orange" | "yellow"; children: React.ReactNode }> = ({
  label,
  count,
  tint,
  children,
}) => {
  const bg = tint === "orange" ? theme.accent : theme.ink;
  const fg = "#0B0E14";
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(11,14,20,0.62)",
        border: `2px solid ${bg}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: bg,
          color: fg,
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontSize: 14,
        }}
      >
        <span>{label}</span>
        <span
          style={{
            background: "#0B0E14",
            color: bg,
            padding: "2px 10px",
            borderRadius: 99,
            fontSize: 12,
          }}
        >
          {count}
        </span>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
};

const KanbanCard: React.FC<{
  card: Card;
  delay: number;
  tint: "orange" | "yellow";
}> = ({ card, delay, tint }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  const s = spring({ frame: f, fps, config: { damping: 18 } });
  const opacity = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const border = tint === "orange" ? theme.accent : theme.ink;
  return (
    <div
      style={{
        background: "#11151F",
        border: `1px solid ${border}`,
        borderRadius: 10,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
        transform: `translateX(${(1 - s) * 24}px)`,
      }}
    >
      <div style={{ width: 44, height: 56 }}>
        <Character who={card.who} size={44} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: theme.ink, fontSize: 14, fontWeight: 700 }}>{card.title}</div>
        {card.note && (
          <div style={{ color: theme.inkDim, fontSize: 11, marginTop: 2, fontFamily: theme.mono }}>
            {card.note}
          </div>
        )}
      </div>
    </div>
  );
};

const Tabs: React.FC<{ active: string }> = ({ active }) => (
  <div style={{ display: "flex", gap: 8 }}>
    {TABS.map((t) => {
      const isActive = t.id === active;
      return (
        <div
          key={t.id}
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            border: `2px solid ${isActive ? theme.accent : theme.ink}`,
            background: isActive ? theme.accent : "transparent",
            color: isActive ? "#0B0E14" : theme.ink,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {t.label}
        </div>
      );
    })}
  </div>
);

export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const headerO = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      {/* Painting backdrop, very dim */}
      <GenesisBackdrop opacity={0.18} blur={3} tint="rgba(11,14,20,0.72)" />

      {/* World clocks across the top */}
      <WorldClockStrip />

      {/* Dashboard chrome */}
      <div style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: headerO }}>
          <div>
            <div style={{ color: theme.accent, fontSize: 13, letterSpacing: 5, fontWeight: 700 }}>
              STUDEX VALLEY OS
            </div>
            <div style={{ color: theme.ink, fontSize: 42, fontWeight: 800, marginTop: 2 }}>
              Mission Control
            </div>
          </div>
          <Tabs active="kanban" />
        </div>

        {/* Kanban bands */}
        <div style={{ display: "flex", gap: 18, flex: 1 }}>
          <Band label="Queued" count={QUEUED.length} tint="yellow">
            {QUEUED.map((c, i) => (
              <KanbanCard key={c.title} card={c} delay={20 + i * 6} tint="yellow" />
            ))}
          </Band>
          <Band label="Running" count={RUNNING.length} tint="orange">
            {RUNNING.map((c, i) => (
              <KanbanCard key={c.title} card={c} delay={40 + i * 6} tint="orange" />
            ))}
          </Band>
          <Band label="Done" count={DONE.length} tint="yellow">
            {DONE.map((c, i) => (
              <KanbanCard key={c.title} card={c} delay={60 + i * 6} tint="yellow" />
            ))}
          </Band>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 18px",
            background: "rgba(11,14,20,0.65)",
            border: `1px solid ${theme.accent}`,
            borderRadius: 10,
            color: theme.ink,
            fontFamily: theme.mono,
            fontSize: 13,
          }}
        >
          <span>
            <span style={{ color: theme.accent }}>●</span> 11 agents online · 0 errors · 2 PRs awaiting review
          </span>
          <span>Night Build ready in 9h 28m</span>
          <span>
            Local tokens today: <strong style={{ color: theme.accent }}>1.2M</strong> · Claude: <strong style={{ color: theme.accent }}>0</strong>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
