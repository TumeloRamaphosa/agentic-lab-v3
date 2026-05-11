import React from "react";

/**
 * PixelSprite — renders a 2D pixel matrix as SVG `<rect>` tiles.
 *
 * Each cell in `matrix` is a single character that maps to a colour in `palette`.
 * Use "." for transparent. Keep matrices small (≤32×32) — they scale crisply.
 */
export type PixelMatrix = string[];
export type PixelPalette = Record<string, string>;

export const PixelSprite: React.FC<{
  matrix: PixelMatrix;
  palette: PixelPalette;
  pixelSize?: number;
  width?: number;
  height?: number;
  outline?: string;
  glow?: string;
}> = ({ matrix, palette, pixelSize = 16, width, height, outline, glow }) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const w = width ?? cols * pixelSize;
  const h = height ?? rows * pixelSize;
  const sx = w / cols;
  const sy = h / rows;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{
        filter: glow ? `drop-shadow(0 0 8px ${glow})` : undefined,
        imageRendering: "pixelated",
      }}
    >
      {matrix.map((row, y) =>
        [...row].map((ch, x) => {
          if (ch === "." || ch === " ") return null;
          const fill = palette[ch] ?? "magenta";
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1.02}
              height={1.02}
              fill={fill}
              stroke={outline}
              strokeWidth={outline ? 0.02 : 0}
            />
          );
        })
      )}
    </svg>
  );
};
