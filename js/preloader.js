// Advanced Animated Rotating Text Preloader with Web Audio API Sound Effects
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const rotatingLoaderText = document.getElementById('preloader-rotating-text');
  
  if (!preloader) return;

  const loadingPhrases = [
    "Initializing Geoinformatics Systems...",
    "Calibrating Hydroponics Telemetry...",
    "Loading Smart Climate Ag Modules...",
    "Compiling Web Development Assets...",
    "Welcome to AgTech Portfolio."
  ];

  let phraseIdx = 0;

  // Web Audio API Synthesizer for Sound Effects (Zero external audio files required!)
  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'complete') {
        // Uplifting chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Audio context safeguard
    }
  };

  // Rotate preloader text every 700ms
  const textInterval = setInterval(() => {
    phraseIdx++;
    if (phraseIdx < loadingPhrases.length) {
      if (rotatingLoaderText) {
        rotatingLoaderText.style.opacity = 0;
        setTimeout(() => {
          rotatingLoaderText.textContent = loadingPhrases[phraseIdx];
          rotatingLoaderText.style.opacity = 1;
        }, 150);
      }
      playSound('tick');
    } else {
      clearInterval(textInterval);
      playSound('complete');
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 400);
    }
  }, 700);
});