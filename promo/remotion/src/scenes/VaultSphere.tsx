import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { SphereView } from "../sphere/SphereView";
import { COMMUNITY_LABELS, NODES_3D } from "../sphere/graph3d";

/**
 * Monoscopic rotating vault sphere — plays as a big floating screen on
 * XREAL One Pro (or any display). Looks 3D via the orbiting camera.
 */
export const VaultSphere: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const angleY = (frame / durationInFrames) * Math.PI * 2; // one full orbit
  const titleO = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const communities = Object.keys(COMMUNITY_LABELS).length;

  return (
    <AbsoluteFill style={{ backgroundColor: "#070910" }}>
      <SphereView width={width} height={height} angleY={angleY} />
      <AbsoluteFill style={{ pointerEvents: "none", padding: 48, opacity: titleO }}>
        <div style={{ color: "#FF7A1A", fontSize: 20, letterSpacing: 5, fontWeight: 700 }}>
          STUDEX · 2ND BRAIN
        </div>
        <div style={{ color: "#FFD60A", fontSize: 40, fontWeight: 800, marginTop: 4 }}>
          Vault Knowledge Sphere
        </div>
        <div style={{ color: "#FFE066", fontSize: 18, marginTop: 6, fontFamily: "monospace" }}>
          {NODES_3D.length} notes · {communities} communities · orbiting
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
