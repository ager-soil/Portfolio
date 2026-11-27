// Responsive 3D profile-card tilt for mouse, pen, and continuous touch input.
document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('trading-card');
  const wrapper = document.querySelector('.card-3d-wrapper');
  if (!card || !wrapper) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    card.style.transform = 'none';
    return;
  }

  let frame = 0;
  let pointerX = 50;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let active = false;
  let activeTouch = false;

  const render = () => {
    frame = 0;
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    card.style.transform = 'perspective(1100px) rotateX(' + currentX.toFixed(2) +
      'deg) rotateY(' + currentY.toFixed(2) + 'deg)';
    card.style.setProperty('--mouse-x', pointerX + '%');
    card.style.setProperty('--mouse-y', pointerY + '%');

    if (active || Math.abs(currentX) > 0.04 || Math.abs(currentY) > 0.04) {
      frame = window.requestAnimationFrame(render);
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const trackPointer = event => {
    const rect = card.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pointerX = x * 100;
    pointerY = y * 100;
    targetX = (0.5 - y) * 12;
    targetY = (x - 0.5) * 12;
    active = true;
    schedule();
  };

  wrapper.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' && !activeTouch) return;
    trackPointer(event);
  }, { passive: true });

  wrapper.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    activeTouch = true;
    active = true;
    if (wrapper.setPointerCapture) wrapper.setPointerCapture(event.pointerId);
    trackPointer(event);
  }, { passive: true });

  const reset = () => {
    active = false;
    activeTouch = false;
    targetX = 0;
    targetY = 0;
    schedule();
  };

  wrapper.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch') reset();
  }, { passive: true });
  wrapper.addEventListener('pointercancel', reset, { passive: true });
  wrapper.addEventListener('lostpointercapture', reset, { passive: true });
  wrapper.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch') reset();
  }, { passive: true });
});
