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
        id: 'floor', // floor, wall, platform, ... 
        idle: true,
        movement: {up: true, down: true, left: true, right: true},
        counter: 0,
        collisions: []  
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
        this.moveSpeed = this.speed * 3;
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
     * Helper methods for checking the state of the player.
     * Each method checks a specific condition and returns a boolean indicating whether that condition is met.
     */

    // helper: player facing left
    isFaceLeft() { return this.directionKey === "a"; }
    // helper: left action key is pressed
    isKeyActionLeft(key) { return key === "a"; }
    // helper: player facing right  
    isFaceRight() { return this.directionKey === "d"; }
    // helper: right action key is pressed
    isKeyActionRight(key) { return key === "d"; }
    // helper: dash key is pressed
    isKeyActionDash(key) { return key === "s"; }
    // helper: action key is in queue 
    isActiveAnimation(key) { return (key in this.pressedKeys) && !this.state.idle; }
    // helper: gravity action key is in queue
    // helper: gravity action key is in queue
    isActiveGravityAnimation(key) {
        return this.isActiveAnimation(key) && this.isInAir();
    }
    // helper: player is in air
    isInAir() {
        return this.bottom <= this.y || this.state.movement.down === false;
    }

    updateAnimation() {
        if (this.isInAir()) {
            this.setAnimation(this.directionKey);
        }
    }

    /**
     * This helper method that acts like an animation manager. Frames are set according to player events.
     *  - Sets the animation of the player based on the provided key.
     *  - The key is used to look up the animation frame and idle in the objects playerData.
     * If the key corresponds to a left or right movement, the directionKey is updated.
     * 
     * @param {string} key - The key representing the animation to set.
     */
    setAnimation(key) {
        // direction setup
        if (this.isKeyActionLeft(key)) {
            this.directionKey = key;
            this.playerData.w = this.playerData.wa;
        } else if (this.isKeyActionRight(key)) {
            this.directionKey = key;
            this.playerData.w = this.playerData.wd;
        }
        // animation comes from playerData
        var animation = this.playerData[key]
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMinFrame(animation.min ? animation.min : 0);
        this.setMaxFrame(animation.frames);
        if (this.state.idle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
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
        this.updateHorizontalMovement();
        this.updateJumpMovement();

        // Perform super update actions
        super.update();

        // reset animatiion: for instance remove platform wiggle when idle   
        this.updateAnimation();
    }
    
    updateHorizontalMovement() {
        if (this.isActiveAnimation("a") && this.state.movement.left) {
            this.x -= this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to left
        }
        if (this.isActiveAnimation("d") && this.state.movement.right) {
            this.x += this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to right
        }
        // Player moving at dash speed left or right 
        if (this.isActiveAnimation("s")) {}
    }
    
    updateJumpMovement() {
        if (this.isActiveGravityAnimation("w")) {
            GameEnv.playSound("PlayerJump");
            let jumpHeightFactor;
            if (this.gravityEnabled) {
                if (GameEnv.difficulty === "easy") {
                    jumpHeightFactor = 0.50;
                } else if (GameEnv.difficulty === "normal") {
                    jumpHeightFactor = 0.40;
                } else {
                    jumpHeightFactor = 0.30;
                }
            } else if (this.state.movement.down === false) {
                jumpHeightFactor = 0.15;  // platform jump height
            }
            this.y -= (this.bottom * jumpHeightFactor);
        }
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
        this.updatePlayerMovementAndGravity();
    }
    
    handleCollisionStart() {
        this.handleCollisionEvent("jumpPlatform");
        this.handleCollisionEvent("wall");
    }

    handleCollisionEvent(collisionType) {
        if (this.collisionData.touchPoints.other.id === collisionType) {
            if (!this.state.collisions.includes(collisionType)) {
                this.state.collisions.push(collisionType);
            }
        }
    }
    
    handleCollisionEnd() {
        // remove each collision when player is no longer touching the object
        if (this.state.id === "floor") {
            // noop
        } else if (this.state.collisions.includes(this.state.id) && this.collisionData.touchPoints.other.id !== this.state.id ) {
            this.state.collisions = this.state.collisions.filter(id => id !== this.state.id );
        }
        // Add similar code for "wall" and other obstacles
    }
    
    updatePlayerState() {
        // set player collision id based on last collision  
        if (this.state.collisions.length > 0) {
            this.state.id = this.state.collisions[this.state.collisions.length - 1];
        } else {
            this.state.id = "floor";
        }
    }
    
    updatePlayerMovementAndGravity() {
        this.state.movement = { up: true, left: true, right: true, down: true };
        this.gravityEnabled = true;

        switch (this.state.id) {
            case "jumpPlatform":
                if (this.collisionData.touchPoints.this.top) {
                    this.state.movement.down = false;
                    this.gravityEnabled = false;
                }
                break;
            case "wall":
                if (this.collisionData.touchPoints.this.top && this.collisionData.touchPoints.other.bottom) {
                    this.state.movement.down = false;
                    this.gravityEnabled = false;
                } else if (this.collisionData.touchPoints.this.right) {
                    this.state.movement.right = false;
                    this.state.movement.left = true;
                } else if (this.collisionData.touchPoints.this.left) {
                    this.state.movement.left = false;
                    this.state.movement.right = true;
                }
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
        if (this.playerData.hasOwnProperty(event.key)) {
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
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.state.idle = false;
                GameEnv.transitionHide = true;
            }

            // dash action on
            if (this.isKeyActionDash(key)) {
                GameEnv.dash = true;
                this.canvas.style.filter = 'invert(1)';
            }
            // parallax background speed starts on player movement
            GameEnv.updateParallaxBackgrounds(key)
        }
    }

    /**
     * Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * *
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            // player idle
            this.state.idle = true;
            // dash action off
            if (this.isKeyActionDash(key)) {
                this.canvas.style.filter = 'invert(0)';
                GameEnv.dash = false;
            } 
            // parallax background speed halts on key up
            GameEnv.updateParallaxBackgrounds(null)
        }
    }

}

export default PlayerBase;