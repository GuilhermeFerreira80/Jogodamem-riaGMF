"use strict";
const panelControl = document.querySelector("#panel-control");
const panelGame = document.querySelector("#panel-game");
const btLevel = document.querySelector("#btLevel");
const btPlay = document.querySelector("#btPlay");
const message = document.querySelector("#message");
const infoGame = panelControl.querySelectorAll(".list-item");
const labelGameTime = document.querySelector("#gameTime");
const labelPoints = document.querySelector("#points");
let cards = document.querySelectorAll(".card");
let cardsLogos = [
  "angular",
  "bootstrap",
  "html",
  "javascript",
  "vue",
  "svelte",
  "react",
  "css",
  "backbone",
  "ember",
];


let [flippedCards, totalFlippedCards, totalPoints] = [[], 0, 0];

const TIMEOUTGAME = 60;
let timer, timerId;

const gameOver = () => totalFlippedCards === cards.length;

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};
function updatePoints(operation = "+") {
  let n = (cards.length - totalFlippedCards) / 2;
  n = n == 0 ? 1 : n;
  totalPoints =
    operation === "+"
      ? totalPoints + timer * n
      : totalPoints < 5
      ? 0
      : totalPoints - 5;
  labelPoints.textContent = totalPoints;
}
function updateGameTime() {
  timer--;
  labelGameTime.textContent = `${timer}s`;
  if (timer === 0) stopGame();
}
function flipCard() {
  this.classList.add("flipped");
  flippedCards.push(this);
  if (flippedCards.length === 2) checkPair();
}
function checkPair() {
  let [card1, card2] = flippedCards;
  if (card1.dataset.logo === card2.dataset.logo) {
    setTimeout(() => {
      card1.classList.add("inactive");
      card2.classList.add("inactive");
      card1.querySelector(".card-front").classList.add("grayscale");
      card2.querySelector(".card-front").classList.add("grayscale");
      totalFlippedCards += 2;
      updatePoints("+");
      if (gameOver()) stopGame();
    }, 500);
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.addEventListener("click", flipCard, { once: true });
      card2.addEventListener("click", flipCard, { once: true });
      updatePoints("-");
    }, 500);
  }
  flippedCards = [];
}

function createPanelGame() {
  let nCards = [6, 12, 20];
  let classPanel = ["intermedio", "avancado"];
  nCards = nCards[btLevel.value - 1];
  panelGame.className = classPanel[btLevel.value - 2] || "";
  let templateCard = document.createElement("div");
  templateCard.innerHTML =
    "<div class='card'><img src='images/ls.png' class='card-back'/><img class='card-front'/></div>";
  panelGame.innerHTML = "";
  templateCard = templateCard.firstChild;
  for (let i = 0; i < nCards; i++)
    panelGame.appendChild(templateCard.cloneNode(true));
  cards = panelGame.children;
}

let showGameInfo = (visible) =>
  visible
    ? infoGame.forEach((e) => e.classList.add("gameStarted"))
    : infoGame.forEach((e) => e.classList.remove("gameStarted"));

function reset() {
  panelGame.style.display = message.classList.remove("hide");

  [btPlay.disabled, message.textContent, panelGame.style.display] = [
    btLevel.value === "0" ? true : false,
    "",
    btLevel.value === "0" ? "none" : "grid",
  ];
  showGameInfo(false);
  createPanelGame();
  [labelGameTime.textContent, labelPoints.textContent] = [`${TIMEOUTGAME}s`, 0];
}

const createAndShuffleCards = (array) => {
  shuffleArray(array);
  array.splice(cards.length / 2, Number.MAX_VALUE);
  array.push(...array);
  shuffleArray(array);
};

function startGame() {
  message.classList.add("hide");
  btLevel.disabled = true;
  btPlay.textContent = "Terminar Jogo";
  showGameInfo(true);
  let [indice, newCardLogos] = [0, [...cardsLogos]];
  createAndShuffleCards(newCardLogos);

  for (let card of cards) {
    let cardFront = card.querySelector(".card-front");
    cardFront.src = `images/${newCardLogos[indice]}.png`;
    card.dataset.logo = newCardLogos[indice++];
    card.addEventListener("click", flipCard, { once: true });
  }
  [flippedCards, totalFlippedCards, totalPoints] = [[], 0, 0];
  [timer, timerId] = [TIMEOUTGAME, setInterval(updateGameTime, 1000)];
  [labelGameTime.textContent, labelPoints.textContent] = [`${timer}s`, 0];
}
function stopGame() {
  [
    btLevel.disabled,
    btPlay.textContent,
    document.querySelector("#messageGameOver").textContent,
  ] = [false, "Iniciar Jogo", `Pontuação:${totalPoints}`];
  clearInterval(timerId);
  modalGameOver.showModal();
  modalGameOver.querySelector("#nickname").style = "display: none;";
  document.querySelector("#messageGameOver").textContent =
    "Pontuação: " + totalPoints;
}

btPlay.addEventListener("click", () =>
  btPlay.textContent === "Terminar Jogo" ? stopGame() : startGame()
);
panelGame.addEventListener("click", () => {
  message.textContent = message.textContent ? "" : "Clique em Iniciar o Jogo!";
});
btLevel.addEventListener("change", reset);

reset();
