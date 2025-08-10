// Game elements
const gameArea = document.getElementById('gameArea');
const egg = document.getElementById('egg');
const basket = document.getElementById('basket');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameMessage = document.getElementById('gameMessage');

// Game state
let gameState = {
    isPlaying: false,
    score: 0,
    lives: 3,
    eggFalling: false,
    basketPosition: 50, // percentage from left
    eggPosition: { x: 50, y: 10 }, // percentage positions
    fallSpeed: 2, // pixels per frame
    gameAreaWidth: 0,
    gameAreaHeight: 0
};

// Initialize game
function initGame() {
    updateGameAreaDimensions();
    updateDisplay();
    setupEventListeners();
    showMessage('Click Start Game to begin!', 'info');
}

// Update game area dimensions
function updateGameAreaDimensions() {
    const rect = gameArea.getBoundingClientRect();
    gameState.gameAreaWidth = rect.width;
    gameState.gameAreaHeight = rect.height;
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Mouse controls
    gameArea.addEventListener('mousemove', handleMouseMove);
    
    // Touch controls for mobile
    gameArea.addEventListener('touchmove', handleTouchMove);
    
    // Window resize
    window.addEventListener('resize', updateGameAreaDimensions);
}

// Handle keyboard input
function handleKeyPress(event) {
    if (!gameState.isPlaying) return;
    
    switch(event.key) {
        case 'ArrowLeft':
            event.preventDefault();
            moveBasket(-5);
            break;
        case 'ArrowRight':
            event.preventDefault();
            moveBasket(5);
            break;
    }
}

// Handle mouse movement
function handleMouseMove(event) {
    if (!gameState.isPlaying) return;
    
    const rect = gameArea.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const percentage = (mouseX / rect.width) * 100;
    
    gameState.basketPosition = Math.max(5, Math.min(95, percentage));
    updateBasketPosition();
}

// Handle touch movement
function handleTouchMove(event) {
    event.preventDefault();
    if (!gameState.isPlaying) return;
    
    const touch = event.touches[0];
    const rect = gameArea.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const percentage = (touchX / rect.width) * 100;
    
    gameState.basketPosition = Math.max(5, Math.min(95, percentage));
    updateBasketPosition();
}

// Move basket by percentage
function moveBasket(deltaPercentage) {
    gameState.basketPosition += deltaPercentage;
    gameState.basketPosition = Math.max(5, Math.min(95, gameState.basketPosition));
    updateBasketPosition();
}

// Update basket position
function updateBasketPosition() {
    basket.style.left = gameState.basketPosition + '%';
}

// Start game
function startGame() {
    if (gameState.isPlaying) return;
    
    gameState.isPlaying = true;
    startBtn.disabled = true;
    showMessage('Game started! Catch the egg!', 'info');
    
    dropEgg();
}

// Drop egg
function dropEgg() {
    if (!gameState.isPlaying) return;
    
    // Reset egg position
    gameState.eggPosition.x = Math.random() * 80 + 10; // Random x position between 10% and 90%
    gameState.eggPosition.y = 10;
    gameState.eggFalling = true;
    
    // Reset egg appearance
    egg.className = 'egg falling';
    egg.textContent = '🥚';
    egg.style.left = gameState.eggPosition.x + '%';
    egg.style.top = gameState.eggPosition.y + 'px';
    
    // Start falling animation
    animateEggFall();
}

// Animate egg falling
function animateEggFall() {
    if (!gameState.eggFalling || !gameState.isPlaying) return;
    
    gameState.eggPosition.y += gameState.fallSpeed;
    egg.style.top = gameState.eggPosition.y + 'px';
    
    // Check for collision with basket
    if (checkCollision()) {
        catchEgg();
        return;
    }
    
    // Check if egg hit the ground
    if (gameState.eggPosition.y >= gameState.gameAreaHeight - 70) { // 70px from bottom (basket + ground)
        breakEgg();
        return;
    }
    
    // Continue falling
    requestAnimationFrame(animateEggFall);
}

// Check collision between egg and basket
function checkCollision() {
    const eggLeft = gameState.eggPosition.x;
    const eggRight = gameState.eggPosition.x + 5; // egg width in percentage
    const basketLeft = gameState.basketPosition - 4; // basket width/2 in percentage
    const basketRight = gameState.basketPosition + 4;
    
    const eggBottom = gameState.eggPosition.y + 40; // egg height
    const basketTop = gameState.gameAreaHeight - 60; // basket position from top
    
    return (eggBottom >= basketTop && 
            eggLeft < basketRight && 
            eggRight > basketLeft);
}

// Catch egg
function catchEgg() {
    gameState.eggFalling = false;
    gameState.score += 10;
    
    // Add catching animation to basket
    basket.classList.add('catching');
    setTimeout(() => basket.classList.remove('catching'), 300);
    
    // Hide egg
    egg.style.display = 'none';
    
    updateDisplay();
    showMessage('Great catch! +10 points', 'success');
    
    // Increase difficulty
    gameState.fallSpeed += 0.2;
    
    // Drop next egg after delay
    setTimeout(() => {
        if (gameState.isPlaying) {
            egg.style.display = 'flex';
            dropEgg();
        }
    }, 1500);
}

// Break egg
function breakEgg() {
    gameState.eggFalling = false;
    gameState.lives--;
    
    // Show broken egg
    egg.classList.add('broken');
    egg.textContent = '🍳';
    
    updateDisplay();
    
    if (gameState.lives <= 0) {
        endGame();
    } else {
        showMessage(`Egg broke! ${gameState.lives} lives remaining`, 'failure');
        
        // Drop next egg after delay
        setTimeout(() => {
            if (gameState.isPlaying) {
                dropEgg();
            }
        }, 2000);
    }
}

// End game
function endGame() {
    gameState.isPlaying = false;
    startBtn.disabled = false;
    showMessage(`Game Over! Final Score: ${gameState.score}`, 'failure');
}

// Reset game
function resetGame() {
    gameState.isPlaying = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.eggFalling = false;
    gameState.basketPosition = 50;
    gameState.eggPosition = { x: 50, y: 10 };
    gameState.fallSpeed = 2;
    
    // Reset UI
    startBtn.disabled = false;
    egg.className = 'egg';
    egg.textContent = '🥚';
    egg.style.display = 'flex';
    egg.style.left = '50%';
    egg.style.top = '10px';
    
    basket.style.left = '50%';
    basket.classList.remove('catching');
    
    updateDisplay();
    showMessage('Game reset! Click Start Game to play again.', 'info');
}

// Update display
function updateDisplay() {
    scoreElement.textContent = gameState.score;
    livesElement.textContent = gameState.lives;
}

// Show message
function showMessage(message, type) {
    gameMessage.textContent = message;
    gameMessage.className = `game-message ${type}`;
    
    // Clear message after 3 seconds for success/failure messages
    if (type === 'success' || type === 'failure') {
        setTimeout(() => {
            if (gameMessage.classList.contains(type)) {
                gameMessage.textContent = '';
                gameMessage.className = 'game-message';
            }
        }, 3000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

console.log('Falling EGG Game initialized!');

