const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dino = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 12,
    jumping: false,
    jumpHeight: 0,
};

let obstacle = createObstacle(); // Create the first obstacle

let score = 0;
let gameInterval;
let isGameOver = false;
let lastScoreUpdateTime = 0; // Track the last time the score was updated
let hasPassedObstacle = false; // Track if the Dino has passed the current obstacle

let displayText = ""; // Text to be displayed
let displayTextTimeout; // Timeout for clearing the displayed text

document.addEventListener("keydown", function (event) {
    if (event.key === " " && !dino.jumping) {
        jump();
    }
});

function createObstacle() {
    const minHeight = 10;
    const maxHeight = 70;
    const obstacleHeight = getRandomNumberForDimension(minHeight, maxHeight);

    return {
        x: canvas.width,
        y: canvas.height - obstacleHeight,
        width: 30,
        height: obstacleHeight,
        speed: 3,
    };
}

function jump() {
    if (!dino.jumping) {
        dino.jumping = true;
        dino.jumpHeight = 0;

        const jumpInterval = setInterval(function () {
            dino.y -= Math.sin(dino.jumpHeight) * 6;
            dino.jumpHeight += 0.12;

            if (dino.jumpHeight >= Math.PI) {
                clearInterval(jumpInterval);
                fall();
            }
        }, 20);
    }
}

function fall() {
    const fallInterval = setInterval(function () {
        if (dino.y < canvas.height - dino.height) {
            dino.y += 5;
        } else {
            dino.jumping = false;
            clearInterval(fallInterval);
        }

        // Stop falling if there's a collision
        if (dino.x + dino.width > obstacle.x && dino.y + dino.height > obstacle.y && dino.x < obstacle.x + obstacle.width) {
            clearInterval(fallInterval);
        }
    }, 20);
}

function updateScore() {
    // Calculate the time elapsed since the last score update
    const currentTime = performance.now();
    const timeElapsed = currentTime - lastScoreUpdateTime;

    // Update the score once per 100 milliseconds)
    if (timeElapsed >= 100) {
        score++;
        lastScoreUpdateTime = currentTime; // Update the last update time
    }
}

function checkCollision() {
    if (
        dino.x + dino.width > obstacle.x &&
        dino.y + dino.height > obstacle.y &&
        dino.x < obstacle.x + obstacle.width
    ) {
        gameOver();
    } else if (dino.x > obstacle.x + obstacle.width && obstacle.x + obstacle.width > 0) {
        if (!hasPassedObstacle) {
            // Dino has successfully passed an obstacle
            updateScoreByPassingObstacle(obstacle.height); // Pass the obstacle's height
            hasPassedObstacle = true;
            displayText = "+" + Math.round(obstacle.height) + ", good job!";
            displayTextTimeout = setTimeout(function () {
                displayText = "";
            }, 1000); // display the text for 1 sec
        }
    } else {
        // Reset the flag when the obstacle is behind the Dino
        hasPassedObstacle = false;
    }
}

function updateScoreByPassingObstacle(_height) {
    score += Math.round(_height); // Add the integer height to the score
}

function gameOver() {
    clearInterval(gameInterval);
    isGameOver = true;

    const modal = document.getElementById("gameOverModal");
    const gameOverText = document.getElementById("gameOverText");
    const finalScoreText = document.getElementById("finalScoreText");

    gameOverText.innerText = "Game over!";
    finalScoreText.innerText = "Score: " + score;

    modal.style.display = "block";
}

// Add an event listener to close the modal when the "X" button is clicked
const closeModal = document.querySelector(".close");
closeModal.addEventListener("click", function () {
    const modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    location.reload(); // Refresh the page to restart the game
});

function getRandomNumberForDimension(min, max) {
    return Math.random() * (max - min) + min;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the ground
    ctx.fillStyle = "#d2b48c";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Draw the dino
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // Randomly place the red obstacle along the x-axis
    if (obstacle.x + obstacle.width < 0) {
        obstacle = createObstacle(); // Create a new obstacle
        obstacle.x = canvas.width + getRandomNumberForDimension(-500, 100);
        hasPassedObstacle = false; // Reset the flag for the new obstacle
    }

    // Draw the obstacle
    ctx.fillStyle = "#0bbf1b";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Draw the score
    ctx.fillStyle = "#333";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 30, 50);

    // Draw the displayed text in the middle of the canvas
    if (displayText) {
        ctx.fillStyle = "#333";
        ctx.font = "24px Arial";
        const textWidth = ctx.measureText(displayText).width;
        const textX = (canvas.width - textWidth) / 2;
        const textY = canvas.height / 2;
        ctx.fillText(displayText, textX, textY);
    }

    // Draw the obstacle's height text on the frame right within the red obstacle
    ctx.fillStyle = "#333";
    ctx.font = "16px Arial";
    const heightText = Math.round(obstacle.height).toString(); // Convert height to string
    const textWidth = ctx.measureText(heightText).width;
    const textX = obstacle.x + (obstacle.width - textWidth) / 2; // Center horizontally
    const textY = obstacle.y + obstacle.height / 2 + 6; // Center vertically
    ctx.fillText(heightText, textX, textY);

    requestAnimationFrame(draw);
}

gameInterval = setInterval(function () {
    if (!isGameOver) {
        obstacle.x -= obstacle.speed;
        updateScore();
        checkCollision();
    }
}, 10);

requestAnimationFrame(draw);
