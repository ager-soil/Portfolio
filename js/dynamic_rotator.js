// Dynamic Text Rotator using GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
  const roles = [
    "Geoinformatics Specialist",
    "AgTech Developer",
    "Web Developer",
    "System Simulator",
    "Hydroponics Enthusiast"
  ];

  const rotatorElem = document.getElementById('role-rotator');
  let currentIdx = 0;

  if (rotatorElem && typeof gsap !== 'undefined') {
    const rotateText = () => {
      gsap.to(rotatorElem, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          currentIdx = (currentIdx + 1) % roles.length;
          rotatorElem.textContent = roles[currentIdx];
          gsap.fromTo(
            rotatorElem,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }
      });
    };

    // Change text every 3 seconds
    setInterval(rotateText, 3000);
  }
});