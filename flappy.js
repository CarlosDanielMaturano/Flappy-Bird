const bird = document.getElementById('bird');
const gameBox = document.getElementById('gameBox');
const obstacleTop = document.getElementById('obstacleTop');
const obstacleBottom = document.getElementById('obstacleBottom');
const scoreTag = document.getElementById('score');
const gameOverTag = document.getElementById('gameOver');
const medalBox = document.getElementById('medalBox');
const goldMedal = document.getElementById('goldMedal');
const silverMedal = document.getElementById('silverMedal');
const bronzeMedal = document.getElementById('bronzeMedal');

let birdY = 200;
let birdX = 100;
let obstacleX = 650; // Set initial pipe position outside of the game area
let score = 0;
const gravity = 0.2; // Modify this to adjust the falling speed
let velocity = 0;
let isGameStarted = false;
let isDead = false;

// Generate the height for obstacles
const gapHeight = 150;
let obstacleTopHeight = Math.floor(Math.random() * 200) + 50;
let obstacleBottomHeight = 480 - obstacleTopHeight - gapHeight;

// Fps limiter
const fps = 60;
let now;
let then = Date.now();
const interval = 1000/fps;
let delta;

// Speed decider
const flyHeight = -6;

function fly() {
    if (!isGameStarted && !isDead) {
        startGame();
    }
    velocity = flyHeight;
    bird.style.transform = 'rotate(-20deg)'; // Rotate the bird upward
}

function startGame() {
    birdY = 200;
    birdX = 100;
    isGameStarted = true;
    bird.style.display = 'block';
    scoreTag.style.display = 'block';

    // Hide medal box and medals
    medalBox.style.display = 'none';
    goldMedal.style.display = 'none';
    silverMedal.style.display = 'none';
    bronzeMedal.style.display = 'none';

    gameOverTag.style.position = 'absolute';

    update()
}

function gameOver() {
    isGameStarted = false;
    isDead = true;

    // New game over animation
    if (birdY < 480) { // 480 is the height of the game area
        now = Date.now();
        delta = now - then;

        requestAnimationFrame(gameOver);

        if (delta > interval) {
            then = now - (delta % interval);

            birdY += 10; // This moves the bird down
            bird.style.top = birdY + 'px';
        }
        
    } else {
        bird.style.display = 'none';
        gameOverTag.style.display = 'block';
        scoreTag.style.display = 'block';
        birdY = 200;
        obstacleX = 650;
        velocity = 0;

        goldMedal.style.display = (score >= 100) ? 'block' : 'none';
        silverMedal.style.display = (score >= 50 && score < 100) ? 'block' : 'none';
        bronzeMedal.style.display = (score < 50) ? 'block' : 'none';
        
        score = 0;
        medalBox.style.display = 'block';

        
        setTimeout(() => { isDead = false }, 2000);
    }

}

function update() {
    if (!isGameStarted) return;

    requestAnimationFrame(update);

    now = Date.now();
    delta = now - then;

    if (delta < interval) return;

    then = now - (delta % interval);

    birdY += velocity;
    velocity += gravity;
    obstacleX -= 5; // This makes the pipe move from right to left

    bird.style.top = birdY + 'px';
    bird.style.left = birdX + 'px';

    if(velocity > 0) {
        bird.style.transform = `rotate(${Math.min(velocity * 3, 90)}deg)`;
    }

    obstacleTop.style.left = obstacleX + 'px';
    obstacleTop.style.height = obstacleTopHeight + 'px';

    obstacleBottom.style.left = obstacleX + 'px';
    obstacleBottom.style.height = obstacleBottomHeight + 'px';
    obstacleBottom.style.bottom = 0;

    if(obstacleX < -50) {
        obstacleX = 650; // Reset the pipe position outside of the game area
        obstacleTopHeight = Math.floor(Math.random() * 200) + 50;
        obstacleBottomHeight = 480 - obstacleTopHeight - gapHeight;
        score++;
    }

    if(birdY > 480 || birdY < 0 || 
      (obstacleX < birdX + 20 && obstacleX + 50 > birdX && 
      (birdY < obstacleTopHeight || birdY + 20 > obstacleTopHeight + gapHeight))) {
        gameOverTag.innerHTML = "Game Over. Score: " + score + "<br> Click to try again.";
        gameOver();
    }

    scoreTag.innerHTML = 'Score: ' + score;

}

window.addEventListener('click', fly);
window.addEventListener('touchstart', fly);
window.addEventListener('keydown', function(e){
    if(e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') fly();
});

// Initially, hide bird and score, show game over message
gameOverTag.innerHTML = "Click to start the game";
bird.style.display = 'none';
scoreTag.style.display = 'none';
