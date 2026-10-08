import { useState, useEffect, useMemo } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Maximize2, Minimize2, Lock, Key, Clock, PartyPopper } from "lucide-react";
import { MinecraftBook } from "@/components/minecraft-book";
import { FestiveDecorations } from "@/components/festive-decorations";
import { AvatarGallery } from "@/components/avatar-gallery";
import { VladaBadge } from "@/components/vlada-badge";

// Временное окно доступа: 14 октября 21:59 МСК - 15 октября 22:00 МСК
const ACCESS_START = new Date("2026-10-14T21:59:00+03:00").getTime();
const ACCESS_END = new Date("2026-10-15T22:00:00+03:00").getTime();

export function App() {
  const [now, setNow] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUnlocked, setPreviewUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    const url = new URL(window.location.href);
    if (
      url.searchParams.get("key")?.toLowerCase() === "sdnemrojdeniyavlada" ||
      url.searchParams.get("secret")?.toLowerCase() === "sdnemrojdeniyavlada" ||
      url.searchParams.has("preview")
    ) {
      return true;
    }
    return localStorage.getItem("vlada_preview_unlocked") === "true";
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [keyError, setKeyError] = useState(false);

  // Обновление текущего времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Отслеживание полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => {});
    } else {
      void document.exitFullscreen().catch(() => {});
    }
  };

  const launchConfetti = () => {
    void confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff8a3d", "#a855f7", "#3dd68c", "#6ea8ff", "#ffd166"],
    });
  };

  const isWindowOpen = now >= ACCESS_START && now <= ACCESS_END;
  const isExpired = now > ACCESS_END;
  const isAllowed = isWindowOpen || previewUnlocked;

  // Расчёт времени до открытия
  const timeLeft = useMemo(() => {
    const diff = ACCESS_START - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [now]);

  const handleUnlockWithKey = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputKey.trim().toLowerCase();
    if (clean === "sdnemrojdeniyavlada") {
      setPreviewUnlocked(true);
      localStorage.setItem("vlada_preview_unlocked", "true");
      setShowKeyModal(false);
      setKeyError(false);
      launchConfetti();
    } else {
      setKeyError(true);
    }
  };

  return (
    <div className="h-screen h-[100dvh] overflow-hidden flex flex-col justify-between text-[#eef0f4] relative selection:bg-orange-500/30 selection:text-orange-200">
      {/* Праздничные декорации по всей странице: шарики, хлопушки, тыквы */}
      <FestiveDecorations />

      {/* Верхняя навигационная панель */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="text-xl select-none" role="img" aria-label="Pumpkin">🎃</span>
          <div>
            <h1 className="text-sm font-bold tracking-wide font-minecraft flex items-center gap-2">
              <span>Сделано с любовью твоими друзьями 💗</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-sans">
                Halloween Edition
              </span>
            </h1>
            <p className="text-[10px] text-white/50 font-minecraft">
              Праздничная книга для Влады
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAllowed && (
            <button
              type="button"
              onClick={launchConfetti}
              className="mc-button flex h-7 items-center gap-1 px-2 text-[11px] font-minecraft"
              title="Запустить праздничные блёстки 🎉"
            >
              <PartyPopper className="size-3 text-amber-300" />
              <span className="hidden sm:inline">Праздник</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="mc-button grid size-7 place-items-center text-[11px] font-minecraft"
            title={isFullscreen ? "Выйти из полного экрана" : "Полный экран"}
            aria-label="Полный экран"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </header>

      {/* Основное содержимое страницы */}
      <main className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden w-full">
        {isAllowed ? (
          <MinecraftBook />
        ) : isExpired ? (
          /* Экран после окончания праздничного окна */
          <div className="relative z-10 max-w-md w-full mx-4 p-6 sm:p-8 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl text-center shadow-2xl">
            <div className="inline-flex p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-4">
              <Sparkles className="size-8" />
            </div>
            <h2 className="text-xl font-bold font-minecraft text-white mb-2">
              Книга запечатана ✨
            </h2>
            <p className="text-sm text-white/70 font-minecraft leading-relaxed mb-6">
              Праздничный день подошел к концу! Спасибо всем, кто оставил тёплые слова и разделил этот особенный день с нами.
            </p>
            <div className="pt-4 border-t border-white/10 flex justify-center">
              <button
                type="button"
                onClick={() => setShowKeyModal(true)}
                className="text-xs text-white/40 hover:text-white/80 transition-colors font-minecraft flex items-center gap-1.5"
              >
                <Key className="size-3" />
                Ввести ключ доступа
              </button>
            </div>
          </div>
        ) : (
          /* Экран обратного отсчёта до 14 октября 21:59 МСК */
          <>
            <div className="countdown-card relative z-10 max-w-lg w-full mx-4 p-3.5 sm:p-6 rounded-2xl border border-orange-500/20 bg-black/70 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(255,120,0,0.15)]">
              <VladaBadge />

              <h2 className="text-base sm:text-xl font-bold font-minecraft text-orange-400 mb-1">
                Книга зачарована и запечатана 🎃
              </h2>
              <p className="text-[11px] sm:text-sm text-white/70 font-minecraft mb-2.5 sm:mb-4">
                Страницы откроются 14 октября ровно в 21:59 по Московскому времени!
              </p>

              {/* Карточки таймера */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-3 mb-2.5 sm:mb-4 font-minecraft">
                <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 sm:p-2.5">
                  <div className="text-lg sm:text-2xl font-bold text-orange-300">{timeLeft.days}</div>
                  <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Дней</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 sm:p-2.5">
                  <div className="text-lg sm:text-2xl font-bold text-orange-300">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Часов</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 sm:p-2.5">
                  <div className="text-lg sm:text-2xl font-bold text-orange-300">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Минут</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 sm:p-2.5">
                  <div className="text-lg sm:text-2xl font-bold text-orange-400 animate-pulse">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider">Секунд</div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-white/40 font-minecraft flex items-center justify-center gap-1.5 mb-2.5 sm:mb-4">
                <Clock className="size-3 sm:size-3.5" />
                <span>Осталось совсем немного терпения...</span>
              </div>

              {/* Кнопка ввода ключа доступа */}
              <div className="pt-2 sm:pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(true)}
                  className="mc-button flex h-7 items-center gap-1.5 px-3 text-[10px] sm:text-[11px] font-minecraft"
                >
                  <Key className="size-3 text-amber-300" />
                  <span>Ввести ключ доступа</span>
                </button>
              </div>
            </div>
            <AvatarGallery />
          </>
        )}
      </main>

      {/* Модальное окно ввода ключа доступа */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-orange-500/30 bg-[#12141a] p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="size-4 text-orange-400" />
              <h3 className="text-sm font-bold font-minecraft text-white">Ключ доступа к книге</h3>
            </div>
            <p className="text-xs text-white/60 font-minecraft mb-4">
              Введите секретное кодовое слово:
            </p>

            <form onSubmit={handleUnlockWithKey} className="space-y-3">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setKeyError(false);
                }}
                placeholder=""
                autoFocus
                className="w-full rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-xs font-minecraft text-white placeholder-white/30 focus:border-orange-500 focus:outline-none"
              />
              {keyError && (
                <p className="text-[11px] text-red-400 font-minecraft">
                  Неверный ключ доступа!
                </p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="mc-button h-7 px-3 text-[11px] font-minecraft"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="mc-button h-7 px-3 text-[11px] font-minecraft !text-amber-300"
                >
                  Открыть
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Подвал сайта */}
      <footer className="relative z-30 py-3 px-4 border-t border-white/10 bg-black/30 text-center font-minecraft text-[10px] text-white/40 flex flex-wrap items-center justify-between gap-2">
        <span>Сделано с любовью твоими друзьями 💗</span>
        <div className="flex items-center gap-3">
          <span>14—15 октября 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
