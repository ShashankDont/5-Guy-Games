const X_CLASS = 'x';
const O_CLASS = 'o';
let X_SYMBOL = 'X';
let O_SYMBOL = 'O';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const changeSymbolsButton = document.getElementById('changeSymbolsButton');
let oTurn;

startGame();
restartButton.addEventListener('click', startGame);
changeSymbolsButton.addEventListener('click', changeSymbols);

function startGame() {
  oTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.textContent = ''; 
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true }); 
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    const winnerSymbol = oTurn ? O_SYMBOL : X_SYMBOL; 
    setTimeout(() => alert(`${winnerSymbol} Wins!`), 10);
    endGame();
  } else if (isDraw()) {
    setTimeout(() => alert('Draw!'), 10);
    endGame();
  } else {
    swapTurns();
  }
}


function placeMark(cell, currentClass) {
  cell.textContent = currentClass === X_CLASS ? X_SYMBOL : O_SYMBOL;
  cell.classList.add(currentClass); 
}

function swapTurns() {
  oTurn = !oTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function endGame() {
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });
}

function changeSymbols() {
  const newX = prompt('Enter new symbol for X:', X_SYMBOL);
  const newO = prompt('Enter new symbol for O:', O_SYMBOL);
  if (newX && newO) {
    X_SYMBOL = newX;
    O_SYMBOL = newO;
    alert(`Symbols updated! X: ${X_SYMBOL}, O: ${O_SYMBOL}`);
    startGame(); // Reset the game with the new symbols
  }
}

let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Wins = 0;
let player2Wins = 0;
let draws = 0;

const player1NameElement = document.getElementById('player1Name');
const player2NameElement = document.getElementById('player2Name');
const player1WinsElement = document.getElementById('player1Wins');
const player2WinsElement = document.getElementById('player2Wins');
const drawsElement = document.getElementById('draws');
const player1Input = document.getElementById('player1Input');
const player2Input = document.getElementById('player2Input');
const updateNamesButton = document.getElementById('updateNamesButton');

updateNamesButton.addEventListener('click', updateNames);

function updateNames() {
    const newPlayer1Name = player1Input.value.trim();
    const newPlayer2Name = player2Input.value.trim();
    if (newPlayer1Name) player1Name = newPlayer1Name;
    if (newPlayer2Name) player2Name = newPlayer2Name;

    player1NameElement.textContent = player1Name;
    player2NameElement.textContent = player2Name;
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        const winner = oTurn ? player2Name : player1Name;
        if (oTurn) {
            player2Wins++;
        } else {
            player1Wins++;
        }
        updateScoreboard();
        setTimeout(() => alert(`${winner} Wins!`), 10);
        endGame();
    } else if (isDraw()) {
        draws++;
        updateScoreboard();
        setTimeout(() => alert('Draw!'), 10);
        endGame();
    } else {
        swapTurns();
    }
}

function updateScoreboard() {
    player1WinsElement.textContent = player1Wins;
    player2WinsElement.textContent = player2Wins;
    drawsElement.textContent = draws;
}

