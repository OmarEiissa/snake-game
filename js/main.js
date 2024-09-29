class Snake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: this.x, y: this.y }];
    this.rotateX = 0;
    this.rotateY = 1;
    this.growing = false;
  }

  move() {
    let newRect = {
      x: this.tail[this.tail.length - 1].x + this.rotateX * this.size,
      y: this.tail[this.tail.length - 1].y + this.rotateY * this.size,
    };

    if (!this.growing) {
      this.tail.shift();
    } else {
      this.growing = false;
    }
    this.tail.push(newRect);
  }
}

class Apple {
  constructor(snakeSize, snakeTail) {
    let isTouching;
    while (true) {
      isTouching = false;
      this.x =
        Math.floor((Math.random() * canvas.width) / snakeSize) * snakeSize;
      this.y =
        Math.floor((Math.random() * canvas.height) / snakeSize) * snakeSize;
      for (let segment of snakeTail) {
        if (this.x === segment.x && this.y === segment.y) {
          isTouching = true;
          break;
        }
      }
      this.color = "#2E7D32";
      this.size = snakeSize;
      if (!isTouching) break;
    }
  }
}

const canvas = document.querySelector("#canvas");
const canvasContext = canvas.getContext("2d");
let snake = new Snake(20, 20, 20);
let apple = new Apple(snake.size, snake.tail);
let gameInterval;
let gameOver = false;
let score = 0;

const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const startContainer = document.querySelector(".start-container");
const gameOverContainer = document.querySelector(".restart-container");

window.onload = () => {
  startContainer.style.display = "block";
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", resetGame);
  gameOverContainer.style.display = "none";
};

function startGame() {
  resetGame();
  startBtn.style.display = "none";
}

function resetGame() {
  snake = new Snake(20, 20, 20);
  apple = new Apple(snake.size, snake.tail);
  gameOver = false;
  score = 0;
  scoreElement.textContent = "Score: " + score;
  clearInterval(gameInterval);
  gameLoop();
  gameOverContainer.style.display = "none";
}

function gameLoop() {
  gameInterval = setInterval(show, 1000 / 15);
}

function show() {
  update();
  draw();
}

function update() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  eatApple();
  checkHitSelf();
  checkHitWall();
}

function checkHitSelf() {
  const head = snake.tail[snake.tail.length - 1];
  for (let i = 0; i < snake.tail.length - 1; i++) {
    if (head.x === snake.tail[i].x && head.y === snake.tail[i].y) {
      gameOver = true;
    }
  }
}

function checkHitWall() {
  const head = snake.tail[snake.tail.length - 1];
  if (head.x < 0) head.x = canvas.width - snake.size;
  else if (head.x >= canvas.width) head.x = 0;
  else if (head.y < 0) head.y = canvas.height - snake.size;
  else if (head.y >= canvas.height) head.y = 0;
}

function eatApple() {
  if (
    snake.tail[snake.tail.length - 1].x === apple.x &&
    snake.tail[snake.tail.length - 1].y === apple.y
  ) {
    snake.growing = true;
    apple = new Apple(snake.size, snake.tail);
    score++;
    scoreElement.textContent = "Score: " + score;
  }
}

function draw() {
  createRect(0, 0, canvas.width, canvas.height, "#263238");
  for (let segment of snake.tail) {
    createRect(
      segment.x + 2.5,
      segment.y + 2.5,
      snake.size - 5,
      snake.size - 5,
      "#fff"
    );
  }
  createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
  if (gameOver) {
    gameOverContainer.style.display = "flex";
    clearInterval(gameInterval);
  }
}

function createRect(x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

window.addEventListener("keydown", (event) => {
  if (gameOver && (event.keyCode === 32 || event.keyCode === 13)) {
    resetGame();
    gameOver = false;
  }
  setTimeout(() => {
    if (!gameOver) {
      if (
        (event.keyCode === 37 || event.keyCode === 65) &&
        snake.rotateX !== 1
      ) {
        snake.rotateX = -1;
        snake.rotateY = 0;
      } else if (
        (event.keyCode === 38 || event.keyCode === 87) &&
        snake.rotateY !== 1
      ) {
        snake.rotateX = 0;
        snake.rotateY = -1;
      } else if (
        (event.keyCode === 39 || event.keyCode === 68) &&
        snake.rotateX !== -1
      ) {
        snake.rotateX = 1;
        snake.rotateY = 0;
      } else if (
        (event.keyCode === 40 || event.keyCode === 83) &&
        snake.rotateY !== -1
      ) {
        snake.rotateX = 0;
        snake.rotateY = 1;
      }
    }
  }, 1);
});
