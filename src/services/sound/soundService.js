import { getProfile } from '../storage/profileStore.js';

// ─── Shared AudioContext ───────────────────────────────────────────────────────
let audioContext = null;

function ctx() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

async function ensureRunning(context) {
  if (context.state === 'suspended') {
    try { await context.resume(); } catch { return false; }
  }
  return true;
}

function isSoundEnabled() {
  try { return getProfile()?.settings?.soundEnabled !== false; } catch { return true; }
}

// ─── Synthetic reverb (impulse response generated at runtime) ─────────────────
let _reverb = null;
let _reverbCtx = null;

function getReverb(context) {
  if (_reverb && _reverbCtx === context) return _reverb;
  const sampleRate = context.sampleRate;
  const dur = 0.9;          // seconds of reverb tail
  const decay = 3.0;        // steeper = shorter tail
  const length = Math.floor(sampleRate * dur);
  const buf = context.createBuffer(2, length, sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < length; i++) {
      // Random noise multiplied by decaying exponential — classic Moorer reverb
      d[i] = (Math.random() * 2 - 1) * Math.exp(-decay * i / length);
    }
  }
  const conv = context.createConvolver();
  conv.buffer = buf;
  _reverb = conv;
  _reverbCtx = context;
  return conv;
}

// ─── Utility: noise burst (percussive transient) ──────────────────────────────
function noiseNode(context, durationSec) {
  const bufLen = Math.floor(context.sampleRate * durationSec);
  const buf = context.createBuffer(1, bufLen, context.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
  const src = context.createBufferSource();
  src.buffer = buf;
  return src;
}

// ─── Utility: schedule a bell partial ─────────────────────────────────────────
// A realistic bell/marimba partial: fast attack, long exponential decay
function bellPartial(context, dest, freq, startTime, peakGain, decayTime) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  // Slight pitch drop at start (natural inharmonicity of struck instruments)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.998, startTime + 0.04);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.003); // 3ms attack
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decayTime);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(startTime);
  osc.stop(startTime + decayTime + 0.05);
}

// ─── Utility: rich tone with warmth (for low sounds) ─────────────────────────
function warmTone(context, dest, freq, startTime, peakGain, durationSec) {
  // Fundamental
  const osc1 = context.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, startTime);

  // Slight second partial
  const osc2 = context.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, startTime);

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(peakGain * 0.3, startTime + durationSec * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

  const gain2 = context.createGain();
  gain2.gain.setValueAtTime(peakGain * 0.2, startTime);
  gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec * 0.3);

  osc1.connect(gain);   gain.connect(dest);
  osc2.connect(gain2);  gain2.connect(dest);
  osc1.start(startTime); osc1.stop(startTime + durationSec + 0.05);
  osc2.start(startTime); osc2.stop(startTime + durationSec * 0.3 + 0.05);
}

// ─── playCorrectSound — marimba bell arpeggio ─────────────────────────────────
export async function playCorrectSound() {
  if (!isSoundEnabled()) return;
  const context = ctx();
  if (!context || !await ensureRunning(context)) return;

  const reverb = getReverb(context);
  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0.55, context.currentTime);

  const dryGain  = context.createGain(); dryGain.gain.value  = 0.7;
  const wetGain  = context.createGain(); wetGain.gain.value  = 0.3;

  dryGain.connect(masterGain);
  wetGain.connect(reverb);
  reverb.connect(masterGain);
  masterGain.connect(context.destination);

  const t = context.currentTime + 0.01;
  // C5 – E5 – G5 – C6  (major chord arpeggio)
  // Each note: fundamental + octave partial + 5th partial (natural harmonic series)
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    const nt = t + idx * 0.09;
    bellPartial(context, dryGain, freq,        nt, 0.07,  0.5);   // fundamental
    bellPartial(context, dryGain, freq * 2,    nt, 0.025, 0.25);  // octave
    bellPartial(context, dryGain, freq * 2.76, nt, 0.012, 0.15);  // natural 3rd partial
  });
}

// ─── playWrongSound — soft low thud + rumble ─────────────────────────────────
export async function playWrongSound() {
  if (!isSoundEnabled()) return;
  const context = ctx();
  if (!context || !await ensureRunning(context)) return;

  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0.45, context.currentTime);
  masterGain.connect(context.destination);

  const t = context.currentTime + 0.01;

  // Short noise burst (the "thud" transient)
  const noise = noiseNode(context, 0.08);
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(400, t);
  noiseFilter.frequency.exponentialRampToValueAtTime(60, t + 0.07);
  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.0001, t);
  noiseGain.gain.exponentialRampToValueAtTime(0.15, t + 0.005);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start(t);

  // Two detuned low tones (beating creates unsettled feeling)
  warmTone(context, masterGain, 130.81, t,        0.06, 0.32); // C3
  warmTone(context, masterGain, 116.54, t + 0.04, 0.04, 0.28); // Bb2 (minor feel)
}

// ─── playRewardSound — sparkly celebration ────────────────────────────────────
export async function playRewardSound() {
  if (!isSoundEnabled()) return;
  const context = ctx();
  if (!context || !await ensureRunning(context)) return;

  const reverb = getReverb(context);
  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0.55, context.currentTime);

  const dryGain = context.createGain(); dryGain.gain.value = 0.6;
  const wetGain = context.createGain(); wetGain.gain.value = 0.4;

  dryGain.connect(masterGain);
  wetGain.connect(reverb);
  reverb.connect(masterGain);
  masterGain.connect(context.destination);

  const t = context.currentTime + 0.01;

  // Ascending fanfare: C5 E5 G5 + sparkle cluster at top
  const fanfare = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  fanfare.forEach((freq, idx) => {
    const nt = t + idx * 0.1;
    bellPartial(context, dryGain, freq,        nt, 0.08,  0.7);
    bellPartial(context, dryGain, freq * 2,    nt, 0.03,  0.35);
    bellPartial(context, dryGain, freq * 2.76, nt, 0.015, 0.2);
  });

  // Gentle shimmer: random high-frequency sparkles
  [1568, 2093, 2637, 3136, 2349].forEach((freq, idx) => {
    const nt = t + 0.35 + idx * 0.06 + Math.random() * 0.03;
    bellPartial(context, wetGain, freq, nt, 0.025, 0.4);
  });

  // Low "boom" underneath to ground the excitement
  warmTone(context, dryGain, 65.41, t, 0.04, 0.5); // C2 sub
}

// ─── playTapSound — physical click with body ─────────────────────────────────
export async function playTapSound() {
  if (!isSoundEnabled()) return;
  const context = ctx();
  if (!context || !await ensureRunning(context)) return;

  const masterGain = context.createGain();
  masterGain.gain.setValueAtTime(0.28, context.currentTime);
  masterGain.connect(context.destination);

  const t = context.currentTime + 0.005;

  // Ultra-short noise click (the "click" attack)
  const noise = noiseNode(context, 0.012);
  const nf = context.createBiquadFilter();
  nf.type = 'bandpass';
  nf.frequency.setValueAtTime(1200, t);
  nf.Q.setValueAtTime(0.8, t);
  const ng = context.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(0.25, t + 0.002);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
  noise.connect(nf); nf.connect(ng); ng.connect(masterGain);
  noise.start(t);

  // Soft low body resonance (the "thock" feeling)
  const osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(380, t);
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);
  const og = context.createGain();
  og.gain.setValueAtTime(0.0001, t);
  og.gain.exponentialRampToValueAtTime(0.12, t + 0.004);
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
  osc.connect(og); og.connect(masterGain);
  osc.start(t); osc.stop(t + 0.07);
}
