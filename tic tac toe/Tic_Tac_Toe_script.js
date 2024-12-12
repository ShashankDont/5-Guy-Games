const X_CLASS = 'x';
const O_CLASS = 'o';
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
const playerXInput = document.getElementById('Xs');
const playerOInput = document.getElementById('Os');

let scores = {};
const scoreList = document.getElementById('scoreList');

let oTurn;

startGame();
restartButton.addEventListener('click', startGame);

function updateScoreboard() 
{
  scoreList.innerHTML = '';
  for (const player in scores) 
  {
    const score = scores[player];
    const li = document.createElement('li');
    li.textContent = `${player}: Wins - ${score.wins} Losses - ${score.losses} Draws - ${score.draws}`;
    scoreList.appendChild(li);
  }
}

function updateDraws() 
{
  const playerX = playerXInput.value.trim() || "Player X";
  const playerO = playerOInput.value.trim() || "Player O";

  if (!scores[playerX]) scores[playerX] = { wins: 0, losses: 0, draws: 0 };
  if (!scores[playerO]) scores[playerO] = { wins: 0, losses: 0, draws: 0 };

  scores[playerX].draws++;
  scores[playerO].draws++;
  updateScoreboard();
}

function updateScore(winner, loser) 
{
  if (!scores[winner]) 
  {
    scores[winner] = { wins: 0, losses: 0, draws: 0 };
  }
  if (!scores[loser]) 
  {
    scores[loser] = { wins: 0, losses: 0, draws: 0};
  }

  scores[winner].wins++;
  scores[loser].losses++;
  updateScoreboard();
}

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
      const winner = currentClass === X_CLASS ? playerXInput.value.trim() || "Player X" : playerOInput.value.trim() || "Player O";
      let loser;
      if (winner === (playerXInput.value.trim() || "Player X")) {
          loser = playerOInput.value.trim() || "Player O";  
      } else {
          loser = playerXInput.value.trim() || "Player X";  
      }

      setTimeout(() => alert(`${winner} Wins!`), 10);
      updateScore(winner, loser);
      endGame();
  } else if (isDraw()) {
      updateDraws();
      setTimeout(() => alert('Draw!'), 10);
      endGame();
  } else {
      swapTurns();
  }
}

function placeMark(cell, currentClass) {
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';
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
