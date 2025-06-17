const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 20;
const PLAYER_COLOR = '#09fbd3';
const AI_COLOR = '#f00';
const BALL_COLOR = '#fff';

// Game objects
let player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: PLAYER_COLOR
};

let ai = {
    x: canvas.width - PADDLE_MARGIN - PADDLE_WIDTH,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: AI_COLOR,
    speed: 4
};

let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    color: BALL_COLOR,
    speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
    speedY: 4 * (Math.random() > 0.5 ? 1 : -1)
};

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top/bottom walls
    if (ball.y <= 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + BALL_SIZE >= canvas.height) {
        ball.y = canvas.height - BALL_SIZE;
        ball.speedY *= -1;
    }

    // Ball collision with player paddle
    if (
        ball.x <= player.x + player.width &&
        ball.y + ball.height >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.x = player.x + player.width;
        ball.speedX *= -1;
        // Add some randomness to ball direction
        ball.speedY += (Math.random() - 0.5) * 2;
    }

    // Ball collision with AI paddle
    if (
        ball.x + ball.width >= ai.x &&
        ball.y + ball.height >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.x = ai.x - ball.width;
        ball.speedX *= -1;
        ball.speedY += (Math.random() - 0.5) * 2;
    }

    // Ball out of bounds (reset)
    if (ball.x < 0 || ball.x + ball.width > canvas.width) {
        resetBall();
    }

    // Simple AI: follow the ball with some delay
    let aiCenter = ai.y + ai.height / 2;
    let ballCenter = ball.y + ball.height / 2;
    if (ballCenter < aiCenter - 10) {
        ai.y -= ai.speed;
    } else if (ballCenter > aiCenter + 10) {
        ai.y += ai.speed;
    }
    // Prevent AI paddle from going out of bounds
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle line
    ctx.fillStyle = "#444";
    for (let y = 0; y < canvas.height; y += 30) {
        ctx.fillRect(canvas.width / 2 - 2, y, 4, 20);
    }

    // Draw paddles
    drawRect(player);
    drawRect(ai);

    // Draw ball
    drawRect(ball);
}

// Draw a rectangle object
function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Prevent paddle from going out of bounds
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Reset ball to center with random direction
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    // Randomize direction
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Start the game
gameLoop();