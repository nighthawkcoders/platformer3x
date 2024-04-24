import GameEnv from './GameEnv.js';
import Background from './Background.js';

export class BackgroundMountains extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.parallaxSpeed = 0.1;
    }

    // speed is used to background parallax behavior
    update() {
        this.speed = GameEnv.backgroundDirection * this.parallaxSpeed;
        super.update();
    }
}

export default BackgroundMountains;