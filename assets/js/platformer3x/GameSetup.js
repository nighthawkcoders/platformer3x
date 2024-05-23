
// GameSehup.js Key objective is to define GameLevel objects and their assets.
import GameEnv from './GameEnv.js';
import GameLevel from './GameLevel.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import GameControl from './GameControl.js';
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
import GameSetterSkibidi from './GameSetterSkibidi.js';

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
    },
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
    var quidditchGameObjects = new GameSet(GameSetterQuidditch.assets, GameSetterQuidditch.objects, path);
    new GameLevel({ tag: "quidditch", callback: this.playerOffScreenCallBack, objects: quidditchGameObjects.getGameObjects() });

    // miniHogwarts Game Level added to the GameEnv ...
    var miniHogwartsGameObjects = new GameSet(GameSetterHogwarts.assets, GameSetterHogwarts.objects, path);
    new GameLevel({ tag: "mini hogwarts", callback: this.playerOffScreenCallBack, objects: miniHogwartsGameObjects.getGameObjects() });

    // Winter MiniGame Level added to the GameEnv ...
    var winterGameObjects = new GameSet(GameSetterWinter.assets, GameSetterWinter.objects, path);
    new GameLevel({ tag: "winter", callback: this.playerOffScreenCallBack, objects: winterGameObjects.getGameObjects() });
    
    // IceMiniGame Game Level added to the GameEnv ...
    var winterIceGameObjects = new GameSet(GameSetterWinterIce.assets, GameSetterWinterIce.objects, path);
    new GameLevel({ tag: "icemini", callback: this.playerOffScreenCallBack, objects: winterIceGameObjects.getGameObjects() });

    // Boss Game Level added to the GameEnv ...
    var bossGameObjects = new GameSet(GameSetterBoss.assets, GameSetterBoss.objects, path);
    new GameLevel({ tag: "boss", callback: this.playerOffScreenCallBack, objects: bossGameObjects.getGameObjects() });

    const skibidiGameObjects = new GameSet(GameSetterSkibidi.assets, GameSetterSkibidi.objects, path)
    new GameLevel({ tag: "skibidi", callback: this.playerOffScreenCallBack, objects: skibidiGameObjects.getGameObjects() })

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
