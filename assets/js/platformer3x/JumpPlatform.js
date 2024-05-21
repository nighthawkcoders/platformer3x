import GameControl from './GameControl.js';
import GameEnv from './GameEnv.js';
import GameSetup from './GameSetup.js';
import PlatformBase from './PlatformBase.js';

export class JumpPlatform extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage, name) {
        super(canvas, image, data);
        this.platformX = xPercentage * GameEnv.innerWidth;
        this.platformY = yPercentage;
        this.name = name;
        this.relativeX = ""; // used for the item block's spritesheet.
    }

    // Override update to include collision checks
    update() {
        this.collisionChecks();
        // No need to call super.update() if specific logic is used for JumpPlatform
    }

    collisionChecks() {
        // Define your collision checks here
        // Example collision check logic
        if (this.collisionData.touchPoints?.other?.id === "player" && this.name === "itemBlock") {
            this.collisionAction();
        }
    }

    collisionAction() {
        // Collision only detects the player and it only applies to the item block
        if (this.relativeX === 0 || this.relativeX === this.canvas.width) {
            if (this.relativeX === 0) {
                GameControl.startRandomEvent("game");
            }
            this.relativeX = -1 * this.canvas.width;
        } else if (this.relativeX === "") {
            this.relativeX = 0;
        }
    }

    // Override size to apply specific sizing logic for JumpPlatform
    size() {
        const scaledHeight = GameEnv.innerHeight * (this.data.sizeRatio / 832);
        const scaledWidth = GameEnv.innerHeight * 0.1; // width of jump platform is 1/10 of height
        const platformX = this.platformX;
        const platformY = (GameEnv.bottom - scaledHeight) * this.platformY;
        this.x = platformX;
        this.y = platformY;

        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        // Update canvas size and position
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`;
    }

    // Override draw to use specific drawing logic for JumpPlatform
    draw() {
        this.ctx.drawImage(this.image, this.relativeX, 0, this.canvas.width / this.data.widthRatio, this.canvas.height / this.data.heightRatio);
    }
}

export default JumpPlatform;
