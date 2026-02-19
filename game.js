// Snake Game - Phaser.js

let snake, food, cursors, score = 0, scoreText, gameOver = false;
let lastMoveTime = 0;
let moveDelay = 150;
let direction = 'right';
let nextDirection = 'right';
let gridSize = 20;
let tileCount = 25;

function preload() {
    // Create simple textures programmatically
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Snake segment texture (green square)
    graphics.fillStyle(0x00ff00);
    graphics.fillRect(0, 0, gridSize, gridSize);
    graphics.generateTexture('snake', gridSize, gridSize);
    
    // Food texture (red square)
    graphics.clear();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, gridSize, gridSize);
    graphics.generateTexture('food', gridSize, gridSize);
}

function create() {
    // Background
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Create snake array
    snake = [];
    for (let i = 0; i < 5; i++) {
        snake.push(this.add.image(100 - i * gridSize, 100, 'snake'));
    }
    
    // Create food
    food = this.add.image(200, 100, 'food');
    
    // Controls
    cursors = this.input.keyboard.createCursorKeys();
    
    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
    
    // Instructions
    this.add.text(16, 50, 'Arrow keys to move', {
        fontSize: '16px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
}

function update(time) {
    if (gameOver) {
        return;
    }
    
    // Handle input
    if (cursors.left.isDown && direction !== 'right') {
        nextDirection = 'left';
    } else if (cursors.right.isDown && direction !== 'left') {
        nextDirection = 'right';
    } else if (cursors.up.isDown && direction !== 'down') {
        nextDirection = 'up';
    } else if (cursors.down.isDown && direction !== 'up') {
        nextDirection = 'down';
    }
    
    // Move snake based on time delay
    if (time - lastMoveTime > moveDelay) {
        direction = nextDirection;
        moveSnake.call(this);
        lastMoveTime = time;
    }
}

function moveSnake() {
    const head = snake[0];
    let newX = head.x;
    let newY = head.y;
    
    // Calculate new head position
    switch (direction) {
        case 'left':
            newX -= gridSize;
            break;
        case 'right':
            newX += gridSize;
            break;
        case 'up':
            newY -= gridSize;
            break;
        case 'down':
            newY += gridSize;
            break;
    }
    
    // Check wall collision
    if (newX < 0 || newX >= tileCount * gridSize || newY < 0 || newY >= tileCount * gridSize) {
        gameOver = true;
        this.add.text(400, 300, 'GAME OVER', {
            fontSize: '48px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        return;
    }
    
    // Check self collision
    for (let segment of snake) {
        if (newX === segment.x && newY === segment.y) {
            gameOver = true;
            this.add.text(400, 300, 'GAME OVER', {
                fontSize: '48px',
                fill: '#ff0000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            return;
        }
    }
    
    // Create new head
    const newHead = this.add.image(newX, newY, 'snake');
    snake.unshift(newHead);
    
    // Check food collision
    if (newX === food.x && newY === food.y) {
        // Increase score
        score += 10;
        scoreText.setText('Score: ' + score);
        
        // Move food to new random position
        food.x = Math.floor(Math.random() * tileCount) * gridSize + gridSize / 2;
        food.y = Math.floor(Math.random() * tileCount) * gridSize + gridSize / 2;
        
        // Increase speed slightly
        moveDelay = Math.max(100, moveDelay - 2);
    } else {
        // Remove tail if no food eaten
        const tail = snake.pop();
        tail.destroy();
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 500,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Initialize game
const game = new Phaser.Game(config);