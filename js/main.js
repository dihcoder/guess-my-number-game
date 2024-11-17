"use strict";

const gameBg = document.body;
const highscore = document.getElementById("highscore");
const scoreboard = document.getElementById("scoreboard");
const secretNumber = document.getElementById("secret-number");
const feedbackMsg = document.getElementById("feedback-msg");
const gameTitle = document.getElementById("game-title");
const restartBtn = document.getElementById("restart-btn");
const guessInput = document.getElementById("guess-input");
const checkBtn = document.getElementById("check-btn");

const MIN_SCORE = 10;
const MAX_SCORE = 100;
const MIN_GUESS = 1;
const MAX_GUESS = 20;
const PENALTY = 10;

const gameState = {}
const uiState = {}

let effectTimeout;

function setGameState(newState) {
    Object.assign(gameState, newState);
}

function setUiState(newState) {
    Object.assign(uiState, newState);
}

const updateUI = () => {

    clearTimeout(effectTimeout);
    gameBg.setAttribute("class", uiState.backgroundColor);
    gameTitle.textContent = uiState.titleValue;
    highscore.textContent = uiState.highscoreValue;
    scoreboard.textContent = uiState.scoreboardValue;
    secretNumber.textContent = uiState.secretNumberValue;
    feedbackMsg.textContent = uiState.feedbackMsgValue;
    feedbackMsg.setAttribute("class", uiState.feedbackMsgEffect);

    effectTimeout = setTimeout(() => {
        feedbackMsg.setAttribute("class", "");
    }, 1000);

}

const generateSecretNumber = (min, max) => {
    return Math.trunc(Math.random() * max + min);
}

const noGuess = () => {
    return !guessInput.value.length;
}

const guessIsValid = () => {
    const guess = Number(guessInput.value);
    return guess >= MIN_GUESS && guess <= MAX_GUESS;
}

const handleNoGuess = () => {
    setUiState({ feedbackMsgValue: "Preencha o campo abaixo com o seu palpite!", feedbackMsgEffect: "bubble" });
}

const handleInvalidGuess = () => {
    setUiState({ feedbackMsgValue: "O número deve estar entre 1 e 20!", feedbackMsgEffect: "bubble" });
}

const handleWin = () => {

    guessInput.value = "";
    setGameState({
        highscore: gameState.scoreboard > gameState.highscore ? gameState.scoreboard : gameState.highscore,
        playerWin: true,
        gameIsOver: false
    })

    setUiState({
        backgroundColor: "victory",
        highscoreValue: gameState.highscore,
        scoreboardValue: gameState.scoreboard,
        secretNumberValue: gameState.secretNumber,
        feedbackMsgValue: "🚩 Parabéns! Você venceu o jogo.",
        feedbackMsgEffect: "",
        titleValue: "Você acertou!!!"
    });

}

const handleGameOver = () => {

    guessInput.value = "";
    setGameState({
        playerWin: false,
        gameIsOver: true
    })

    setUiState({
        backgroundColor: "gameover",
        highscoreValue: gameState.highscore,
        scoreboardValue: gameState.scoreboard,
        secretNumberValue: gameState.secretNumber,
        feedbackMsgValue: "😥 Que pena! Você perdeu.",
        feedbackMsgEffect: "",
        titleValue: "Fim de Jogo!"
    });

}

const handleGreatherGuess = () => {

    setUiState({
        scoreboardValue: gameState.scoreboard,
        feedbackMsgValue: "⬆️ Seu palpite está alto!",
        feedbackMsgEffect: "bubble",
    })

}

const handleSmallerGuess = () => {

    setUiState({
        scoreboardValue: gameState.scoreboard,
        feedbackMsgValue: "⬇️ Seu palpite está baixo!",
        feedbackMsgEffect: "bubble",
    })

}

const decreaseScore = () => {
    gameState.scoreboard -= PENALTY;
    if (gameState.scoreboard < MIN_SCORE) gameState.scoreboard = 0;
}

const restartGame = () => {

    guessInput.value = "";
    setGameState({
        secretNumber: generateSecretNumber(MIN_GUESS, MAX_GUESS),
        highscore: gameState.highscore ? gameState.highscore : 0,
        scoreboard: MAX_SCORE,
        playerWin: false,
        gameIsOver: false
    })

    setUiState({
        backgroundColor: "motion-gradient",
        highscoreValue: gameState.highscore,
        scoreboardValue: gameState.scoreboard,
        titleValue: "Adivinhe Meu Número!",
        secretNumberValue: "?",
        feedbackMsgValue: `<Escolha um número entre ${MIN_GUESS} e ${MAX_GUESS}>`,
        feedbackMsgEffect: ""
    })

    updateUI();

}

const playGame = () => {

    if (gameState.playerWin || gameState.gameIsOver) return;

    if (noGuess()) handleNoGuess();
    else if (!guessIsValid()) handleInvalidGuess();
    else if (Number(guessInput.value) === gameState.secretNumber) handleWin();
    else {
        decreaseScore();

        if (!gameState.scoreboard) handleGameOver();
        else if (Number(guessInput.value) > gameState.secretNumber) handleGreatherGuess();
        else handleSmallerGuess();
    }

    updateUI();

}

checkBtn.addEventListener("click", playGame);
restartBtn.addEventListener("click", restartGame);

restartGame();