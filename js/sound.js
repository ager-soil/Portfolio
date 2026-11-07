// ==========================================
// MODULAR SOUND ENGINE (sound.js)
// Easily add or modify sounds in the future!
// ==========================================

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isInitialized = false;
    this.masterGain = null;
  }

  // Initialize Web Audio Context with higher volume master gain
  init() {
    if (this.isInitialized) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      // Master Gain Node set to high volume (louder sound)
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.audioCtx.currentTime); // Volume level (0.0 to 1.0)
      this.masterGain.connect(this.audioCtx.destination);

      this.isInitialized = true;
      this.startAmbientSpaceDrone();
    } catch (e) {
      console.warn("Web Audio API not supported or blocked.");
    }
  }

  // 1. Ambient Space Drone (Autoplays on website load)
  startAmbientSpaceDrone() {
    if (!this.audioCtx) return;

    // Dual-oscillator deep cosmic space drone for rich atmosphere
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const droneGain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc1.type = 'sawtooth'; 
    osc1.frequency.setValueAtTime(65.41, this.audioCtx.currentTime); // C2 note

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(130.81, this.audioCtx.currentTime); // C3 note

    droneGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
  }

  // 2. UI Interactive Hover Sound Effect
  playHover() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  // 3. UI Interactive Click Sound Effect
  playClick() {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(261.63, this.audioCtx.currentTime + 0.15); // C4

    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.15);
  }

  // ==========================================
  // FUTURE-PROOFING: Add any new sound easily!
  // ==========================================
  playCustomSound(freq = 440, type = 'sine', duration = 0.2) {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }
}

// Global Sound Engine Instance
const sounds = new SoundEngine();

// Auto-initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  sounds.init();

  // Browser Autoplay Policy Bypass: Unlocks audio instantly on the user's first click or keystroke anywhere on the page
  const unlockAudio = () => {
    sounds.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);

  // Automatically attach hover and click sounds to all interactive UI components
  setTimeout(() => {
    document.querySelectorAll('a, button, .card-3d, .skill-pill, .filter-btn').forEach(elem => {
      elem.addEventListener('mouseenter', () => sounds.playHover());
      elem.addEventListener('click', () => sounds.playClick());
    });
  }, 1000);
});