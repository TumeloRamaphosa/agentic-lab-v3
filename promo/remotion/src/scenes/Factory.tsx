import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { theme } from "../theme";
import { GenesisBackdrop } from "../components/GenesisBackdrop";
import { Character } from "../sprites/Character";
import { CharacterKey } from "../sprites/characters";

/**
 * Factory scene — Tumelo (Iron Man) at the centre, agents at workstations
 * around him. The Studex Genesis painting sits behind, dimmed.
 */

const STATIONS: Array<{
  who: CharacterKey;
  label: string;
  x: number; // 0–100 % of width
  y: number; // 0–100 % of height
  size: number;
  desk: string;
}> = [
  { who: "robusca",       label: "ROBUSCA · Chief of Staff", x: 12, y: 28, size: 150, desk: "STANDUP" },
  { who: "adam",          label: "ADAM · Sales",              x: 12, y: 64, size: 150, desk: "PIPELINE" },
  { who: "charlie",       label: "CHARLIE · Customer",         x: 28, y: 80, size: 130, desk: "WHATSAPP" },
  { who: "denchclaw",     label: "DENCHCLAW · Customer",       x: 88, y: 28, size: 130, desk: "SUPPORT" },
  { who: "research",      label: "RESEARCH",                   x: 88, y: 64, size: 130, desk: "INTEL" },
  { who: "openfang",      label: "OPENFANG · Research",        x: 72, y: 80, size: 120, desk: "WEB" },
  { who: "cto",           label: "CTO",                        x: 30, y: 28, size: 130, desk: "CURSOR" },
  { who: "skunkworks",    label: "SKUNK WORKS",                x: 70, y: 28, size: 130, desk: "BUILD" },
  { who: "drfixit",       label: "DR FIX-IT",                  x: 60, y: 80, size: 120, desk: "HEARTBEAT" },
  { who: "the-lady",      label: "THE LADY · Media",           x: 40, y: 80, size: 130, desk: "BROADCAST" },
];

const Workstation: React.FC<{
  who: CharacterKey;
  label: string;
  size: number;
  desk: string;
  delay: number;
}> = ({ who, label, size, desk, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;
  const s = spring({ frame: f, fps, config: { damping: 16 } });
  const opacity = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const lift = (1 - s) * 24;
  // Subtle idle bob so the agent looks "working"
  const bob = Math.sin((frame - delay) / 14) * 2.5;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `translateY(${lift + bob}px)`,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: theme.accent,
          letterSpacing: 2,
          fontWeight: 700,
          marginBottom: 4,
          background: "rgba(11,14,20,0.7)",
          padding: "3px 8px",
          borderRadius: 4,
          border: `1px solid ${theme.accent}`,
        }}
      >
        {desk}
      </div>
      <Character who={who} size={size} glow={`${theme.accent}66`} />
      <div
        style={{
          fontSize: 13,
          color: theme.ink,
          fontWeight: 700,
          marginTop: 6,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          textAlign: "center",
          maxWidth: size + 20,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const ConveyorBelt: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 4) % 60;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${y}%`,
        height: 14,
        background: `repeating-linear-gradient(90deg,
          ${theme.accent} 0px, ${theme.accent} 24px,
          ${theme.bg} 24px, ${theme.bg} 30px)`,
        backgroundPositionX: `-${offset}px`,
        boxShadow: `0 0 12px ${theme.accent}66`,
        opacity: 0.55,
      }}
    />
  );
};

export const Factory: React.FC = () => {
  const frame = useCurrentFrame();
  const titleO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* The painting, heavily dimmed */}
      <GenesisBackdrop opacity={0.35} blur={2} tint="rgba(11,14,20,0.55)" />

      {/* Factory chrome */}
      <ConveyorBelt y={48} />
      <ConveyorBelt y={94} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleO,
        }}
      >
        <div
          style={{
            color: theme.accent,
            fontSize: 22,
            letterSpacing: 6,
            fontWeight: 700,
          }}
        >
          THE STUDEX FACTORY · LIVE
        </div>
        <div style={{ color: theme.ink, fontSize: 56, fontWeight: 800, marginTop: 4 }}>
          Your agents, working.
        </div>
      </div>

      {/* Tumelo as Iron Man — centre stage */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Character
          who="tumelo-ironman"
          size={260}
          glow="#7DF9FF"
          label="TUMELO · COMMANDER"
          labelColor={theme.accent}
        />
      </div>

      {/* All ten agents around the factory */}
      {STATIONS.map((s, i) => (
        <div
          key={s.who}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Workstation
            who={s.who}
            label={s.label}
            size={s.size}
            desk={s.desk}
            delay={20 + i * 6}
          />
        </div>
      ))}

      {/* Footer ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          color: theme.inkDim,
          fontSize: 16,
          letterSpacing: 3,
          opacity: titleO,
        }}
      >
        STUDEX VALLEY OS · DAILY 09:00 SAST · AGENT COUNCIL ASSEMBLED
      </div>
    </AbsoluteFill>
  );
};
