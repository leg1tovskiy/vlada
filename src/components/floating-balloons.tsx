import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const colors = [
  { body: "#ea580c", light: "#fdba74", knot: "#c2410c" },
  { body: "#9333ea", light: "#d8b4fe", knot: "#7e22ce" },
  { body: "#f59e0b", light: "#fef08a", knot: "#b45309" },
  { body: "#ec4899", light: "#fbcfe8", knot: "#be185d" },
  { body: "#10b981", light: "#a7f3d0", knot: "#047857" },
];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

function newFlight(id: number, initial: boolean) {
  const duration = randomBetween(12, 20);
  return {
    id,
    left: randomBetween(3, 91),
    size: randomBetween(38, 58),
    duration,
    delay: initial ? -randomBetween(0, duration) : 0,
    drift: randomBetween(-65, 65),
    colors: colors[Math.floor(Math.random() * colors.length)],
  };
}

function FloatingBalloon() {
  const [flight, setFlight] = useState(() => newFlight(0, true));
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    if (!popped) return;
    const timeout = window.setTimeout(() => {
      setFlight((previous) => newFlight(previous.id + 1, false));
      setPopped(false);
    }, 480);
    return () => window.clearTimeout(timeout);
  }, [popped]);

  const style = {
    left: `${flight.left}%`,
    width: flight.size,
    height: flight.size * 1.6,
    animationDuration: `${flight.duration}s`,
    animationDelay: `${flight.delay}s`,
    animationPlayState: popped ? "paused" : "running",
    "--balloon-drift": `${flight.drift}px`,
    "--balloon-color": flight.colors.body,
  } as CSSProperties;

  return (
    <button
      key={flight.id}
      type="button"
      aria-label="Лопнуть шарик"
      className="floating-balloon"
      style={style}
      onClick={() => setPopped(true)}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "balloonRise" && !popped) {
          setFlight((previous) => newFlight(previous.id + 1, false));
        }
      }}
    >
      <svg
        width={flight.size}
        height={flight.size * 1.6}
        viewBox="0 0 32 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`balloon-art pixelated ${popped ? "balloon-art-popped" : ""}`}
        aria-hidden="true"
      >
        <ellipse cx="16" cy="16" rx="13" ry="15" fill={flight.colors.body} />
        <ellipse cx="11" cy="11" rx="4" ry="5" fill={flight.colors.light} opacity="0.65" />
        <circle cx="9" cy="8" r="1.5" fill="#fff" opacity="0.9" />
        <path d="M7 23C9 28 23 28 25 23C23 26 9 26 7 23Z" fill="#000" opacity="0.25" />
        <polygon points="14,31 18,31 17,34 15,34" fill={flight.colors.knot} />
        <path d="M16 34 Q 13 40, 17 44 T 15 52" stroke="#e2e8f0" strokeWidth="1.2" strokeDasharray="2 1" opacity="0.75" />
      </svg>
      {popped && (
        <span className="balloon-burst" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <i key={index} style={{ "--burst-angle": `${index * 45}deg` } as CSSProperties} />
          ))}
        </span>
      )}
    </button>
  );
}

export function FloatingBalloons() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-label="Летающие шарики">
      {Array.from({ length: 10 }, (_, index) => <FloatingBalloon key={index} />)}
    </div>
  );
}
