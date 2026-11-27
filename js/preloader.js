document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const textElement = document.getElementById("casino-text");
    const progressFill = document.querySelector(".preloader-progress-fill");
    const percentElement = document.querySelector(".preloader-percent");

    if (!preloader || !textElement) return;

    const targetText = textElement.textContent.trim() || "INITIALIZING INFOSPACE";
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#@&$*";
    const characterPositions = [];

    for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] !== " ") characterPositions.push(i);
    }

    let revealedCharacters = 0;
    let frame = 0;
    const framesPerCharacter = 2;
    const frameDelay = 34;

    const scrambleInterval = setInterval(() => {
        frame++;
        if (frame % framesPerCharacter === 0 && revealedCharacters < characterPositions.length) {
            revealedCharacters++;
        }

        let output = "";
        for (let i = 0; i < targetText.length; i++) {
            if (targetText[i] === " ") {
                output += " ";
                continue;
            }
            const position = characterPositions.indexOf(i);
            output += position < revealedCharacters
                ? targetText[i]
                : charset[Math.floor(Math.random() * charset.length)];
        }

        textElement.textContent = output;

        const progress = Math.min(100, Math.round((revealedCharacters / characterPositions.length) * 100));
        if (progressFill) progressFill.style.width = progress + "%";
        if (percentElement) percentElement.textContent = String(progress).padStart(2, "0") + "%";

        if (revealedCharacters >= characterPositions.length) {
            clearInterval(scrambleInterval);
            textElement.textContent = targetText;
            if (progressFill) progressFill.style.width = "100%";
            if (percentElement) percentElement.textContent = "100%";

            preloader.classList.add("sequence-complete");
            setTimeout(() => preloader.classList.add("fade-out"), 700);
            setTimeout(() => { preloader.style.display = "none"; }, 1700);
        }
    }, frameDelay);
});