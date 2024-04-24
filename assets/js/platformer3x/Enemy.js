import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';

export class Enemy extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition) {
        super(canvas, image, data, 0.0, 0.2);

        this.playerData = data;
        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        this.isIdle = false;
        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;

        this.storeSpeed = this.speed;

        this.direction = "d"; // initially facing right

        //Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.storeSpeed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard") {
            this.storeSpeed = this.speed * Math.floor(Math.random() * 3 + 3);
        } else {
            this.storeSpeed = this.speed * 5
        }
    }

    setAnimation(key) {
        // animation comes from playerData
        var animation = this.playerData[key]

        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }

    update() {
        super.update();

        this.setAnimation(this.direction);
        
        
        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            if (this.direction === "a") {
                this.direction = "d";
            }
            else if (this.direction === "d") {
                this.direction = "a";
            }
        };

        if (this.direction === "d") {
            this.speed = Math.abs(this.storeSpeed)
            this.canvas.style.transform = 'none';
        }
        else if (this.direction === "a") {
            this.speed = -Math.abs(this.storeSpeed);
            this.canvas.style.transform = 'scaleX(-1)';
        }
        else if (this.direction === "idle") {
            this.speed = 0
        }


        // Move the enemy\
        this.x += this.speed;

        this.playerBottomCollision = false;
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            if (this.direction === "a" && this.collisionData.touchPoints.other.right) {
                this.direction = "d";
            }
            else if (this.direction === "d" && this.collisionData.touchPoints.other.left) {
                this.direction = "a";
            }

        }

        if (this.collisionData.touchPoints.other.id === "player") {
            // Collision: Top of Goomba with Bottom of Player
            //console.log(this.collisionData.touchPoints.other.bottom + 'bottom')
            //console.log(this.collisionData.touchPoints.other.top + "top")
            //console.log(this.collisionData.touchPoints.other.right + "right")
            //console.log(this.collisionData.touchPoints.other.left + "left")
            if (this.collisionData.touchPoints.other.bottom && this.immune == 0) {
                GameEnv.invincible = true;
                GameEnv.goombaBounce = true;
                this.canvas.style.transition = "transform 1.5s, opacity 1s";
                this.canvas.style.transition = "transform 2s, opacity 1s";
                this.canvas.style.transformOrigin = "bottom"; // Set the transform origin to the bottom
                this.canvas.style.transform = "scaleY(0)"; // Make the Goomba flat
                this.speed = 0;
                GameEnv.playSound("goombaDeath");

                setTimeout((function () {
                    GameEnv.invincible = false;
                    this.destroy();
                }).bind(this), 1500);


            }
        }

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.direction === "a" && this.collisionData.touchPoints.other.right) {
                this.direction = "d";
            }
            else if (this.direction === "d" && this.collisionData.touchPoints.other.left) {
                this.direction = "a";
            }
        }
    }
}

export default Enemy;