
/* =========================================
   DIGITAL RAIN BACKGROUND
   Deep Blue + Sky Blue Sci-Fi Theme
   ========================================= */

(() => {
    "use strict";

    const canvas = document.createElement("canvas");
    canvas.id = "digital-rain";

    const ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true
    });

    if (!ctx) return;

    document.body.prepend(canvas);

    let width = 0;
    let height = 0;
    let animationId = null;
    let lastTime = 0;
    let layers = [];

    const COLORS = {
        main: "#78C8FF",
        bright: "#A5E5FF",
        glow: "#318BDA"
    };

    // Create one layer of falling digital streams.
    function createLayer(config) {
        const columns = [];
        const spacing = config.fontSize * config.spacing;

        for (let x = 0; x < width + spacing; x += spacing) {
            columns.push({
                x,
                y: Math.random() * height,
                speed: config.speed * (0.7 + Math.random() * 0.7),
                length: Math.floor(
                    config.minLength +
                    Math.random() * (config.maxLength - config.minLength)
                ),
                fontSize: config.fontSize,
                opacity: config.opacity * (0.65 + Math.random() * 0.7),
                drift: (Math.random() - 0.5) * config.drift,
                phase: Math.random() * Math.PI * 2,
                flicker: Math.random() * 0.5 + 0.5
            });
        }

        return { columns, config };
    }

    function rebuildLayers() {
        layers = [
            // Far layer: tiny, faint, fast streams
            createLayer({
                fontSize: 9,
                spacing: 1.5,
                speed: 0.65,
                opacity: 0.24,
                minLength: 10,
                maxLength: 22,
                drift: 3
            }),

            // Middle layer: main digital rain
            createLayer({
                fontSize: 12,
                spacing: 1.8,
                speed: 1.05,
                opacity: 0.36,
                minLength: 12,
                maxLength: 25,
                drift: 5
            }),

            // Front layer: larger, softer glowing streams
            createLayer({
                fontSize: 16,
                spacing: 2.2,
                speed: 1.35,
                opacity: 0.20,
                minLength: 8,
                maxLength: 17,
                drift: 7
            })
        ];
    }

    function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        rebuildLayers();
    }

    function drawStream(column, time, delta) {
        const {
            fontSize,
            length,
            opacity,
            speed,
            drift,
            phase,
            flicker
        } = column;

        const wave = Math.sin(time * 0.00045 + phase);

        // Gentle sideways movement gives the streams a slight twist.
        const x = column.x + wave * drift;

        column.y += speed * delta * 0.06;

        const step = fontSize * 1.15;

        ctx.font = `${fontSize}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < length; i++) {
            const charY = column.y - i * step;

            if (charY < -fontSize || charY > height + fontSize) {
                continue;
            }

            const fade = 1 - i / length;
            const alpha = opacity * fade * flicker;

            // A little character variation makes the rain feel alive.
            const digit = Math.random() > 0.5 ? "1" : "0";

            ctx.globalAlpha = alpha;

            if (i === 0) {
                // Bright leading character.
                ctx.fillStyle = COLORS.bright;
                ctx.shadowColor = COLORS.glow;
                ctx.shadowBlur = 12;
            } else {
                // Softer blue characters trailing behind.
                ctx.fillStyle = COLORS.main;
                ctx.shadowBlur = 0;
            }

            ctx.fillText(digit, x, charY);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Reset the stream after it has completely fallen away.
        if (column.y - length * step > height) {
            column.y = -Math.random() * height * 0.5;
            column.length = Math.floor(10 + Math.random() * 18);
            column.opacity *= 0.75 + Math.random() * 0.5;
        }
    }

    function animate(time) {
        if (!lastTime) lastTime = time;

        const delta = Math.min(time - lastTime, 40);
        lastTime = time;

        // Clear only the canvas, preserving the original page background.
        ctx.clearRect(0, 0, width, height);

        for (const layer of layers) {
            for (const column of layer.columns) {
                drawStream(column, time, delta);
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationId !== null) return;
        lastTime = 0;
        animationId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Pause when the browser tab is not visible.
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();

        startAnimation();
})();
