/*
 * - Keyboard (spacebar) or mouse click controls
 * - Time-based animation for consistent speed across devices
 * - High score tracking
 */

/*
 * DOM Elements
 * Getting all necessary HTML elements for interaction
 */
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
const keyboardControlBtn = document.getElementById('keyboardControl');
const mouseControlBtn = document.getElementById('mouseControl');

/*
 * Game Constants
 * These values control core game mechanics and behavior
 */
const GRAVITY = 0.5;          // Falling speed
const JUMP_FORCE = -10;       // Upward force when jumping
const PIPE_SPEED = 3;         // Obstacle movement speed
const PIPE_SPACING = 200;     // Gap between top and bottom pipes
const PIPE_WIDTH = 50;        // Width of pipe obstacles
const FPS = 60;               // Target frames per second
const frameTime = 1000 / FPS; // Milliseconds per frame

/*
 * Game Variables
 * These track the current game state
 */
let plane;              // The player's plane object
let pipes;             // Array of pipe obstacles
let gameOver;          // Tracks if the game has ended
let frameCount;        // Counts frames for pipe spawning
let startTime;         // When the game started
let scores;            // Array of high scores
let animationFrameId;  // For animation control
let lastTime = 0;      // For delta time calculation
let controlType = null; // Selected control method ('keyboard' or 'mouse')

/*
 * Initialize the game
 * Sets up initial game state and objects
 */
function initGame()
{
    // Initialize the plane object with all properties and methods
    plane =
    {
        x: 100,
        y: canvas.height / 2,
        velocity: 0,
        width: 40,
        height: 30,

        // Update plane position with delta time for consistent speed
        update: function (delta)
        {
            this.velocity += GRAVITY * delta * 60;  // Apply gravity
            this.y += this.velocity * delta * 60;   // Update position
        },

        // Make the plane jump
        jump: function ()
        {
            this.velocity = JUMP_FORCE;
        },

        // Draw the plane on the canvas
        draw: function ()
        {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

            // Draw the paper plane
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.moveTo(this.width / 2, 0);  // Front point
            ctx.lineTo(-this.width / 2, -this.height / 2);  // Top wing
            ctx.lineTo(-this.width / 2, this.height / 2);   // Bottom wing
            ctx.closePath();
            ctx.fill();

            // Draw the center fold line
            ctx.strokeStyle = '#2980b9';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.width / 2, 0);
            ctx.lineTo(-this.width / 2, 0);
            ctx.stroke();

            ctx.restore();
        }
    };

    // Reset game state
    pipes = [];
    gameOver = false;
    frameCount = 0;
    startTime = Date.now();
    lastTime = 0;
}

/*
 * Handle control selection
 * Sets up the game for either keyboard or mouse control
 * @param type - The type of control ('keyboard' or 'mouse')
 */
function selectControl(type)
{
    controlType = type;
    keyboardControlBtn.classList.remove('selected');
    mouseControlBtn.classList.remove('selected');

    if (type === 'keyboard')
    {
        keyboardControlBtn.classList.add('selected');
    }
    else
    {
        mouseControlBtn.classList.add('selected');
    }

    startButton.style.display = 'block';
    document.getElementById('controlInstruction').textContent =
        type === 'keyboard' ? 'Press SPACE to jump' : 'Click to jump';
}

/*
 * Set up control event listeners
 * Based on selected control type
 */
function setupControls()
{
    // Remove any existing event listeners
    canvas.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeydown);

    // Add appropriate event listener based on control type
    if (controlType === 'mouse')
    {
        canvas.addEventListener('click', handleClick);
    }
    else
    {
        document.addEventListener('keydown', handleKeydown);
    }
}

/*
 * Handle mouse click event
 * Makes the plane jump when clicked
 */
function handleClick()
{
    if (!gameOver)
    {
        plane.jump();
    }
}

/*
 * Handle keyboard event
 * Makes the plane jump when spacebar is pressed
 */
function handleKeydown(event)
{
    if (event.code === 'Space' && !gameOver)
    {
        plane.jump();
    }
}

/*
 * Create a new pipe obstacle
 * Generates pipes with random heights but consistent gap
 */
function createPipe()
{
    const topHeight = Math.random() * (canvas.height - PIPE_SPACING - 100) + 50;
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + PIPE_SPACING
    });
}

/*
 * Update and draw all pipes
 * @param delta - Time passed since last frame
 */
function updatePipes(delta)
{
    // Update pipe positions
    for (let i = pipes.length - 1; i >= 0; i--)
    {
        pipes[i].x -= PIPE_SPEED * delta * 60;
        if (pipes[i].x + PIPE_WIDTH < 0)
        {
            pipes.splice(i, 1);
        }
    }

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(pipe =>
    {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
    });
}

/*
 * Check for collisions
 * Returns true if plane hits pipes or screen boundaries
 */
function checkCollision()
{
    const collisionBox =
    {
        x: plane.x + plane.width / 4,
        y: plane.y + plane.height / 4,
        width: plane.width / 2,
        height: plane.height / 2
    };

    // Check screen boundaries
    if (collisionBox.y < 0 || collisionBox.y + collisionBox.height > canvas.height)
    {
        return true;
    }

    // Check pipe collisions
    for (let pipe of pipes)
    {
        if (collisionBox.x + collisionBox.width > pipe.x && collisionBox.x < pipe.x + PIPE_WIDTH)
        {
            if (collisionBox.y < pipe.topHeight || collisionBox.y + collisionBox.height > pipe.bottomY)
            {
                return true;
            }
        }
    }
    return false;
}

/*
 * Update game state
 * @param delta - Time passed since last frame
 */
function updateGame(delta)
{
    plane.update(delta);
    plane.draw();

    if (frameCount % 100 === 0)
    {
        createPipe();
    }

    updatePipes(delta);
}

/*
 * Main game loop
 * Uses delta time for consistent speed across devices
 */
function gameLoop(currentTime)
{
    if (!lastTime) lastTime = currentTime;

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (deltaTime >= frameTime)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'skyblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!gameOver)
        {
            updateGame(deltaTime / 1000);

            if (checkCollision())
            {
                gameOver = true;
                endGame();
            }

            frameCount++;
        }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

/*
 * End current game
 * Save score and show game over menu
 */
function endGame()
{
    cancelAnimationFrame(animationFrameId);
    const endTime = Date.now();
    const timePlayed = (endTime - startTime) / 1000;
    const playerName = prompt("Game Over! Enter your name:");
    if (playerName)
    {
        addScore(playerName, timePlayed);
    }
    showGameOverMenu();
}

/*
 * Add new score to high scores
 * @param name - Player's name
 * @param time - Time survived in seconds
 */
function addScore(name, time)
{
    time = Number(time);
    if (isNaN(time))
    {
        console.error('Invalid time provided:', time);
        time = 0;
    }
    scores.push({ name, time });
    scores.sort((a, b) => b.time - a.time);
    scores = scores.slice(0, 10);
    localStorage.setItem('flappyPlanesScores', JSON.stringify(scores));
}

/*
 * Display high scores
 * Shows list of top 10 scores
 */
function displayScores()
{
    scoreList.innerHTML = '';
    if (!scores || scores.length === 0)
    {
        const li = document.createElement('li');
        li.textContent = "No scores yet. Play the game to set some records!";
        scoreList.appendChild(li);
    }
    else
    {
        scores.forEach((score, index) =>
        {
            const li = document.createElement('li');
            let timeDisplay;
            if (typeof score.time === 'number')
            {
                timeDisplay = score.time.toFixed(2);
            }
            else
            {
                timeDisplay = 'Invalid time';
            }
            li.textContent = `${index + 1}. ${score.name}: ${timeDisplay} seconds`;
            scoreList.appendChild(li);
        });
    }
}

/*
 * Validate and fix scores
 * Ensures all scores are in correct format
 */
function validateAndFixScores()
{
    scores = scores.map(score => ({
        name: String(score.name || 'Unknown'),
        time: Number(score.time) || 0
    }));
    scores.sort((a, b) => b.time - a.time);
    scores = scores.slice(0, 10);
    localStorage.setItem('flappyPlanesScores', JSON.stringify(scores));
}

/*
 * Show game over menu
 */
function showGameOverMenu()
{
    canvas.style.display = 'none';
    gameOverMenu.style.display = 'block';
}

/*
 * Start new game
 */
function startGame()
{
    startPage.style.display = 'none';
    canvas.style.display = 'block';
    gameOverMenu.style.display = 'none';
    initGame();
    setupControls();
    animationFrameId = requestAnimationFrame(gameLoop);
}

/*
 * Event Listeners
 */

// Control selection buttons
keyboardControlBtn.addEventListener('click', () => selectControl('keyboard'));
mouseControlBtn.addEventListener('click', () => selectControl('mouse'));

// Game navigation buttons
startButton.addEventListener('click', startGame);

scoreButton.addEventListener('click', () =>
{
    startPage.style.display = 'none';
    scorePage.style.display = 'block';
    gameOverMenu.style.display = 'none';
    displayScores();
});

backButton.addEventListener('click', () =>
{
    scorePage.style.display = 'none';
    startPage.style.display = 'block';
});

restartButton.addEventListener('click', startGame);

toStartButton.addEventListener('click', () =>
{
    gameOverMenu.style.display = 'none';
    startPage.style.display = 'block';
});

toScoreButton.addEventListener('click', () =>
{
    gameOverMenu.style.display = 'none';
    scorePage.style.display = 'block';
    displayScores();
});

/*
 * Initialize game
 * Load scores and set up initial state
 */
scores = JSON.parse(localStorage.getItem('flappyPlanesScores')) || [];
validateAndFixScores();
