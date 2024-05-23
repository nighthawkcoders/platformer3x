import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class ChocoFrog extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be Defined
        this.name = name;

        //Initial Position 
        this.x = xPercentage * GameEnv.innerWidth;
        this.yPercentage = yPercentage;

        // Calculate initial Y position
        this.y = GameEnv.bottom * this.yPercentage;
        this.canvas.style.top = `${this.y}px`;

        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;

    }

    update() {
        super.update();

        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        }
        this.playerBottomCollision = false;

        this.y = GameEnv.bottom * this.yPercentage;
        this.canvas.style.top = `${this.y}px`;
    }

    // Player action on collisions
    collisionAction() {
   

        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce1 = true;
                this.canvas.style.transition = "transform 1.5s, opacity 1s";
                this.canvas.style.transition = "transform 2s, opacity 1s";
                this.canvas.style.transformOrigin = "bottom"; 
                this.canvas.style.transform = "scaleY(0)"; 
                this.speed = 0;
                GameEnv.playSound("Mushroom");

                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                    GameEnv.destroyedChocoFrog = true;
                }).bind(this), 1500);
            }

        }
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }
}

export default ChocoFrog;