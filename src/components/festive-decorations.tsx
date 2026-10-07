import React from "react";

// Пиксельный воздушный шарик со свисающей ниточкой
function PixelBalloon({
  color,
  highlight,
  knotColor,
  size = 44,
  className = "",
  style = {},
}: {
  color: string;
  highlight: string;
  knotColor: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`relative select-none pointer-events-none ${className}`} style={style}>
      <svg
        width={size}
        height={size * 1.6}
        viewBox="0 0 32 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pixelated drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
      >
        {/* Тело шарика (овальная форма с пиксельными краями) */}
        <ellipse cx="16" cy="16" rx="13" ry="15" fill={color} />
        {/* Блик света на шарике */}
        <ellipse cx="11" cy="11" rx="4" ry="5" fill={highlight} opacity="0.65" />
        <circle cx="9" cy="8" r="1.5" fill="#ffffff" opacity="0.9" />
        {/* Тень внизу шарика */}
        <path
          d="M7 23C9 28 23 28 25 23C23 26 9 26 7 23Z"
          fill="#000000"
          opacity="0.25"
        />
        {/* Узелок шарика */}
        <polygon points="14,31 18,31 17,34 15,34" fill={knotColor} />
        <rect x="15" y="31" width="2" height="2" fill="#000000" opacity="0.3" />
        {/* Изогнутая ниточка шарика */}
        <path
          d="M16 34 Q 13 40, 17 44 T 15 52"
          stroke="#e2e8f0"
          strokeWidth="1.2"
          strokeDasharray="2 1"
          opacity="0.75"
          fill="none"
        />
      </svg>
    </div>
  );
}

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
      {/* ══════════ ШАРИКИ (BALLOONS) ══════════ */}

      {/* Левая сторона: связка шариков вверху */}
      <div className="hidden md:block absolute top-16 left-6 lg:left-12 animate-[balloonBob_5s_ease-in-out_infinite]">
        <PixelBalloon
          color="#ea580c" // Оранжевый (Хэллоуин)
          highlight="#fdba74"
          knotColor="#c2410c"
          size={52}
          className="hover:scale-110 transition-transform"
        />
      </div>
      <div className="hidden md:block absolute top-28 left-16 lg:left-24 animate-[balloonBob_6.2s_ease-in-out_infinite_1.2s]">
        <PixelBalloon
          color="#9333ea" // Фиолетовый (Мистический)
          highlight="#d8b4fe"
          knotColor="#7e22ce"
          size={46}
        />
      </div>
      <div className="hidden lg:block absolute top-48 left-8 animate-[balloonBob_5.6s_ease-in-out_infinite_2.4s]">
        <PixelBalloon
          color="#f59e0b" // Золотисто-янтарный
          highlight="#fef08a"
          knotColor="#b45309"
          size={42}
        />
      </div>

      {/* Левая сторона: нижние шарики */}
      <div className="hidden sm:block absolute bottom-24 left-10 lg:left-16 animate-[balloonBob_6.5s_ease-in-out_infinite_0.8s]">
        <PixelBalloon
          color="#ec4899" // Праздничный розовый
          highlight="#fbcfe8"
          knotColor="#be185d"
          size={48}
        />
      </div>

      {/* Правая сторона: верхние шарики */}
      <div className="hidden md:block absolute top-20 right-8 lg:right-16 animate-[balloonBob_5.4s_ease-in-out_infinite_1.8s]">
        <PixelBalloon
          color="#a855f7" // Фиолетовый
          highlight="#e9d5ff"
          knotColor="#7e22ce"
          size={50}
        />
      </div>
      <div className="hidden md:block absolute top-36 right-16 lg:right-28 animate-[balloonBob_6s_ease-in-out_infinite_0.4s]">
        <PixelBalloon
          color="#f97316" // Тыквенный
          highlight="#fed7aa"
          knotColor="#c2410c"
          size={44}
        />
      </div>

      {/* Правая сторона: нижние шарики */}
      <div className="hidden sm:block absolute bottom-28 right-8 lg:right-20 animate-[balloonBob_5.8s_ease-in-out_infinite_2.2s]">
        <PixelBalloon
          color="#10b981" // Праздничный изумрудный
          highlight="#a7f3d0"
          knotColor="#047857"
          size={46}
        />
      </div>
      <div className="hidden lg:block absolute bottom-44 right-16 animate-[balloonBob_6.6s_ease-in-out_infinite_1.5s]">
        <PixelBalloon
          color="#f59e0b" // Янтарный
          highlight="#fef08a"
          knotColor="#d97706"
          size={40}
        />
      </div>

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
