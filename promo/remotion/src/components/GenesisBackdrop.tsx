import React from "react";
import { Img, staticFile, AbsoluteFill } from "remotion";

/**
 * Studex Genesis backdrop — the Michelangelo-meets-Studex painting.
 *
 * Save your hero image to: public/studex-genesis.png
 *
 * If the file is absent, falls back to a procedural gradient so the
 * composition still renders cleanly.
 */
export const GenesisBackdrop: React.FC<{
  opacity?: number;
  zoom?: number;
  tint?: string;
  blur?: number;
}> = ({ opacity = 1, zoom = 1, tint, blur = 0 }) => {
  return (
    <AbsoluteFill>
      <Img
        src={staticFile("studex-genesis.png")}
        onError={(e) => {
          // hide image; reveal gradient fallback
          (e.target as HTMLImageElement).style.display = "none";
          const fb = document.getElementById("genesis-fallback");
          if (fb) fb.style.display = "block";
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          transformOrigin: "center",
          opacity,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      <div
        id="genesis-fallback"
        style={{
          display: "none",
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 40%, #5B7AAE 0%, #2C3E5C 35%, #0B0E14 80%)",
        }}
      />
      {tint && (
        <AbsoluteFill style={{ backgroundColor: tint, mixBlendMode: "multiply" }} />
      )}
      {/* Vignette so foreground text reads */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(11,14,20,0.65) 80%, #0B0E14 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
