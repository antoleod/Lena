import { getProfile } from '../storage/profileStore.js';

let audioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) {
    audioContext = new Ctor();
  }
  return audioContext;
}

function scheduleTone(context, type, frequency, startTime, duration, gainValue) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

export async function playRewardSound() {
  const profile = getProfile();
  if (profile.settings?.soundEnabled === false) return;

  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  const start = context.currentTime + 0.01;
  scheduleTone(context, 'triangle', 523.25, start, 0.18, 0.06);
  scheduleTone(context, 'triangle', 659.25, start + 0.12, 0.2, 0.07);
  scheduleTone(context, 'sine', 783.99, start + 0.24, 0.28, 0.08);
}

export async function playCorrectSound() {
  const profile = getProfile();
  if (profile.settings?.soundEnabled === false) return;

  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  const start = context.currentTime + 0.01;
  // Upbeat ascending arpeggio (C5 -> E5 -> G5 -> C6)
  scheduleTone(context, 'sine', 523.25, start, 0.08, 0.05);
  scheduleTone(context, 'sine', 659.25, start + 0.07, 0.08, 0.05);
  scheduleTone(context, 'sine', 783.99, start + 0.14, 0.08, 0.05);
  scheduleTone(context, 'sine', 1046.50, start + 0.21, 0.18, 0.06);
}

export async function playWrongSound() {
  const profile = getProfile();
  if (profile.settings?.soundEnabled === false) return;

  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  const start = context.currentTime + 0.01;
  // Low-pitched gentle warning arpeggio (G3 -> D3)
  scheduleTone(context, 'triangle', 196.00, start, 0.12, 0.05);
  scheduleTone(context, 'triangle', 146.83, start + 0.09, 0.20, 0.05);
}

/**
 * Soft tap sound — a single short sine blip for general UI interactions.
 * Much quieter and shorter than answer sounds; won't disrupt activity flow.
 */
export async function playTapSound() {
  const profile = getProfile();
  if (profile.settings?.soundEnabled === false) return;

  const context = getAudioContext();
  if (!context) return;

  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch {
      return;
    }
  }

  const start = context.currentTime + 0.01;
  // Single gentle blip: A4 (440Hz), sine, very short and quiet
  scheduleTone(context, 'sine', 440, start, 0.06, 0.03);
}

