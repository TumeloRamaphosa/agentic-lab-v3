import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Transparent bold-white strip of world clocks.
 * Used on every dashboard view and the Dashboard preview scene.
 *
 * Cities (left → right):
 *   Cape Town · Dubai · London · Shanghai · Beijing · Hong Kong · New York · San Francisco
 *
 * Time in Remotion is simulated — we tick a virtual minute hand off the frame counter
 * so the clocks feel alive in the demo. In the real Hono dashboard the same component
 * reads actual time via `Intl.DateTimeFormat({ timeZone })`.
 */
export const CITIES: Array<{ label: string; tz: string; abbr: string }> = [
  { label: "Cape Town",     tz: "Africa/Johannesburg",   abbr: "SAST" },
  { label: "Dubai",         tz: "Asia/Dubai",            abbr: "GST"  },
  { label: "London",        tz: "Europe/London",         abbr: "GMT"  },
  { label: "Shanghai",      tz: "Asia/Shanghai",         abbr: "CST"  },
  { label: "Beijing",       tz: "Asia/Shanghai",         abbr: "CST"  },
  { label: "Hong Kong",     tz: "Asia/Hong_Kong",        abbr: "HKT"  },
  { label: "New York",      tz: "America/New_York",      abbr: "EST"  },
  { label: "San Francisco", tz: "America/Los_Angeles",   abbr: "PST"  },
];

/** Format HH:MM for a tz at a given JS Date. */
const formatHM = (d: Date, tz: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);

export const WorldClockStrip: React.FC<{
  height?: number;
  opacity?: number;
}> = ({ height = 76, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Virtual time: anchor to a plausible business start, +1 simulated minute per
  // real second so the clocks change visibly during render.
  const baseEpoch = new Date("2026-05-12T06:30:00Z").getTime();
  const simulatedMs = baseEpoch + Math.floor((frame / fps) * 60_000);
  const now = new Date(simulatedMs);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height,
        padding: "0 32px",
        background: "rgba(11,14,20,0.55)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        opacity,
      }}
    >
      {CITIES.map((c) => (
        <div
          key={c.label + c.tz}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#FFFFFF",
            fontFamily: '"JetBrains Mono","SF Mono",Menlo,monospace',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.75,
            }}
          >
            {c.label}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 2,
              marginTop: 2,
            }}
          >
            {formatHM(now, c.tz)}
            <span style={{ fontSize: 11, marginLeft: 6, opacity: 0.55 }}>{c.abbr}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
