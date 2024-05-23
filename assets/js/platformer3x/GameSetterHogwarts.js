// GameSetHills.js Key objective is to define objects for a GameLevel
import GameSet from './GameSet.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundParallax from './BackgroundParallax.js';
import BackgroundTransitions from './BackgroundTransitions.js';
import BackgroundSnow from './BackgroundSnow.js';
import Platform from './Platform.js';
import PlayerWinter from './PlayerWinter.js';
import PlayerMini from './PlayerMini.js';
import PlayerMiniHogwarts from './PlayerMiniHogwarts.js';
import PlayerQuidditch from './PlayerQuidditch.js';
import BlockPlatform from './BlockPlatform.js';
import SpawnPlatform from './PlatformSpawn.js';
import MovingPlatform from './PlatformMoving.js'
import MagicBeam from './MagicBeam.js';
import ChocoFrog from './ChocoFrog.js';
import Coin from './Coin.js';
import GameControl from './GameControl.js';
import Owl from './FlyingOwl.js';
import Snowman from './EnemySnowman.js';
import Cerberus from './EnemyCerberus.js';
import PlayerGreece from './PlayerGreece.js';
import FinishLine from './FinishLine.js';
import Lava from './Lava.js';
import Dragon from './FlyingDragon.js';
import Star from './Star.js';
import Dementor from './FlyingDementor.js';
import Draco from './EnemyDraco.js';
import Boss from './Boss.js';
import Jellyfish from './FlyingJellyfish.js';
import Penguin from './EnemyPenguin.js';
import PlayerIce from './PlayerIce.js';
import FlyingIsland from './PlatformFlyingIsland.js';
import PlayerZombie from './PlayerZombie.js';
import BossItem from './BossItem.js';
import PlayerBoss from './PlayerBoss.js';

// Define the GameSetup object literal
const assets = {  
  obstacles: {
    tube: { src: "/images/platformer/obstacles/tube.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
    tubeU: { src: "/images/platformer/obstacles/blue-tube-up.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
    tubeD: { src: "/images/platformer/obstacles/blue-tube.png",
    hitbox: { widthPercentage: 0.5, heightPercentage: 0.5},
    width: 300,
    height: 300,
    scaleSize: 100,
    },
    cabin: {
      src: "/images/platformer/obstacles/cabin.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
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
    chest: {
      src: "/images/platformer/obstacles/Chest.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 150,
    },
    flag: {
      src: "/images/platformer/obstacles/flag.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 },
      width: 300,
      height: 300,
      scaleSize: 120,
    },
    coin: { src: "/images/platformer/obstacles/coin.png" },
    snowflake: { src: "/images/platformer/obstacles/snowflake.png" },
    star: { src: "/images/platformer/obstacles/star.png" },
    snitch: { src: "/images/platformer/obstacles/snitch.png" },
    whompingwillow: {
      src: "/images/platformer/obstacles/whompingwillowtree.png",
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
    },
  },
  platforms: {
    grass: { src: "/images/platformer/platforms/grass.png" },
    narwhalfloor: { src: "/images/platformer/platforms/narwhalfloor.png" },
    sand: { src: "/images/platformer/platforms/sand.png" },
    sandblock: {src:"/images/platformer/platforms/sandblock.png"},
    snowyfloor: { src: "/images/platformer/platforms/snowyfloor.png" },
    snowywood: { src: "/images/platformer/platforms/snowywood.png" },
    alien: { src: "/images/platformer/platforms/alien.png" },
    bricks: { src: "/images/platformer/platforms/brick_wall.png" },
    lava: { src: "/images/platformer/platforms/lava.jpg" },
    sandstone: { src: "/images/platformer/platforms/sandstone.png" },
    cobblestone: { src: "/images/platformer/platforms/cobblestone.png" },
    yellowpattern: { src: "/images/platformer/platforms/yellowtowerpattern.jpg" },
    yellowredpattern: { src: "/images/platformer/platforms/yellowredpattern.jpg" },
    lionpattern: { src: "/images/platformer/platforms/lionpattern.jpg" },
    stone: { src: "/images/platformer/platforms/stone.jpg"}, 
    turf: { src: "/images/platformer/platforms/turf.png" },
    island: { src: "/images/platformer/platforms/island.png" },
    island: { src: "/images/platformer/platforms/island.png" },
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
    boss: { src: "/images/platformer/backgrounds/BossBackground.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    start: { src: "/images/platformer/backgrounds/home.png" },
    hills: { src: "/images/platformer/backgrounds/hills.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    greece: { src: "/images/platformer/backgrounds/greek.png" },
    mountains: { src: "/images/platformer/backgrounds/mountains.jpg", parallaxSpeed: 0.1, moveOnKeyAction: true },
    clouds: { src: "/images/platformer/backgrounds/clouds.png", parallaxSpeed: 0.5 },
    water: { src: "/images/platformer/backgrounds/water.png" },
    fish: { src: "/images/platformer/backgrounds/school-fish.png", parallaxSpeed: -0.5 },
    reef: { src: "/images/platformer/backgrounds/reef.png" },
    quidditch: { src: "/images/platformer/backgrounds/quidditch2.jpg" },
    miniHogwarts: { src: "/images/platformer/backgrounds/miniHogwarts.png", parallaxSpeed: 0.5, moveOnKeyAction: true }, 
    bat: {src: "/images/platformer/backgrounds/bat.png", parallaxSpeed: -0.5 },
    space: { src: "/images/platformer/backgrounds/planet.jpg" },
    castles: { src: "/images/platformer/backgrounds/castles.png" },
    winter: { src: "/images/platformer/backgrounds/winter.png", parallaxSpeed: 0.4, moveOnKeyAction: true },
    snow: { src: "/images/platformer/backgrounds/snowfall.png" },
    icewater: { src: "/images/platformer/backgrounds/icewater.png", parallaxSpeed: 0.4, moveOnKeyAction: true},
    narwhal: { src: "/images/platformer/backgrounds/narwhal.png", parallaxSpeed: 2 },
    mini: { src: "/images/platformer/backgrounds/mini.png" },
    devil: {src: "/images/platformer/backgrounds/devil.png", parallaxSpeed: 2 },
  },
  transitions: {
    loading: { src: "/images/platformer/transitions/greenscreen.png" },
    hillsEnd: { src: "/images/platformer/transitions/hillsEnd.png" },
    winterEnd: { src: "/images/platformer/transitions/winterEnd.png" },
    greeceEnd: { src: "/images/platformer/transitions/greeceEnd.png" },
    waterEnd: { src: "/images/platformer/transitions/waterEnd.png" },
    quidditchEnd: { src: "/images/platformer/transitions/quidditchEnd.png" },
    miniEnd: { src: "/images/platformer/transitions/miniEnd.png" },
    iceminiEnd: { src: "/images/platformer/transitions/IceMinigameEnd.png"},
  },
  players: {
    harry: {
      src: "/images/platformer/sprites/harryanimation3.png",
      width: 32,
      height: 32,
      scaleSize: 60,
      speedRatio: 0.7,
      idle: {
        left: { row: 1, frames: 0 },
        right: { row: 2, frames: 0 },
      },
      walk: {
        left: { row: 1, frames: 5 },
        right: { row: 2, frames: 5 },
      },
      run: {
        left: { row: 1, frames: 5 },
        right: { row: 2, frames: 5 },
      },
      jump: {
        left: { row: 1, frames: 0 },
        right: { row: 2, frames: 0 },
      },
      hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
    },
    lopez: {
      src: "/images/platformer/sprites/lopezanimation.png",
      width: 46,
      height: 52.5,
      scaleSize: 60,
      speedRatio: 0.7,
      wa: { row: 1, frames: 3 }, // Up-Left Movement 
      wd: { row: 2, frames: 3 }, // Up-Right Movement
      idle: { row: 6, frames: 1, idleFrame: { column: 1, frames: 0 } },
      a: { row: 1, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Left Movement
      s: { row: 1, frames: 3 }, // Stop the movement 
      d: { row: 2, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Right Movement 
      runningLeft: { row: 5, frames: 3, idleFrame: { column: 1, frames: 0 } },
      runningRight: { row: 4, frames: 3, idleFrame: { column: 1, frames: 0 } }, 
    },
  },
  enemies: {
    magicBeam: {
      src: "/images/platformer/platforms/magic_beam.png",
      width: 450,
      height: 400,
      hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
    },
    chocoFrog: {
      src: "/images/platformer/platforms/Chocolatefrog.jpg",
      width: 200,
      height: 200,
      hitbox: { widthPercentage: 0.0, heightPercentage: 0.0 }
    },
  }
  };

  //  Game Level defintion...
  const objects = [
    { name: 'miniHogwarts', id: 'background', class: BackgroundParallax, data: assets.backgrounds.miniHogwarts },
    { name: 'bat', id: 'background', class: BackgroundParallax, data: assets.backgrounds.bat },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.009, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.058, yPercentage: 0.66 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.1, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.47 },
    
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.81 },

    { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: assets.platforms.stone, xPercentage: 0.44, yPercentage: 0.92 },
    { name: 'magicBeam', id: 'magicBeam', class: MagicBeam, data: assets.enemies.magicBeam, xPercentage: 0.37, yPercentage: 0.61 },

    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.64 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.54 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.44 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.34 },
    
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.6, yPercentage: 0.66 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.56, yPercentage: 0.5 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.64, yPercentage: 0.81 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.68, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.72, yPercentage: 0.47 },
    { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: assets.platforms.stone, xPercentage: 0.76, yPercentage: 0.47 },
    
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.55, yPercentage: 0.38 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.636, yPercentage: 0.699 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.672, yPercentage: 0.368 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.71, yPercentage: 0.368 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.75, yPercentage: 0.368 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.056, yPercentage: 0.56 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.15, yPercentage: 0.24 },
    
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.14, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.18, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.22, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.26, yPercentage: 0.7 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.43, yPercentage: 0.82 },
    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.47, yPercentage: 0.24 },

    { name: 'coin', id: 'coin', class: Coin, data: assets.obstacles.snitch, xPercentage: 0.85, yPercentage: 0.81 },
    

    { name: 'harry', id: 'player', class: PlayerMiniHogwarts, data: assets.players.harry },
    { name: 'tubeD', id: 'finishline', class: FinishLine, data: assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
    { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: assets.obstacles.tubeU, xPercentage: 0.85, yPercentage: 0.7 },
  ];

  const GameHogwarts = {
    assets: assets,
    objects: objects
  };

export default GameHogwarts;
