import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import Enemy from './Enemy.js';

export class Snowman extends Enemy {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data);

        //Unused but must be Defined
        this.name = name;
        this.y = yPercentage;

        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        this.immune = 0;

        //Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard", "impossible") {
            this.speed = this.speed * Math.floor(Math.random() * 3 + 4);
        } else {
            this.speed = this.speed * 5
        }
    }

    updateMovement(){
        if (this.direction === "d") {
            this.speed = Math.abs(this.storeSpeed)
        }
        else if (this.direction === "a") {
            this.speed = -Math.abs(this.storeSpeed);
        }
        else if (this.direction === "idle") {
            this.speed = 0
        }

        //Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
            this.canvas.style.filter = "invert(100%)";
            this.canvas.style.scale = 1.25;
            this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
            this.canvas.style.transform = "rotate(180deg)"
            this.immune = 1;
    }

        // Move the enemy\
        this.x += this.speed;
    }

    update() {
        super.update();
        super.checkBoundaries();
        this.updateMovement();
    }


}

export default Snowman;