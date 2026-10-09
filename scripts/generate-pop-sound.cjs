const fs = require('fs');
const path = require('path');

function createPopWav() {
  const sampleRate = 44100;
  const duration = 0.07; // 70ms total, sound is ~45ms
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

  // Synthesize soft, understated "пуп" (bubble/balloon pop)
  let phase = 0;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;

    // Smooth frequency drop from 420Hz down to 130Hz
    const freq = 130 + 290 * Math.exp(-t / 0.012);
    phase += (2 * Math.PI * freq) / sampleRate;

    // Soft amplitude envelope: peak at 2ms, gentle decay by 45ms
    let env = 0;
    if (t < 0.002) {
      env = t / 0.002;
    } else {
      env = Math.exp(-(t - 0.002) / 0.014);
    }

    // Comfortable, soft volume (~0.32 max)
    const sample = Math.sin(phase) * env * 0.32;
    const clamped = Math.max(-1, Math.min(1, sample));
    buffer.writeInt16LE(Math.floor(clamped * 32767), 44 + i * 2);
  }

  const outPath = path.join(__dirname, '..', 'public', 'sounds', 'pop.wav');
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated ${outPath} (${buffer.length} bytes)`);
}

createPopWav();
