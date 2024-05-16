import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class TubeGreece extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data);
        this.tubeX = xPercentage * GameEnv.innerWidth;
        this.tubeY = yPercentage;
    }

    // Required, but no update action
    update() {
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0);
    }

    // Set Tube position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerWidth * (64 / 832);
        // Formula for Width is scaled: scaledWidth/scaledHeight == this.width/this.height
        const scaledWidth = scaledHeight/1.5;
        // const tubeX = 0.4 * GameEnv.innerWidth;
        const tubeX = this.tubeX;
        //const tubeY = (GameEnv.bottom - 0.1 * scaledHeight);
        const tubeY = (GameEnv.bottom - scaledHeight) * this.tubeY;


        // set variables used in Display and Collision algorithms
        this.bottom = tubeY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
    
        //this.canvas.width = this.width; 
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${tubeX}px`;
        this.canvas.style.top = `${tubeY}px`; 
        

    }
}

export default TubeGreece;