class Snake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: this.x, y: this.y }];
    this.rotateX = 0;
    this.rotateY = 1;
    this.growing = false; // للتحكم في نمو الثعبان
  }

  move() {
    let newRect;
    if (this.rotateX == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateX == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateY == 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size,
      };
    } else if (this.rotateY == -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size,
      };
    }

    if (!this.growing) {
      this.tail.shift();
    } else {
      this.growing = false;
    }
    this.tail.push(newRect);
  }
}

class Apple {
  constructor() {
    let isTouching;
    while (true) {
      isTouching = false;
      this.x =
        Math.floor((Math.random() * canvas.width) / snake.size) * snake.size;
      this.y =
        Math.floor((Math.random() * canvas.height) / snake.size) * snake.size;
      for (let i = 0; i < snake.tail.length; i++) {
        if (this.x === snake.tail[i].x && this.y === snake.tail[i].y) {
          isTouching = true;
        }
      }
      this.color = "pink";
      this.size = snake.size;
      if (!isTouching) {
        break;
      }
    }
  }
}

let canvas = document.querySelector("#canvas");

let snake = new Snake(20, 20, 20);
let apple = new Apple();

let canvasContext = canvas.getContext("2d");
let gameInterval; // متغير لتخزين دالة setInterval
let gameOver = false;

window.onload = () => {
  gameLoop();
};

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

function resetGame() {
  snake = new Snake(20, 20, 20);
  apple = new Apple();
  gameOver = false;
  clearInterval(gameInterval); // إيقاف التحديثات السابقة
  gameLoop(); // بدء اللعبة من جديد
}

function checkHitSelf() {
  let headTail = snake.tail[snake.tail.length - 1];
  for (let i = 0; i < snake.tail.length - 1; i++) {
    if (headTail.x === snake.tail[i].x && headTail.y === snake.tail[i].y) {
      gameOver = true;
    }
  }
}

function checkHitWall() {
  let headTail = snake.tail[snake.tail.length - 1];
  if (headTail.x < 0) {
    headTail.x = canvas.width - snake.size;
  } else if (headTail.x >= canvas.width) {
    headTail.x = 0;
  } else if (headTail.y < 0) {
    headTail.y = canvas.height - snake.size;
  } else if (headTail.y >= canvas.height) {
    headTail.y = 0;
  }
}

function eatApple() {
  if (
    snake.tail[snake.tail.length - 1].x == apple.x &&
    snake.tail[snake.tail.length - 1].y == apple.y
  ) {
    snake.growing = true; // عند أكل التفاحة، يجب أن ينمو الثعبان
    apple = new Apple();
  }
}

function draw() {
  createRect(0, 0, canvas.width, canvas.height, "#263238");
  for (let i = 0; i < snake.tail.length; i++) {
    createRect(
      snake.tail[i].x + 2.5,
      snake.tail[i].y + 2.5,
      snake.size - 5,
      snake.size - 5,
      "#fff"
    );
  }

  createRect(apple.x, apple.y, apple.size, apple.size, apple.color);

  canvasContext.font = "20px Arial";
  canvasContext.fillStyle = "#2E7D32";
  canvasContext.fillText(
    "Score: " + (snake.tail.length - 1),
    canvas.width - 120,
    18
  );

  if (gameOver) {
    canvasContext.font = "50px Arial";
    canvasContext.fillStyle = "red";
    canvasContext.fillText(
      "Game Over",
      canvas.width / 2 - 150,
      canvas.height / 2
    );

    canvasContext.font = "20px Arial";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
      "Press Space or Enter to Restart",
      canvas.width / 2 - 140,
      canvas.height / 2 + 50
    );

    clearInterval(gameInterval); // إيقاف اللعبة عند الخسارة
    return;
  }
}

function createRect(x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

window.addEventListener("keydown", (event) => {
  if (gameOver && (event.keyCode == 32 || event.keyCode == 13)) {
    resetGame();
    gameOver = false;
  }

  setTimeout(() => {
    if (!gameOver) {
      if ((event.keyCode == 37 || event.keyCode == 65) && snake.rotateX != 1) {
        snake.rotateX = -1;
        snake.rotateY = 0;
      } else if (
        (event.keyCode == 38 || event.keyCode == 87) &&
        snake.rotateY != 1
      ) {
        snake.rotateX = 0;
        snake.rotateY = -1;
      } else if (
        (event.keyCode == 39 || event.keyCode == 68) &&
        snake.rotateX != -1
      ) {
        snake.rotateX = 1;
        snake.rotateY = 0;
      } else if (
        (event.keyCode == 40 || event.keyCode == 83) &&
        snake.rotateY != -1
      ) {
        snake.rotateX = 0;
        snake.rotateY = 1;
      }
    }
  }, 1);
});
