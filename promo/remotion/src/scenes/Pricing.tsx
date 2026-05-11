import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

const TIERS = [
  { name: "Starter", price: "R 2 999", per: "/ month", who: "Solo founder", feats: ["3 agents", "1 channel", "Cloud models"] },
  { name: "Pro", price: "R 6 999", per: "/ month", who: "Small team", feats: ["6 agents", "Slack + Discord", "Local models on your Mac", "Night Build"], featured: true },
  { name: "Premium", price: "R 13 999", per: "/ month", who: "Operator", feats: ["All agents", "Mesh across machines", "Cursor Background Agents", "White-label"] },
];

export const Pricing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 100, color: theme.ink }}>
      <div style={{ fontSize: 28, color: theme.accent, letterSpacing: 4, marginBottom: 10, opacity: titleO }}>
        RENT YOUR FLEET
      </div>
      <h2 style={{ fontSize: 72, margin: 0, marginBottom: 40, opacity: titleO }}>
        Cheaper than one hire.
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 28 }}>
        {TIERS.map((t, i) => {
          const start = 24 + i * 18;
          const o = interpolate(frame, [start, start + 14], [0, 1], { extrapolateRight: "clamp" });
          const y = spring({ frame: frame - start, fps, config: { damping: 16 } });
          return (
            <div
              key={t.name}
              style={{
                background: t.featured ? theme.accent : theme.surface,
                color: t.featured ? theme.bg : theme.ink,
                border: `2px solid ${t.featured ? theme.accent : theme.inkDim + "44"}`,
                borderRadius: 22,
                padding: 36,
                opacity: o,
                transform: `translateY(${(1 - y) * 40}px) scale(${t.featured ? 1.04 : 1})`,
              }}
            >
              <div style={{ fontSize: 26, opacity: 0.8, letterSpacing: 2, textTransform: "uppercase" }}>
                {t.name}
              </div>
              <div style={{ fontSize: 64, fontWeight: 800, marginTop: 12, lineHeight: 1 }}>
                {t.price}
                <span style={{ fontSize: 24, fontWeight: 400, opacity: 0.7 }}> {t.per}</span>
              </div>
              <div style={{ fontSize: 22, opacity: 0.7, marginTop: 6 }}>{t.who}</div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                {t.feats.map((f) => (
                  <div key={f} style={{ fontSize: 22 }}>
                    <span style={{ color: t.featured ? theme.bg : theme.accent, marginRight: 10 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 22, color: theme.inkDim, marginTop: 36, opacity: titleO }}>
        7-day free trial · POPIA compliant · load-shedding friendly
      </div>
    </AbsoluteFill>
  );
};
