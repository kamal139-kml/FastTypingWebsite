
const passages = [
    "Practice every day to improve your typing speed and accuracy. Focus on the words, keep your fingers relaxed, and let your confidence grow with every sentence.",
    "Technology changes the world through creativity, curiosity, and continuous learning. Small improvements every day can lead to extraordinary results in the future.",
    "A great programmer solves problems with patience and logic. Write clean code, test your ideas, learn from mistakes, and never stop exploring new possibilities.",
    "Success is built through consistent effort and smart practice. Stay focused on your goals, celebrate your progress, and remember that every expert started as a beginner.",
    "The keyboard is your tool and practice is your power. Improve your rhythm, learn from every error, and challenge yourself to reach a new personal record.",
    "Learning coding is fun and interesting. Every day gives you a new opportunity to improve your skills and build something amazing."
];

const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");
const durationSelect = document.getElementById("duration");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const errorsDisplay = document.getElementById("errors");
const progress = document.getElementById("progress");
const gameMessage = document.getElementById("gameMessage");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const againBtn = document.getElementById("againBtn");
const resultPanel = document.getElementById("resultPanel");

let targetText = "";
let started = false;
let finished = false;
let startTime = 0;
let endTime = 0;
let timerInterval = null;
let testDuration = Number(durationSelect.value);

// Choose a random passage
function choosePassage() {
    const index = Math.floor(Math.random() * passages.length);
    return passages[index];
}

// Display passage character by character
function preparePassage() {
    targetText = choosePassage();
    textDisplay.replaceChildren();

    for (let i = 0; i < targetText.length; i++) {
        const span = document.createElement("span");
        span.textContent = targetText[i];
        textDisplay.appendChild(span);
    }

    updateHighlights();
}

// Highlight correct and incorrect characters
function updateHighlights() {
    const spans = textDisplay.querySelectorAll("span");
    const typed = typingInput.value;

    spans.forEach((span, index) => {
        span.className = "";

        if (index < typed.length) {
            if (typed[index] === targetText[index]) {
                span.classList.add("correct");
            } else {
                span.classList.add("incorrect");
            }
        }

        if (index === typed.length && !finished) {
            span.classList.add("current");
        }
    });
}

// Calculate typing statistics
function getStats() {
    const typed = typingInput.value;
    let correctChars = 0;
    let errors = 0;

    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === targetText[i]) {
            correctChars++;
        } else {
            errors++;
        }
    }

    const currentTime = started ? Date.now() : endTime;
    const elapsedSeconds = startTime
        ? Math.max(0, (currentTime - startTime) / 1000)
        : 0;

    const minutes = elapsedSeconds / 60;

    const wpm = minutes > 0
        ? Math.round((correctChars / 5) / minutes)
        : 0;

    const accuracy = typed.length > 0
        ? Math.round((correctChars / typed.length) * 100)
        : 100;

    return { correctChars, errors, wpm, accuracy };
}

// Update WPM, accuracy, and errors
function updateStats() {
    const stats = getStats();

    wpmDisplay.textContent = stats.wpm;
    accuracyDisplay.textContent = stats.accuracy + "%";
    errorsDisplay.textContent = stats.errors;
}

// Countdown timer
function updateTimer() {
    if (!started) return;

    const elapsed = (Date.now() - startTime) / 1000;
    const remaining = Math.max(0, testDuration - elapsed);

    timerDisplay.textContent = Math.ceil(remaining);
    progress.style.width =
        (remaining / testDuration) * 100 + "%";

    updateStats();

    if (remaining <= 0) {
        finishTest("Time is up!");
    }
}

// Start the typing test
function startTest() {
    if (started || finished) return;

    testDuration = Number(durationSelect.value);
    started = true;
    startTime = Date.now();

    typingInput.disabled = false;
    durationSelect.disabled = true;

    startBtn.disabled = true;
    startBtn.textContent = "TEST RUNNING...";
    gameMessage.textContent = "Go! Keep typing accurately.";

    typingInput.focus();

    timerInterval = setInterval(updateTimer, 100);
}

// Finish test and show results
function finishTest(message) {
    if (finished) return;

    finished = true;
    started = false;
    endTime = Date.now();

    clearInterval(timerInterval);

    typingInput.disabled = true;
    durationSelect.disabled = false;

    startBtn.disabled = false;
    startBtn.textContent = "START TEST";

    updateHighlights();
    updateStats();

    const stats = getStats();

    document.getElementById("finalWpm").textContent =
        stats.wpm + " WPM";

    document.getElementById("finalAccuracy").textContent =
        stats.accuracy + "%";

    document.getElementById("finalCorrect").textContent =
        stats.correctChars;

    document.getElementById("finalErrors").textContent =
        stats.errors;

    gameMessage.textContent = message;
    resultPanel.hidden = false;
}

// Reset and select another random passage
function resetTest() {
    clearInterval(timerInterval);

    started = false;
    finished = false;
    startTime = 0;
    endTime = 0;

    testDuration = Number(durationSelect.value);

    typingInput.value = "";
    typingInput.disabled = true;
    durationSelect.disabled = false;

    timerDisplay.textContent = testDuration;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    errorsDisplay.textContent = "0";

    progress.style.width = "100%";

    gameMessage.textContent = "Press START TEST to begin.";

    startBtn.disabled = false;
    startBtn.textContent = "START TEST";

    resultPanel.hidden = true;

    preparePassage();
}

// Track typing
typingInput.addEventListener("input", function () {
    if (!started || finished) return;

    if (typingInput.value.length > targetText.length) {
        typingInput.value =
            typingInput.value.slice(0, targetText.length);
    }

    updateHighlights();
    updateStats();

    if (typingInput.value === targetText) {
        finishTest("Passage completed!");
    }
});

// Button connections
startBtn.addEventListener("click", startTest);
restartBtn.addEventListener("click", resetTest);
againBtn.addEventListener("click", resetTest);

// Reset when duration changes
durationSelect.addEventListener("change", resetTest);

// Display current year if the HTML contains this element
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Initialize the game
resetTest();
