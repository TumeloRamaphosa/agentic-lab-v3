import React from "react";
import { interpolate } from "remotion";
import { NODES_3D, EDGES, project } from "./graph3d";

/**
 * One rendered eye of the vault sphere. Pure SVG, depth-sorted (painter's
 * algorithm) with distance fog so the globe reads as 3D. `eyeOffset` shifts
 * the camera horizontally for stereoscopic SBS rendering.
 */
export const SphereView: React.FC<{
  width: number;
  height: number;
  angleY: number;
  eyeOffset?: number;
  showLabels?: boolean;
}> = ({ width, height, angleY, eyeOffset = 0, showLabels = true }) => {
  const radius = Math.min(width, height) * 0.34;

  const projected = NODES_3D.map((n) => ({
    n,
    p: project(n, angleY, width, height, { radius, eyeOffset }),
  }));

  // Edges first (behind nodes), faded by average depth.
  const edges = EDGES.map((e, i) => {
    const A = projected[e.a];
    const B = projected[e.b];
    const avgDepth = (A.p.depth + B.p.depth) / 2;
    const opacity = interpolate(avgDepth, [-1, 1], [0.04, 0.32]);
    return (
      <line
        key={i}
        x1={A.p.sx} y1={A.p.sy} x2={B.p.sx} y2={B.p.sy}
        stroke="#FFB47A"
        strokeWidth={interpolate(avgDepth, [-1, 1], [0.5, 1.6])}
        opacity={opacity}
      />
    );
  });

  // Nodes: far → near (painter's algorithm).
  const ordered = [...projected].sort((a, b) => a.p.depth - b.p.depth);
  const maxDeg = Math.max(...NODES_3D.map((n) => n.degree), 1);

  const nodes = ordered.map(({ n, p }) => {
    const baseR = 4 + (n.degree / maxDeg) * 16;
    const r = baseR * p.scale;
    const fog = interpolate(p.depth, [-1, 1], [0.35, 1]); // far = dim
    const big = n.degree / maxDeg > 0.45;
    return (
      <g key={n.id} opacity={fog}>
        <circle cx={p.sx} cy={p.sy} r={r} fill={n.color} stroke="#0B0E14" strokeWidth={1} />
        {showLabels && big && p.depth > -0.1 && (
          <text
            x={p.sx + r + 4}
            y={p.sy + 4}
            fill="#FFD60A"
            fontSize={Math.max(10, 15 * p.scale)}
            fontWeight={700}
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {n.label.length > 28 ? n.label.slice(0, 27) + "…" : n.label}
          </text>
        )}
      </g>
    );
  });

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor="#15203A" />
          <stop offset="70%" stopColor="#0B0E14" />
          <stop offset="100%" stopColor="#070910" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={width} height={height} fill="url(#glow)" />
      {edges}
      {nodes}
    </svg>
  );
};
