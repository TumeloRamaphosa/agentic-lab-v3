import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

const LAYERS: Array<{ label: string; sub: string }> = [
  { label: "VAULT", sub: "single source of truth (your Obsidian 2nd Brain)" },
  { label: "HIVE MIND", sub: "classifier · memory · audit · kill switches" },
  { label: "AGENTS", sub: "six roles · eleven codenames · one voice each" },
  { label: "BRIDGES", sub: "Slack · Discord · Voice (ElevenLabs)" },
  { label: "MUSCLE", sub: "Ollama on your Macs · Claude on escalation" },
];

export const Picture: React.FC = () => {
  const frame = useCurrentFrame();
  const titleO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 100, color: theme.ink }}>
      <div style={{ fontSize: 28, color: theme.accent, letterSpacing: 4, marginBottom: 20, opacity: titleO }}>
        THE WHOLE COMPANY IN ONE PICTURE
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 24 }}>
        {LAYERS.map((l, i) => {
          const start = 20 + i * 22;
          const o = interpolate(frame, [start, start + 14], [0, 1], { extrapolateRight: "clamp" });
          const w = interpolate(frame, [start, start + 30], [0, 100], { extrapolateRight: "clamp" });
          return (
            <div
              key={l.label}
              style={{
                background: theme.surface,
                border: `2px solid ${theme.accent}`,
                borderRadius: 18,
                padding: "30px 40px",
                opacity: o,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, ${theme.accent}22 ${w}%, transparent ${w}%)`,
                }}
              />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>{l.label}</div>
                <div style={{ fontSize: 26, color: theme.inkDim, marginTop: 6 }}>{l.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
