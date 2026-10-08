const fs = require('fs');
const path = require('path');

function createPopWav() {
  const sampleRate = 44100;
  const duration = 0.22; // 220ms
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);

  // format chunk identifier
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // format chunk length
  buffer.writeUInt16LE(1, 20);  // sample format (1 = PCM)
  buffer.writeUInt16LE(1, 22);  // channel count (1 = mono)
  buffer.writeUInt32LE(sampleRate, 24); // sample rate
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate (sampleRate * 1 channel * 2 bytes)
  buffer.writeUInt16LE(2, 32);  // block align
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data chunk identifier
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Synthesize balloon pop + minecraft item pop
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // 1. Initial burst noise (air pressure release) - first 35ms
    const noiseEnv = Math.exp(-t * 90);
    const noise = (Math.random() * 2 - 1) * noiseEnv * 0.45;

    // 2. Rubber pop snap (rapid frequency drop) - first 50ms
    const snapEnv = Math.exp(-t * 70);
    const snapFreq = 750 * Math.exp(-t * 60) + 120;
    const snap = Math.sin(2 * Math.PI * snapFreq * t) * snapEnv * 0.5;

    // 3. Minecraft-like item drop plop (gentle chime from 40ms to 180ms)
    let mcPop = 0;
    if (t > 0.03) {
      const tPop = t - 0.03;
      const popEnv = Math.exp(-tPop * 35) * Math.sin(Math.min(1, tPop * 120) * Math.PI / 2);
      const popFreq = 380 + 320 * Math.exp(-tPop * 25);
      mcPop = Math.sin(2 * Math.PI * popFreq * tPop) * popEnv * 0.35;
    }

    let sample = noise + snap + mcPop;
    // Clamp to -1..1
    sample = Math.max(-1, Math.min(1, sample));

    const int16 = Math.floor(sample * 32767);
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  const outPath = path.join(__dirname, '..', 'public', 'sounds', 'pop.wav');
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated ${outPath} (${buffer.length} bytes)`);
}

createPopWav();
