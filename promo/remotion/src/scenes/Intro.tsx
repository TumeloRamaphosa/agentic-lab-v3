import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, config: { damping: 14 } });
  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const subFade = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        color: theme.ink,
        textAlign: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          fontSize: 28,
          letterSpacing: 8,
          color: theme.accent,
          textTransform: "uppercase",
          opacity: fade,
        }}
      >
        StudEx Valley
      </div>
      <h1
        style={{
          fontSize: 140,
          fontWeight: 800,
          margin: 0,
          lineHeight: 1.05,
          transform: `translateY(${(1 - titleY) * 40}px)`,
          opacity: fade,
        }}
      >
        Your company,<br />running itself.
      </h1>
      <div
        style={{
          fontSize: 32,
          color: theme.inkDim,
          maxWidth: 1200,
          opacity: subFade,
        }}
      >
        An AI operating system that handles sales, customers, content and code — while you sleep.
      </div>
    </AbsoluteFill>
  );
};
