import GameEnv from './GameEnv.js';
import Background from './Background.js';

export class BackgroundFish extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.parallaxSpeed = 1; 
    }

    // speed is used to background parallax behavior
    update() {
        this.speed = -1 * this.parallaxSpeed;
        super.update();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        super.draw();
    }

}

export default BackgroundFish;