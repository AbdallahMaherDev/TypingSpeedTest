const words = [
  "Hello",
  "Code",
  "Javascript",
  "Programming",
  "Town",
  "Country",
  "Testing",
  "Youtube",
  "Linkedin",
  "Twitter",
  "Github",
  "Leetcode",
  "Internet",
  "Python",
  "Scala",
  "Destructuring",
  "Paradigm",
  "Styling",
  "Cascade",
  "Documentation",
  "Coding",
  "Funny",
  "Working",
  "Dependencies",
  "Task",
  "Runner",
  "Roles",
  "Test",
  "Rust",
  "Playing",
];

// Setting Levels
const lvls = {
  Easy: 10,
  Normal: 7,
  Hard: 5,
};

// Catch Selectors
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let levelSelect = document.querySelector(".level-select");
let startButton = document.querySelector(".start");
let theWord = document.querySelector(".the-word");
let input = document.querySelector(".input");
let feedback = document.querySelector(".feedback");
let upcomingWords = document.querySelector(".upcoming-words");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
let restartButton = document.querySelector(".restart");
let progressBar = document.querySelector(".progress");

// Initialize Variables
let defaultLevelName = levelSelect.value;
let defaultLevelSeconds = lvls[defaultLevelName];
let timeLeft = defaultLevelSeconds;
let gameInterval;
let gameActive = false;
let wordsList = [...words]; // Create a copy of the original array

// Initialize UI
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scoreTotal.innerHTML = words.length;

// Update Level When Changed
levelSelect.onchange = function () {
  if (gameActive) {
    // If game is active, don't allow changing level
    // Revert to current level
    levelSelect.value = defaultLevelName;
    return;
  }

  defaultLevelName = this.value;
  defaultLevelSeconds = lvls[defaultLevelName];
  lvlNameSpan.innerHTML = defaultLevelName;
  secondsSpan.innerHTML = defaultLevelSeconds;
  timeLeftSpan.innerHTML = defaultLevelSeconds;
  timeLeft = defaultLevelSeconds;
};

// Prevent paste in input field
input.onpaste = function () {
  return false;
};

// Start game button click handler
startButton.onclick = function () {
  this.remove();
  input.focus();
  gameActive = true;

  // Disable level selection during the game
  levelSelect.disabled = true;
  levelSelect.classList.add("disabled");

  generateWords();
};

// Handle Input for Real-Time Word Checking
input.oninput = function () {
  if (!gameActive) return;

  if (theWord.innerHTML.toLowerCase() === this.value.toLowerCase()) {
    // Correct word typed
    clearInterval(gameInterval);
    showFeedback("Good Jop"); // Good job!
    input.value = "";
    scoreGot.innerHTML = parseInt(scoreGot.innerHTML) + 1;

    if (wordsList.length > 0) {
      setTimeout(generateWords, 500); // Delay before next word
    } else {
      endGame(true);
    }
  }
};

function generateWords() {
  if (wordsList.length === 0) {
    endGame(true);
    return;
  }

  let randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  let wordIndex = wordsList.indexOf(randomWord);
  wordsList.splice(wordIndex, 1);

  theWord.innerHTML = randomWord;

  // Update upcoming words display
  upcomingWords.innerHTML = "";
  for (let i = 0; i < Math.min(wordsList.length, 7); i++) {
    let div = document.createElement("div");
    let text = document.createTextNode(wordsList[i]);
    div.appendChild(text);
    upcomingWords.appendChild(div);
  }

  // Reset timer
  timeLeft = defaultLevelSeconds;
  timeLeftSpan.innerHTML = timeLeft;

  // Reset progress bar
  progressBar.style.width = "100%";
  progressBar.style.transition = `width ${defaultLevelSeconds}s linear`;

  // Force reflow to ensure transition applies correctly
  void progressBar.offsetWidth;

  startPlay();
}

function startPlay() {
  clearInterval(gameInterval);
  progressBar.style.width = "0%";

  gameInterval = setInterval(() => {
    timeLeft--;
    timeLeftSpan.innerHTML = timeLeft;

    if (timeLeft === 0) {
      clearInterval(gameInterval);
      if (gameActive) {
        endGame(false);
      }
    }
  }, 1000);
}

function showFeedback(message) {
  feedback.innerHTML = message;
  feedback.classList.remove("show");

  // Force reflow to restart animation
  void feedback.offsetWidth;

  feedback.classList.add("show");
}

function endGame(isWin) {
  gameActive = false;
  clearInterval(gameInterval);

  // Enable level selection again
  levelSelect.disabled = false;
  levelSelect.classList.remove("disabled");

  finishMessage.innerHTML = "";
  let span = document.createElement("span");

  if (isWin) {
    span.className = "good";
    let text = document.createTextNode("Congratulations! You Won!");
    span.appendChild(text);
  } else {
    span.className = "bad";
    let text = document.createTextNode("Game Over");
    span.appendChild(text);
  }

  finishMessage.appendChild(span);
  restartButton.style.display = "block";
}

restartButton.onclick = function () {
  // Reset game state
  wordsList = [...words];
  finishMessage.innerHTML = "";
  scoreGot.innerHTML = "0";
  gameActive = false;

  // Reset UI
  restartButton.style.display = "none";
  upcomingWords.innerHTML = "Words Will Show Here";
  theWord.innerHTML = "";
  input.value = "";

  // Add start button back
  let newStartButton = document.createElement("div");
  newStartButton.className = "start";
  newStartButton.innerHTML = "Start Playing";
  newStartButton.onclick = startButton.onclick;

  document
    .querySelector(".container")
    .insertBefore(newStartButton, document.querySelector(".the-word"));

  startButton = newStartButton;
};
