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
let wordsList = [...words];

// Initialize UI
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scoreTotal.innerHTML = words.length;

// Update Level When Changed
levelSelect.onchange = function () {
  if (gameActive) {
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

input.onpaste = () => false;

startButton.onclick = function () {
  this.remove();
  input.focus();
  gameActive = true;
  levelSelect.disabled = true;
  levelSelect.classList.add("disabled");
  generateWords();
};

input.oninput = function () {
  if (!gameActive) return;

  if (theWord.innerHTML.toLowerCase() === this.value.toLowerCase()) {
    clearInterval(gameInterval);
    showFeedback("Good jop");
    input.value = "";
    scoreGot.innerHTML = parseInt(scoreGot.innerHTML) + 1;

    // Reset progress bar immediately when word is correct
    progressBar.style.width = "100%";
    progressBar.style.transition = "none";
    void progressBar.offsetWidth; // Force reflow

    if (wordsList.length > 0) {
      setTimeout(generateWords, 500);
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
  wordsList.splice(wordsList.indexOf(randomWord), 1);

  theWord.innerHTML = randomWord;

  upcomingWords.innerHTML = "";
  wordsList.slice(0, 7).forEach((word) => {
    let div = document.createElement("div");
    div.textContent = word;
    upcomingWords.appendChild(div);
  });

  // Reset progress bar with new transition
  timeLeft = defaultLevelSeconds;
  timeLeftSpan.innerHTML = timeLeft;
  progressBar.style.width = "100%";
  progressBar.style.transition = `width ${defaultLevelSeconds}s linear`;
  void progressBar.offsetWidth; // Force reflow

  startPlay();
}

function startPlay() {
  clearInterval(gameInterval);
  progressBar.style.width = "0%";

  gameInterval = setInterval(() => {
    timeLeft--;
    timeLeftSpan.innerHTML = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      if (gameActive) endGame(false);
    }
  }, 1000);
}

function showFeedback(message) {
  feedback.textContent = message;
  feedback.classList.remove("show");
  void feedback.offsetWidth;
  feedback.classList.add("show");
}

function endGame(isWin) {
  gameActive = false;
  clearInterval(gameInterval);

  // Reset progress bar on game end
  progressBar.style.width = "100%";
  progressBar.style.transition = "none";

  levelSelect.disabled = false;
  levelSelect.classList.remove("disabled");

  finishMessage.innerHTML = isWin
    ? '<span class="good">Congratulations! You Won!</span>'
    : '<span class="bad">Game Over</span>';

  restartButton.style.display = "block";
}

restartButton.onclick = function () {
  wordsList = [...words];
  finishMessage.innerHTML = "";
  scoreGot.innerHTML = "0";
  gameActive = false;

  // Reset progress bar on restart
  progressBar.style.width = "100%";
  progressBar.style.transition = "none";

  restartButton.style.display = "none";
  upcomingWords.innerHTML = "Words Will Show Here";
  theWord.innerHTML = "";
  input.value = "";

  let newStartButton = document.createElement("div");
  newStartButton.className = "start";
  newStartButton.textContent = "Start Playing";
  newStartButton.onclick = startButton.onclick;

  document
    .querySelector(".container")
    .insertBefore(newStartButton, document.querySelector(".the-word"));
};
