import GameEnv from './GameEnv.js';
import Character from './Character.js';

/**
 * @class Player class
 * @description Player.js key objective is to eent the user-controlled character in the game.   
 * 
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The Player object.  
 * 
 * @extends Character
 */
export class PlayerBase extends Character {
    /**
     * Initial environment of the player.
     * @property {string} collision - The current object the player is interacting with (e.g., 'floor', 'wall', 'platform').
     * @property {Array} collisions - The collisions that the player has had.
     * @property {string} animation - The current animation state of the player (e.g., 'idle', 'walk', 'run', 'jump').
     * @property {string} direction - The direction the player is facing (e.g., 'left', 'right').
     * @property {Object} movement - The directions in which the player can move.
     * @property {boolean} movement.up - Whether the player can move up.
     * @property {boolean} movement.down - Whether the player can move down.
     * @property {boolean} movement.left - Whether the player can move left.
     * @property {boolean} movement.right - Whether the player can move right.
     * @property {boolean} movement.falling - Whether the player is falling.
     * @property {boolean} isDying - Whether the player is dying.
     */

    // This object represents the initial state of the player when the game starts.
    initEnvironmentState = {
        // environment
        collision: 'floor',
        collisions: [],
        // player
        animation: 'idle',
        direction: 'right',
        speed: this.speed,
        movement: {up: false, down: false, left: true, right: true, falling: false},
        isDying: false,
    };

    /** GameObject: Constructor for Player object
     * @extends Character 
     * @param {HTMLCanvasElement} canvas - The canvas element to draw the player on.
     * @param {HTMLImageElement} image - The image to draw the player with.
     * @param {Object} data - The data object containing the player's properties.
     */
    constructor(canvas, image, data) {
        super(canvas, image, data);

        // Player Data
        GameEnv.player = this; // Global player object
        this.playerData = data; // GameSetup data
        this.name = GameEnv.userID; // name of the player
        this.shouldBeSynced = true; // multi-player sync
        this.state = {...this.initEnvironmentState}; // start with player on the floor 

        // Player control data
        this.runSpeed = this.speed * 3;
        this.pressedKeys = {};
        this.directionKey = "d"; // initially facing right

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);
    }

    /**
     * GameObject: Destructor for Player Object
     * This method is used to remove the event listeners for keydown and keyup events.
     * After removing the event listeners, it calls the parent class's destroy player object. 
     * This method overrides standard GameObject.destroy.
     * @override
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }

    /**
     * gameLoop: updates the player's state, animation and position.
     * @override
     */
    update() {
        // player methods
        this.updateAnimation();
        this.updateMovement();
 
        // super actions need to be after; this is to preserve player order of operations
        super.update();
    }
  
    /**
     * gameLoop helper: Udate Player jump height
     */
    updateJump() {
        this.y -= (this.bottom * 0.35); // Jump height factor
    }

    /**
     * gameLoop: updates the player's movement based on the player's animation (idle, walk, run, jump, etc.)
     */ 
    updateMovement() {
        switch (this.state.animation) {
            case 'idle':
                break;
            case 'jump':
                if (this.state.movement.up && !this.state.movement.falling) {
                    GameEnv.playSound("PlayerJump");
                    this.updateJump();
                    this.state.movement.falling = true;
                }
                // break is left out to allow left / right speed to be applied 
            default:
                if (this.state.direction === 'left' && this.state.movement.left && 'a' in this.pressedKeys) {
                    this.setX(this.x - (this.state.animation === 'run' ? this.runSpeed : this.speed));
                } else if (this.state.direction === 'right' && this.state.movement.right && 'd' in this.pressedKeys){
                    this.setX(this.x + (this.state.animation === 'run' ? this.runSpeed : this.speed));
                }
        }
    }

    /**
     * gameLoop: updates the player's animation (idle, walk, run, jump, etc.)
     */
    updateAnimation() {
        switch (this.state.animation) {
            case 'idle':
                this.setSpriteAnimation(this.playerData.idle[this.state.direction]);
                break;
            case 'walk':
                this.setSpriteAnimation(this.playerData.walk[this.state.direction]);
                break;
            case 'run':
                this.setSpriteAnimation(this.playerData.run[this.state.direction]);
                break;
            case 'jump':
                this.setSpriteAnimation(this.playerData.jump[this.state.direction]);
                break;
            default:
                console.error(`Invalid state: ${this.state.animation}`);
        }
    }


    /**
     * User Event: updates the player's state, key pressed is mapped to player's animation state  
     * @param {*} key 
     */
    updateState(key) {
        switch (key) {
            case 'a':
            case 'd':
                this.state.animation = 'walk';
                break;
            case 'w':
              if (this.state.movement.up == false) {
                this.state.movement.up = true;
                this.state.animation = 'jump';
              }
              break;
            case 's':
                if ("a" in this.pressedKeys || "d" in this.pressedKeys) {
                    this.state.animation = 'run';
                }
                break;
            default:
                this.state.animation = 'idle';
                break;
        }
    }

    /**
     * User Event: Handles the keydown event.
     * This method checks the pressed key, then conditionally:
     * - adds the key to the pressedKeys object
     * - sets the player's animation
     * - adjusts the game environment
     *
     * @param {Event} event - The keydown event.
     */    
    
    handleKeyDown(event) {
        const key = event.key;
        if (!(event.key in this.pressedKeys)) {
            //If both 'a' and 'd' are pressed, then only 'd' will be inputted
            //Originally if this is deleted, player would stand still. 
            if (this.pressedKeys['a'] && key === 'd') {
                delete this.pressedKeys['a']; // Remove "a" key from pressedKeys
                return; //(return) = exit early
            } else if (this.pressedKeys['d'] && key === 'a') {
                // If "d" is pressed and "a" is pressed afterward, ignore "a" key
                return;
            }
            if (key === 'a') {
                this.state.direction = 'left';
            } else if (key === 'd') {
                this.state.direction = 'right';
            }
            this.pressedKeys[event.key] = true;
            this.updateState(key);
            GameEnv.transitionHide = true;
        }

        // parallax background speed starts on player movement
        GameEnv.updateParallaxBackgrounds(key)
    }

    /**
     * User Event: Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * 
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        const key = event.key;
        if (key in this.pressedKeys) {
            delete this.pressedKeys[key];
            if (Object.keys(this.pressedKeys).length > 0) {
                // If there are still keys in pressedKeys, update the state to the last one
                const lastKey = Object.keys(this.pressedKeys)[Object.keys(this.pressedKeys).length - 1];
                this.updateState(lastKey);
            } else {
                // If there are no more keys in pressedKeys, update the state to null
                this.updateState(null);
            }
        }
    }
    

    /**
     * gameLoop: Collision action handler for the player.
     * Handles the player's actions when a collision occurs.
     * This method checks the collision, type of game object, and then to determine action, e.g game over, animation, etc.
     * Depending on the side of the collision, it performs player action, e.g. stops movement, etc.
     * This method overrides GameObject.collisionAction. 
     * @override
     */
    collisionAction() {
        this.handleCollisionStart();
        this.handleCollisionEnd();
        this.updatePlayerState();
        this.handlePlayerReaction();
    }
   
    /**
     * gameLoop: Set up Player collision events 
     */
    handleCollisionStart() {
        this.handleCollisionEvent("jumpPlatform");
        this.handleCollisionEvent("wall");
        this.handleCollisionEvent("floor");
    }

    /**
     * gameLoop helper: sets up collision event handler if player is touching the object
     * @param {*} collisionType 
     */
    handleCollisionEvent(collisionType) {
        if (this.collisionData.touchPoints.other.id === collisionType) {
            if (!this.state.collisions.includes(collisionType)) {
                this.state.collisions.push(collisionType);
            }
        }
    }
   
    /**
     * gameLoop: Tears down Player collision events
     */
    handleCollisionEnd() {
        // remove each collision when player is no longer touching the object
        if (this.state.collision === "floor") {
            // noop
        } else if (this.state.collisions.includes(this.state.collision) && this.collisionData.touchPoints.other.id !== this.state.collision ) {
            this.state.collisions = this.state.collisions.filter(collision => collision !== this.state.collision);
        }
    }
   
    /**
     * gameLoop: Updates Player state based on the most recent collision
     */
    updatePlayerState() {
        // set player collision id based on last collision  
        if (this.state.collisions.length > 0) {
            this.state.collision = this.state.collisions[this.state.collisions.length - 1];
        } else {
            this.state.collision = "floor";
        }
    }
   
    /**
     * gameloop: Handles Player reaction / state updates to the collision
     */
    handlePlayerReaction() {
        this.gravityEnabled = true;

        switch (this.state.collision) {
            // 1. Player is on a jump platform
            case "jumpPlatform":
                if (this.collisionData.touchPoints.this.top) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                    this.gravityEnabled = false;
                }
                break;
            // 2. Player is on or touching a wall 
            case "wall":
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                    this.gravityEnabled = false;
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement = { up: false, down: false, left: true, right: false, falling: false};
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement = { up: false, down: false, left: false, right: true, falling: false};
                }
                break;
            case "floor":
                // 3. Player is on the floor, default platform
                if (this.onTop) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                }
                break;
        }
    }

}

export default PlayerBase;