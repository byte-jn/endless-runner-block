const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let move = true;
let height = 0;

const player = {
  x: 60,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 10,
  flightspeed: canvas.height - 50,
  jumping: false,
  allowed: true,
  difficultyspace: 400
};

const obstacles = [];
let score = 0;

function drawPlayer() {
  ctx.fillStyle = '#0F0';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  for (let obstacle of obstacles) {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  }
}

function drawScore() {
  ctx.fillStyle = '#FFF';
  ctx.font = '24px Arial';
  ctx.fillText("Score: " + score, 20, canvas.height/2- 30)
  ctx.fillText("Speed: " + Math.round(player.speed,0), 20, canvas.height/2);
  ctx.fillText("Space: " + Math.round(player.difficultyspace,0), 20, canvas.height/2+ 30);
  ctx.fillText("Height: " + Math.round(height,0), 20, canvas.height/2+ 60);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawScore();

  if (player.allowed) {
    if (player.jumping) {
      player.y -= player.flightspeed;
      if (player.y === 0) {
        player.jumping = false;
        player.allowed = false;
      }
    }
  } else {
    if (player.jumping) {
      player.y += player.flightspeed;
      if (player.y === canvas.height - player.height) {
        player.allowed = true;
        player.jumping = false;
      }
    }
  }

  player.speed = 10 * (1 + (score / 50));

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x <= canvas.width - player.difficultyspace ){
    const obstaclesheight = canvas.height - 50 - Math.random() * 500;
    const obstacleY = Math.random() > 0.5 ? 0 : canvas.height - obstaclesheight;
    const obstacle = {
      x: canvas.width,
      y: obstacleY,
      width: 50,
      height: obstaclesheight,
    };
    height = obstaclesheight;
    obstacles.push(obstacle);
  }

  for (let obstacle of obstacles) {
    obstacle.x -= player.speed;

    if (collision(player, obstacle)) {
      move = false;
    }
  }

  for (let i = 0; i < obstacles.length; i++) {
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      i--;
    }
  }

  if (move) {
    requestAnimationFrame(update);
  }
}

function collision(player, obstacle) {
  return (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  );
}

document.addEventListener('keydown', (event) => {
  if (event.keyCode === 32) {
    if (!player.jumping) {
      player.jumping = true;
    }
    else {
      player.jumping = false;
      player.falling = true;
    }
  }
});

update();