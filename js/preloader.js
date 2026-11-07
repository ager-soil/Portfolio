// Casino Decrypting Preloader & Web Audio API Space Sound Engine
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const casinoTextElem = document.getElementById('casino-text');
  
  const targetText = "INITIALIZING WORKSPACE";
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#@&$*";
  
  let frame = 0;
  const totalFramesPerChar = 4;
  let revealedChars = 0;

  // --- 1. Silent Casino Scramble Animation ---
  const scrambleInterval = setInterval(() => {
    if (!casinoTextElem) return;

    let output = "";
    
    for (let i = 0; i < targetText.length; i++) {
      if (targetText[i] === " ") {
        output += " ";
        continue;
      }
      
      if (i < revealedChars) {
        output += targetText[i];
      } else {
        const randomChar = charset[Math.floor(Math.random() * charset.length)];
        output += randomChar;
      }
    }

    casinoTextElem.textContent = output;

    frame++;
    if (frame % totalFramesPerChar === 0) {
      revealedChars++;
    }

    if (revealedChars > targetText.length) {
      clearInterval(scrambleInterval);
      casinoTextElem.textContent = targetText;
      
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
        }
      }, 500);
    }
  }, 50);

  // --- 2. Ambient Deep Space Audio Synthesizer ---
  let audioCtx = null;
  let spaceDroneOsc1 = null;
  let spaceDroneOsc2 = null;
  let noiseFilter = null;
  let isAudioPlaying = false;

  const initSpaceAudio = () => {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Deep Sub Space Drone (Low Sine Wave)
    spaceDroneOsc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    spaceDroneOsc1.type = 'sine';
    spaceDroneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 pitch
    gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);

    // Cosmic Atmosphere Resonance (Subtle Slow LFO Detune)
    spaceDroneOsc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    spaceDroneOsc2.type = 'triangle';
    spaceDroneOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);
    gain2.gain.setValueAtTime(0.03, audioCtx.currentTime);

    // Lowpass filter to simulate cosmic vacuum rumble
    noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(220, audioCtx.currentTime);

    spaceDroneOsc1.connect(gain1);
    spaceDroneOsc2.connect(gain2);
    gain1.connect(noiseFilter);
    gain2.connect(noiseFilter);
    noiseFilter.connect(audioCtx.destination);

    spaceDroneOsc1.start();
    spaceDroneOsc2.start();
    isAudioPlaying = true;
  };

  // UI Interactive Sound Effects (Hover & Click Space Blips)
  window.playUiSound = (type) => {
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    }
  };

  // Sound Toggle Controls
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (!audioCtx) {
        initSpaceAudio();
        if (soundIcon) soundIcon.className = "fa-solid fa-volume-high";
      } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        isAudioPlaying = true;
        if (soundIcon) soundIcon.className = "fa-solid fa-volume-high";
      } else if (audioCtx.state === 'running') {
        audioCtx.suspend();
        isAudioPlaying = false;
        if (soundIcon) soundIcon.className = "fa-solid fa-volume-xmark";
      }
    });
  }

  // Attach hover/click sound listeners to links and buttons across the portfolio
  document.querySelectorAll('a, button, .card-3d, .skill-pill').forEach(elem => {
    elem.addEventListener('mouseenter', () => window.playUiSound('hover'));
    elem.addEventListener('click', () => window.playUiSound('click'));
  });
});