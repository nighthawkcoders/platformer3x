import GameObject from './GameObject.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Lava extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.islandX = xPercentage * GameEnv.innerWidth;
        this.islandY = yPercentage * GameEnv.innerHeight; // Initialize islandY with a pixel value
        this.risingSpeed = 20; // Adjust the rising speed as needed
        this.lastUpdateTime = Date.now(); // Initialize last update time to current time
    }

    update() {
        // Calculate time passed since the last update
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;

        // Update the lava's position based on rising speed and delta time
        this.islandY -= (this.risingSpeed * deltaTime) / 1000;

        // Log the Y position every time it changes
        //console.log("Lava Y Position:", this.islandY);

        // Update last update time
        this.lastUpdateTime = currentTime;

        // Call collision checks
        this.collisionChecks();
        this.size();
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
            // Add game over logic here
        }
    }
}

export default Lava;