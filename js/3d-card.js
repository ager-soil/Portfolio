// Three.js Background Canvas & 3D Interactive Card Tilt/Specular Effect
document.addEventListener('DOMContentLoaded', () => {
  // --- 2. Interactive 3D Trading Card Tilt & Specular Lighting ---
  const card = document.getElementById('trading-card');
  const cardWrapper = document.querySelector('.card-3d-wrapper');

  if (card && cardWrapper) {
    cardWrapper.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    cardWrapper.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
      card.style.transition = 'transform 0.5s ease';
    });

    cardWrapper.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  }
});