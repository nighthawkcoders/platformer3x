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
     * @property {string} id - The current surface the player is on (e.g., 'floor', 'wall', 'platform').
     * @property {boolean} idle - Whether the player is idle.
     * @property {Object} movement - The directions in which the player can move.
     * @property {boolean} movement.up - Whether the player can move up.
     * @property {boolean} movement.down - Whether the player can move down.
     * @property {boolean} movement.left - Whether the player can move left.
     * @property {boolean} movement.right - Whether the player can move right.
     * @property {Array} collisions - The collisions that the player has had.
     */
    initEnvironmentState = {
        // environment
        id: 'floor',
        counter: 0,
        collisions: [],
        // player
        current: 'idle',
        direction: 'right',
        speed: this.speed,
        movement: {up: false, down: false, left: true, right: true, falling: false},
        isDying: false,
    };

    /** GameObject instantiation: constructor for Player object
     *  * @extends Character 
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

        // ??  needed to start the game
        this.isDying = false;
        this.isDyingR = false;
        this.timer = false;
        GameEnv.invincible = false; 
        this.transitionHide = false;
        
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
     * GameObject: responds to level change and game over destroy for the player object
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
     * gameloop: updates the player's state and position.
     * In each refresh cycle of the game loop, the player-specific movement is updated.
     * - If the player is moving left or right, the player's x position is updated.
     * - If the player is dashing, the player's x position is updated at twice the speed.
     * This method overrides Character.update, which overrides GameObject.update. 
     * @override
     */
    update() {
        this.updateAnimation();
        this.updateMovement();
 
        // Perform super update actions
        super.update();
    }
    
    updateMovement() {
        switch (this.state.current) {
            case 'idle':
                break;
            case 'jump':
                if (this.state.movement.up && !this.state.movement.falling) {
                    this.y -= (this.bottom * 0.35); // Jump height factor
                    this.state.movement.falling = true;
                }
                // leave break out to allow left / right speed 
            default:
                if (this.state.direction === 'left' && this.state.movement.left) {
                    this.x -= this.state.current === 'run' ? this.runSpeed : this.speed;
                } else if (this.state.direction === 'right' && this.state.movement.right){
                    this.x += this.state.current === 'run' ? this.runSpeed : this.speed;
                }
        }
    }

    updateAnimation() {
        switch (this.state.current) {
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
                console.error(`Invalid state: ${this.state.current}`);
        }
    }

    updateState(key) {
        switch (key) {
            case 'a':
            case 'd':
                this.state.current = 'walk';
                break;
            case 'w':
              if (this.state.movement.up == false) {
                this.state.movement.up = true;
                this.state.current = 'jump';
              }
              break;
            default:
                this.state.current = 'idle';
                break;
        }
    }

    /**
     * Handles the keydown event.
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
            this.updateState(key);
            GameEnv.transitionHide = true;
        }

        // parallax background speed starts on player movement
        GameEnv.updateParallaxBackgrounds(key)
    }

    /**
     * Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * *
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        const key = event.key;
        if (event.key in this.pressedKeys) {
            delete this.pressedKeys[event.key];
        }
        this.updateState(null);
        // parallax background speed halts on key up
        GameEnv.updateParallaxBackgrounds(null)
}
    

    /**
     * gameloop: performs action on collisions
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
     * gameloop: enables a type of collision events between player and object
     */
    handleCollisionStart() {
        this.handleCollisionEvent("jumpPlatform");
        this.handleCollisionEvent("wall");
        this.handleCollisionEvent("floor");
    }

    /**
     *  helper: sets up collision event handler if player is touching the object
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
     * gameloop: disables expired collision events when player is no longer touching the object 
     */
    handleCollisionEnd() {
        // remove each collision when player is no longer touching the object
        if (this.state.id === "floor") {
            // noop
        } else if (this.state.collisions.includes(this.state.id) && this.collisionData.touchPoints.other.id !== this.state.id ) {
            this.state.collisions = this.state.collisions.filter(id => id !== this.state.id );
        }
        // Add similar code for "wall" and other obstacles
    }
   
    /**
     * gameloop: updates the player's state based on the most recent collision
     */
    updatePlayerState() {
        // set player collision id based on last collision  
        if (this.state.collisions.length > 0) {
            this.state.id = this.state.collisions[this.state.collisions.length - 1];
        } else {
            this.state.id = "floor";
        }
    }
   
    /**
     * gameloop: handles player reaction to the collision
     */
    handlePlayerReaction() {
        this.gravityEnabled = true;

        switch (this.state.id) {
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
                if (this.onTop) {
                    this.state.movement = { up: false, down: false, left: true, right: true, falling: false};
                }
                break;
        }
    }

}

export default PlayerBase;