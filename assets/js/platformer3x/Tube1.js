import GameEnv from './GameEnv.js';
import Tube from './Tube.js'; // Import the Tube class

export class Tube1 extends Tube {
    constructor(canvas, image, data) {
        // Call the constructor of the parent class (Tube) with the necessary arguments
        super(canvas, image, data);

        // Override specific properties if needed
        this.tubeX = .01 * GameEnv.innerWidth; // Change tubeX value
    }
    draw() {
        this.ctx.drawImage(this.image, 0, -130);
    }
    // Override size method to customize tube position
    size() {
        const scaledHeight = GameEnv.innerHeight * (100 / 832);
        const scaledWidth = scaledHeight * this.aspect_ratio;

        // Customize tube position based on the overridden tubeX value
        const tubeY = (GameEnv.top + 0.001 * scaledHeight);

        // Set variables used in Display and Collision algorithms
        this.bottom = tubeY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;

        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.tubeX}px`; // Use overridden tubeX value
        this.canvas.style.top = `${tubeY}px`;
    }

    // You can override other methods or add new methods as needed
}

export default Tube1;
