document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const textElement = document.getElementById("casino-text");

    if (!preloader || !textElement) return;

    const targetText =
        textElement.textContent.trim() || "INITIALIZING INFOSPACE";

    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#@&$*";

    // Track character positions, excluding spaces.
    const characterPositions = [];

    for (let i = 0; i < targetText.length; i++) {
        if (targetText[i] !== " ") {
            characterPositions.push(i);
        }
    }

    let revealedCharacters = 0;
    let frame = 0;

    const framesPerCharacter = 4;
    const frameDelay = 50;

    const scrambleInterval = setInterval(() => {
        frame++;

        if (frame % framesPerCharacter === 0) {
            if (revealedCharacters < characterPositions.length) {
                revealedCharacters++;
            }
        }

        let output = "";

        for (let i = 0; i < targetText.length; i++) {
            if (targetText[i] === " ") {
                output += " ";
                continue;
            }

            const position = characterPositions.indexOf(i);

            if (position < revealedCharacters) {
                output += targetText[i];
            } else {
                output += charset[
                    Math.floor(Math.random() * charset.length)
                ];
            }
        }

        textElement.textContent = output;

        // All characters have been revealed.
        if (revealedCharacters >= characterPositions.length) {
            clearInterval(scrambleInterval);

            textElement.textContent = targetText;

            // Allow the completed text to remain visible briefly.
            setTimeout(() => {
                preloader.classList.add("fade-out");
            }, 650);

            // Remove the preloader after its fade transition.
            setTimeout(() => {
                preloader.style.display = "none";
            }, 1900);
        }
    }, frameDelay);
});