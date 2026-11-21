'use strict';
/*
 * audio.js — every sound in Second Glance is synthesized with WebAudio:
 * no audio files, nothing to load. Short, friendly blips that reward a
 * find and grumble at a miss without ever getting in the way.
 */

const Sound = (() => {
  let ac = null;
  let muted = false;

  function ensureContext() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }

  function tone(freq, delay, dur, type, vol) {
    if (muted) return;
    const a = ensureContext();
    if (!a) return;
    const t0 = a.currentTime + delay;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  return {
    find() {
      tone(1318.5, 0, 0.12, 'sine', 0.18);
      tone(1760, 0.07, 0.2, 'sine', 0.16);
    },
    miss() {
      tone(150, 0, 0.16, 'square', 0.07);
      tone(110, 0.05, 0.14, 'square', 0.05);
    },
    hint() {
      tone(880, 0, 0.22, 'sine', 0.09);
      tone(1174.7, 0.1, 0.3, 'sine', 0.07);
    },
    sceneClear() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.24, 'triangle', 0.15));
    },
    gameClear() {
      [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.15));
    },
    timeUp() {
      [392, 370, 349, 311].forEach((f, i) => tone(f, i * 0.13, 0.22, 'sawtooth', 0.06));
    },
    tick() {
      tone(1050, 0, 0.05, 'sine', 0.05);
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
    isMuted() {
      return muted;
    },
  };
})();
