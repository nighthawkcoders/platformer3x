import GameEnv from './GameEnv.js';
import PlayerBase from './PlayerBase.js';
import GameControl from './GameControl.js';
/**
 * @class PlayerHills class
 * @description PlayerHills.js key objective is to eent the user-controlled character in the game.
 *
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The Player object.
 *
 * @extends PlayerBase
 */
export class PlayerGreece extends PlayerBase {
    /** GameObject instantiation: constructor for PlayerHills object
     * @extends Character
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);
        // Goomba variables, deprecate?
        this.timer = false;
        GameEnv.invincible = false; // Player is not invincible
        //Hp Bar
        this.maxHp = 99; // Maximum health points
        this.currentHp = 99; // Current health points
        this.hpBar = document.createElement("canvas");
        this.hpBar.width = 100;
        this.hpBar.height = 15;
        document.querySelector("#canvasContainer").appendChild(this.hpBar);
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
    drawHpBox() { //Hp box
        // Position and size of the health bar
        const hpBarWidth = this.hpBar.width; // The width of the health bar matches the boss's width
        const hpBarHeight = this.hpBar.height; // A fixed height for the health bar
        const hpBarX = (this.x + this.canvasWidth/2 - this.hpBar.width/2); // Position above the boss
        const hpBarY = this.y - this.canvasHeight/40; // 20 pixels above the boss
        this.hpBar.id = "hpBar";
        // Calculate health percentage
        const hpPercentage = this.currentHp / this.maxHp;
        // Draw the background (gray)
        this.hpBar.getContext('2d').fillStyle = 'gray';
        this.hpBar.getContext('2d').fillRect(0, 0, hpBarWidth, hpBarHeight);
        // Draw the health bar (green, based on current health)
        this.hpBar.getContext('2d').fillStyle = 'green';
        this.hpBar.getContext('2d').fillRect(0, 0, hpBarWidth * hpPercentage, hpBarHeight);
        this.hpBar.style.position = 'absolute';  //code from Flag.js, define the style of the Hp Bar
        this.hpBar.style.left = `${hpBarX}px`;
        this.hpBar.style.top = `${hpBarY}px`;
        this.hpBar.style.borderRadius = '5px';
        this.hpBar.style.width = `${hpBarWidth}px`;
        this.hpBar.style.height = `${hpBarHeight}px`;
        this.hpBar.style.border = '2px solid black';
      }
    /**
     * @override
     * gameLoop: Watch for Player collision events
     */
    handleCollisionStart() {
        super.handleCollisionStart(); // calls the super class method
        // adds additional collision events
        this.handleCollisionEvent("minifinishline");
        this.handleCollisionEvent("finishline");
        this.handleCollisionEvent("cerberus");
        this.handleCollisionEvent("flyingIsland");
        this.handleCollisionEvent("lava");
    }
    update() {
        // player methods
        this.updateAnimation();
        this.updateMovement();
        this.drawHpBox();
        // super actions need to be after; this is to preserve player order of operations
        super.update();
    }
    /**
     * @override
     * gameloop: Handles additional Player reaction / state updates to the collision for game level
     */
    handlePlayerReaction() {
        super.handlePlayerReaction(); // calls the super class method
        // handles additional player reactions
        switch (this.state.collision) {
            case "minifinishline":
                // 1. Caught in finishline
                if (this.collisionData.touchPoints.this.onTopofOther  || this.state.isFinishing ) {
                    // Position player in the center of the finishline 
                    this.x = this.collisionData.newX;
                    this.state.movement = { up: false, down: false, left: false, right: false, falling: false};
                    this.state.isFinishing = true;
                    this.gravityEnabled = true;
                    // Using natural gravity wait for player to reach floor
                    if (Math.abs(this.y - this.bottom) <= GameEnv.gravity) {
                        // Force end of level condition
                        GameControl.transitionToLevel(GameEnv.levels[4])
                    }
                // 2. Collision between player right and finishline   
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement.right = false;
                    this.state.movement.left = true;
                // 3. Collision between player left and finishline
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement.left = false;
                    this.state.movement.right = true;
                }
                break;
            case "finishline":
                // Transition to the next level when touching the flag
                GameControl.transitionToLevel(GameEnv.levels[5]);
                break;
            case "cerberus": // Note: Goomba.js and Player.js could be refactored
                // 1. Player jumps on goomba, interaction with Goomba.js
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom && this.state.isDying == false) {
                    // GoombaBounce deals with player.js and goomba.js
                    if (GameEnv.goombaBounce === true) {
                        GameEnv.goombaBounce = false;
                        this.y = this.y - 100;
                    }
                    if (GameEnv.goombaBounce1 === true) {
                        GameEnv.goombaBounce1 = false;
                        this.y = this.y - 250
                    }
                // 2. Player touches goomba sides of goomba
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
                case "lava": // Note: Goomba.js and Player.js could be refactored
                if (this.collisionData.touchPoints.other.id === "lava") {
                    if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                        if (this.state.isDying == false) {
                            if(this.currentHp == 33){
                                this.currentHp -= 33;
                                this.drawHpBox();
                                this.state.isDying = true;
                                this.canvas.style.transition = "transform 0.5s";
                                this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                                GameEnv.playSound("PlayerDeath");
                                setTimeout(async() => {
                                    await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                                }, 900);
                            } else{
                                this.setY(this.y - (this.bottom * 0.6));
                                this.currentHp -= 33;
                            }
                        }
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.right) {
                        this.x -= 10;
                    } else if (GameEnv.difficulty === "easy" && this.collisionData.touchPoints.this.left) {
                       this.x += 10;
                    }
                }
                break;
                case "flyingIsland":
                    // Player is on top of the island
                    if (this.collisionData.touchPoints.this.onTopofOther) {
                        this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                        this.gravityEnabled = false;
                    // Player is touching the wall with right side
                    } else if (this.collisionData.touchPoints.this.right) {
                        this.state.movement = { up: false, down: false, left: true, right: false, falling: false};
                        this.y -= 4;
                    // Player is touching the wall with left side
                    } else if (this.collisionData.touchPoints.this.left) {
                        this.state.movement = { up: false, down: false, left: false, right: true, falling: false};
                        this.y -= 4;
                    }
                break;
        }
    }
}
export default PlayerGreece;