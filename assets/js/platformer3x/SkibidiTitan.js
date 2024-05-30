import Character from './Character.js';
import GameEnv from './GameEnv.js';
import GameControl from './GameControl.js';
import Laser from './Laser.js';


export class skibidiTitan extends Character {
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
        this.debounce = 0;
        this.laser = document.getElementById("Laser");
        this.laserHeight = this.laser.innerHeight

    }
    
    killBeam(target) {
        if (target.timer === false) {
            target.timer = true;
            if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                target.canvas.style.transition = "transform 0.5s";
                target.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                GameEnv.playSound("PlayerDeath");

                if (target.state.isDying == false) {
                    target.state.isDying = true;
                    setTimeout(async() => {
                        await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                        console.log("level restart")
                        target.state.isDying = false;
                    }, 900); 
                }
            } else if (GameEnv.difficulty === "easy") {
                this.x += 10;
            }
        }
    }

    update() {
        super.update();
        this.immune = 1;
        if(this.debounce < 240 && this.debounce > -1){
            this.laser.style.left = `-2000px`;
            this.x = GameEnv.PlayerPosition.playerX - 0.14*GameEnv.innerWidth;
            this.debounce += 1;
        }
        if(this.debounce < -120){
            this.debounce += 1;
            if(this.debounce == -235){GameEnv.playSound("laserCharge");this.laser.style.transform = `scaleY(${0})`;}
            this.canvas.style.filter = `invert(${this.debounce+240}%)`
        }else if(this.debounce < 0 && this.debounce >= -120){
            this.debounce += 1;
            this.canvas.style.filter = `invert(0%)`;
            this.laser.style.left = `${this.x + 0.14*GameEnv.innerWidth}px`;
            
            
            this.laser.style.transform = `scaleY(${(this.debounce+120)/40})`;
            this.laser.style.top = `${(this.debounce+120)*6}px`;
            if(this.debounce == -115){GameEnv.playSound("laserSound");}

            var plrPos = GameEnv.PlayerPosition.playerX;
           
            if (this.x >= plrPos - 250 && this.x <= plrPos - 150) {
                //setTimeout(Plr.goombaCollision.bind(this), 50);
                this.killBeam(GameEnv.player);
                this.debounce = 0;
                this.laser.style.left = `${this.x + 0.14*GameEnv.innerWidth}px`;
            }
        }

        if(this.debounce == 240){
            this.debounce = -240;
        }
        //console.log((GameEnv.PlayerPosition.playerX - 200) + " " + this.x);
        
        
        
        //Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
                this.immune = 1;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
            this.immune = 1;
        }

        // Move the enemy
        //this.x -= this.speed;
        this.y = 0.25*GameEnv.innerHeight;
        this.playerBottomCollision = false;


        
    }
}

export default skibidiTitan;