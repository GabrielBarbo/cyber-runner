/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export class AudioController {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;

  constructor() {
    // Lazy initialization
  }

  init() {
    if (!this.ctx) {
      // Support for standard and webkit prefixed AudioContext
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.4; // Master volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playGemCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // High pitch "ding" with slight upward inflection
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playLetterCollect() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // Play a major chord (C Majorish: C5, E5, G5) for a rewarding sound
    const freqs = [523.25, 659.25, 783.99]; 
    
    freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = f;
        
        // Stagger start times slightly for an arpeggio feel
        const start = t + (i * 0.04);
        const dur = 0.3;

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + dur);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start(start);
        osc.stop(start + dur);
    });
  }

  playJump(isDouble = false) {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sine wave for a smooth "whoop" sound
    osc.type = 'sine';
    
    // Pitch shift up for double jump
    const startFreq = isDouble ? 400 : 200;
    const endFreq = isDouble ? 800 : 450;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.15);

    // Lower volume for jump as it is a frequent action
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  playDamage() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // 1. Noise buffer for "crunch/static"
    const bufferSize = this.ctx.sampleRate * 0.3; // 0.3 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    // 2. Low oscillator for "thud/impact"
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    
    noise.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
    noise.start(t);
    noise.stop(t + 0.3);
  }

  playLaser() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  playExplosion() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(10, t + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.5);
  }

  musicSource: AudioBufferSourceNode | null = null;
  musicGain: GainNode | null = null;

  startMusic() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain || this.musicSource) return;

    const tempo = 135; // Slightly faster
    const sixteenth = 60 / tempo / 4;
    const bar = sixteenth * 16;
    
    const duration = bar * 4; // 4 bars for a bit more variety
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
        const time = i / this.ctx.sampleRate;
        const s16 = Math.floor(time / sixteenth) % 16;
        const s32 = Math.floor(time / (sixteenth / 2)) % 32;
        
        // --- Layer 1: Kick (1, 5, 9, 13) ---
        let kick = 0;
        if (s16 % 4 === 0) {
            const beatTime = time % (sixteenth * 4);
            kick = Math.sin(2 * Math.PI * 60 * Math.exp(-beatTime * 30)) * Math.exp(-beatTime * 15);
        }

        // --- Layer 2: Snare (5, 13) ---
        let snare = 0;
        if (s16 === 4 || s16 === 12) {
            const beatTime = time % (sixteenth * 4);
            snare = (Math.random() * 2 - 1) * Math.exp(-beatTime * 12) * 0.4;
        }

        // --- Layer 3: Hi-Hats (Off-beats or sixteenths) ---
        let hat = (Math.random() * 2 - 1) * 0.05;
        const hatEnv = Math.exp(-(time % sixteenth) * 40);
        // Accent on off-beats
        if (s16 % 2 === 1) hat *= 1.5;
        hat *= hatEnv;

        // --- Layer 4: Driving Bassline ---
        const bassNotes = [55, 55, 55, 55, 65, 65, 55, 55, 48, 48, 48, 48, 55, 55, 60, 62];
        const bassBeat = Math.floor(time / (sixteenth * 2)) % 16;
        const bassFreq = bassNotes[bassBeat];
        const bassEnv = Math.exp(-(time % (sixteenth * 2)) * 10);
        const bass = Math.sin(2 * Math.PI * bassFreq * time) * bassEnv * 0.3;

        // --- Layer 5: Arpeggio / Lead ---
        const leadNotes = [110, 130, 165, 130, 220, 165, 260, 165];
        const leadBeat = Math.floor(time / sixteenth) % 8;
        const leadFreq = leadNotes[leadBeat];
        // Only play every second bar for variety
        const isLeadBar = Math.floor(time / bar) % 2 === 0;
        let lead = 0;
        if (isLeadBar) {
            const leadEnv = Math.exp(-(time % sixteenth) * 15);
            lead = Math.sin(2 * Math.PI * leadFreq * time) * leadEnv * 0.15;
            // Add a bit of 'bite' with a square wave hint
            lead += (Math.sin(2 * Math.PI * leadFreq * time) > 0 ? 1 : -1) * leadEnv * 0.05;
        }

        data[i] = (kick + snare + hat + bass + lead) * 0.4;
    }

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.musicGain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 1);
    this.musicGain.connect(this.masterGain);

    this.musicSource = this.ctx.createBufferSource();
    this.musicSource.buffer = buffer;
    this.musicSource.loop = true;
    this.musicSource.connect(this.musicGain);
    this.musicSource.start();
  }

  stopMusic() {
    if (this.musicSource) {
        if (this.musicGain) {
            const t = this.ctx?.currentTime || 0;
            this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, t);
            this.musicGain.gain.linearRampToValueAtTime(0, t + 0.2);
        }
        setTimeout(() => {
            if (this.musicSource) {
                this.musicSource.stop();
                this.musicSource = null;
            }
        }, 200);
    }
  }

  playGameOver() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    
    // Low rumble + falling tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 1.0);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.linearRampToValueAtTime(0, t + 1.0);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.0);

    // Noise burst
    this.playExplosion();
  }
}

export const audio = new AudioController();
