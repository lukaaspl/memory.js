/**
 * @license
 * Memory Puzzles game written in JavaScript
 * Copyright Łukasz Roman <https://github.com/lukaaspl>
 * Relased under MIT license
 */

class Memory {
    constructor(containerNode, difficultyLevel) {
        this.containerNode = containerNode;

        // game flags 
        this.gameActive = false;
        this.cardPicked = 'none';
        this.firstCard = '';
        this.secondCard = '';

        // set configuration depending on difficulty level:
        // pairs number, hex codes yes or not, preview time
        this.difficultyLevel = difficultyLevel;

        switch (this.difficultyLevel) {
            case 'easy':
                this.pairs = 12;
                this.hexCode = true;
                this.previewTime = 3000;
                break;
            case 'normal':
                this.pairs = 16;
                this.hexCode = true;
                this.previewTime = 2000;
                break;
            case 'hard':
                this.pairs = 28;
                this.hexCode = false;
                this.previewTime = false;
                break;
            default:
                this.pairs = 16;
                this.hexCode = true;
                this.previewTime = 1000;;
        }

        // array with pairs which were found
        this.foundPairs = [];

        // create statstics object to be able to update them
        this.statistics = new Statistics(this.pairs);

        // card background img tag
        this.cardBackgroundImageTag = '<img src="../assets/card-bg.png" alt="">';

        // create music objects to have access to game sounds
        this.sound = new Sound();
        this.sound.setVolume(0.6);

        this.invertCard = this.invertCard.bind(this);
    }

    // render cards divs elements
    renderCards() {
        for (let i = 0; i < this.pairs * 2; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = this.cardBackgroundImageTag;

            this.containerNode.appendChild(card);
        }
    }

    // switch game on/off
    gameOn(state) {
        if (state) {
            this.gameActive = true;
            this.statistics.startTime();
        } else {
            this.gameActive = false;
            this.statistics.pauseTime();
        }
    }

    // generate color for every card
    createColorsArray() {
        const _hexadecimals = '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f';
        const hexadecimals = _hexadecimals.split(',');
        const colorsArray = [];

        // mesaure time needed to create an array
        const startTime = performance.now();

        while (colorsArray.length < this.pairs) {
            let hexColor = '';

            for (let j = 0; j < 6; j++) {
                const randomIndex = Math.floor(Math.random() * hexadecimals.length);
                hexColor += hexadecimals[randomIndex];
            }

            hexColor = `#${hexColor}`;

            // if that color does not exist yet, push it to the array
            // else iterate again
            if (colorsArray.indexOf(hexColor) === -1)
                colorsArray.push(hexColor);
        }

        const endTime = performance.now();
        const creationTime = endTime - startTime;

        // double array to make every color have a pair
        const pairedColorsArray = colorsArray.concat(colorsArray);

        return {
            pairedColors: pairedColorsArray,
            colors: colorsArray,
            time: creationTime,
        };
    }

    // fill cards with generated colors
    fillCards() {
        const cards = document.querySelectorAll('.card');
        const colors = this.createColorsArray();
        const pairedColors = colors.pairedColors;
        const creationTime = colors.time;

        console.info(`colors generated in ${creationTime.toFixed(2)} seconds`);

        cards.forEach(card => {
            // randomly set colors to cards
            const randomIndex = Math.floor(Math.random() * pairedColors.length);

            card.setAttribute('data-card-color', pairedColors[randomIndex]);
            card.addEventListener('click', evt => this.pickCard(evt.target));

            // remove color from array after each iteration
            pairedColors.splice(randomIndex, 1);
        });
    }

    // click on card
    pickCard(card) {
        // if card was already inverted 
        // by picking first/second card or clicking on paired cards
        // then break function
        if (card.classList.contains('inverted'))
            return false;

        // switch game state to on if it's first click
        if (!this.gameActive) {
            const pauseButton = document.querySelector('button[data-action="pause"]');

            this.gameOn(true);
            pauseButton.removeAttribute('disabled');
        }

        const cardBackgroundColor = card.getAttribute('data-card-color');

        // adjust behavior depending on the type of card selection
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
                this.invertCard(card);

                // check if both cards make a pair
                if (this.firstCard === this.secondCard) {
                    // found a pair
                    this.addPair();
                    this.unsetPickedCards();
                    this.sound.positive();
                } else {
                    // cards do not fit
                    this.coverCardsTimeout = (
                        setTimeout(this.coverInvertedCards.bind(this), 1000)
                    );

                    this.negativeSoundTimeout = (
                        setTimeout(() => this.sound.negative(), 1000)
                    );

                    this.statistics.addMissedPair();
                    this.sound.pop();
                }
                break;

            case 'second':
                // pick card before timeout function fires
                // so invert clicked card and cover at once inverted ones before
                this.coverInvertedCards();
                clearTimeout(this.coverCardsTimeout);
                clearTimeout(this.negativeSoundTimeout);

                // so it's treated as first card picking
                this.cardPicked = 'first';
                this.firstCard = cardBackgroundColor;
                this.invertCard(card);
                this.sound.pop();
                break;

            default:
                return false;
        }
    }

    // invert card and name it by using her hex color
    invertCard(card) {
        const cardBackgroundColor = card.getAttribute('data-card-color');

        card.classList.add('inverted');
        card.style.backgroundColor = cardBackgroundColor;

        if (this.hexCode)
            card.innerHTML = `<h3 class="color-desc">${cardBackgroundColor}</h3>`;
    }

    preview() {
        if (!this.previewTime)
            return false;

        const cards = document.querySelectorAll('.card');

        cards.forEach(card => this.invertCard(card));
        setTimeout(() => this.coverInvertedCards(), this.previewTime);
    }

    // cover inverted cards
    coverInvertedCards() {
        const invertedCards = document.querySelectorAll('.card.inverted');

        // but only unpaired ones
        invertedCards.forEach(invertedCard => {
            const invertedCardBackgroundColor = invertedCard.getAttribute('data-card-color');

            if (this.foundPairs.indexOf(invertedCardBackgroundColor) === -1) {
                invertedCard.classList.remove('inverted');
                invertedCard.style.backgroundColor = '';
                invertedCard.innerHTML = this.cardBackgroundImageTag;
            }
        });

        // reset card flags
        this.unsetPickedCards();
    }

    // add pair to game collection
    addPair() {
        this.foundPairs.push(this.firstCard);
        --this.pairs;

        this.statistics.addFoundPair();

        // check if there still are pairs to uncover
        if (this.pairs === 0) {
            this.gameOn(false);

            const pauseButton = document.querySelector('button[data-action="pause"]');
            pauseButton.setAttribute('disabled', '');
        }
    }

    // reset card flags
    unsetPickedCards() {
        this.firstCard = '';
        this.secondCard = '';
        this.cardPicked = 'none';
    }
}

// class for managing statistics
class Statistics {
    constructor(pairsTotal) {
        // HTML references to statistic fields
        this.nodes = {
            pairsTotal: document.querySelector('.pairsTotal'),
            foundPairs: document.querySelector('.pairsFound'),
            missedPairs: document.querySelector('.pairsMissed'),
            gameTime: document.querySelector('.gameTime'),
        };

        // set how many pairs are on the board
        this.nodes.pairsTotal.textContent = pairsTotal;

        // statistics
        this.foundPairs = 0;
        this.missedPairs = 0;
        this.gameTime = 0;
    }

    // start/continue counting time
    startTime() {
        this.timeInterval = setInterval(() => {
            ++this.gameTime;
            this.nodes.gameTime.textContent = this.gameTime;
        }, 1000);
    }

    // pause counting time
    pauseTime() {
        clearInterval(this.timeInterval);
    }

    // add missed pair
    addMissedPair() {
        ++this.missedPairs;
        this.nodes.missedPairs.textContent = this.missedPairs;
    }

    // add found pair
    addFoundPair() {
        ++this.foundPairs;
        this.nodes.foundPairs.textContent = this.foundPairs;
    }
}

// class for managing interface
class Interface {
    constructor() {
        this.nodes = {
            board: document.querySelector('.board'),
            menuToggleButton: document.querySelector('.menu-toggler'),
            menuBar: document.querySelector('.menu'),
            logo: document.querySelector('header > .logo'),
            menuButtons: document.querySelectorAll('.nav-menu button'),
            intro: document.querySelector('.intro'),
            difficultyLevelForm: document.querySelector('.difficulty-level'),
            difficultyDescription: document.querySelector('.level-description-box'),
        }

        this.nodes.menuToggleButton
            .addEventListener('click', this.menuToggle.bind(this));

        this.nodes.menuButtons.forEach(menuButton => {
            menuButton.addEventListener('click', evt => this.captureMenuButton(evt));
        });

        this.introduction();
    }

    startGame(pickedLevel) {
        this.memory = new Memory(this.nodes.board, pickedLevel);
        this.memory.renderCards();
        this.memory.fillCards();
        this.statistics = this.memory.statistics;
        this.sound = this.memory.sound;

        const cards = document.querySelectorAll('.card');

        cards.forEach((card, index) => {
            card.classList.add('hidden');
            setTimeout(() => card.classList.remove('hidden'), 20 * index);
        });

        const enterTime = cards.length * 20;
        setTimeout(() => this.memory.preview(), enterTime + 1000);
    }

    menuToggle() {
        this.nodes.menuToggleButton.classList.toggle('active');
        this.nodes.menuBar.classList.toggle('active');
        this.nodes.board.classList.toggle('menu-active');
        this.nodes.logo.classList.toggle('menu-active');
    }

    captureMenuButton(evt) {
        const action = evt.target.dataset.action;

        switch (action) {
            case 'new-game':
                // new game button
                break;
            case 'pause':
                // continue/pause button
                if (this.memory.gameActive) {
                    this.memory.gameActive = false;
                    this.nodes.board.classList.add('overlayed');
                    this.statistics.pauseTime();
                    evt.target.innerHTML = '<i class="fas fa-play"></i> Continue';
                } else {
                    this.memory.gameActive = true;
                    this.nodes.board.classList.remove('overlayed');
                    this.statistics.startTime();
                    evt.target.innerHTML = '<i class="fas fa-pause"></i> Pause';
                }
                break;
            case 'sound':
                // mute/unmute button
                if (this.sound.muted) {
                    this.sound.unmute();
                    evt.target.innerHTML = '<i class="fas fa-volume-up"></i> Sound: on';
                } else {
                    this.sound.mute();
                    evt.target.innerHTML = '<i class="fas fa-volume-mute"></i> Sound: off';
                }
                break;
            default:
                return false;
        }
    }

    introduction() {
        const intro = this.nodes.intro;
        const difficultyForm = this.nodes.difficultyLevelForm;
        const difficultyDescription = this.nodes.difficultyDescription;
        let pickedLevel = 'normal';

        difficultyForm.addEventListener('change', evt => {
            pickedLevel = evt.target.id;
            const activeDesc = difficultyDescription.querySelector('.active');
            const descToLoad = difficultyDescription.querySelector(`[data-level=${pickedLevel}]`);

            activeDesc.classList.remove('active');
            setTimeout(() => descToLoad.classList.add('active'), 100);
        });

        difficultyForm.addEventListener('submit', evt => {
            evt.preventDefault();
            intro.classList.add('hidden');
            this.startGame(pickedLevel);
        })
    }
}

class Sound {
    constructor() {
        this.defaultVolume = 0.5;
        this.muted = false;

        this.sounds = {
            pop: new Audio('./assets/pop.wav'),
            negative: new Audio('./assets/negative.wav'),
            positive: new Audio('./assets/positive.wav'),
        }
    }

    setVolume(volume) {
        if (volume < 0 || volume > 1)
            return false;

        this.defaultVolume = volume;

        for (let key in this.sounds)
            this.sounds[key].volume = volume;
    }

    mute() {
        this.muted = true;

        for (let key in this.sounds)
            this.sounds[key].muted = true;
    }

    unmute() {
        this.muted = false;

        for (let key in this.sounds)
            this.sounds[key].muted = false;
    }

    pop() {
        this.sounds.pop.play();
    }

    negative() {
        this.sounds.negative.play();
    }

    positive() {
        this.sounds.positive.play();
    }
}

/*  INIT  */

const interface = new Interface();