import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { theme } from "../theme";

const SLOTS = [
  { t: "07:00", h: "Snapshot", b: "Vault saved." },
  { t: "08:00", h: "Robusca Standup", b: "Yesterday + today + ack items." },
  { t: "09:00", h: "Agent Council", b: "Every agent reports. Voice in the room." },
  { t: "12:00", h: "Midday Snapshot", b: "Quiet save." },
  { t: "17:00", h: "EOD Wrap", b: "Numbers locked in." },
  { t: "22:00", h: "Night Build", b: "Two new prototypes start." },
  { t: "02:00", h: "Hard Stop", b: "Open them in Cursor at sunrise." },
];

export const Ritual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ padding: 100, color: theme.ink }}>
      <div style={{ fontSize: 28, color: theme.accent, letterSpacing: 4, marginBottom: 10, opacity: titleO }}>
        ONE DAY · ONE LOOP
      </div>
      <h2 style={{ fontSize: 72, margin: 0, marginBottom: 36, opacity: titleO }}>
        While you sleep, it builds.
      </h2>
      <div style={{ position: "relative", paddingLeft: 200 }}>
        <div
          style={{
            position: "absolute",
            left: 160,
            top: 0,
            bottom: 0,
            width: 4,
            background: `linear-gradient(180deg, ${theme.accent}, ${theme.accent}33)`,
            borderRadius: 2,
          }}
        />
        {SLOTS.map((s, i) => {
          const start = 22 + i * 12;
          const o = interpolate(frame, [start, start + 12], [0, 1], { extrapolateRight: "clamp" });
          const x = spring({ frame: frame - start, fps, config: { damping: 16 } });
          return (
            <div
              key={s.t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 32,
                marginBottom: 16,
                opacity: o,
                transform: `translateX(${(1 - x) * 30}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  width: 140,
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.accent,
                  fontFamily: theme.mono,
                }}
              >
                {s.t}
              </div>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: theme.accent,
                  marginLeft: -9,
                  border: `4px solid ${theme.bg}`,
                }}
              />
              <div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>{s.h}</div>
                <div style={{ fontSize: 22, color: theme.inkDim, marginTop: 2 }}>{s.b}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
