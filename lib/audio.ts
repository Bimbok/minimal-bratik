"use client";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be lazily initialized on user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playKeyClick(type: "down" | "up" | "enter" | "backspace" = "down") {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Noise buffer for mechanical switch tactile click
      const bufferSize = this.ctx.sampleRate * 0.008; // 8ms noise tick
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      
      let baseFreq = 2400;
      let duration = 0.012;
      let vol = 0.12;

      if (type === "enter") {
        baseFreq = 1400;
        duration = 0.02;
        vol = 0.2;
      } else if (type === "backspace") {
        baseFreq = 1800;
        duration = 0.015;
        vol = 0.15;
      } else if (type === "up") {
        baseFreq = 3200;
        duration = 0.008;
        vol = 0.08;
      }

      noiseFilter.frequency.setValueAtTime(baseFreq, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(vol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      // Low frequency body thump for mechanical switch housing impact
      osc.type = "sine";
      osc.frequency.setValueAtTime(type === "enter" ? 180 : 320, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + duration);

      gain.gain.setValueAtTime(vol * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio context errors silently
    }
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    } catch {
      // Ignore
    }
  }

  public playError() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();
