// ==========================================
// MODULAR SOUND ENGINE (sound.js) - MAX VOLUME
// ==========================================

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isInitialized = false;
    this.masterGain = null;
  }

  // Initialize Web Audio Context with maximum volume gain
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
      this.startAmbientSpaceDrone();
    } catch (e) {
      console.warn("Web Audio API not supported or blocked.");
    }
  }

  // 1. Loud Ambient Space Drone (Autoplays background space sound)
  startAmbientSpaceDrone() {
    if (!this.audioCtx) return;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const osc3 = this.audioCtx.createOscillator();
    const droneGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc1.type = 'sawtooth'; 
    osc1.frequency.setValueAtTime(55.00, this.audioCtx.currentTime); // A1 note

    osc2.type = 'square'; 
    osc2.frequency.setValueAtTime(110.00, this.audioCtx.currentTime); // A2 note

    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(82.41, this.audioCtx.currentTime); // E2 note

    droneGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime); 

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();
  }

  // 2. Distinct Preloader "Tick-Tick-Tick" Sound
  playPreloaderTick() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    // Sharp metallic clock/gear tick
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.03);
  }

  // 3. High-Volume UI Interactive Hover Sound
  playHover() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioCtx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  // 4. High-Volume UI Interactive Click Sound
  playClick() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.45, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  // Future-proofing custom sound method
  playCustomSound(freq = 440, type = 'sine', duration = 0.2) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }
}

// Global Sound Engine Instance
const sounds = new SoundEngine();

// Auto-initialize on page load with browser policy unlock safeguards
window.addEventListener('DOMContentLoaded', () => {
  sounds.init();

  const unlockAudio = () => {
    sounds.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  setTimeout(() => {
    document.querySelectorAll('a, button, .card-3d, .skill-pill, .filter-btn').forEach(elem => {
      elem.addEventListener('mouseenter', () => sounds.playHover());
      elem.addEventListener('click', () => sounds.playClick());
    });
  }, 1000);
});