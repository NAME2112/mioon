const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, dx, dy, food, game;
let tileCount;

// Mobile responsive canvas
function resizeCanvas() {
  let size = Math.min(window.innerWidth, window.innerHeight - 150);
  size = Math.floor(size / box) * box;
  canvas.width = size;
  canvas.height = size;
  tileCount = size / box;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function init() {
  snake = [{ x: box * 5, y: box * 5 }];
  dx = box;
  dy = 0;
  spawnFood();
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * tileCount) * box,
    y: Math.floor(Math.random() * tileCount) * box
  };
}

// Arrow key control
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) setDirection("up");
  if (e.key === "ArrowDown" && dy === 0) setDirection("down");
  if (e.key === "ArrowLeft" && dx === 0) setDirection("left");
  if (e.key === "ArrowRight" && dx === 0) setDirection("right");
});

// Touch button control
function setDirection(dir) {
  if (dir === "up" && dy === 0) { dx = 0; dy = -box; }
  if (dir === "down" && dy === 0) { dx = 0; dy = box; }
  if (dir === "left" && dx === 0) { dx = -box; dy = 0; }
  if (dir === "right" && dx === 0) { dx = box; dy = 0; }
}

// Swipe control
let startX, startY;
canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});
canvas.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  let diffX = touch.clientX - startX;
  let diffY = touch.clientY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) setDirection("right");
    else setDirection("left");
  } else {
    if (diffY > 0) setDirection("down");
    else setDirection("up");
  }
});

function bodyCollision(head, body) {
  return body.some(p => p.x === head.x && p.y === head.y);
}

function drawSnake() {
  snake.forEach((p, index) => {
    ctx.fillStyle = "lime";
    ctx.fillRect(p.x, p.y, box, box);

    if (index === 0) {
      ctx.fillStyle = "black";
      let eyeSize = box / 5;
      let offsetX = (dx > 0) ? box - eyeSize*2 : (dx < 0) ? eyeSize : box/4;
      let offsetY = (dy > 0) ? box - eyeSize*2 : (dy < 0) ? eyeSize : box/4;

      ctx.fillRect(p.x + offsetX, p.y + offsetY, eyeSize, eyeSize);
      ctx.fillRect(p.x + offsetX, p.y + offsetY + eyeSize*2, eyeSize, eyeSize);
    }
  });
}

function gameLoop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  drawSnake();

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // wall wrap
  if (head.x < 0) head.x = (tileCount - 1) * box;
  if (head.x >= tileCount * box) head.x = 0;
  if (head.y < 0) head.y = (tileCount - 1) * box;
  if (head.y >= tileCount * box) head.y = 0;

  if (bodyCollision(head, snake)) {
    alert("Game Over 💀");
    clearInterval(game);
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    spawnFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
}

function resetGame() {
  clearInterval(game);
  init();
  game = setInterval(gameLoop, 150);
}

init();
game = setInterval(gameLoop, 150);