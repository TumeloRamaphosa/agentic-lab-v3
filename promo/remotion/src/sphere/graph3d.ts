import graphData from "../data/graph.json";
import labelData from "../data/labels.json";

type RawNode = {
  id: string;
  label: string;
  file_type?: string;
  community?: number;
};
type RawLink = { source: string; target: string; weight?: number };

const NODES = (graphData as { nodes: RawNode[] }).nodes;
const LINKS = (graphData as { links: RawLink[] }).links;
const LABELS = labelData as Record<string, string>;

// Community colour palette (StudEx tech-yellow/orange family + accents).
const PALETTE = [
  "#FFD60A", "#FF7A1A", "#4ADE80", "#7DF9FF", "#C77DFF",
  "#FF5D8F", "#FFB47A", "#5BC0EB", "#9BE564", "#FFE066",
];

export type Node3D = {
  id: string;
  label: string;
  x: number; y: number; z: number; // unit-sphere coords
  color: string;
  degree: number;
  community: number;
};

export type Edge = { a: number; b: number };

/** Fibonacci-sphere distribution → even node spacing on a unit sphere. */
function buildNodes(): Node3D[] {
  const n = NODES.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const degree = new Map<string, number>();
  for (const l of LINKS) {
    degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
    degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
  }
  return NODES.map((node, i) => {
    const y = 1 - (i / (n - 1)) * 2; // 1 .. -1
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const community = node.community ?? 0;
    return {
      id: node.id,
      label: node.label,
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      color: PALETTE[community % PALETTE.length],
      degree: degree.get(node.id) ?? 0,
      community,
    };
  });
}

export const NODES_3D: Node3D[] = buildNodes();

const INDEX = new Map(NODES_3D.map((n, i) => [n.id, i]));
export const EDGES: Edge[] = LINKS
  .map((l) => ({ a: INDEX.get(l.source) ?? -1, b: INDEX.get(l.target) ?? -1 }))
  .filter((e) => e.a >= 0 && e.b >= 0);

export const COMMUNITY_LABELS = LABELS;

export type Projected = {
  sx: number; sy: number; depth: number; scale: number;
};

/**
 * Rotate a point around Y (and a gentle X tilt), then perspective-project.
 * Returns screen coords + depth (for painter sort + fog) + scale.
 */
export function project(
  n: Node3D,
  angleY: number,
  width: number,
  height: number,
  opts: { radius?: number; focal?: number; tiltX?: number; eyeOffset?: number } = {}
): Projected {
  const radius = opts.radius ?? Math.min(width, height) * 0.34;
  const focal = opts.focal ?? 900;
  const tiltX = opts.tiltX ?? 0.35;
  const eye = opts.eyeOffset ?? 0;

  // rotate around Y
  let x = n.x * Math.cos(angleY) + n.z * Math.sin(angleY);
  let z = -n.x * Math.sin(angleY) + n.z * Math.cos(angleY);
  let y = n.y;
  // tilt around X
  const y2 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
  const z2 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
  y = y2; z = z2;

  const X = x * radius + eye;
  const Y = y * radius;
  const Z = z * radius;

  const persp = focal / (focal + Z);
  return {
    sx: width / 2 + X * persp,
    sy: height / 2 + Y * persp,
    depth: z, // -1 (far) .. 1 (near)
    scale: persp,
  };
}
