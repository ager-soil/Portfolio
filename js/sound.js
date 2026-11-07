// ==========================================
// MODULAR SOUND ENGINE (sound.js) - ZERO DELAY
// ==========================================

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isInitialized = false;
    this.masterGain = null;
    this.droneGain = null;
    this.isDronePlaying = false;
  }

  // Initialize Web Audio Context immediately
  init() {
    if (this.isInitialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Master Gain Node set to high volume (0.85 = maximum safe volume)
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked.");
    }
  }

  // 1. Instant Preloader "Tick-Tick-Tick" Sound (No Delay)
  playPreloaderTick() {
    this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Sharp high-tech mechanical tick
    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.025);
  }

  // 2. Continuous Cosmic Space "Om" Ambient Drone
  startSpaceOmDrone() {
    this.init();
    if (!this.audioCtx || this.isDronePlaying) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Sacred "Om" Cosmic Harmonic Frequencies (108Hz Sub-Bass + 432Hz Resonance)
    const oscRoot = this.audioCtx.createOscillator();
    const oscOm = this.audioCtx.createOscillator();
    const oscFifth = this.audioCtx.createOscillator();

    this.droneGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    // Fundamental Cosmic Bass (108 Hz - Sacred Om Sub-Tone)
    oscRoot.type = 'sine';
    oscRoot.frequency.setValueAtTime(108.00, this.audioCtx.currentTime);

    // Warm Cosmic Resonance (432 Hz - Om Tuning Frequency)
    oscOm.type = 'triangle';
    oscOm.frequency.setValueAtTime(432.00, this.audioCtx.currentTime);

    // Deep Cosmic Harmonic Fifth (162 Hz)
    oscFifth.type = 'sine';
    oscFifth.frequency.setValueAtTime(162.00, this.audioCtx.currentTime);

    // Set high gain for loud background presence
    this.droneGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    this.droneGain.gain.exponentialRampToValueAtTime(0.65, this.audioCtx.currentTime + 1.5); // Smooth fade-in

    // Lowpass warmth filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.audioCtx.currentTime);

    oscRoot.connect(filter);
    oscOm.connect(filter);
    oscFifth.connect(filter);

    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    oscRoot.start();
    oscOm.start();
    oscFifth.start();

    this.isDronePlaying = true;
  }

  // 3. Interactive Hover Sound Effect
  playHover() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  // 4. Interactive Click Sound Effect
  playClick() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(750, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, this.audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.12);
  }

  // Custom Sound Helper for future expansion
  playCustomSound(freq = 440, type = 'sine', duration = 0.2) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }
}

// Global Sound Engine Instance
const sounds = new SoundEngine();

// Zero-delay initialization and instant listener attachments
document.addEventListener('DOMContentLoaded', () => {
  sounds.init();

  // Instant unlock on any interaction (bypasses browser autoplay restrictions immediately)
  const unlockAudio = () => {
    sounds.init();
    if (sounds.audioCtx && sounds.audioCtx.state === 'suspended') {
      sounds.audioCtx.resume();
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);

  // Attach hover and click sounds directly
  document.querySelectorAll('a, button, .card-3d, .skill-pill, .filter-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => sounds.playHover());
    elem.addEventListener('click', () => sounds.playClick());
  });
});