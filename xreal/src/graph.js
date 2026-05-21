import * as THREE from "three";

const PALETTE = [
  0xffd60a, 0xff7a1a, 0x4ade80, 0x7df9ff, 0xc77dff,
  0xff5d8f, 0xffb47a, 0x5bc0eb, 0x9be564, 0xffe066,
];

/** Fibonacci point on a unit sphere. */
function fib(i, n) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / Math.max(1, n - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const t = golden * i;
  return new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r);
}

/**
 * Build a 3D graph: nodes clustered by community (community centres spread on
 * an outer sphere; members jitter near their centre) so clusters read clearly.
 * Returns { group, nodeMeshes, pickables, byId } for the scene + raycaster.
 */
export function buildGraph(graph, labels) {
  const group = new THREE.Group();
  const nodes = graph.nodes;
  const links = graph.links;

  const degree = new Map();
  for (const l of links) {
    degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
    degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
  }
  const maxDeg = Math.max(1, ...[...degree.values()]);

  const communities = [...new Set(nodes.map((n) => n.community ?? 0))];
  const centre = new Map();
  communities.forEach((c, i) => centre.set(c, fib(i, communities.length).multiplyScalar(9)));

  const byId = new Map();
  const pickables = [];
  const seen = new Map();
  const sphereGeo = new THREE.SphereGeometry(1, 20, 20);

  nodes.forEach((n) => {
    const com = n.community ?? 0;
    const idx = (seen.get(com) ?? 0); seen.set(com, idx + 1);
    const offset = fib(idx, Math.max(2, seen.get(com) + 3)).multiplyScalar(2.6);
    const pos = centre.get(com).clone().add(offset);
    const deg = degree.get(n.id) ?? 0;
    const radius = 0.18 + (deg / maxDeg) * 0.6;
    const color = PALETTE[com % PALETTE.length];
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, roughness: 0.45 });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.scale.setScalar(radius);
    mesh.position.copy(pos);
    mesh.userData = {
      id: n.id, label: n.label, source: n.source_file ?? "", community: com,
      communityLabel: labels?.[String(com)] ?? `Community ${com}`, degree: deg,
    };
    group.add(mesh);
    byId.set(n.id, mesh);
    pickables.push(mesh);
  });

  // Edges as line segments, coloured midway between endpoints.
  const positions = [];
  const colors = [];
  const cA = new THREE.Color(), cB = new THREE.Color();
  for (const l of links) {
    const a = byId.get(l.source), b = byId.get(l.target);
    if (!a || !b) continue;
    positions.push(a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z);
    cA.set(a.material.color.getHex()); cB.set(b.material.color.getHex());
    colors.push(cA.r, cA.g, cA.b, cB.r, cB.g, cB.b);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.22 })
  );
  group.add(lines);

  // Adjacency for the info panel.
  const neighbours = new Map();
  for (const l of links) {
    (neighbours.get(l.source) ?? neighbours.set(l.source, []).get(l.source)).push(l.target);
    (neighbours.get(l.target) ?? neighbours.set(l.target, []).get(l.target)).push(l.source);
  }

  return { group, pickables, byId, neighbours };
}
