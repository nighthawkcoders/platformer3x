import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class Tree extends GameObject {
    constructor(canvas, image) {
        super(canvas, image, 0, 0.5, 0.5);
    }
    
    // Required, but no update action
    update() {
    }

    // Draw position is always 0,0
    draw() {
        const glowRadius = 20; // adjust the glow radius as needed
        const glowColor = 'rgba(255, 255, 0, 0.5)'; // yellow glow color
        
        // Draw the glowing effect
        this.ctx.shadowColor = glowColor;
        this.ctx.shadowBlur = glowRadius;
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }

    // Set Tree position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerHeight * (400/832); // Reduced height
        // Formula for Width is scaled: scaledWidth/scaledHeight == this.width/this.height
        const scaledWidth = scaledHeight * this.aspect_ratio;
        
        // Calculate tree position
        const treeX = .80 * GameEnv.innerWidth - scaledWidth / 2; // Center the tree horizontally
        const treeY = GameEnv.bottom - scaledHeight; // Position the tree at the bottom

        // Set canvas dimensions and position
        this.canvas.width = scaledWidth; 
        this.canvas.height = scaledHeight;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${treeX}px`;
        this.canvas.style.top = `${treeY}px`; 

        // set variables used in Display and Collision algorithms
        this.bottom = treeY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        // Update canvas context
        this.ctx = this.canvas.getContext('2d');
    }
}

export default Tree;