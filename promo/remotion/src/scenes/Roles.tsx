import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

const ROLES: Array<{ role: string; codename: string; line: string }> = [
  { role: "Chief of Staff", codename: "Robusca", line: "Runs your 8am standup. Keeps the day on the rails." },
  { role: "Sales", codename: "Adam · CashClaw", line: "Closes deals. Watches the pipeline." },
  { role: "Customer", codename: "Charlie · DenchClaw", line: "Replies to every message. Books every call." },
  { role: "Research", codename: "OpenFang", line: "Reads the internet. Spots what to do next." },
  { role: "DevOps", codename: "CTO · Skunk Works · Dr Fix-It", line: "Writes the code. Keeps the lights on." },
  { role: "Media", codename: "The Lady", line: "Posts the content. Tracks what works." },
];

export const Roles: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 100, color: theme.ink }}>
      <div style={{ fontSize: 28, color: theme.accent, letterSpacing: 4, marginBottom: 16, opacity: titleO }}>
        SIX ROLES · ELEVEN AGENTS
      </div>
      <h2 style={{ fontSize: 72, margin: 0, marginBottom: 36, opacity: titleO }}>
        Each one with its own voice.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {ROLES.map((r, i) => {
          const start = 25 + i * 14;
          const o = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const y = spring({ frame: frame - start, fps, config: { damping: 16 } });
          return (
            <div
              key={r.codename}
              style={{
                background: theme.surface,
                border: `1px solid ${theme.inkDim}33`,
                borderLeft: `4px solid ${theme.accent}`,
                borderRadius: 14,
                padding: "22px 28px",
                opacity: o,
                transform: `translateY(${(1 - y) * 30}px)`,
              }}
            >
              <div style={{ fontSize: 22, color: theme.inkDim, letterSpacing: 2, textTransform: "uppercase" }}>
                {r.role}
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 4 }}>{r.codename}</div>
              <div style={{ fontSize: 22, color: theme.inkDim, marginTop: 8 }}>{r.line}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
