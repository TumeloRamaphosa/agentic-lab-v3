import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const s = spring({ frame, fps, config: { damping: 12 } });
  const pulse = 1 + Math.sin(frame / 6) * 0.02;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: theme.ink,
        padding: 100,
        opacity: o,
      }}
    >
      <div style={{ fontSize: 26, color: theme.accent, letterSpacing: 6, marginBottom: 20 }}>
        STUDEX VALLEY
      </div>
      <h1
        style={{
          fontSize: 160,
          fontWeight: 800,
          margin: 0,
          lineHeight: 1,
          transform: `scale(${0.9 + s * 0.1})`,
        }}
      >
        Let it run.
      </h1>
      <div style={{ fontSize: 36, color: theme.inkDim, marginTop: 28, maxWidth: 1200 }}>
        Start your 7-day free trial today.
      </div>
      <div
        style={{
          marginTop: 50,
          background: theme.accent,
          color: theme.bg,
          padding: "26px 60px",
          borderRadius: 16,
          fontSize: 36,
          fontWeight: 700,
          transform: `scale(${pulse})`,
        }}
      >
        studex.valley → /start
      </div>
    </AbsoluteFill>
  );
};
