import GameObject from './GameObject.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Lava extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.islandX = xPercentage * GameEnv.innerWidth;
        this.islandY = yPercentage * GameEnv.innerHeight; // Initialize islandY with a pixel value
        this.initialDelay = 5000; // 5 seconds delay
        this.risingSpeed = 19; // Adjust the rising speed as needed
        this.lastUpdateTime = Date.now(); // Initialize last update time to current time
        this.timeUntilRise = this.initialDelay; // Time until lava rises
        this.timerElement = document.createElement('div'); // Create a timer element
        this.timerElement.style.position = 'absolute';
        this.timerElement.style.top = '10px';
        this.timerElement.style.left = '10px';
        document.body.appendChild(this.timerElement); // Append timer element to the body
        this.initialDelayElapsed = false; // Flag to track if initial delay has elapsed
        this.startTimer(); // Start the timer
    }

    startTimer() {
        setInterval(() => {
            this.timeUntilRise -= 1000;
            if (this.timeUntilRise <= 0) {
                this.timeUntilRise = 0;
                this.initialDelayElapsed = true; // Set the flag to true when initial delay is over
            }
            this.timerElement.innerText = `Time until lava rises: ${this.timeUntilRise / 1000}s`;
        }, 1000);
    }

    update() {
        if (this.initialDelayElapsed) {
            // Calculate time passed since the last update
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdateTime;

            // Update the lava's position based on rising speed and delta time
            this.islandY -= (this.risingSpeed * deltaTime) / 1000;

            // Update last update time
            this.lastUpdateTime = currentTime;

            // Call collision checks
            this.collisionChecks();
            this.size();
        }
    }

    resetTimer() {
        // Reset the timer back to 5 seconds
        this.timeUntilRise = this.initialDelay;
        this.initialDelayElapsed = false; // Reset the flag
    }
    
    draw() {
        // Draw the lava block on the canvas
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        // Adjust the size and position of the lava block
        const scaledWidth = this.canvas.width * 6.4;
        const scaledHeight = this.canvas.height * 6;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.islandX}px`;
        this.canvas.style.top = `${this.islandY}px`;
    }

    collisionAction() {
        // Placeholder logic for collision action
        if (this.collisionData.touchPoints.other.id === "player") {
            console.log("Player touched lava. Game over!"); // Placeholder action, you can replace it with game over logic
        }
    }
}

export default Lava;
