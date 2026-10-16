import { SoundPreset } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private currentPreset: SoundPreset = 'frostcello';
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setPreset(preset: SoundPreset) {
    this.currentPreset = preset;
    if (preset === 'mute') {
      this.isMuted = true;
      this.stopAmbientDrone();
    } else {
      this.isMuted = false;
      if (this.droneGain) {
        this.startAmbientDrone();
      }
    }
  }

  public getPreset(): SoundPreset {
    return this.currentPreset;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAmbientDrone();
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted || this.currentPreset === 'mute';
  }

  /**
   * Starts a continuous, cinematic ambient background drone (Frostpunk / Ambient).
   */
  public startAmbientDrone() {
    if (this.isSoundMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopAmbientDrone();

    try {
      const now = ctx.currentTime;
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.12, now + 3.0);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      this.droneOsc1 = ctx.createOscillator();
      this.droneOsc2 = ctx.createOscillator();

      if (this.currentPreset === 'frostcello') {
        // C2 (65.41Hz) + G2 (98.00Hz) Dark Cello 5th drone
        this.droneOsc1.type = 'sawtooth';
        this.droneOsc2.type = 'triangle';
        this.droneOsc1.frequency.setValueAtTime(65.41, now);
        this.droneOsc2.frequency.setValueAtTime(98.00, now);
      } else if (this.currentPreset === 'warmpiano') {
        // A2 (110Hz) + E3 (164.81Hz) Soft warm pad
        this.droneOsc1.type = 'sine';
        this.droneOsc2.type = 'triangle';
        this.droneOsc1.frequency.setValueAtTime(110.0, now);
        this.droneOsc2.frequency.setValueAtTime(164.81, now);
      } else {
        // Heartbeat Sub-bass
        this.droneOsc1.type = 'sine';
        this.droneOsc2.type = 'sine';
        this.droneOsc1.frequency.setValueAtTime(55.0, now);
        this.droneOsc2.frequency.setValueAtTime(55.5, now);
      }

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(ctx.destination);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbientDrone() {
    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        setTimeout(() => {
          if (this.droneOsc1) {
            try { this.droneOsc1.stop(); } catch {}
            this.droneOsc1 = null;
          }
          if (this.droneOsc2) {
            try { this.droneOsc2.stop(); } catch {}
            this.droneOsc2 = null;
          }
        }, 1300);
      } catch {}
    }
  }

  /**
   * Plays a monumental, heavy cinematic transition hit when a Frostpunk slide turns.
   */
  public playTransitionHit(slideIndex = 0) {
    if (this.isSoundMuted()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (this.currentPreset === 'frostcello') {
        // 1. Heavy resonant Timpani / Bass boom
        const boomOsc = ctx.createOscillator();
        const boomGain = ctx.createGain();
        boomOsc.type = 'sine';
        boomOsc.frequency.setValueAtTime(105, now);
        boomOsc.frequency.exponentialRampToValueAtTime(28, now + 2.0);

        boomGain.gain.setValueAtTime(0.55, now);
        boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        boomOsc.connect(boomGain);
        boomGain.connect(ctx.destination);
        boomOsc.start(now);
        boomOsc.stop(now + 2.3);

        // 2. Frostpunk Cello Bow Resonance
        const celloOsc = ctx.createOscillator();
        const celloGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        celloOsc.type = 'sawtooth';
        const chordRoots = [130.81, 146.83, 164.81, 196.00]; // C3, D3, E3, G3
        celloOsc.frequency.setValueAtTime(chordRoots[slideIndex % chordRoots.length], now);

        celloGain.gain.setValueAtTime(0.001, now);
        celloGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
        celloGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.4);

        celloOsc.connect(filter);
        filter.connect(celloGain);
        celloGain.connect(ctx.destination);
        celloOsc.start(now);
        celloOsc.stop(now + 3.5);

      } else if (this.currentPreset === 'warmpiano') {
        // Lush Piano chord arpeggio
        const notes = [261.63, 329.63, 392.00, 493.88]; // C, E, G, B
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);

          gain.gain.setValueAtTime(0.001, now + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.1 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 3.0);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 3.1);
        });

      } else if (this.currentPreset === 'heartbeat') {
        // Deep heartbeat pulse
        [0, 0.28].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(idx === 0 ? 68 : 52, now + offset);
          osc.frequency.exponentialRampToValueAtTime(25, now + offset + 0.25);

          gain.gain.setValueAtTime(idx === 0 ? 0.6 : 0.4, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.28);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.3);
        });
      }
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
