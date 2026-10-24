const STORAGE_KEY = "bubbleRushBestScore";

const DIFFICULTY_SETTINGS = {
  easy: {
    label: "Easy",
    timer: 45,
    bubbleCount: 36,
    columns: 6,
    bubbleSize: "3.85rem",
  },
  medium: {
    label: "Medium",
    timer: 30,
    bubbleCount: 54,
    columns: 8,
    bubbleSize: "3.15rem",
  },
  hard: {
    label: "Hard",
    timer: 20,
    bubbleCount: 72,
    columns: 9,
    bubbleSize: "2.7rem",
  },
};

let currentDifficulty = "medium";
let gameState = "ready";
let score = 0;
let targetNumber = 0;
let remainingTime = DIFFICULTY_SETTINGS[currentDifficulty].timer;
let attempts = 0;
let correctHits = 0;
let timerId = null;
let bestScore = loadHighScore();

const elements = {
  welcomeScreen: document.getElementById("welcomeScreen"),
  gameScreen: document.getElementById("gameScreen"),
  gameOverScreen: document.getElementById("gameOverScreen"),
  welcomeBestScore: document.getElementById("welcomeBestScore"),
  startGameBtn: document.getElementById("startGameBtn"),
  board: document.getElementById("board"),
  hitValue: document.getElementById("hitValue"),
  timerValue: document.getElementById("timerValue"),
  scoreValue: document.getElementById("scoreValue"),
  difficultyBadge: document.getElementById("difficultyBadge"),
  statusText: document.getElementById("statusText"),
  finalScore: document.getElementById("finalScore"),
  resultBestScore: document.getElementById("resultBestScore"),
  correctHits: document.getElementById("correctHits"),
  totalAttempts: document.getElementById("totalAttempts"),
  accuracyValue: document.getElementById("accuracyValue"),
  resultDifficulty: document.getElementById("resultDifficulty"),
  resultTitle: document.getElementById("resultTitle"),
  resultMessage: document.getElementById("resultMessage"),
  playAgainBtn: document.getElementById("playAgainBtn"),
  homeBtn: document.getElementById("homeBtn"),
  difficultyButtons: Array.from(document.querySelectorAll(".difficulty-btn")),
};

function loadHighScore() {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = Number(rawValue);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return 0;
    }

    return Math.floor(parsedValue);
  } catch (error) {
    return 0;
  }
}

function saveHighScore(newScore) {
  try {
    const previousBest = loadHighScore();

    if (newScore > previousBest) {
      bestScore = newScore;
      window.localStorage.setItem(STORAGE_KEY, String(newScore));
      updateBestScoreDisplay();
      return true;
    }

    bestScore = previousBest;
    updateBestScoreDisplay();
    return false;
  } catch (error) {
    updateBestScoreDisplay();
    return false;
  }
}

function updateBestScoreDisplay() {
  elements.welcomeBestScore.textContent = String(bestScore);
  elements.resultBestScore.textContent = String(bestScore);
}

function showScreen(screenName) {
  const screens = {
    welcome: elements.welcomeScreen,
    game: elements.gameScreen,
    gameOver: elements.gameOverScreen,
  };

  Object.entries(screens).forEach(([name, screen]) => {
    screen.hidden = name !== screenName;
  });
}

function clearTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateScore() {
  elements.scoreValue.textContent = String(score);
}

function updateHitValue() {
  elements.hitValue.textContent = String(targetNumber);
}

function updateTimerDisplay() {
  elements.timerValue.textContent = String(Math.max(0, remainingTime));
}

function setDifficulty(level) {
  const selectedDifficulty = DIFFICULTY_SETTINGS[level] || DIFFICULTY_SETTINGS.medium;
  currentDifficulty = level;
  remainingTime = selectedDifficulty.timer;
  updateTimerDisplay();
  elements.difficultyBadge.textContent = selectedDifficulty.label;
  elements.resultDifficulty.textContent = selectedDifficulty.label;

  elements.difficultyButtons.forEach((button) => {
    const isActive = button.dataset.difficulty === level;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (elements.board) {
    elements.board.style.setProperty("--grid-columns", String(selectedDifficulty.columns));
    elements.board.style.setProperty("--bubble-size", selectedDifficulty.bubbleSize);
  }
}

function getNewHit() {
  targetNumber = Math.floor(Math.random() * 10);
  updateHitValue();
}

function makeBubble() {
  const selectedDifficulty = DIFFICULTY_SETTINGS[currentDifficulty];
  const fragment = document.createDocumentFragment();

  elements.board.style.setProperty("--grid-columns", String(selectedDifficulty.columns));
  elements.board.style.setProperty("--bubble-size", selectedDifficulty.bubbleSize);

  for (let index = 0; index < selectedDifficulty.bubbleCount; index += 1) {
    const value = Math.floor(Math.random() * 10);
    const bubble = document.createElement("button");

    bubble.type = "button";
    bubble.className = "bubble";
    bubble.type = "button";
    bubble.textContent = String(value);
    bubble.dataset.value = String(value);
    bubble.setAttribute("aria-label", `Bubble number ${value}`);
    bubble.tabIndex = 0;
    fragment.appendChild(bubble);
  }

  elements.board.replaceChildren(fragment);
}

function resetGame() {
  clearTimer();
  score = 0;
  attempts = 0;
  correctHits = 0;
  targetNumber = 0;
  remainingTime = DIFFICULTY_SETTINGS[currentDifficulty].timer;
  updateScore();
  updateTimerDisplay();
  updateHitValue();
  elements.statusText.textContent = "Ready to play";
  elements.resultTitle.textContent = "Game Over";
}

function endGame(reason) {
  if (gameState === "gameOver") {
    return;
  }

  gameState = "gameOver";
  clearTimer();

  const isNewRecord = saveHighScore(score);
  const accuracy = attempts > 0 ? (correctHits / attempts) * 100 : 0;

  elements.finalScore.textContent = String(score);
  elements.correctHits.textContent = String(correctHits);
  elements.totalAttempts.textContent = String(attempts);
  elements.accuracyValue.textContent = `${Math.round(accuracy)}%`;
  elements.resultDifficulty.textContent = DIFFICULTY_SETTINGS[currentDifficulty].label;

  if (isNewRecord) {
    elements.resultTitle.textContent = "New Record!";
    elements.resultMessage.textContent = `${reason} You beat your previous best score.`;
  } else {
    elements.resultTitle.textContent = "Game Over";
    elements.resultMessage.textContent = reason;
  }

  elements.resultBestScore.textContent = String(bestScore);
  elements.statusText.textContent = "Round over";
  showScreen("gameOver");
}

function startTimer() {
  clearTimer();

  const deadline = Date.now() + remainingTime * 1000;

  timerId = setInterval(() => {
    const secondsLeft = Math.ceil((deadline - Date.now()) / 1000);
    remainingTime = Math.max(0, secondsLeft);
    updateTimerDisplay();

    if (remainingTime <= 0) {
      clearTimer();
      endGame("Time is up! The timer reached zero.");
    }
  }, 100);
}

function startGame() {
  if (gameState === "playing") {
    return;
  }

  resetGame();
  gameState = "playing";
  remainingTime = DIFFICULTY_SETTINGS[currentDifficulty].timer;
  elements.statusText.textContent = `${DIFFICULTY_SETTINGS[currentDifficulty].label} mode`;
  elements.difficultyBadge.textContent = DIFFICULTY_SETTINGS[currentDifficulty].label;
  showScreen("game");
  getNewHit();
  makeBubble();
  updateTimerDisplay();
  updateScore();
  startTimer();
}

function handleBubbleClick(event) {
  const bubble = event.target.closest(".bubble");

  if (!bubble || gameState !== "playing") {
    return;
  }

  const clickedValue = Number(bubble.dataset.value);

  if (!Number.isInteger(clickedValue) || clickedValue < 0 || clickedValue > 9) {
    return;
  }

  attempts += 1;

  if (clickedValue === targetNumber) {
    score += 10;
    correctHits += 1;
    updateScore();
    getNewHit();
    makeBubble();
    return;
  }

  endGame(`Wrong bubble! The target was ${targetNumber}.`);
}

function handleKeyboardBubbleAction(event) {
  if (event.target.matches(".bubble") && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    handleBubbleClick({ target: event.target });
  }
}

function initGame() {
  bestScore = loadHighScore();
  updateBestScoreDisplay();
  setDifficulty(currentDifficulty);
  showScreen("welcome");
  resetGame();

  elements.startGameBtn.addEventListener("click", startGame);
  elements.playAgainBtn.addEventListener("click", startGame);
  elements.homeBtn.addEventListener("click", () => {
    clearTimer();
    gameState = "ready";
    elements.statusText.textContent = "Ready to play";
    elements.board.replaceChildren();
    showScreen("welcome");
  });

  elements.difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setDifficulty(button.dataset.difficulty);
      if (gameState === "ready" || gameState === "gameOver") {
        elements.statusText.textContent = "Ready to play";
      }
    });
  });

  elements.board.addEventListener("click", handleBubbleClick);
  elements.board.addEventListener("keydown", handleKeyboardBubbleAction);
}

initGame();
