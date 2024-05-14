import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class MagicBeam extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        //Initial Position 
        this.x = xPercentage * GameEnv.innerWidth;


        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;
    }

    update() {
        super.update();

        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        };     
        this.playerBottomCollision = false;
    }


    // Player action on collisions
    collisionAction() {
      

        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision: Top of Goomba with Bottom of Player
            //console.log(this.collisionData.touchPoints.other.bottom + 'bottom')
            //console.log(this.collisionData.touchPoints.other.top + "top")
            //console.log(this.collisionData.touchPoints.other.right + "right")
            //console.log(this.collisionData.touchPoints.other.left + "left")
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce1 = true;
               
                this.speed = 0;

                setTimeout((function() {
                    GameEnv.invincible = false;
                    this.destroy();
                    GameEnv.destroyedMagicBeam = true;
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

export default MagicBeam;