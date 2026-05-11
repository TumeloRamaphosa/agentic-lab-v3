import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { GenesisBackdrop } from "../components/GenesisBackdrop";

/**
 * Genesis scene — opens with the Studex × Creation of Adam painting.
 * Tagline animates in over the painting before handing off to the rest.
 */
export const Genesis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, config: { damping: 14 } });
  const titleO = interpolate(frame, [10, 36], [0, 1], { extrapolateRight: "clamp" });
  const subO = interpolate(frame, [44, 80], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, 180], [1.02, 1.10]);

  return (
    <AbsoluteFill>
      <GenesisBackdrop zoom={zoom} blur={0.4} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 120,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: theme.ink,
            margin: 0,
            lineHeight: 1.05,
            transform: `translateY(${(1 - titleY) * 40}px)`,
            opacity: titleO,
            textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          }}
        >
          Studex Global Markets
        </h1>
        <div
          style={{
            fontSize: 36,
            color: theme.inkDim,
            marginTop: 22,
            opacity: subO,
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        >
          A private, future-first AI global trading community.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            color: theme.accent,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: subO,
          }}
        >
          Vision · Legacy · Intelligence
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
