// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import BackgroundParallax from './BackgroundParallax.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import Platform from './Platform.js';
import FinishLine from './FinishLine.js';
import NarwhalBoss from './NarwhalBoss.js';
import PlayerIce from './PlayerIce.js';

// Define the GameSetup object literal
const assets = {  
  obstacles: {
    tubeD: { src: "/images/platformer/obstacles/blue-tube.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
    iceberg: {
      src: "/images/platformer/obstacles/iceberg.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 150,
    },
    snowflake: { src: "/images/platformer/obstacles/snowflake.png" },
  },
  platforms: {
    narwhalfloor: { src: "/images/platformer/platforms/narwhalfloor.png" },
    block: { src: "/images/platformer/platforms/brick_block.png" }, //MAY need 3 new variables: sizeRatio, widthRatio, and heightRatio
    itemBlock: {
      src: "/images/platformer/platforms/mario_block_spritesheet_v2.png",
      sizeRatio: 83.2,
      widthRatio: 0.5,
      heightRatio: 1.0,
      width: 204,
      height: 204,
      scaleSize: 80,
      speedRatio: 0.7,
      hitbox: { widthPercentage: 0.4, heightPercentage: -0.2 }
    }
  },
  backgrounds: {
    icewater: { src: "/images/platformer/backgrounds/icewater.png", parallaxSpeed: 0.4, moveOnKeyAction: true},
    narwhal: { src: "/images/platformer/backgrounds/narwhal.png", parallaxSpeed: 2 },
  },
  transitions: {
    iceminiEnd: { src: "/images/platformer/transitions/IceMinigameEnd.png"},
  },
  players: {
    whitemario: {
      src: "/images/platformer/sprites/white_mario.png",
      width: 256,
      height: 256,
      scaleSize: 80,
      speedRatio: 0.7,
      idle: {
        left: { row: 1, frames: 15 },
        right: { row: 0, frames: 15 },
      },
      walk: {
        left: { row: 3, frames: 7 },
        right: { row: 2, frames: 7 },
      },
      run: {
        left: { row: 5, frames: 15 },
        right: { row: 4, frames: 15 },
      },
      jump: {
        left: { row: 11, frames: 15 },
        right: { row: 10, frames: 15 },
      },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
  },
  enemies: {
    Penguin: {
      src: "/images/platformer/sprites/penguin.png",
      width: 240,
      height: 290,
      scaleSize: 80,
      speedRatio: 0.6,
      xPercentage: 0.6,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 },
      left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
      idle: { row: 0, frames: 0 }, // Stop the movement 
      right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
    },
    Jellyfish: {
      src: "/images/platformer/sprites/jellyfish.png",
      width: 499, 
      height: 500,
      scaleSize: 90,
      speedRatio: 0.8,
    },
    narwhalboss: {
        src: "images/platformer/sprites/narwhal_boss.png",
        width: 221, //211 230
        height: 148,
        scaleSize: 200,
        speedRatio: 0.2,
        animationSpeed: 8,
        idleL: { row: 0, frames: 4, idleFrame: { column: 1, frames: 0 } },
        idleR: { row: 1, frames: 4, idleFrame: { column: 1, frames: 0 } },
        left: { row: 2, frames: 4, idleFrame: { column: 1, frames: 0 } },
        right: { row: 3, frames: 4, idleFrame: { column: 1, frames: 0 } },
        attackL: { row: 4, frames: 4 },
        attackR: { row: 5, frames: 4 },
        death: { row: 6, frames: 4 },
    },
    }
  };
    
  const iceminiObjects = [
    // GameObject(s), the order is important to z-index...
    { name: 'icewater', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.icewater },
    { name: 'narwhal', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.narwhal },
    { name: 'narwhalfloor', id: 'platform', class: Platform, data: this.assets.platforms.narwhalfloor },
    { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2368, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2736, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3104, yPercentage: 0.82 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3472, yPercentage: 0.74 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.59, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.6268, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.332, yPercentage: 0.35 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3736, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4104, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4472, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.484, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5208, yPercentage: 0.6 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5576, yPercentage: 0.6 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.325, yPercentage: 0.25 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.29, yPercentage: 0.25 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.40, yPercentage: 0.5 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.42, yPercentage: 0.5 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.44, yPercentage: 0.5 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.46, yPercentage: 0.5 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.48, yPercentage: 0.5 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.5, yPercentage: 0.5 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.58, yPercentage: 0.25 },
    { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.62, yPercentage: 0.25 },
    { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.2, minPosition: 0.05 },
    { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.8, minPosition: 0.05 },
    { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.5, minPosition: 0.05 },
    { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.7, minPosition: 0.05 },
    { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.3, minPosition: 0.05 },
    { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
    { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
    { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
    { name: 'narwhal boss', id: 'narwhalboss', class: NarwhalBoss, data: this.assets.enemies.narwhalboss, xPercentage: 0.7, yPercentage: -3 },
    { name: 'mario', id: 'player', class: PlayerIce, data: this.assets.players.whitemario },
    { name: 'tubeD', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
    { name: 'iceberg', id: 'finishline', class: FinishLine, data: this.assets.obstacles.iceberg, xPercentage: 0.85, yPercentage: 0.603 },
    { name: 'iceminiEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.iceminiEnd },
  ];
<<<<<<< HEAD
  // IceMiniGame Game Level added to the GameEnv ...
  new GameLevel({ tag: "icemini", callback: this.playerOffScreenCallBack, objects: iceminiObjects });
  const GameSetterNarwhalBoss = {
=======

  const GameSetterWinterIce = {
    tag: 'Winter Ice',
>>>>>>> 3cb1a45fb64af4842c9355e53f79b1b6a695a006
    assets: assets,
    objects: objects
  };

export default GameSetterNarwhalBoss;