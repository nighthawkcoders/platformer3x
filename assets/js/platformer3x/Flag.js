import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class Flag extends GameObject {
    constructor(canvas, image, data) {
        super(canvas, image, data);
    }
    
    // Required, but no update action
    update() {
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Set flag position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerHeight * (480/832);
        // Formula for Width is scaled: scaledWidth/scaledHeight == this.width/this.height
        const scaledWidth = scaledHeight * this.aspect_ratio;
        const flagX = .82 * GameEnv.innerWidth;
        const flagY = (GameEnv.bottom - (.25 * scaledHeight));

        // set variables used in Display and Collision algorithms
        this.bottom = flagY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
    
        //this.canvas.width = this.width; 
        //this.canvas.height = this.height;
        this.canvas.style.Width = `${scaledWidth}px`;
        this.canvas.style.Height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${flagX}px`;
        this.canvas.style.top = `${flagY}px`; 

    }
}

export default Flag;