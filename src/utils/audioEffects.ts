/**
 * Web Audio API synthesizer for authentic Nairobi Matatu sound effects.
 * No external mp3 files needed - generates real-time audio!
 */

class MatatuAudioEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(enabled?: boolean) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  public isEnabled() {
    return this.soundEnabled;
  }

  /**
   * Iconic Matatu dual-tone horn ("Pee-Peee!")
   */
  public playHorn() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Tone 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.exponentialRampToValueAtTime(460, now + 0.12);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.16);

    // Tone 2 (Quick response)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(580, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(600, now + 0.32);
    gain2.gain.setValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.4);
  }

  /**
   * Conductor bodywork knock ("Gonga Chuma / Piga Bodi") - 2 sharp metallic taps
   */
  public playBodyworkTap() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [0, 0.12].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now + offset);
      osc.frequency.exponentialRampToValueAtTime(120, now + offset + 0.05);
      
      gain.gain.setValueAtTime(0.4, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.07);
    });
  }

  /**
   * "Nishushe Hapo! / Drop Me Here" Stage Bell chime
   */
  public playDropBell() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, now); // C6
    osc.frequency.setValueAtTime(1318.5, now + 0.1); // E6

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
  }

  /**
   * M-Pesa / Refund instant chime ("Chapaa Imerudi!")
   */
  public playRefundChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });
  }

  /**
   * Conductor coin shake / change rattling
   */
  public playCoinShake() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4500;
    filter.Q.value = 8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.16);
  }
}

export const matatuAudio = new MatatuAudioEngine();
