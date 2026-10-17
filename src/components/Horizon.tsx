import { useEffect, useState } from "react";

/** Phone: a sun between the wordmark and "Talk to a person". Wide screens: a large disc centered in the band. */
const PHONE = { cx: 582, cy: 42, r: 34, sink: 80 };
const WIDE = { cx: 600, cy: 60, r: 52, sink: 76 };
const WIDE_QUERY = "(min-width: 720px)";

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide;
}

/**
 * The horizon band: Keel's signature. Flat silkscreen layers of sky, haze, sun, ridges, and still water.
 * `rise` (0 to 1) sets how high the sun stands; onboarding raises it with every answer.
 * Purely decorative: progress is always also given in text.
 */
export function Horizon({ rise, children }: { rise: number; children?: React.ReactNode }) {
  const r = Math.min(Math.max(rise, 0), 1);
  const sun = useWide() ? WIDE : PHONE;
  // The sun sits at its risen height and sinks behind the ridges when r is small.
  // Eased, so it clears the hills early and climbs gently after that.
  const drop = (1 - r) ** 2 * sun.sink;
  return (
    <div className="horizon">
      <svg
        className="horizon-art"
        viewBox="0 0 1200 104"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="1200" height="104" className="h-sky" />
        <rect y="50" width="1200" height="28" className="h-haze" />
        <g className="h-sun" style={{ transform: `translateY(${drop}px)` }}>
          <circle cx={sun.cx} cy={sun.cy} r={sun.r} />
        </g>
        <path className="h-ridge-far" d="M0 70 L120 58 L260 66 L380 54 L520 64 L700 56 L860 66 L1000 55 L1200 63 V80 H0 Z" />
        <path className="h-ridge-near" d="M0 78 L160 70 L330 76 L470 69 L640 76 L820 70 L980 77 L1200 71 V82 H0 Z" />
        <rect y="80" width="1200" height="24" className="h-water" />
        <g className="h-glint" style={{ opacity: r }}>
          <rect x={sun.cx - 38} y="86" width="76" height="3" />
          <rect x={sun.cx - 22} y="93" width="44" height="3" />
          <rect x={sun.cx - 8} y="99" width="16" height="2" />
        </g>
      </svg>
      {children && <div className="horizon-top">{children}</div>}
    </div>
  );
}
