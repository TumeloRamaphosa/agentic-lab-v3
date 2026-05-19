import React from "react";
import { staticFile, AbsoluteFill } from "remotion";

/**
 * Studex Genesis backdrop — the Michelangelo-meets-Studex painting.
 *
 * Save your hero image to: public/studex-genesis.png
 *
 * Uses a NATIVE <img> (not Remotion's <Img>) on purpose: a missing optional
 * asset must NOT register a delayRender() that fails the whole render. The
 * procedural gradient is the always-present base layer; the painting fades
 * in over it only if the file exists.
 */
export const GenesisBackdrop: React.FC<{
  opacity?: number;
  zoom?: number;
  tint?: string;
  blur?: number;
}> = ({ opacity = 1, zoom = 1, tint, blur = 0 }) => {
  const [hasImage, setHasImage] = React.useState(true);

  return (
    <AbsoluteFill>
      {/* Always-present procedural base */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 40%, #5B7AAE 0%, #2C3E5C 35%, #0B0E14 80%)",
        }}
      />
      {hasImage && (
        <img
          src={staticFile("studex-genesis.png")}
          onError={() => setHasImage(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            opacity,
            filter: blur ? `blur(${blur}px)` : undefined,
          }}
        />
      )}
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
