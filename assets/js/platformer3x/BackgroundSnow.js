import Background from './Background.js';

export class BackgroundSnow extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.parallaxSpeed = 0.3; // Speed for vertical parallax scrolling
    }

    // Update method to handle vertical scrolling
    update() {
        this.y += this.parallaxSpeed; // Move vertically based on parallax speed
        super.update();
        
        // Reset the position once the image has moved out of the canvas
        if (this.y >= this.canvas.height) {
            this.y = -this.canvas.height; // Reset to the top of the canvas
        }
    }

    // Draw method to render the background image vertically
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the image at the current vertical position
        this.ctx.drawImage(this.image, 0, this.y, this.canvas.width, this.canvas.height);

        // Draw the image again above the current one for seamless scrolling
        this.ctx.drawImage(this.image, 0, this.y - this.canvas.height, this.canvas.width, this.canvas.height);

        super.draw();
    }
}

export default BackgroundSnow;