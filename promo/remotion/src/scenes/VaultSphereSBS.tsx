import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { SphereView } from "../sphere/SphereView";

/**
 * Stereoscopic Side-by-Side (SBS) vault sphere for XREAL One Pro 3D mode.
 *
 * Full-SBS layout: left eye fills the left half, right eye the right half.
 * Composition width is 2× a single eye (e.g. 3840×1080 = two 1920×1080 eyes).
 * The two cameras are offset horizontally (eye separation) to create parallax
 * → real depth when XREAL plays it in 3D / SBS mode.
 *
 * Playback: cast/connect to XREAL, enable 3D (Side-by-Side) in the XREAL app,
 * play full-screen. The brain becomes a globe floating in front of you.
 */
export const VaultSphereSBS: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const eyeW = width / 2;
  const angleY = (frame / durationInFrames) * Math.PI * 2;
  const SEP = 26; // px parallax per eye (positive = toward viewer)

  return (
    <AbsoluteFill style={{ backgroundColor: "#070910", flexDirection: "row" }}>
      <div style={{ width: eyeW, height, overflow: "hidden" }}>
        <SphereView width={eyeW} height={height} angleY={angleY} eyeOffset={-SEP} showLabels={false} />
      </div>
      <div style={{ width: eyeW, height, overflow: "hidden" }}>
        <SphereView width={eyeW} height={height} angleY={angleY} eyeOffset={+SEP} showLabels={false} />
      </div>
    </AbsoluteFill>
  );
};
