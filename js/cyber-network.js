
/* =========================================================
   CYBER NETWORK PARTICLE ENGINE
   Independent 2D canvas background for the Infospace portfolio.
   Does not reuse #bg-canvas (reserved for the existing Three.js
   scene) and does not require any external library.
   ========================================================= */

(() => {
    "use strict";

    const CONFIG = {
        desktopDensity: 0.000085,
        mobileDensity: 0.000052,
        minParticles: 34,
        maxParticles: 105,
        connectionDistance: 148,
        mouseRadius: 190,
        speed: 0.34,
        pulseChance: 0.0018,
        maxDpr: 1.7
    };

    const reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Create a dedicated canvas layer.
    const canvas = document.createElement("canvas");
    canvas.id = "cyber-network-canvas";
    canvas.setAttribute("aria-hidden", "true");

    Object.assign(canvas.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: "-1",
        opacity: "0.94"
    });

    const mount = () => {
        if (!document.body || document.getElementById(canvas.id)) return;
        document.body.prepend(canvas);
    };

    if (document.body) mount();
    else document.addEventListener("DOMContentLoaded", mount, { once: true });

    const ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true
    });

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationId = 0;
    let lastTime = 0;
    let pulseClock = 0;
    let isVisible = !document.hidden;

    const pointer = {
        x: -10000,
        y: -10000,
        active: false
    };

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    class Particle {
        constructor() {
            this.x = random(0, width);
            this.y = random(0, height);

            this.vx = random(-CONFIG.speed, CONFIG.speed);
            this.vy = random(-CONFIG.speed, CONFIG.speed);

            this.radius = random(1.05, 2.15);
            this.phase = random(0, Math.PI * 2);
            this.twinkle = random(0.65, 1);
        }

        update(delta) {
            const step = Math.min(delta / 16.67, 2.2);

            this.x += this.vx * step;
            this.y += this.vy * step;

            this.phase += 0.018 * step;

            // Gentle pointer influence.
            if (pointer.active) {
                const dx = pointer.x - this.x;
                const dy = pointer.y - this.y;
                const distance = Math.hypot(dx, dy);

                if (distance > 0 && distance < CONFIG.mouseRadius) {
                    const force =
                        (1 - distance / CONFIG.mouseRadius) *
                        0.012 * step;

                    this.vx += (dx / distance) * force;
                    this.vy += (dy / distance) * force;
                }
            }

            // Keep movement calm and bounded.
            this.vx *= 0.999;
            this.vy *= 0.999;

            const velocity = Math.hypot(this.vx, this.vy);
            const maxSpeed = 0.72;

            if (velocity > maxSpeed) {
                this.vx = (this.vx / velocity) * maxSpeed;
                this.vy = (this.vy / velocity) * maxSpeed;
            }

            const margin = 12;

            if (this.x < -margin) this.x = width + margin;
            else if (this.x > width + margin) this.x = -margin;

            if (this.y < -margin) this.y = height + margin;
            else if (this.y > height + margin) this.y = -margin;
        }

        draw() {
            const glow = 0.72 + Math.sin(this.phase) * 0.2;

            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(104, 220, 255, ${glow * this.twinkle})`;

            ctx.shadowColor = "rgba(0, 205, 255, 0.8)";
            ctx.shadowBlur = 8;

            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    const createParticles = () => {
        const density = width < 700
            ? CONFIG.mobileDensity
            : CONFIG.desktopDensity;

        const count = Math.max(
            CONFIG.minParticles,
            Math.min(
                CONFIG.maxParticles,
                Math.round(width * height * density)
            )
        );

        particles = Array.from(
            { length: count },
            () => new Particle()
        );
    };

    const resize = () => {
        const oldWidth = width || window.innerWidth;
        const oldHeight = height || window.innerHeight;

        width = Math.max(1, window.innerWidth);
        height = Math.max(1, window.innerHeight);

        dpr = Math.min(
            window.devicePixelRatio || 1,
            CONFIG.maxDpr
        );

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Preserve approximate particle positions.
        if (particles.length) {
            const sx = width / oldWidth;
            const sy = height / oldHeight;

            particles.forEach(p => {
                p.x *= sx;
                p.y *= sy;
            });
        }

        createParticles();
    };

    const drawConnections = () => {
        const maxDistance = CONFIG.connectionDistance;
        const maxDistanceSquared = maxDistance * maxDistance;

        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];

            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;

                const distanceSquared = dx * dx + dy * dy;

                if (distanceSquared > maxDistanceSquared) continue;

                const distance = Math.sqrt(distanceSquared);
                const proximity = 1 - distance / maxDistance;
                const alpha = proximity * 0.31;

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    `rgba(52, 190, 238, ${alpha})`;

                ctx.lineWidth = 0.65 + proximity * 0.45;
                ctx.stroke();
            }
        }

        // Interactive network around the pointer.
        if (pointer.active) {
            for (const p of particles) {
                const distance = Math.hypot(
                    pointer.x - p.x,
                    pointer.y - p.y
                );

                if (distance >= CONFIG.mouseRadius) continue;

                const alpha =
                    (1 - distance / CONFIG.mouseRadius) * 0.38;

                ctx.beginPath();
                ctx.moveTo(pointer.x, pointer.y);
                ctx.lineTo(p.x, p.y);

                ctx.strokeStyle =
                    `rgba(93, 235, 255, ${alpha})`;

                ctx.lineWidth = 0.8;
                ctx.stroke();
            }

            const gradient = ctx.createRadialGradient(
                pointer.x,
                pointer.y,
                0,
                pointer.x,
                pointer.y,
                58
            );

            gradient.addColorStop(
                0,
                "rgba(42, 205, 255, 0.10)"
            );

            gradient.addColorStop(
                1,
                "rgba(42, 205, 255, 0)"
            );

            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.arc(
                pointer.x,
                pointer.y,
                58,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    };

    const drawDataPulse = (delta) => {
        pulseClock += delta;

        if (pulseClock < 16) return;
        pulseClock = 0;

        // Moving cyan signals between connected particles.
        if (
            Math.random() >
            CONFIG.pulseChance * (delta / 16.67)
        ) return;

        const aIndex = Math.floor(
            Math.random() * particles.length
        );

        const a = particles[aIndex];

        let nearest = null;
        let nearestDistance = CONFIG.connectionDistance;

        for (let i = 0; i < particles.length; i++) {
            if (i === aIndex) continue;

            const b = particles[i];

            const distance = Math.hypot(
                b.x - a.x,
                b.y - a.y
            );

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = b;
            }
        }

        if (!nearest) return;

        const t = Math.random();

        const x = a.x + (nearest.x - a.x) * t;
        const y = a.y + (nearest.y - a.y) * t;

        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(190, 250, 255, 0.98)";
        ctx.shadowColor = "rgba(0, 220, 255, 0.95)";
        ctx.shadowBlur = 12;

        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const render = (time) => {
        if (!isVisible) return;

        const delta = lastTime
            ? Math.min(time - lastTime, 40)
            : 16.67;

        lastTime = time;

        ctx.clearRect(0, 0, width, height);

        if (!reduceMotion) {
            for (const particle of particles) {
                particle.update(delta);
            }
        }

        drawConnections();

        for (const particle of particles) {
            particle.draw();
        }

        if (!reduceMotion) {
            drawDataPulse(delta);
        }

        animationId = window.requestAnimationFrame(render);
    };

    const start = () => {
        if (animationId || !isVisible) return;

        lastTime = 0;
        animationId = window.requestAnimationFrame(render);
    };

    const stop = () => {
        if (!animationId) return;

        window.cancelAnimationFrame(animationId);
        animationId = 0;
    };

    const handleVisibility = () => {
        isVisible = !document.hidden;

        if (isVisible) start();
        else stop();
    };

    window.addEventListener("resize", resize, {
        passive: true
    });

    window.addEventListener("pointermove", event => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = true;
    }, {
        passive: true
    });

    window.addEventListener("pointerleave", () => {
        pointer.active = false;
    }, {
        passive: true
    });

    window.addEventListener("blur", () => {
        pointer.active = false;
    });

    document.addEventListener(
        "visibilitychange",
        handleVisibility
    );

    resize();
    start();

})();
