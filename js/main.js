const board_border = "#f1c40f";
const board_background = "#fffdd0";
const snake_color = "#2c3e50";
const snake_border = "black";
const apple_color = "red";
const apple_bordrer = "black";

// Начальное расположение
let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
];

let score = 0;
let changing_direction = false;
let food_x;
let food_y;
let dx = 10;
let dy = 0;

const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

main();
foodGeneration();

document.addEventListener("keydown", change_direction);

function main() {
  if (gaveOver()) {
    document.querySelector("h1").textContent = "THE END";
    return;
  }

  changing_direction = false;
  setTimeout(function onTick() {
    clear();
    drawFood();
    moveSnake();
    drawSnake();
    main();
  }, 100);
}

// Настройка поля
function clear() {
  snakeboard_ctx.fillStyle = board_background;
  snakeboard_ctx.strokeStyle = board_border;
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

// Рисуем змейку
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// Настройки змейки
function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = snake_color;
  snakeboard_ctx.strokestyle = snake_border;
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Настройки еды
function drawFood() {
  snakeboard_ctx.fillStyle = apple_color;
  snakeboard_ctx.strokeStyle = apple_bordrer;
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// Рандомное местоположение еды
function foodRandomizer(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

// Генерация еды
function foodGeneration() {
  food_x = foodRandomizer(0, snakeboard.width - 10);
  food_y = foodRandomizer(0, snakeboard.height - 10);
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) foodGeneration();
  });
}

// Проверка на конец игры
function gaveOver() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

// Назначение клавиш направления
function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  // Проверка поворота на 180
  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function moveSnake() {
  // Создание головы змейки
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Новая голова в начало змейки
  snake.unshift(head);
  const eatenFood = snake[0].x === food_x && snake[0].y === food_y;
  if (eatenFood) {
    score += 1;
    document.querySelector("h1").textContent = score;
    foodGeneration();
  } else {
    snake.pop();
  }
}
