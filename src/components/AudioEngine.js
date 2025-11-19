// Simple WebAudio engine to play chords using oscillators
// Provides playChord(frequencies, duration, volume) and stopAll()

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.active = [];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.3;
      this.master.connect(this.ctx.destination);
    }
  }

  setVolume(val) {
    this.ensureContext();
    this.master.gain.setTargetAtTime(val, this.ctx.currentTime, 0.01);
  }

  playChord(freqs, duration = 1.2) {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const nodes = freqs.map((f) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now);
      // soft attack/decay
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(1.0, now + 0.02);
      gain.gain.setTargetAtTime(0.0001, now + duration * 0.6, 0.2);
      osc.connect(gain).connect(this.master);
      osc.start(now);
      osc.stop(now + duration);
      return { osc, gain };
    });

    this.active.push(...nodes);
    // cleanup later
    setTimeout(() => {
      this.active = this.active.filter((n) => !nodes.includes(n));
    }, duration * 1000 + 100);
  }

  stopAll() {
    this.active.forEach((n) => {
      try { n.osc.stop(); } catch {}
    });
    this.active = [];
  }
}
