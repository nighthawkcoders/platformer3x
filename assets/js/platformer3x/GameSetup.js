// GameSehup.js Key objective is to define GameLevel objects and their assets.
import GameEnv from './GameEnv.js';
import GameLevel from './GameLevel.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import GameControl from './GameControl.js';
<<<<<<< HEAD
import Owl from './Owl.js';
import Snowman from './Snowman.js';
import Cerberus from './Cerberus.js';
import PlayerGreece from './PlayerGreece.js';
import FinishLine from './FinishLine.js';
import Lava from './Lava.js';
import Dragon from './Dragon.js';
import Star from './Star.js';
import Dementor from './Dementor.js';
import Draco from './Draco.js';
import Boss from './Boss.js';
import Jellyfish from './Jellyfish.js';
import Penguin from './Penguin.js';
import PlayerIce from './PlayerIce.js';
import FlyingIsland from './FlyingIsland.js';
import PlayerBaseOneD from './PlayerBaseOneD.js';
import PlayerZombie from './PlayerZombie.js';
import BossItem from './BossItem.js';
import PlayerBoss from './PlayerBoss.js';
import NarwhalBoss from './NarwhalBoss.js';
=======
import GameSet from './GameSet.js';
import GameSetterHills from './GameSetterHills.js';
import GameSetterWater from './GameSetterWater.js';
import GameSetterGreece from './GameSetterGreece.js';
import GameSetterGreeceMini from './GameSetterGreeceMini.js';
import GameSetterQuidditch from './GameSetterQuidditch.js';
import GameSetterHogwarts from './GameSetterHogwarts.js';
import GameSetterWinter from './GameSetterWinter.js';
import GameSetterWinterIce from './GameSetterWinterIce.js';
import GameSetterBoss from './GameSetterBoss.js';
>>>>>>> 74aaae06179dc850833fc841ba8f49d883b00c8d

//test comment

/* Coding Style Notes
 *
 * GameSetup is defined as an object literal in in Name Function Expression (NFE) style
 * * const GameSetup = function() { ... } is an NFE
 * * NFEs are a common pattern in JavaScript, reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function 
 *
 * * Informerly, inside of GameSetup it looks like defining keys and values that are functions.
 * * * GameSetup is a singleton object, object literal, without a constructor.
 * * * This coding style ensures one instance, thus the term object literal.
 * * * Inside of GameSetup, the keys are functions, and the values are references to the functions.
 * * * * The keys are the names of the functions.
 * * * * The values are the functions themselves.
 *
 * * Observe, encapulation of this.assets and sharing data between methods.
 * * * this.assets is defined in the object literal scope.
 * * * this.assets is shared between methods.
 * * * this.assets is not accessible outside of the object literal scope.
 * * * this.assets is not a global variable.
 * 
 * * Observe, the use of bind() to bind methods to the GameSetup object.
 * * * * bind() ensures "this" inside of methods binds to "GameSetup"
 * * * * this avoids "Temporal Dead Zone (TDZ)" error...
 * 
 * 
 * Usage Notes
 * * call GameSetup.initLevels() to setup the game levels and assets.
 * * * the remainder of GameSetup supports initLevels()
 * 
*/

// Define the GameSetup object literal
const GameSetup = {

  /*  ==========================================
   *  ===== Game Level Methods +++==============
   *  ==========================================
   * Game Level methods support Game Play, and Game Over
   * * Helper functions assist the Callback methods
   * * Callback methods are called by the GameLevel objects
   */

  /**
   * Helper function that waits for a button click event.
   * @param {string} id - The HTML id or name of the button.
   * @returns {Promise<boolean>} - A promise that resolves when the button is clicked.
   * References:
   * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   * *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
   */
  waitForButtonStart: function (id) {
    // Returns a promise that resolves when the button is clicked
    return new Promise((resolve) => {
      const waitButton = document.getElementById(id);
      // Listener function to resolve the promise when the button is clicked
      const waitButtonListener = () => {
        resolve(true);
      };
      // Add the listener to the button's click event
      waitButton.addEventListener('click', waitButtonListener);
    });
  },

  waitForButtonRestart: function (id) {
    // Returns a promise that resolves when the button is clicked
    return new Promise((resolve) => {
      const waitButton = document.getElementById(id);
      // Listener function to resolve the promise when the button is clicked
      const waitButtonListener = () => {
        if (document.getElementById('timeScore')) {
          document.getElementById('timeScore').textContent = GameEnv.time
        }
        const userScoreElement = document.getElementById('userScore');

        if (userScoreElement) {
          // Update the displayed time
          userScoreElement.textContent = (GameEnv.coinScore / 1000).toFixed(2);
        }
        resolve(true);
      };
      // Add the listener to the button's click event
      waitButton.addEventListener('click', waitButtonListener);
    });
  },

  /*  ==========================================
   *  ===== Game Level Call Backs ==============
   *  ==========================================
   * Game Level callbacks are functions that return true or false
   */

  /**
   * Start button callback.
   * Unhides the gameBegin button, waits for it to be clicked, then hides it again.
   * @async
   * @returns {Promise<boolean>} Always returns true.
   */
  startGameCallback: async function () {
    const id = document.getElementById("gameBegin");
    // Unhide the gameBegin button
    id.hidden = false;

    // Wait for the startGame button to be clicked
    await this.waitForButtonStart('startGame');
    // Hide the gameBegin button after it is clicked
    id.hidden = true;

    return true;
  },

  /**
   * Home screen exits on the Game Begin button.
   * Checks if the gameBegin button is hidden, which means the game has started.
   * @returns {boolean} Returns true if the gameBegin button is hidden, false otherwise.
   */
  homeScreenCallback: function () {
    // gameBegin hidden means the game has started
    const id = document.getElementById("gameBegin");
    return id.hidden;
  },

  /**
   * Level completion callback, based on Player off screen.
   * Checks if the player's x position is greater than the innerWidth of the game environment.
   * If it is, resets the player for the next level and returns true.
   * If it's not, returns false.
   * @returns {boolean} Returns true if the player's x position is greater than the innerWidth, false otherwise.
   */
  playerOffScreenCallBack: function () {
    // console.log(GameEnv.player?.x)
    if (GameEnv.player?.x > GameEnv.innerWidth) {
      GameEnv.player = null; // reset for next level
      return true;
    } else {
      return false;
    }
  },

  /**
   * Game Over callback.
   * Unhides the gameOver button, waits for it to be clicked, then hides it again.
   * Also sets the currentLevel of the game environment to null.
   * @async
   * @returns {Promise<boolean>} Always returns true.
   */
  gameOverCallBack: async function () {
    const id = document.getElementById("gameOver");
    id.hidden = false;
    GameControl.stopTimer()
    // Wait for the restart button to be clicked
    await this.waitForButtonRestart('restartGame');
    id.hidden = true;

    // Change currentLevel to start/restart value of null
    GameEnv.currentLevel = false;

    return true;
  },

  /*  ==========================================
   *  ======= Data Definitions =================
   *  ==========================================
   * Assets for the Game Objects defined in nested JSON key/value pairs
   *
   * * assets: contains definitions for all game objects, images, and properties
   * * * 1st level: category (obstacles, platforms, backgrounds, players, enemies)
   * * * 2nd level: item (tube, grass, mario, goomba)
   * * * 3rd level: property (src, width, height, scaleSize, speedRatio, w, wa, wd, a, s, d)
  */

  assets: {
    backgrounds: {
      start: { src: "/images/platformer/backgrounds/home.png" },
    },
    transitions: {
      miniEnd: { src: "/images/platformer/transitions/miniEnd.png" },
<<<<<<< HEAD
      iceminiEnd: { src: "/images/platformer/transitions/IceMinigameEnd.png"},
      hogwartsminiEnd: { src: "/images/platformer/transitions/HogwartsminiEnd.png"},
    },
    players: {
      mario: {
        src: "/images/platformer/sprites/mario.png",
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
      monkey: {
        src: "/images/platformer/sprites/monkey.png",
        width: 40,
        height: 40,
        scaleSize: 80,
        speedRatio: 0.7,
        wa: { row: 9, min: 8, frames: 15 },
        wd: { row: 9, min: 0, frames: 7 },
        a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
        s: { row: 12, frames: 15 },
        d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
      },
      knight: {
        src: "/images/platformer/sprites/knight.png",
        width: 128,
        height: 128,
        scaleSize: 120,
        speedRatio: 0.7,
        idle: {
          left: { row: 1, frames: 23 },
          right: { row: 0, frames: 23 },
        },
        walk: {
          left: { row: 7, frames: 20 },
          right: { row: 6, frames: 20 },
        },
        run: {
          left: { row: 5, frames: 23 },
          right: { row: 4, frames: 23 },
        },
        jump: {
          left: { row: 3, frames: 23 },
          right: { row: 2, frames: 23 },
        },
        hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
      }, harry: {
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
      zombie: { //one direction player
        src: "/images/platformer/sprites/zombie.png",
        width: 130,
        height: 70,
        scaleSize: 60,
        speedRatio: 0.7,
        idle: { row: 2, frames: 11, idleFrame: { column: 1, frames: 0 } },
        walk: { row: 3, frames: 11 }, // default - right Movement
        run: { row: 3, frames: 11 }, // default - right Movement
        jump: { row: 3, frames: 11 }, // default - right Movement
        attack: { row: 4, min: 6,frames: 11 }, 
        jumpAttack : { row: 6, frames: 11 }, 
        death : { row: 11, frames: 11 }, 
        hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
      },
      zombie: { //one direction player
        src: "/images/platformer/sprites/zombie.png",
        width: 130,
        height: 70,
        scaleSize: 60,
        speedRatio: 0.7,
        idle: { row: 2, frames: 11, idleFrame: { column: 1, frames: 0 } },
        walk: { row: 3, frames: 11 }, // default - right Movement
        run: { row: 3, frames: 11 }, // default - right Movement
        jump: { row: 3, frames: 11 }, // default - right Movement
        attack: { row: 4, min: 6,frames: 11 }, 
        jumpAttack : { row: 6, frames: 11 }, 
        death : { row: 11, frames: 11 }, 
        hitbox: { widthPercentage: 0.3, heightPercentage: 0.8 }
      },
    },
    enemies: {
      goomba: {
        src: "/images/platformer/sprites/goomba.png",
        width: 448,
        height: 452,
        scaleSize: 60,
        speedRatio: 0.7,
        xPercentage: 0.6,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
      },
      Snowman: {
        src: "/images/platformer/sprites/snowman.png",
        width: 308,
        height: 327,
        scaleSize: 60,
        speedRatio: 0.7,
        xPercentage: 0.6,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 },
        left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
        idle: { row: 0, frames: 0 }, // Stop the movement 
        right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
      },
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
      Owl: {
        src: "/images/platformer/sprites/owl.png",
        width: 499,
        height: 500,
        scaleSize: 60,
        speedRatio: 0.8,
      },
      Jellyfish: {
        src: "/images/platformer/sprites/jellyfish.png",
        width: 499, 
        height: 500,
        scaleSize: 90,
        speedRatio: 0.8,
      },  
      flyingGoomba: {
        src: "/images/platformer/sprites/flying-goomba.png",
        width: 448,
        height: 452,
        scaleSize: 60,
        speedRatio: 0.7,
      },
      mushroom: {
        src: "/images/platformer/platforms/mushroom.png",
        width: 200,
        height: 180,
        hitbox: { widthPercentage: 0.0, heightPercentage: 0.2 }
      },
      magicBeam: {
        src: "/images/platformer/platforms/magic_beam.png",
        width: 450,
        height: 400,
        hitbox: { widthPercentage: 0.5, heightPercentage: 0.5 }
      },
      alien: {
        src: "/images/platformer/sprites/alien.png",
        width: 444,
        height: 640,
        scaleSize: 60,
        speedRatio: 0.85,
      },
      flyingUFO: {
        src: "/images/platformer/sprites/flying-ufo.png",
        width: 1920,
        height: 1166,
        scaleSize: 150,
        speedRatio: 0.9,
      },
      cerberus: {
        src: "/images/platformer/sprites/cerberus.png",
        width: 103,
        height: 103,
        scaleSize: 80,
        speedRatio: 0.85,
        left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
        idle: { row: 0, frames: 0 }, // Stop the movement 
        right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
      },
      dragon: {
        src: "/images/platformer/sprites/dragon.png",
        width: 152,
        height: 119,
        scaleSize: 60,
        speedRatio: 0.7,
      }, dementor: {
        src: "/images/platformer/sprites/dementor2.png",
        width: 400,
        height: 400,
        scaleSize: 80,
        speedRatio: 0.7,
      },
      draco: {
        src: "/images/platformer/sprites/dracomalfoy.png",
        width: 301,
        height: 261,
        scaleSize: 80,
        speedRatio: 0.7,
        xPercentage: 0.6,
        left: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Left Movement
        idle: { row: 0, frames: 0 }, // Stop the movement 
        right: { row: 0, frames: 0, idleFrame: { column: 0, frames: 0 } }, // Right Movement 
      },
      boss: {
        src: "/images/platformer/sprites/boss.png",
        width: 64,
        height: 64,
        scaleSize: 320,
        speedRatio: 0.6,
        animationSpeed: 6,
        idleL: { row: 9, frames: 0, idleFrame: { column: 1, frames: 0 } },
        idleR: { row: 11, frames: 0, idleFrame: { column: 1, frames: 0 } },
        left: { row: 9, frames: 8, idleFrame: { column: 7, frames: 0 } },
        right: { row: 11, frames: 8, idleFrame: { column: 7, frames: 0 } },
        attackL: { row: 13, frames: 5 },
        attackR: { row: 15, frames: 5 },
        death: { row: 20, frames: 5 },
      },
      narwhalboss: {
        src: "/images/platformer/sprites/narwhal_boss.png",
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
=======
    },
>>>>>>> 74aaae06179dc850833fc841ba8f49d883b00c8d
  },

  /*  ==========================================
   *  ========== Game Level init ===============
   *  ==========================================
   * 
   * Game Level sequence as defined in code below
   * * a.) tag: "start" level defines button selection and cycles to the home screen
   * * b.) tag: "home" defines background and awaits "start" button selection and cycles to 1st game level
   * * c.) tag: "hills" and other levels before the tag: "end" define key gameplay levels
   * * d.) tag: "end"  concludes levels with game-over-screen background and replay selections
   * 
   * Definitions of new Object creations and JSON text
   * * 1.) "new GameLevel" adds game objects to the game environment.
   * * * JSON key/value "tag" is for readability
   * * * JSON "callback" contains function references defined above that terminate a GameLevel
   * * * JSON "objects" contain zero to many "GameObject"(s)
   * * 2.) "GameObject"(s) are defined using JSON text and include name, id, class, and data.  
   * * * JSON key/value "name" is for readability
   * * * JSON "id" is a GameObject classification and may have program significance
   * * * JSON "class" is the JavaScript class that defines the GameObject
   * * J* SON "data" contains assets and properties for the GameObject
  */

  initLevels: function (path) {  // ensure valid {{site.baseurl}} for path

    // Add File location in assets relative to the root of the site
    Object.keys(this.assets).forEach(category => {
      Object.keys(this.assets[category]).forEach(item => {
        this.assets[category][item]['file'] = path + this.assets[category][item].src;
      });
    });

    var fun_facts = {
      //data structure
      "Fun Fact #1": "Mario's full name is Mario Mario.", //key and value
      "Fun Fact #2": "Mario's least favorite food is shiitake mushrooms.", //single quotes to include the double quotes
      "Fun Fact #3": "Mario, in human years, is 24-25 years old.",
      "Fun Fact #4": "Mario's girlfriend's name is Pauline.",
      "Fun Fact #5": "Call or text 929-55-MARIO (929-556-2746) to get a fun surprise!",
      "Fun Fact #6": "Mario's original name was Jumpman.",
      "Fun Fact #7": "March 10th is known as Mario Day because the abbreviation for March 10th (Mar10) looks like Mario.",
      "Fun Fact #8": "Mario was originally a carpenter, not a plumber.",
      "Fun Fact #9": "There are actually lyrics to the Mario theme song."
    }
    function generate() {
      var nums = Object.keys(fun_facts);
      //console.log(nums);
      var num = nums[Math.floor(Math.random() * nums.length)]
      var fun_fact = fun_facts[num]; //using dictionary
      //access ids
      document.getElementById("fun_fact").innerHTML = fun_fact;
      document.getElementById("num").innerHTML = num;
    }

    let k = 0;
    let interval2 = setInterval(() => {
      generate();
      k++;
      if (k == fun_facts.length) {
        clearInterval(interval2);
      }
    }, 3000);

    // Home screen added to the GameEnv ...
    new GameLevel({ tag: "start", callback: this.startGameCallback });
    const homeGameObjects = [
      { name: 'background', id: 'background', class: Background, data: this.assets.backgrounds.start }
    ];
    // Home Screen Background added to the GameEnv, "passive" means complementary, not an interactive level..
    new GameLevel({ tag: "home", callback: this.homeScreenCallback, objects: homeGameObjects, passive: true });

    // Hills Game Level added to the GameEnv ...
    var hillsGameObjects = new GameSet(GameSetterHills.assets, GameSetterHills.objects, path);
    new GameLevel({ tag: "hills", callback: this.playerOffScreenCallBack, objects: hillsGameObjects.getGameObjects() });

    // Greece Game Level added to the GameEnv ...
    var greeceGameObjects = new GameSet(GameSetterGreece.assets, GameSetterGreece.objects, path);
    new GameLevel({ tag: "ancient greece", callback: this.playerOffScreenCallBack, objects: greeceGameObjects.getGameObjects() });

    // Space Game Level added to the GameEnv ...
    var greeceMiniGameObjects = new GameSet(GameSetterGreeceMini.assets, GameSetterGreeceMini.objects, path);
    new GameLevel({ tag: "mini greece", callback: this.playerOffScreenCallBack, objects: greeceMiniGameObjects.getGameObjects() });

    // Under Water Game Level defintion...
    // Hills Game Level added to the GameEnv ...
    var waterGameObjects = new GameSet(GameSetterWater.assets, GameSetterWater.objects, path);
    new GameLevel({ tag: "water", callback: this.playerOffScreenCallBack, objects: waterGameObjects.getGameObjects() });

    // Quidditch Game Level added to the GameEnv ...
<<<<<<< HEAD
    new GameLevel({ tag: "quidditch", callback: this.playerOffScreenCallBack, objects: quidditchGameObjects });

    const miniHogwartsObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'miniHogwarts', id: 'background', class: Background, data: this.assets.backgrounds.miniHogwarts },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.009, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.058, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.1, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.47 },
      
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.81 },

      { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: this.assets.platforms.stone, xPercentage: 0.44, yPercentage: 0.92 },
      { name: 'magicBeam', id: 'magicBeam', class: MagicBeam, data: this.assets.enemies.magicBeam, xPercentage: 0.37, yPercentage: 0.61 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.64 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.54 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.44 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.34 },
      
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.6, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.56, yPercentage: 0.5 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.64, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.68, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.72, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.76, yPercentage: 0.47 },
      
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.55, yPercentage: 0.38 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.636, yPercentage: 0.699 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.672, yPercentage: 0.368 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.71, yPercentage: 0.368 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.75, yPercentage: 0.368 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.056, yPercentage: 0.56 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.15, yPercentage: 0.24 },
      
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.14, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.18, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.22, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.26, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.43, yPercentage: 0.82 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.47, yPercentage: 0.24 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.799, yPercentage: 0.81 },
      

      { name: 'harry', id: 'player', class: PlayerMini, data: this.assets.players.harry },
      { name: 'tubeD', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
      { name: 'tubeU', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.85, yPercentage: 0.646 },
      { name: 'minihogwartsEnd', id: 'background', class: BackgroundTransitions,  data: this.assets.transitions.minihogwartsEnd },
    ];

    // miniHogwarts Game Level added to the GameEnv ...
    new GameLevel({ tag: "mini hogwarts", callback: this.playerOffScreenCallBack, objects: miniHogwartsObjects });

    const winterObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'winter', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.winter },
      { name: 'snow', id: 'background', class: BackgroundSnow, data: this.assets.backgrounds.snow },
      { name: 'snowyfloor', id: 'platform', class: Platform, data: this.assets.platforms.snowyfloor },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2368, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2736, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3104, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3472, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.384, yPercentage: 0.74 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4208, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.56 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.48 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.40 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.32 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.69, yPercentage: 0.76 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.655, yPercentage: 0.68 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.62, yPercentage: 0.68 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.72, yPercentage: 0.76 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 1 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.92 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.84 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.625, yPercentage: 0.92 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.625, yPercentage: 1 },
      { name: 'snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.2100, yPercentage: 0.72 },
      { name: 'snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.2619, yPercentage: 0.72 },
      { name: 'snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.3136, yPercentage: 0.72 },
      { name: 'owl', id: 'owl', class: Owl, data: this.assets.enemies.Owl, xPercentage: 0.3, minPosition: 0.05 },
      { name: 'owl', id: 'owl', class: Owl, data: this.assets.enemies.Owl, xPercentage: 0.8, minPosition: 0.05 },
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage: 0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage: 0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage: 0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'mario', id: 'player', class: PlayerWinter, data: this.assets.players.whitemario },
      { name: 'cabin', id: 'finishline', class: FinishLine, data: this.assets.obstacles.cabin, xPercentage: 0.85, yPercentage: 0.603 },
      { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.69, yPercentage: 0.71 },
      { name: 'minihogwartsEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.minihogwartsEnd },
    ];
=======
    var quidditchGameObjects = new GameSet(GameSetterQuidditch.assets, GameSetterQuidditch.objects, path);
    new GameLevel({ tag: "quidditch", callback: this.playerOffScreenCallBack, objects: quidditchGameObjects.getGameObjects() });

    // miniHogwarts Game Level added to the GameEnv ...
    var miniHogwartsGameObjects = new GameSet(GameSetterHogwarts.assets, GameSetterHogwarts.objects, path);
    new GameLevel({ tag: "mini hogwarts", callback: this.playerOffScreenCallBack, objects: miniHogwartsGameObjects.getGameObjects() });
>>>>>>> 74aaae06179dc850833fc841ba8f49d883b00c8d

    // Winter MiniGame Level added to the GameEnv ...
    var winterGameObjects = new GameSet(GameSetterWinter.assets, GameSetterWinter.objects, path);
    new GameLevel({ tag: "winter", callback: this.playerOffScreenCallBack, objects: winterGameObjects.getGameObjects() });
    
<<<<<<< HEAD
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
      { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'narwhal boss', id: 'narwhalboss', class: NarwhalBoss, data: this.assets.enemies.narwhalboss, xPercentage: 0.5, yPercentage: -3, difficulties: ["normal", "hard", "impossible"] },
      { name: 'mario', id: 'player', class: PlayerIce, data: this.assets.players.whitemario },
      { name: 'tubeD', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
      { name: 'iceberg', id: 'finishline', class: FinishLine, data: this.assets.obstacles.iceberg, xPercentage: 0.85, yPercentage: 0.603 },
      { name: 'iceminiEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.iceminiEnd },
    ];
=======
>>>>>>> 74aaae06179dc850833fc841ba8f49d883b00c8d
    // IceMiniGame Game Level added to the GameEnv ...
    var winterIceGameObjects = new GameSet(GameSetterWinterIce.assets, GameSetterWinterIce.objects, path);
    new GameLevel({ tag: "icemini", callback: this.playerOffScreenCallBack, objects: winterIceGameObjects.getGameObjects() });

<<<<<<< HEAD
    const bossGameObjects = [
      { name: 'bossbackground', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.boss },
      { name: 'devil', id: 'devil', class:BackgroundParallax, data: this.assets.backgrounds.devil},
      { name: 'boss', id: 'boss', class: Boss, data: this.assets.enemies.boss, xPercentage: 0.5, minPosition: 0.3 },
      { name: 'boss1', id: 'boss', class: Boss, data: this.assets.enemies.boss, xPercentage: 0.3, minPosition: 0.07 },
      { name: 'mario', id: 'player', class: PlayerBoss, data: this.assets.players.mario },
      { name: 'zombie', id: 'player', class: PlayerZombie, data: this.assets.players.zombie },
      { name: 'tube', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.65 },
      { name: 'itemBlock', id: 'jumpPlatform', class: BossItem, data: this.assets.platforms.itemBlock, xPercentage: 0.2, yPercentage: 0.65 }, //item block is a platform
      { name: 'mario', id: 'player', class: PlayerBoss, data: this.assets.players.mario },
      { name: 'zombie', id: 'player', class: PlayerZombie, data: this.assets.players.zombie },
      { name: 'grass', id: 'platform', class: Platform, data: this.assets.platforms.grass },
      { name: 'winterEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.winterEnd },
    ];

    new GameLevel({ tag: "boss", callback: this.playerOffScreenCallBack, objects: bossGameObjects });
=======
    // Boss Game Level added to the GameEnv ...
    var bossGameObjects = new GameSet(GameSetterBoss.assets, GameSetterBoss.objects, path);
    new GameLevel({ tag: "boss", callback: this.playerOffScreenCallBack, objects: bossGameObjects.getGameObjects() });
>>>>>>> 74aaae06179dc850833fc841ba8f49d883b00c8d

    // Game Over Level definition...
    const endGameObjects = [
      { name: 'background', class: Background, id: 'background', data: this.assets.transitions.miniEnd }
    ];
    // Game Over screen added to the GameEnv ...
    new GameLevel({ tag: "end", callback: this.gameOverCallBack, objects: endGameObjects });
  }
}
// Bind the methods to the GameSetup object, ensures "this" inside of methods binds to "GameSetup"
// * * this avoids "Temporal Dead Zone (TDZ)" error... 
// * * * * "Cannot access 'GameSetup' before initialization", light reading TDZ (ha ha)...
// * * * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_Dead_Zone
GameSetup.startGameCallback = GameSetup.startGameCallback.bind(GameSetup);
GameSetup.gameOverCallBack = GameSetup.gameOverCallBack.bind(GameSetup);

export default GameSetup;