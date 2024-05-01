import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class SpawnPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.isHidden = false; // Initially show the platform
        // this.showDelay = 4000; // Delay of 4 seconds
        this.showDelay = Math.floor(Math.random() * 9000) + 1000; // Random delay between 1 to 10 seconds (in milliseconds)
        setTimeout(() => {
            this.isHidden = true; // After the  delay, hide the platform
            this.size(); // Update size and position
        }, this.showDelay);
    }

    // Required, but no update action
    update() {
        //console.log(this.platformY)
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Set platform position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (1/27);
        const scaledWidth = scaledHeight;  // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        //this.canvas.width = this.width;
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }
}

export default SpawnPlatform;
