export const theme = {
  bg: "#0B0E14",
  surface: "#11151F",
  ink: "#F2F4F8",
  inkDim: "#8A95A6",
  accent: "#FF7A1A",
  accentSoft: "#FFB47A",
  good: "#4ADE80",
  warn: "#FACC15",
  font: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", Menlo, monospace',
};

export const FPS = 30;

export const SCENES: Array<{ id: string; durationFrames: number }> = [
  { id: "intro", durationFrames: FPS * 6 },
  { id: "problem", durationFrames: FPS * 8 },
  { id: "picture", durationFrames: FPS * 10 },
  { id: "roles", durationFrames: FPS * 10 },
  { id: "ritual", durationFrames: FPS * 10 },
  { id: "pricing", durationFrames: FPS * 8 },
  { id: "cta", durationFrames: FPS * 8 },
];

export function sceneStart(id: string): number {
  let acc = 0;
  for (const s of SCENES) {
    if (s.id === id) return acc;
    acc += s.durationFrames;
  }
  return 0;
}
