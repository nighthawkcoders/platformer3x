import GameEnv from './GameEnv.js';
import PlayerBase from './PlayerBase.js';

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
export class PlayerHills extends PlayerBase {

    /** GameObject instantiation: constructor for PlayerHills object
     * @extends Character 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);
    }

    /* Overrides for setAnimation method */
    setAnimation(key) {
        super.setAnimation(key);
    }

    /* Overrides for movement methods */
    updateHorizontalMovement() {
        super.updateHorizontalMovement();
    }
    
    updateJumpMovement() {
        super.updateJumpMovement();
    }

    /* Overrides for collision methods */
    handleCollisionStart() {
        super.handleCollisionStart();
        this.handleCollisionEvent("tube");
    }
    
    updatePlayerMovementAndGravity() {
        super.updatePlayerMovementAndGravity();

        switch (this.state.id) {
            case "tube":
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
        }
    }

}

export default PlayerHills;