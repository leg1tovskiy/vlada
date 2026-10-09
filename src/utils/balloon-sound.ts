let audioContext: AudioContext | null = null;

export function playBalloonPopSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      const fallback = new Audio("/sounds/pop.wav");
      void fallback.play().catch(() => {});
      return;
    }

    if (!audioContext) {
      audioContext = new AudioContextClass();
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }

    const ctx = audioContext;
    const now = ctx.currentTime;
    const pitch = 0.93 + Math.random() * 0.14;

    // Мягкий не выделяющийся "пуп" (чистый синусоидальный спад с 420Гц до 130Гц за 45мс)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(130 * pitch, now + 0.045);

    // Мягкая ненавязчивая громкость, гладкая микроатака и экспоненциальный спад
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    const fallback = new Audio("/sounds/pop.wav");
    void fallback.play().catch(() => {});
  }
}
