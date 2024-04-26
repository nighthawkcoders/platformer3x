import GameEnv from './GameEnv.js';
import PlayerBase from './PlayerBase.js';
import GameControl from './GameControl.js';

/**
 * @class PlayerWinter class
 * @description PlayerWinter.js key objective is to eent the user-controlled character in the game.   
 * 
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The Player object.  
 * 
 * @extends PlayerBase 
 */
export class PlayerWinter extends PlayerBase {

    /** GameObject instantiation: constructor for PlayerWinter object
     * @extends Character 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);

        // Snowman variables, deprecate?
        this.timer = false;
        GameEnv.invincible = false; // Player is not invincible 
    }

    /**
     * @override
     * gameLoop helper: Update Player jump height, replaces PlayerBase updateJump using settings from GameEnv
     */
    updateJump() {  
        let jumpHeightFactor;
        if (GameEnv.difficulty === "easy") {
            jumpHeightFactor = 0.50;
        } else if (GameEnv.difficulty === "normal") {
            jumpHeightFactor = 0.40;
        } else {
            jumpHeightFactor = 0.30;
        }
        this.setY(this.y - (this.bottom * jumpHeightFactor));
    }

    /**
     * @override
     * gameLoop: Watch for Player collision events 
     */ 
    handleCollisionStart() {
        super.handleCollisionStart(); // calls the super class method
        // adds additional collision events
        this.handleCollisionEvent("cabin");
        this.handleCollisionEvent("snowman");
        this.handleCollisionEvent("mushroom");
    }
   
    /**
     * @override
     * gameloop: Handles additional Player reaction / state updates to the collision for game level 
     */
    handlePlayerReaction() {
        super.handlePlayerReaction(); // calls the super class method
        // handles additional player reactions
        switch (this.state.collision) {
            case "cabin":
                // 1. Caught in tube
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    // Position player in the center of the tube 
                    this.x = this.collisionData.newX;
                    // Using natural gravity wait for player to reach floor
                    if (Math.abs(this.y - this.bottom) <= GameEnv.gravity) {
                        // Force end of level condition
                        this.x = GameEnv.innerWidth + 1;
                    }
                // 2. Collision between player right and tube   
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement.right = false;
                    this.state.movement.left = true;
                // 3. Collision between player left and tube
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement.left = false;
                    this.state.movement.right = true;
                }
                break;
            case "snowman": // Note: Snowman.js and Player.js could be refactored
                // 1. Player jumps on snowman, interaction with Snowman.js
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom && this.state.isDying == false) {
                    // SnowmanBounce deals with player.js and Snowman.js
                    if (GameEnv.snowmanBounce === true) {
                        GameEnv.snowmanBounce = false;
                        this.y = this.y - 100;
                    }
                    if (GameEnv.snowmanBounce1 === true) {
                        GameEnv.snowmanBounce1 = false; 
                        this.y = this.y - 250
                    }
                // 2. Player touches snowman sides of snowman 
                } else if (this.collisionData.touchPoints.this.right || this.collisionData.touchPoints.this.left) {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (this.state.isDying == false) {
                            this.state.isDying = true;
                            this.canvas.style.transition = "transform 0.5s";
                            this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                            GameEnv.playSound("PlayerDeath");
                            setTimeout(async() => {
                                await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                            }, 900); 
                        }
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.right) {
                        this.x -= 10;
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.left) {
                       this.x += 10;
                    }
                
                }
                break;
            case "mushroom": // 
                // Player touches mushroom   
                if (GameEnv.destroyedMushroom === false) {
                    GameEnv.destroyedMushroom = true;
                    this.canvas.style.filter = 'invert(1)';
                    // Invert state lasts for 2 seconds
                    setTimeout(() => {
                        this.canvas.style.filter = 'invert(0)';
                    }, 2000); // 2000 milliseconds = 2 seconds
                }
                break;  
        }

    }

}

export default PlayerWinter;