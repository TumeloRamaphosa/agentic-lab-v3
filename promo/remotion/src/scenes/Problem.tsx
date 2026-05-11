import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

const PAINS = [
  "Replying to the same customers at 11pm",
  "Forgetting where you saved that deck",
  "Watching costs climb with no clear answer why",
  "Hiring a team you can't afford yet",
];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 120, color: theme.ink }}>
      <div style={{ fontSize: 28, color: theme.accent, letterSpacing: 4, marginBottom: 30 }}>
        THE PROBLEM
      </div>
      <h2 style={{ fontSize: 96, margin: 0, lineHeight: 1.05, maxWidth: 1500 }}>
        Running a business in 2026 means doing a hundred jobs at once.
      </h2>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 22 }}>
        {PAINS.map((p, i) => {
          const start = 30 + i * 18;
          const o = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const y = spring({ frame: frame - start, fps, config: { damping: 14 } });
          return (
            <div
              key={p}
              style={{
                fontSize: 40,
                color: theme.inkDim,
                opacity: o,
                transform: `translateX(${(1 - y) * 30}px)`,
              }}
            >
              <span style={{ color: theme.accent, marginRight: 16 }}>×</span>
              {p}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
