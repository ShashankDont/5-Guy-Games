const X_CLASS = 'x';
const O_CLASS = 'o';
let X_SYMBOL = 'X';
let O_SYMBOL = 'O';
let xScore = 0;
let oScore = 0;
let draws = 0;

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
const playerXScore = document.getElementById('playerXScore');
const playerOScore = document.getElementById('playerOScore');
const drawScore = document.getElementById('drawScore');
const playerXName = document.getElementById('playerXName');
const playerOName = document.getElementById('playerOName');
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
    setTimeout(() => {
      alert(`${winnerSymbol} Wins!`);
      updateScore(winnerSymbol);
      checkForOverallWin();
    }, 10);
    endGame();
  } else if (isDraw()) {
    setTimeout(() => alert('Draw!'), 10);
    draws++;
    drawScore.textContent = draws;
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

function updateScore(winnerSymbol) {
  if (winnerSymbol === X_SYMBOL) {
    xScore++;
    playerXScore.textContent = xScore;
  } else {
    oScore++;
    playerOScore.textContent = oScore;
  }
}

function checkForOverallWin() {
  const winningScore = 3; // Define the number of games required to win overall
  if (xScore === winningScore) {
    alert('Player X is the overall winner!');
    resetGame();
  } else if (oScore === winningScore) {
    alert('Player O is the overall winner!');
    resetGame();
  }
}

function resetGame() {
  xScore = 0;
  oScore = 0;
  draws = 0;
  playerXScore.textContent = xScore;
  playerOScore.textContent = oScore;
  drawScore.textContent = draws;
  startGame();
}

function changeSymbols() {
  const newX = prompt('Enter new symbol for X:', X_SYMBOL);
  const newO = prompt('Enter new symbol for O:', O_SYMBOL);
  if (newX && newO) {
    X_SYMBOL = newX;
    O_SYMBOL = newO;
    playerXName.textContent = newX;
    playerOName.textContent = newO;
    alert(`Symbols updated! X: ${X_SYMBOL}, O: ${O_SYMBOL}`);
    startGame(); // Reset the game with the new symbols
  }
}
