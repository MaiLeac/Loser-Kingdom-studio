// Web Audio API Synthesizer for high-impact psychological sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private speechVersion = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) this.stopAll();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Air-raid siren sound effect with oscillating pitch
  public playSiren(durationMs: number = 3000) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    
    // Siren pitch cycling
    const cycles = Math.floor(durationMs / 600);
    for (let i = 0; i < cycles; i++) {
      const cycleStart = now + (i * 0.6);
      osc.frequency.linearRampToValueAtTime(850, cycleStart + 0.3);
      osc.frequency.linearRampToValueAtTime(450, cycleStart + 0.6);
    }

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  // Jumpscare deep bass drop & high screech
  public playJumpscare() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub bass drop
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.2);

    // High shriek distortion
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'sawtooth';
    highOsc.frequency.setValueAtTime(800, now);
    highOsc.frequency.linearRampToValueAtTime(1600, now + 0.1);
    highOsc.frequency.linearRampToValueAtTime(400, now + 0.5);

    highGain.gain.setValueAtTime(0.3, now);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(now);
    highOsc.stop(now + 0.6);
  }

  // Digital glitch burst
  public playGlitch() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
      osc.frequency.setValueAtTime(120 + Math.random() * 900, now + i * 0.07);
      gain.gain.setValueAtTime(0.2, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + (i + 1) * 0.07);
    }
  }

  // Harsh rejection buzzer
  public playBuzzer() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.setValueAtTime(95, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Success triumph chime
  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.2, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.4);
    });
  }

  // Tension ticking
  public playTick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public stopAll() {
    this.speechVersion++;
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.suspend();
      } catch (e) {}
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  // Never substitute an English voice when Vietnamese is unavailable.
  public async speakRoast(text: string) {
    if (this.isMuted) return;
    const status = (message: string) => window.dispatchEvent(new CustomEvent('voice-status', {detail: message}));
    if (!('speechSynthesis' in window)) { status('Thiết bị chưa hỗ trợ đọc giọng Việt.'); return; }
    const synth = window.speechSynthesis;
    const version = ++this.speechVersion;
    synth.cancel();
    if (!synth.getVoices().length) await new Promise<void>(resolve => {
      const finish = () => {clearTimeout(timer); synth.removeEventListener('voiceschanged', finish); resolve();};
      const timer = setTimeout(finish, 1800);
      synth.addEventListener('voiceschanged', finish);
    });
    if (version !== this.speechVersion || this.isMuted) return;
    const voice = synth.getVoices().find(v => /^vi(?:-|_|$)/i.test(v.lang));
    if (!voice) { status('Thiết bị chưa có giọng tiếng Việt. Nội dung vẫn hiển thị; không dùng giọng Anh thay thế.'); return; }
    status('');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onerror = () => status('Chưa đọc được giọng Việt. Bạn có thể thử nghe lại.');
    synth.speak(utterance);
  }
}
export const sound = new SoundEngine();
