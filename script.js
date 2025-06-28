// Get the logged-in user's info
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// All possible puzzle words
const wordPool = [
  "rain", "fast", "lamp", "grow", "mint", "cold", "pack", "fire", "game", "star",
  "light", "dark", "wind", "stone", "crisp", "water", "shine", "green", "bloom", "quiet"
];

// Game state
let currentWord = "";
let currentLetters = [];
let guessedWords = [];
let usedPuzzleWords = [];
let score = 0;
let currentLevel = 1;

// Get all needed elements
const letterBox = document.getElementById("letter-box");
const wordInput = document.getElementById("word-input");
const submitBtn = document.getElementById("submit-word");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const logoutBtn = document.getElementById("logout");
const levelDisplay = document.getElementById("level");
const nextBtn = document.getElementById("next-btn");
const music = document.getElementById("background-music");
const toggleMusicBtn = document.getElementById("toggle-music");
const welcomeMessage = document.getElementById("welcome-message");
const gameOverScreen = document.getElementById("game-over-screen");
const gameElements = document.getElementById("game-elements");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again-btn");
const hintBtn = document.getElementById("hint-btn");
const hintBox = document.getElementById("hint-box");

// Shuffle letters randomly
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pick a random unused word
function getNewRandomWord() {
  const available = wordPool.filter(word => !usedPuzzleWords.includes(word));
  if (available.length === 0) return null;
  const word = available[Math.floor(Math.random() * available.length)];
  usedPuzzleWords.push(word);
  return word;
}

// Show new puzzle on screen
function loadNextPuzzle() {
  currentWord = getNewRandomWord();
  if (!currentWord) {
    endGame();
    return;
  }

  currentLetters = shuffleArray(currentWord.toUpperCase().split(""));
  letterBox.textContent = currentLetters.join(" ");
  wordInput.value = "";
  feedback.textContent = "";
  hintBox.style.display = "none";
  levelDisplay.textContent = currentLevel;
  currentLevel++;
  guessedWords = [];
  nextBtn.disabled = true;
}

// Check if typed word uses only the given letters
function canFormWord(word, letters) {
  const temp = [...letters];
  for (let char of word.toUpperCase()) {
    const index = temp.indexOf(char);
    if (index === -1) return false;
    temp.splice(index, 1);
  }
  return true;
}

// End game and show score
function endGame() {
  gameElements.classList.add("d-none");
  gameOverScreen.classList.remove("d-none");
  finalScoreDisplay.textContent = score;
  scoreDisplay.textContent = score;
}

// Reset everything and restart
function resetGame() {
  score = 0;
  currentLevel = 1;
  guessedWords = [];
  usedPuzzleWords = [];
  scoreDisplay.textContent = score;
  gameOverScreen.classList.add("d-none");
  gameElements.classList.remove("d-none");
  loadNextPuzzle();
}

// Submit typed word
submitBtn.addEventListener("click", async () => {
  const typedWord = wordInput.value.toLowerCase().trim();
  if (typedWord === "") return;

  if (!canFormWord(typedWord, currentLetters)) {
    feedback.textContent = "❌ Use only the given letters.";
    wordInput.value = "";
    return;
  }

  if (guessedWords.includes(typedWord)) {
    feedback.textContent = "⚠️ Word already used.";
    wordInput.value = "";
    return;
  }

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${typedWord}`);
    if (res.ok) {
      feedback.textContent = "✅ Word accepted!";
      score += 10;
      scoreDisplay.textContent = score;
      guessedWords.push(typedWord);
      nextBtn.disabled = false;
    } else {
      feedback.textContent = "❌ Not a valid English word.";
    }
  } catch {
    feedback.textContent = "⚠️ Network error.";
  }

  wordInput.value = "";
});

// Music toggle
toggleMusicBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    toggleMusicBtn.textContent = "🔊 Music On";
  } else {
    music.pause();
    toggleMusicBtn.textContent = "🔇 Music Off";
  }
});

// Auto-play music on load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    music.play().then(() => {
      toggleMusicBtn.textContent = "🔊 Music On";
    }).catch(() => {
      toggleMusicBtn.textContent = "🔇 Music Off";
    });
  }, 500);
});

// Logout and go back to login
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// Load next puzzle manually
nextBtn.addEventListener("click", loadNextPuzzle);

// Restart the game
playAgainBtn.addEventListener("click", resetGame);

// Show hint
hintBtn.addEventListener("click", () => {
  if (currentWord) {
    hintBox.textContent = `Hint: starts with "${currentWord[0].toUpperCase()}" and is ${currentWord.length} letters long.`;
    hintBox.style.display = "block";
  }
});

// Show welcome message or force login
if (loggedInUser && loggedInUser.username) {
  welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;
} else {
  window.location.href = "index.html";
}

// Start the first puzzle
loadNextPuzzle();
