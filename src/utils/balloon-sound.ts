/**
 * Воспроизведение аутентичного звука лопания шарика.
 * Использует звуковой сэмпл (оригинальный Minecraft pop) с предварительной загрузкой в Web Audio API,
 * нулевой задержкой, полифонией и естественной микро-вариацией тона.
 */

let audioCtx: AudioContext | null = null;
let cachedBuffer: AudioBuffer | null = null;
let isLoading = false;

const SOUND_URL = "/sounds/balloon_pop.wav";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

async function preloadSound(): Promise<AudioBuffer | null> {
  if (cachedBuffer) return cachedBuffer;
  if (isLoading) return null;
  const ctx = getAudioContext();
  if (!ctx) return null;

  try {
    isLoading = true;
    const response = await fetch(SOUND_URL);
    const arrayBuf = await response.arrayBuffer();
    cachedBuffer = await ctx.decodeAudioData(arrayBuf);
    return cachedBuffer;
  } catch {
    return null;
  } finally {
    isLoading = false;
  }
}

// Предзагрузка при старте
if (typeof window !== "undefined") {
  void preloadSound();
}

export function playBalloonPopSound() {
  try {
    const ctx = getAudioContext();

    if (ctx) {
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      if (cachedBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = cachedBuffer;

        // Небольшая случайная вариация тона для естественности (как в игре)
        source.playbackRate.value = 0.94 + Math.random() * 0.12;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.8;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
        return;
      }
    }

    // Резервный вариант через HTML5 Audio
    const fallback = new Audio(SOUND_URL);
    fallback.volume = 0.8;
    fallback.playbackRate = 0.94 + Math.random() * 0.12;
    void fallback.play().catch(() => {});

    // Загружаем буфер для последующих кликов, если ещё не успел
    void preloadSound();
  } catch {
    const fallback = new Audio(SOUND_URL);
    void fallback.play().catch(() => {});
  }
}
