import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class MagicBeam extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data);

        // Unused but must be Defined
        this.name = name;

        // Initial Position
        this.x = xPercentage * GameEnv.innerWidth;
        this.yPercentage = yPercentage;
        this.updateYPosition();

        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;
    }

    updateYPosition() {
        this.y = GameEnv.bottom * this.yPercentage;
        this.canvas.style.top = `${this.y}px`;
    }

    update() {
        super.update();

        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        }
        this.playerBottomCollision = false;

        // Update Y position in case the game environment changes
        this.updateYPosition();
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.collisionData.touchPoints.other.bottom && this.immune === 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce1 = true;
                this.canvas.style.transition = "transform 1.5s, opacity 1s";
                this.canvas.style.transformOrigin = "bottom"; 
                this.canvas.style.transform = "scaleY(0)"; 
                this.speed = 0;

                setTimeout(() => {
                    GameEnv.invincible = false;
                    this.destroy();
                    GameEnv.destroyedMagicBeam = true;
                }, 1500);
            }
        }
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }
}

export default MagicBeam;
