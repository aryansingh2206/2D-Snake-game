const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

canvas.width = 400;
canvas.height = 400;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameRunning = false;
let speed = 150;
let gameInterval;

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
}

function update() {
    if (!gameRunning) return;

    let head = { x: snake[0].x + direction.x * gridSize, y: snake[0].y + direction.y * gridSize };

    // Check for wall collision
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        resetGame();
        return;
    }

    // Check for self-collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            resetGame();
            return;
        }
    }

    // Eating food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        speed = Math.max(50, speed - 5); // Increase speed after eating
        scoreDisplay.textContent = score;
        placeFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    snake.unshift(head);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function gameLoop() {
    update();
    draw();
}

function resetGame() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score: ${score}`);
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    speed = 150;
    scoreDisplay.textContent = score;
    gameRunning = false;
    placeFood();
}

document.addEventListener("keydown", (event) => {
    if (!gameRunning) {
        gameRunning = true;
        gameInterval = setInterval(gameLoop, speed);
    }

    if (event.key === "ArrowUp" && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (event.key === "ArrowDown" && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (event.key === "ArrowLeft" && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (event.key === "ArrowRight" && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
});

placeFood();
draw();
