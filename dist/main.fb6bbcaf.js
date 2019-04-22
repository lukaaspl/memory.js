// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/Statistics.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// class for managing statistics
var Statistics =
/*#__PURE__*/
function () {
  function Statistics(pairsTotal) {
    _classCallCheck(this, Statistics);

    // HTML references to statistic fields
    this.nodes = {
      pairsTotal: document.querySelector('.pairsTotal'),
      foundPairs: document.querySelector('.pairsFound'),
      missedPairs: document.querySelector('.pairsMissed'),
      gameTime: document.querySelector('.gameTime')
    }; // set how many pairs are on the board

    this.nodes.pairsTotal.textContent = pairsTotal; // statistics

    this.foundPairs = 0;
    this.missedPairs = 0;
    this.gameTime = 0;
  } // start/continue counting time


  _createClass(Statistics, [{
    key: "startTime",
    value: function startTime() {
      var _this = this;

      this.timeInterval = setInterval(function () {
        ++_this.gameTime;
        _this.nodes.gameTime.textContent = _this.gameTime;
      }, 1000);
    } // pause counting time

  }, {
    key: "pauseTime",
    value: function pauseTime() {
      clearInterval(this.timeInterval);
    } // add missed pair

  }, {
    key: "addMissedPair",
    value: function addMissedPair() {
      ++this.missedPairs;
      this.nodes.missedPairs.textContent = this.missedPairs;
    } // add found pair

  }, {
    key: "addFoundPair",
    value: function addFoundPair() {
      ++this.foundPairs;
      this.nodes.foundPairs.textContent = this.foundPairs;
    } // reset statistics in case of starting new game

  }, {
    key: "resetStatistics",
    value: function resetStatistics() {
      clearInterval(this.timeInterval);
      this.nodes.pairsTotal.textContent = 0;
      this.nodes.gameTime.textContent = 0;
      this.nodes.missedPairs.textContent = 0;
      this.nodes.foundPairs.textContent = 0;
    }
  }]);

  return Statistics;
}();

var _default = Statistics;
exports.default = _default;
},{}],"assets/pop.wav":[function(require,module,exports) {
module.exports = "/pop.73461079.wav";
},{}],"assets/negative.wav":[function(require,module,exports) {
module.exports = "/negative.13de6042.wav";
},{}],"assets/positive.wav":[function(require,module,exports) {
module.exports = "/positive.88193984.wav";
},{}],"assets/victory.mp3":[function(require,module,exports) {
module.exports = "/victory.5e54e67f.mp3";
},{}],"js/Sound.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pop = _interopRequireDefault(require("../assets/pop.wav"));

var _negative = _interopRequireDefault(require("../assets/negative.wav"));

var _positive = _interopRequireDefault(require("../assets/positive.wav"));

var _victory = _interopRequireDefault(require("../assets/victory.mp3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// class for managing sound
var Sound =
/*#__PURE__*/
function () {
  function Sound() {
    _classCallCheck(this, Sound);

    // set default volume in case of invalid volume parameter
    this.defaultVolume = 0.4; // keep sound unmuted as default

    this.muted = false; // sound sources

    this.sounds = {
      pop: new Audio(_pop.default),
      negative: new Audio(_negative.default),
      positive: new Audio(_positive.default),
      victory: new Audio(_victory.default)
    };
  } // set volume method


  _createClass(Sound, [{
    key: "setVolume",
    value: function setVolume(volume) {
      if (volume < 0 || volume > 1) return false;
      this.defaultVolume = volume;

      for (var key in this.sounds) {
        this.sounds[key].volume = volume;
      }
    } // mute / unmute methods

  }, {
    key: "mute",
    value: function mute() {
      this.muted = true;

      for (var key in this.sounds) {
        this.sounds[key].muted = true;
      }
    }
  }, {
    key: "unmute",
    value: function unmute() {
      this.muted = false;

      for (var key in this.sounds) {
        this.sounds[key].muted = false;
      }
    } // play sound methods

  }, {
    key: "pop",
    value: function pop() {
      this.sounds.pop.play();
    }
  }, {
    key: "negative",
    value: function negative() {
      this.sounds.negative.play();
    }
  }, {
    key: "positive",
    value: function positive() {
      this.sounds.positive.play();
    }
  }, {
    key: "victory",
    value: function victory() {
      this.sounds.victory.play();
    }
  }]);

  return Sound;
}();

var _default = Sound;
exports.default = _default;
},{"../assets/pop.wav":"assets/pop.wav","../assets/negative.wav":"assets/negative.wav","../assets/positive.wav":"assets/positive.wav","../assets/victory.mp3":"assets/victory.mp3"}],"assets/card-bg.png":[function(require,module,exports) {
module.exports = "/card-bg.b460bc38.png";
},{}],"js/Memory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Statistics = _interopRequireDefault(require("./Statistics"));

var _Sound = _interopRequireDefault(require("./Sound"));

var _Interface = _interopRequireDefault(require("./Interface"));

var _cardBg = _interopRequireDefault(require("../assets/card-bg.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Memory =
/*#__PURE__*/
function () {
  function Memory(containerNode, difficultyLevel) {
    _classCallCheck(this, Memory);

    this.containerNode = containerNode; // game flags 

    this.gameActive = false;
    this.cardPicked = 'none';
    this.firstCard = '';
    this.secondCard = ''; // set configuration depending on difficulty level:
    // pairs number, hex codes yes or not, preview time

    this.difficultyLevel = difficultyLevel;

    switch (this.difficultyLevel) {
      case 'easy':
        this.pairs = 12;
        this.hexCode = true;
        this.previewTime = 4000;
        break;

      case 'normal':
        this.pairs = 16;
        this.hexCode = true;
        this.previewTime = 3000;
        break;

      case 'hard':
        this.pairs = 20;
        this.hexCode = false;
        this.previewTime = 2000;
        break;

      default:
        this.pairs = 16;
        this.hexCode = true;
        this.previewTime = 3000;
    } // array with pairs which were found


    this.foundPairs = []; // create statstics object to be able to update them

    this.statistics = new _Statistics.default(this.pairs); // card background img tag

    this.cardBackgroundImageTag = "<img src=\"".concat(_cardBg.default, "\" alt=\"\">"); // create music objects to have access to game sounds

    this.sound = new _Sound.default();
    this.sound.setVolume(0.4);
    this.pauseButtonNode = document.querySelector('button[data-action="pause"]');
  } // render cards divs elements


  _createClass(Memory, [{
    key: "renderCards",
    value: function renderCards() {
      for (var i = 0; i < this.pairs * 2; i++) {
        var card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = this.cardBackgroundImageTag;
        this.containerNode.appendChild(card);
      }
    } // switch game on/off

  }, {
    key: "gameOn",
    value: function gameOn(state) {
      if (state) {
        this.gameActive = true;
        this.statistics.startTime();
      } else {
        this.gameActive = false;
        this.statistics.pauseTime();
      }
    } // generate color for every card

  }, {
    key: "createColorsArray",
    value: function createColorsArray() {
      var _hexadecimals = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f';

      var hexadecimals = _hexadecimals.split(',');

      var colorsArray = []; // mesaure time needed to create an array

      var startTime = performance.now();

      while (colorsArray.length < this.pairs) {
        var hexColor = '';

        for (var j = 0; j < 6; j++) {
          var randomIndex = Math.floor(Math.random() * hexadecimals.length);
          hexColor += hexadecimals[randomIndex];
        }

        hexColor = "#".concat(hexColor); // if that color does not exist yet, push it to the array
        // else iterate again

        if (colorsArray.indexOf(hexColor) === -1) colorsArray.push(hexColor);
      }

      var endTime = performance.now();
      var creationTime = endTime - startTime; // double array to make every color have a pair

      var pairedColorsArray = colorsArray.concat(colorsArray);
      return {
        pairedColors: pairedColorsArray,
        colors: colorsArray,
        time: creationTime
      };
    } // fill cards with generated colors

  }, {
    key: "fillCards",
    value: function fillCards() {
      var _this = this;

      this.cardsNodes = document.querySelectorAll('.card');
      var cards = this.cardsNodes;
      var colors = this.createColorsArray();
      var pairedColors = colors.pairedColors;
      var creationTime = colors.time;
      console.info("colors generated in ".concat(creationTime.toFixed(2), " seconds"));
      cards.forEach(function (card) {
        // randomly set colors to cards
        var randomIndex = Math.floor(Math.random() * pairedColors.length);
        card.setAttribute('data-card-color', pairedColors[randomIndex]);
        card.addEventListener('click', function (evt) {
          return _this.pickCard(evt.target);
        }); // remove color from array after each iteration

        pairedColors.splice(randomIndex, 1);
      });
    } // click on card

  }, {
    key: "pickCard",
    value: function pickCard(card) {
      var _this2 = this;

      // if card was already inverted 
      // by picking first/second card or clicking on paired cards
      // then break function
      if (card.classList.contains('inverted')) return false; // switch game state to on if it's first click

      if (!this.gameActive) {
        this.pauseButtonNode.removeAttribute('disabled');
        this.gameOn(true);
      }

      var cardBackgroundColor = card.getAttribute('data-card-color'); // adjust behavior depending on the type of card selection

      switch (this.cardPicked) {
        case 'none':
          // picked first card
          this.cardPicked = 'first';
          this.firstCard = cardBackgroundColor;
          this.invertCard(card);
          this.sound.pop();
          break;

        case 'first':
          // picked second card
          this.cardPicked = 'second';
          this.secondCard = cardBackgroundColor;
          this.invertCard(card); // check if both cards make a pair

          if (this.firstCard === this.secondCard) {
            // found a pair
            this.addPair();
            this.unsetPickedCards();
            this.sound.positive();
          } else {
            // cards do not fit
            this.coverCardsTimeout = setTimeout(this.coverInvertedCards.bind(this), 1000);
            this.negativeSoundTimeout = setTimeout(function () {
              return _this2.sound.negative();
            }, 1000);
            this.statistics.addMissedPair();
            this.sound.pop();
          }

          break;

        case 'second':
          // pick card before timeout function fires
          // so invert clicked card and cover at once inverted ones before
          this.coverInvertedCards();
          clearTimeout(this.coverCardsTimeout);
          clearTimeout(this.negativeSoundTimeout); // so it's treated as first card picking

          this.cardPicked = 'first';
          this.firstCard = cardBackgroundColor;
          this.invertCard(card);
          this.sound.pop();
          break;

        default:
          return false;
      }
    } // invert card and name it by using her hex color

  }, {
    key: "invertCard",
    value: function invertCard(card) {
      var cardBackgroundColor = card.getAttribute('data-card-color');
      card.classList.add('inverted');
      card.style.backgroundColor = cardBackgroundColor;
      if (this.hexCode) card.innerHTML = "<h3 class=\"color-desc\">".concat(cardBackgroundColor, "</h3>");
    } // preview cards before game is on

  }, {
    key: "preview",
    value: function preview() {
      var _this3 = this;

      // do not preview as it's set in difficulty level config 
      if (!this.previewTime) return false;
      this.cardsNodes.forEach(function (card) {
        return _this3.invertCard(card);
      });
      setTimeout(function () {
        _this3.coverInvertedCards();

        _this3.containerNode.classList.remove('overlayed');
      }, this.previewTime);
    } // handing out cards animation

  }, {
    key: "handOutCards",
    value: function handOutCards() {
      var _this4 = this;

      var cards = this.cardsNodes; // set single card animation time [ms]

      var handOutCardTime = 30; // set time after which preview is on after handing out cards animation 

      var timeBeforePreview = cards.length * handOutCardTime + 800; // if preview is enabled, make cards overlayed that they can not be clicked

      if (this.previewTime) this.containerNode.classList.add('overlayed'); // hide cards

      cards.forEach(function (card, index) {
        card.classList.add('hidden'); // hand out cards

        setTimeout(function () {
          return card.classList.remove('hidden');
        }, handOutCardTime * index);
      }); // turn on preview

      setTimeout(function () {
        return _this4.preview();
      }, timeBeforePreview);
    } // cover inverted cards

  }, {
    key: "coverInvertedCards",
    value: function coverInvertedCards() {
      var _this5 = this;

      var invertedCards = document.querySelectorAll('.card.inverted'); // but only unpaired ones

      invertedCards.forEach(function (invertedCard) {
        var invertedCardBackgroundColor = invertedCard.getAttribute('data-card-color');

        if (_this5.foundPairs.indexOf(invertedCardBackgroundColor) === -1) {
          invertedCard.classList.remove('inverted');
          invertedCard.style.backgroundColor = '';
          invertedCard.innerHTML = _this5.cardBackgroundImageTag;
        }
      }); // reset card flags

      this.unsetPickedCards();
    } // add pair to game collection

  }, {
    key: "addPair",
    value: function addPair() {
      this.foundPairs.push(this.firstCard);
      --this.pairs;
      this.statistics.addFoundPair(); // check if there still are pairs to uncover

      if (this.pairs === 0) {
        this.gameOn(false);
        this.pauseButtonNode.setAttribute('disabled', '');
        this.finishScene.call(new _Interface.default(), this.statistics, this);
      }
    } // reset card flags

  }, {
    key: "unsetPickedCards",
    value: function unsetPickedCards() {
      this.firstCard = '';
      this.secondCard = '';
      this.cardPicked = 'none';
    } // function called with context of interface object so "this" means interface instance, not memory

  }, {
    key: "finishScene",
    value: function finishScene(statistics, memory) {
      var _this6 = this;

      var drawStars = function drawStars(stars) {
        var starsMax = 5;
        var starFilled = '<i class="fas fa-star"></i>';
        var starContour = '<i class="far fa-star"></i>';
        var contourStarsToDraw = starsMax - stars;
        var outcome = '';

        for (var i = 0; i < stars; i++) {
          outcome += starFilled;
        }

        for (var _i = 0; _i < contourStarsToDraw; _i++) {
          outcome += starContour;
        }

        return outcome;
      };

      var foundPairs = statistics.foundPairs;
      var missedPairs = statistics.missedPairs;
      var gameTime = statistics.gameTime;
      var secondsPerPair = (gameTime / foundPairs).toFixed(2);
      var efficiency = Math.floor(foundPairs * 100 / (foundPairs + missedPairs));
      var starsForTime = 1;
      var starsForEfficiency = 5;
      if (secondsPerPair < 2) starsForTime = 5;else if (secondsPerPair <= 4) starsForTime = 4;else if (secondsPerPair <= 6) starsForTime = 3;else if (secondsPerPair <= 8) starsForTime = 2;
      if (efficiency < 20) starsForEfficiency = 1;else if (efficiency <= 40) starsForEfficiency = 2;else if (efficiency <= 60) starsForEfficiency = 3;else if (efficiency <= 80) starsForEfficiency = 4;
      var finishSceneMarkup = "<div class=\"finish-scene\">\n            <h2><i class=\"fas fa-trophy\"></i> Congratulations!</h2>\n    \n            <p>You have successfully completed the game with the following result:</p>\n    \n            <div class=\"game-result\">\n                <p>\n                    You discovered <span>".concat(foundPairs, " pairs</span> in <span>").concat(gameTime, " seconds</span>\n                    and you were wrong <span>").concat(missedPairs, " times:</span>\n                </p>\n                <div class=\"stars\">\n                    <div class=\"star-section\">\n                        <span>It gives <strong>1 pair per ").concat(secondsPerPair, " seconds</strong></span>\n                        <span>").concat(drawStars(starsForTime), "</span>\n                    </div>\n                    <div class=\"star-section\">\n                        <span>It gives <strong>").concat(efficiency, "% efficiency</strong></span>\n                        <span>").concat(drawStars(starsForEfficiency), "</span>\n                    </div>\n                </div>\n            </div>\n    \n            <button id=\"play-again-btn\">Play again</button>\n    \n            </div>");
      setTimeout(function () {
        _this6.openModal(finishSceneMarkup);

        memory.sound.victory();
        var playAgainButton = document.getElementById('play-again-btn');
        playAgainButton.addEventListener('click', function () {
          memory.breakGame();

          _this6.introduction(false);

          _this6.closeModal();
        });
      }, 500);
    }
  }, {
    key: "breakGame",
    value: function breakGame() {
      var _this7 = this;

      if (!this.gameActive) {
        this.containerNode.classList.remove('paused');
        this.pauseButtonNode.innerHTML = '<i class="fas fa-pause"></i> Pause';
      }

      this.cardsNodes.forEach(function (card) {
        card.classList.add('hidden');
      });
      this.statistics.resetStatistics();
      this.pauseButtonNode.setAttribute('disabled', '');
      if (this.containerNode.classList.contains('overlayed')) this.containerNode.classList.remove('overlayed');
      setTimeout(function () {
        _this7.cardsNodes.forEach(function (card) {
          _this7.containerNode.removeChild(card);
        });
      }, 200);
    }
  }]);

  return Memory;
}();

var _default = Memory;
exports.default = _default;
},{"./Statistics":"js/Statistics.js","./Sound":"js/Sound.js","./Interface":"js/Interface.js","../assets/card-bg.png":"assets/card-bg.png"}],"js/Interface.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Memory = _interopRequireDefault(require("./Memory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// class for managing interface
var Interface =
/*#__PURE__*/
function () {
  function Interface() {
    _classCallCheck(this, Interface);

    // HTML references to interface objects
    this.nodes = {
      board: document.querySelector('.board'),
      menuToggleButton: document.querySelector('.menu-toggler'),
      menuBar: document.querySelector('.menu'),
      logo: document.querySelector('header > .logo'),
      menuButtons: document.querySelectorAll('.nav-menu button'),
      intro: document.querySelector('.intro'),
      difficultyLevelForm: document.querySelector('.difficulty-level'),
      difficultyDescription: document.querySelector('.level-description-box'),
      modal: document.querySelector('.modal'),
      footer: document.querySelector('footer')
    };
  } // init interface buttons listeners


  _createClass(Interface, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.nodes.menuToggleButton.addEventListener('click', this.menuToggle.bind(this));
      this.nodes.menuButtons.forEach(function (menuButton) {
        menuButton.addEventListener('click', function (evt) {
          return _this.captureMenuButton(evt);
        });
      });
      this.isSoundMuted = false;
    } // loading scene

  }, {
    key: "loadingScene",
    value: function loadingScene() {
      var loadingScene = document.querySelector('.loading-scene');
      var loadingLogo = document.querySelector('.loading-logo');
      window.addEventListener('load', function () {
        loadingLogo.classList.add('visible');
        setTimeout(function () {
          loadingLogo.classList.remove('visible');
          loadingScene.classList.add('hidden');
        }, 1400);
      });
    } // start new memory game

  }, {
    key: "startGame",
    value: function startGame(pickedLevel) {
      this.memory = new _Memory.default(this.nodes.board, pickedLevel);
      this.memory.renderCards();
      this.memory.fillCards();
      this.memory.handOutCards(); // if sound was muted in previous game, keep this setting

      this.isSoundMuted ? this.memory.sound.mute() : this.memory.sound.setVolume(0.4);
      this.statistics = this.memory.statistics;
      this.nodes.footer.classList.add('hidden');
    } // when hamburger icon is clicked 

  }, {
    key: "menuToggle",
    value: function menuToggle() {
      this.nodes.menuToggleButton.classList.toggle('active');
      this.nodes.menuBar.classList.toggle('active');
      this.nodes.board.classList.toggle('menu-active');
      this.nodes.logo.classList.toggle('menu-active');
    } // capture which menu button was clicked

  }, {
    key: "captureMenuButton",
    value: function captureMenuButton(evt) {
      var action = evt.target.dataset.action;

      switch (action) {
        case 'new-game':
          // new game button
          this.memory.breakGame();
          this.introduction(false); // if modal wasn't close, close it

          if (this.nodes.board.classList.contains('modaled')) this.closeModal(); // if mobile view, toggle menu after clicking

          if (window.innerWidth < 1024) this.menuToggle();
          break;

        case 'pause':
          // continue/pause button
          if (this.memory.gameActive) {
            this.memory.gameActive = false;
            this.nodes.board.classList.add('paused');
            this.statistics.pauseTime();
            evt.target.innerHTML = '<i class="fas fa-play"></i> Continue';
          } else {
            this.memory.gameActive = true;
            this.nodes.board.classList.remove('paused');
            this.statistics.startTime();
            evt.target.innerHTML = '<i class="fas fa-pause"></i> Pause';
          }

          break;

        case 'sound':
          // mute / unmute button
          // when game wasn't started once yet - fake this
          if (!this.memory) {
            if (this.isSoundMuted) {
              this.isSoundMuted = false;
              evt.target.innerHTML = '<i class="fas fa-volume-up"></i> Sound: on';
            } else {
              this.isSoundMuted = true;
              evt.target.innerHTML = '<i class="fas fa-volume-mute"></i> Sound: off';
            }

            break;
          }

          if (this.memory.sound.muted) {
            this.memory.sound.unmute();
            this.isSoundMuted = false;
            evt.target.innerHTML = '<i class="fas fa-volume-up"></i> Sound: on';
          } else {
            this.memory.sound.mute();
            this.isSoundMuted = true;
            evt.target.innerHTML = '<i class="fas fa-volume-mute"></i> Sound: off';
          }

          break;

        default:
          return false;
      }
    } // introduction scene

  }, {
    key: "introduction",
    value: function introduction() {
      var _this2 = this;

      var firstTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var newGameButton = document.querySelector("[data-action=\"new-game\"]");
      var intro = this.nodes.intro;
      var footer = this.nodes.footer;
      footer.classList.remove('hidden'); // if it is another game, just show introduction without adding listeners again

      if (!firstTime) {
        intro.classList.remove('hidden');
        newGameButton.disabled = true;
        return;
      } // difficulty form handling


      var difficultyForm = this.nodes.difficultyLevelForm;
      var difficultyDescription = this.nodes.difficultyDescription;
      var pickedLevel = 'normal';
      intro.classList.remove('hidden');
      newGameButton.disabled = true;
      difficultyForm.addEventListener('change', function (evt) {
        pickedLevel = evt.target.id;
        var activeDesc = difficultyDescription.querySelector('.active');
        var descToLoad = difficultyDescription.querySelector("[data-level=".concat(pickedLevel, "]"));
        activeDesc.classList.remove('active');
        setTimeout(function () {
          return descToLoad.classList.add('active');
        }, 100);
      });
      difficultyForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        newGameButton.disabled = false;
        intro.classList.add('hidden'); // start new game

        _this2.startGame(pickedLevel);
      });
    } // show modal / type parameter intended for future game development
    // todo: prompt modal type

  }, {
    key: "openModal",
    value: function openModal(content) {
      var _this3 = this;

      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
      this.nodes.board.classList.add('modaled');
      this.nodes.modal.classList.remove('hidden');
      this.nodes.modal.innerHTML = content; // append close button to the modal

      var closeModalButton = document.createElement('i');
      closeModalButton.className = 'fas fa-window-close close-modal-btn';
      closeModalButton.addEventListener('click', function () {
        return _this3.closeModal();
      });
      this.nodes.modal.appendChild(closeModalButton);
    } // close modal

  }, {
    key: "closeModal",
    value: function closeModal() {
      this.nodes.board.classList.remove('modaled');
      this.nodes.modal.classList.add('hidden');
    }
  }]);

  return Interface;
}();

var _default = Interface;
exports.default = _default;
},{"./Memory":"js/Memory.js"}],"js/main.js":[function(require,module,exports) {
"use strict";

var _Interface = _interopRequireDefault(require("./Interface"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userInterface = new _Interface.default();
userInterface.init();
userInterface.loadingScene();
userInterface.introduction();
},{"./Interface":"js/Interface.js"}],"C:/Users/Lukas/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53002" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Lukas/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map