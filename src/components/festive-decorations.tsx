import React from "react";
import { FloatingBalloons } from "./floating-balloons";

// Пиксельная праздничная хлопушка с разлетающимся конфетти
function PixelPartyPopper({
  angle = 45,
  size = 48,
  className = "",
  style = {},
}: {
  angle?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`} style={style}>
      <div style={{ transform: `rotate(${angle}deg)` }} className="relative">
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pixelated drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
        >
          {/* Конус хлопушки (полосатый хэллоуинский / праздничный) */}
          <polygon points="6,34 26,14 34,22" fill="#ea580c" />
          <polygon points="12,28 20,20 25,25 17,33" fill="#a855f7" />
          <polygon points="18,22 26,14 29,17 21,25" fill="#fbbf24" />
          {/* Основание конуса */}
          <circle cx="7" cy="33" r="3" fill="#f97316" />
          {/* Золотая каемка */}
          <line x1="26" y1="14" x2="34" y2="22" stroke="#fef08a" strokeWidth="2" />
        </svg>

        {/* Разлетающиеся искры конфетти */}
        <div className="absolute -top-3 -right-3 size-2 rounded-full bg-amber-400 animate-ping opacity-75" />
        <div className="absolute -top-5 right-2 size-1.5 rounded-full bg-purple-400 animate-pulse" />
        <div className="absolute -top-2 right-6 size-2 rounded-sm bg-pink-400 rotate-45 animate-pulse" />
        <div className="absolute top-1 -right-5 size-1.5 rounded-full bg-green-400 animate-ping" />
        <div className="absolute -top-4 -right-1 size-2 rounded-sm bg-orange-400 rotate-12" />
      </div>
    </div>
  );
}

export function FestiveDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10 select-none">
      <FloatingBalloons />

      {/* ══════════ ХЛОПУШКИ (PARTY POPPERS) ══════════ */}

      {/* Хлопушка в левом нижнем углу (стреляет в сторону книги) */}
      <div className="hidden sm:block absolute bottom-10 left-6 lg:left-14 animate-[popperJiggle_4s_ease-in-out_infinite]">
        <PixelPartyPopper angle={35} size={54} />
      </div>

      {/* Хлопушка в правом нижнем углу */}
      <div className="hidden sm:block absolute bottom-12 right-6 lg:right-14 animate-[popperJiggle_4.5s_ease-in-out_infinite_1s]">
        <PixelPartyPopper angle={-35} size={54} />
      </div>

      {/* Хлопушка слева по центру */}
      <div className="hidden xl:block absolute top-1/2 -translate-y-12 left-4 animate-[popperJiggle_5s_ease-in-out_infinite_2s]">
        <PixelPartyPopper angle={55} size={44} />
      </div>

      {/* Хлопушка справа по центру */}
      <div className="hidden xl:block absolute top-1/2 -translate-y-8 right-4 animate-[popperJiggle_5.2s_ease-in-out_infinite_0.5s]">
        <PixelPartyPopper angle={-55} size={44} />
      </div>

      {/* ══════════ ТЫКВЫ ПО СТРАНИЦЕ (PUMPKINS) ══════════ */}

      {/* Тыква в левом нижнем углу (уютно сидит на полу с мягким свечением) */}
      <div className="hidden sm:block absolute bottom-4 left-24 lg:left-32 halloween-pumpkin-glow">
        <img
          src="/pixel-pumpkin.png"
          alt="Halloween Pumpkin"
          draggable={false}
          className="w-12 sm:w-14 h-auto object-contain pixelated opacity-90 drop-shadow-[0_0_14px_rgba(255,120,0,0.65)]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Тыква в правом нижнем углу */}
      <div className="hidden sm:block absolute bottom-5 right-24 lg:right-36 halloween-pumpkin-glow" style={{ animationDelay: "1.5s" }}>
        <img
          src="/pixel-pumpkin.png"
          alt="Halloween Pumpkin"
          draggable={false}
          className="w-12 sm:w-14 h-auto object-contain pixelated opacity-90 -scale-x-100 drop-shadow-[0_0_14px_rgba(255,120,0,0.65)]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Маленькая парящая тыквочка слева на фоне */}
      <div className="hidden lg:block absolute top-1/3 left-6 animate-[spookyFloat_7s_ease-in-out_infinite]">
        <img
          src="/pixel-pumpkin.png"
          alt="Mini Pumpkin"
          draggable={false}
          className="w-8 sm:w-10 h-auto object-contain pixelated opacity-75 drop-shadow-[0_0_10px_rgba(255,140,0,0.5)]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Маленькая парящая тыквочка справа на фоне */}
      <div className="hidden lg:block absolute top-1/3 right-8 animate-[spookyFloat_8s_ease-in-out_infinite_2.5s]">
        <img
          src="/pixel-pumpkin.png"
          alt="Mini Pumpkin"
          draggable={false}
          className="w-8 sm:w-10 h-auto object-contain pixelated opacity-75 drop-shadow-[0_0_10px_rgba(255,140,0,0.5)]"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* ══════════ РАЗЛЕТАЮЩИЕСЯ ИСКОРКИ И КОНФЕТТИ ══════════ */}
      <div className="absolute top-1/4 left-1/5 size-2 rounded-sm bg-amber-400/40 rotate-12 animate-pulse" />
      <div className="absolute top-3/4 left-1/4 size-1.5 rounded-full bg-orange-400/50 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute top-1/5 right-1/4 size-2 rounded-sm bg-purple-400/40 rotate-45 animate-pulse" style={{ animationDelay: "1.2s" }} />
      <div className="absolute top-2/3 right-1/5 size-1.5 rounded-full bg-pink-400/40 animate-ping" style={{ animationDuration: "4s", animationDelay: "2s" }} />
    </div>
  );
}
