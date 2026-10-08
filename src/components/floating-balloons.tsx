import { useEffect, useState, useCallback } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { getRandomMinecraftItem } from "@/data/minecraft-items";
import type { MinecraftItem } from "@/data/minecraft-items";
import { playBalloonPopSound } from "@/utils/balloon-sound";

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

interface DroppedItem {
  id: number;
  item: MinecraftItem;
  startX: number;
  startY: number;
  driftX: number;
  rotation: number;
  duration: number;
  size: number;
}

interface FloatingBalloonProps {
  onPop: (x: number, y: number) => void;
}

function FloatingBalloon({ onPop }: FloatingBalloonProps) {
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

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (popped) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.35;
    setPopped(true);
    onPop(centerX, centerY);
  };

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
      onClick={handleClick}
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

let nextDropId = 1;

export function FloatingBalloons() {
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);

  const handlePop = useCallback((x: number, y: number) => {
    playBalloonPopSound();
    const randomItem = getRandomMinecraftItem();
    const drop: DroppedItem = {
      id: nextDropId++,
      item: randomItem,
      startX: x,
      startY: y,
      driftX: randomBetween(-45, 45),
      rotation: randomBetween(-120, 120),
      duration: randomBetween(1.3, 1.7),
      size: randomBetween(42, 52),
    };
    setDroppedItems((prev) => [...prev, drop]);
  }, []);

  const handleItemAnimationEnd = useCallback((id: number) => {
    setDroppedItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-label="Летающие шарики">
        {Array.from({ length: 10 }, (_, index) => (
          <FloatingBalloon key={index} onPop={handlePop} />
        ))}
      </div>

      {droppedItems.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
          {droppedItems.map((drop) => {
            const style = {
              left: `${drop.startX}px`,
              top: `${drop.startY}px`,
              width: `${drop.size}px`,
              height: `${drop.size}px`,
              "--start-x": `${drop.startX}px`,
              "--start-y": `${drop.startY}px`,
              "--drift-x": `${drop.driftX}px`,
              "--item-rot": `${drop.rotation}deg`,
              "--fall-duration": `${drop.duration}s`,
            } as CSSProperties;

            return (
              <div
                key={drop.id}
                className="minecraft-dropped-item"
                style={style}
                onAnimationEnd={() => handleItemAnimationEnd(drop.id)}
              >
                <img
                  src={`/mc-items/${drop.item.file}`}
                  alt={drop.item.name}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
