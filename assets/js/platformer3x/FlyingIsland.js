import GameObject from './GameObject.js';
import GameEnv from './GameEnv.js';

export class FlyingIsland extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage, bobbingHeight, bobbingSpeed) {
        super(canvas, image, data);
        this.islandX = xPercentage * GameEnv.innerWidth;
        this.islandY = yPercentage * GameEnv.innerHeight; // Initialize islandY with a pixel value
        this.bobbingHeight = bobbingHeight;
        this.bobbingSpeed = bobbingSpeed;
        this.bobbingDirection = 1; // 1 for up, -1 for down
        this.relativeX = ""; //used for the item block's spritesheet.
        // Add glow effect
        this.canvas.style.boxShadow = "0 0 10px 5px rgba(255, 255, 0, 0.7)";
    }

    update() {
        // Bobbing motion
        this.islandY += this.bobbingSpeed * this.bobbingDirection;

        
        // Reverse direction if the island reaches the bobbing limits
        if (this.islandY <= this.yPercentage * GameEnv.innerHeight - this.bobbingHeight) {
            this.bobbingDirection = 1;
        } else if (this.islandY >= this.yPercentage * GameEnv.innerHeight) {
            this.bobbingDirection = -1;
        }
        this.collisionChecks();
    }

    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    size() {
        const scaledWidth = this.canvas.width;
        const scaledHeight = this.canvas.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.islandX}px`;
        this.canvas.style.top = `${this.islandY}px`;
    }

    collisionAction() {
        //collision only detects mario and it only applies to the item block
        if (this.collisionData.touchPoints.other.id === "player" && this.name === "flyingIsland") {
            console.log("yes")
            if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
                if (this.relativeX === 0) {
                    GameControl.startRandomEvent("game");
                    //console.log("randomEventtriggered", GameControl.randomEventId);
                };
                this.relativeX = -1 * this.canvas.width;
            } else if (this.relativeX === "") {
                this.relativeX = 0;
            }
        }        
    }

}


export default FlyingIsland;
