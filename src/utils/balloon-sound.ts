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
    const pitch = 0.88 + Math.random() * 0.28;

    // 1. Воздушный хлопок (белый шум с резким спадом за 35мс)
    const noiseLen = Math.floor(ctx.sampleRate * 0.045);
    const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1600 * pitch, now);
    filter.Q.setValueAtTime(2.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // 2. Резиновый щелчок шарика (низкочастотный спад с 700Гц до 110Гц)
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = "sine";
    popOsc.frequency.setValueAtTime(720 * pitch, now);
    popOsc.frequency.exponentialRampToValueAtTime(105 * pitch, now + 0.055);

    popGain.gain.setValueAtTime(0.8, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(now);
    popOsc.stop(now + 0.065);

    // 3. Звук выпадения предмета Minecraft (чистый колокольчик/чпок через 20мс)
    const itemOsc = ctx.createOscillator();
    const itemGain = ctx.createGain();
    itemOsc.type = "triangle";
    itemOsc.frequency.setValueAtTime(360 * pitch, now + 0.02);
    itemOsc.frequency.exponentialRampToValueAtTime(760 * pitch, now + 0.08);

    itemGain.gain.setValueAtTime(0.001, now);
    itemGain.gain.setValueAtTime(0.4, now + 0.025);
    itemGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    itemOsc.connect(itemGain);
    itemGain.connect(ctx.destination);
    itemOsc.start(now + 0.02);
    itemOsc.stop(now + 0.13);
  } catch {
    const fallback = new Audio("/sounds/pop.wav");
    void fallback.play().catch(() => {});
  }
}
