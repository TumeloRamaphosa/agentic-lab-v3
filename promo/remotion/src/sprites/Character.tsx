import React from "react";
import { Img, staticFile } from "remotion";
import { PixelSprite } from "./PixelSprite";
import { characters, CharacterKey } from "./characters";

/**
 * Character renderer.
 * Tries to load `public/agents/<key>.png` (NanoBanana HD asset).
 * Falls back to the SVG pixel sprite if the PNG is missing.
 *
 * The user generates HD versions with the prompts in ASSETS.md
 * and drops them in public/agents/. The Remotion build auto-picks them up.
 */
export const Character: React.FC<{
  who: CharacterKey;
  size?: number;
  glow?: string;
  preferHd?: boolean;
  label?: string;
  labelColor?: string;
}> = ({ who, size = 160, glow, preferHd = true, label, labelColor = "#FFD60A" }) => {
  const c = characters[who];
  const hdPath = `agents/${who}.png`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ position: "relative", width: size, height: size * 1.25 }}>
        {preferHd && (
          <Img
            src={staticFile(hdPath)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "block";
            }}
            style={{
              width: size,
              height: size * 1.25,
              objectFit: "contain",
              filter: glow ? `drop-shadow(0 0 12px ${glow})` : undefined,
              imageRendering: "pixelated",
              position: "absolute",
              inset: 0,
            }}
          />
        )}
        <div style={{ display: preferHd ? "none" : "block", position: "absolute", inset: 0 }}>
          <PixelSprite
            matrix={c.matrix}
            palette={c.palette}
            width={size}
            height={size * 1.25}
            glow={glow}
          />
        </div>
      </div>
      {label && (
        <div
          style={{
            fontSize: Math.max(14, size * 0.12),
            color: labelColor,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
