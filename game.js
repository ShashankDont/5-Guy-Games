// Get DOM elements
const startPage = document.getElementById('startPage');
const scorePage = document.getElementById('scorePage');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreButton = document.getElementById('scoreButton');
const backButton = document.getElementById('backButton');
const scoreList = document.getElementById('scoreList');
const gameOverMenu = document.getElementById('gameOverMenu');
const restartButton = document.getElementById('restartButton');
const toStartButton = document.getElementById('toStartButton');
const toScoreButton = document.getElementById('toScoreButton');

// Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_SPEED = 3;
const PIPE_SPACING = 200;
const PIPE_WIDTH = 50;

// Game variables
let plane, pipes, gameOver, frameCount, startTime, scores;
let animationFrameId;

// Initialize game
function initGame() {
    plane = {
        x: 100,
        y: canvas.height / 2,
        velocity: 0,
        width: 40,
        height: 30,
        update: function () {
            this.velocity += GRAVITY;
            this.y += this.velocity;
        },
        jump: function () {
            this.velocity = JUMP_FORCE;
        },
        draw: function () {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

            // Draw forward-facing paper plane
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.moveTo(this.width / 2, 0);  // Point at the front
            ctx.lineTo(-this.width / 2, -this.height / 2);
            ctx.lineTo(-this.width / 2, this.height / 2);
            ctx.closePath();
            ctx.fill();

            // Draw a line to represent the fold
            ctx.strokeStyle = '#2980b9';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.width / 2, 0);
            ctx.lineTo(-this.width / 2, 0);
            ctx.stroke();

            ctx.restore();
        }
    };
    pipes = [];
    gameOver = false;
    frameCount = 0;
    startTime = Date.now();
}

// Create a new pipe
function createPipe() {
    const topHeight = Math.random() * (canvas.height - PIPE_SPACING - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + PIPE_SPACING
    });
}

// Update and draw pipes
function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
    });
}

// Check for collisions
function checkCollision() {
    const collisionBox = {
        x: plane.x + plane.width / 4,
        y: plane.y + plane.height / 4,
        width: plane.width / 2,
        height: plane.height / 2
    };

    if (collisionBox.y < 0 || collisionBox.y + collisionBox.height > canvas.height) {
        return true;
    }
    for (let pipe of pipes) {
        if (collisionBox.x + collisionBox.width > pipe.x && collisionBox.x < pipe.x + PIPE_WIDTH) {
            if (collisionBox.y < pipe.topHeight || collisionBox.y + collisionBox.height > pipe.bottomY) {
                return true;
            }
        }
    }
    return false;
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        plane.update();
        plane.draw();

        if (frameCount % 100 === 0) {
            createPipe();
        }

        updatePipes();

        if (checkCollision()) {
            gameOver = true;
            endGame();
        }

        frameCount++;
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// End game and save score
function endGame() {
    cancelAnimationFrame(animationFrameId);
    const endTime = Date.now();
    const timePlayed = (endTime - startTime) / 1000; // Convert to seconds
    const playerName = prompt("Game Over! Enter your name:");
    if (playerName) {
        addScore(playerName, timePlayed);
    }
    showGameOverMenu();
}

// Add a new score
function addScore(name, time) {
    time = Number(time);
    if (isNaN(time)) {
        console.error('Invalid time provided:', time);
        time = 0;
    }
    scores.push({ name, time });
    scores.sort((a, b) => b.time - a.time);
    scores = scores.slice(0, 10);
    localStorage.setItem('flappyPlanesScores', JSON.stringify(scores));
}

// Display scores
function displayScores() {
    console.log("Displaying scores:", scores);
    scoreList.innerHTML = '';
    if (!scores || scores.length === 0) {
        const li = document.createElement('li');
        li.textContent = "No scores yet. Play the game to set some records!";
        scoreList.appendChild(li);
        console.log("No scores message added");
    } else {
        scores.forEach((score, index) => {
            const li = document.createElement('li');
            let timeDisplay;
            if (typeof score.time === 'number') {
                timeDisplay = score.time.toFixed(2);
            } else {
                timeDisplay = 'Invalid time';
                console.error('Invalid time for score:', score);
            }
            li.textContent = `${index + 1}. ${score.name}: ${timeDisplay} seconds`;
            scoreList.appendChild(li);
            console.log("Score added:", li.textContent);
        });
    }
}

// Validate and fix scores
function validateAndFixScores() {
    scores = scores.map(score => ({
        name: String(score.name || 'Unknown'),
        time: Number(score.time) || 0
    }));
    scores.sort((a, b) => b.time - a.time);
    scores = scores.slice(0, 10);
    localStorage.setItem('flappyPlanesScores', JSON.stringify(scores));
}

// Show game over menu
function showGameOverMenu() {
    canvas.style.display = 'none';
    gameOverMenu.style.display = 'block';
}

// Start the game
function startGame() {
    startPage.style.display = 'none';
    canvas.style.display = 'block';
    gameOverMenu.style.display = 'none';
    initGame();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Event listeners
startButton.addEventListener('click', startGame);

scoreButton.addEventListener('click', () => {
    startPage.style.display = 'none';
    scorePage.style.display = 'block';
    gameOverMenu.style.display = 'none';
    displayScores();
});

backButton.addEventListener('click', () => {
    scorePage.style.display = 'none';
    startPage.style.display = 'block';
});

restartButton.addEventListener('click', startGame);

toStartButton.addEventListener('click', () => {
    gameOverMenu.style.display = 'none';
    startPage.style.display = 'block';
});

toScoreButton.addEventListener('click', () => {
    gameOverMenu.style.display = 'none';
    scorePage.style.display = 'block';
    displayScores();
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !gameOver) {
        plane.jump();
    }
});

// Load scores from localStorage
scores = JSON.parse(localStorage.getItem('flappyPlanesScores')) || [];
console.log("Loaded scores:", scores);

validateAndFixScores();

console.log("Flappy Planes game initialized");
console.log("scoreList element:", scoreList);
