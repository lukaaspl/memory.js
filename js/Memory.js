/**
 * @license
 * Memory Puzzles game written in JavaScript
 * Copyright Łukasz Roman <https://github.com/lukaaspl>
 * Relased under MIT license
 */

import Statistics from './Statistics';
import Sound from './Sound';
import Interface from './Interface';
import cardBackground from '../assets/card-bg.png';

class Memory {
    constructor(containerNode, difficultyLevel) {
        this.containerNode = containerNode;

        // game flags 
        this.gameActive = false;
        this.cardPicked = 'none';
        this.firstCard = '';
        this.secondCard = '';

        // set configuration depending on difficulty level:
        // pairs number, hex codes yes or not, preview time or its lack
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
        }

        // array with pairs which were found
        this.foundPairs = [];

        // create statstics object to be able to update them
        this.statistics = new Statistics(this.pairs);

        // card background img tag
        this.cardBackgroundImageTag = `<img src="${cardBackground}" alt="">`;

        // create music objects to have access to game sounds
        this.sound = new Sound();
        this.sound.setVolume(0.4);

        // pause game button node
        this.pauseButtonNode = document.querySelector('button[data-action="pause"]');
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

        // function returns object maybe for future purposes
        return {
            pairedColors: pairedColorsArray,
            colors: colorsArray,
            time: creationTime,
        };
    }

    // fill cards with generated colors
    fillCards() {
        this.cardsNodes = document.querySelectorAll('.card');

        const cards = this.cardsNodes;
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
            this.pauseButtonNode.removeAttribute('disabled');
            this.gameOn(true);
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

    // preview cards before game is on
    preview() {
        // do not preview as it's set in difficulty level config 
        if (!this.previewTime)
            return false;

        this.cardsNodes.forEach(card => this.invertCard(card));
        setTimeout(() => {
            this.coverInvertedCards();
            this.containerNode.classList.remove('overlayed');
        }, this.previewTime);
    }

    // handing out cards animation
    handOutCards() {
        const cards = this.cardsNodes;

        // set single card animation time [ms]
        const handOutCardTime = 30;

        // set time after which preview is on after handing out cards animation 
        const timeBeforePreview = (cards.length * handOutCardTime) + 800;

        // if preview is enabled, make cards overlayed that they can not be clicked
        if (this.previewTime)
            this.containerNode.classList.add('overlayed');

        // hide cards
        cards.forEach((card, index) => {
            card.classList.add('hidden');

            // hand out cards
            setTimeout(() => (
                card.classList.remove('hidden')
            ), handOutCardTime * index);
        });

        // turn on preview
        setTimeout(() => this.preview(), timeBeforePreview);
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
            this.pauseButtonNode.setAttribute('disabled', '');
            this.finishScene.call(new Interface(), this.statistics, this);
        }
    }

    // reset card flags
    unsetPickedCards() {
        this.firstCard = '';
        this.secondCard = '';
        this.cardPicked = 'none';
    }

    // function called with context of interface object so "this" means interface instance
    // parameters are references to other needed classes
    finishScene(statistics, memory) {
        // generating stars depending on game result
        const drawStars = (stars) => {
            const starsMax = 5;
            const starFilled = '<i class="fas fa-star"></i>';
            const starContour = '<i class="far fa-star"></i>';
            const contourStarsToDraw = starsMax - stars;
            let outcome = '';

            for (let i = 0; i < stars; i++)
                outcome += starFilled;

            for (let i = 0; i < contourStarsToDraw; i++)
                outcome += starContour;

            return outcome;
        }

        // get statistics to display
        const foundPairs = statistics.foundPairs;
        const missedPairs = statistics.missedPairs;
        const gameTime = statistics.gameTime;

        // specify a few statistics based on the result
        const secondsPerPair = (gameTime / foundPairs).toFixed(2);
        const efficiency = Math.floor(((foundPairs * 100) / (foundPairs + missedPairs)));

        // and give them the right number of stars
        let starsForTime = 1;
        let starsForEfficiency = 5;

        if (secondsPerPair < 2)
            starsForTime = 5;
        else if (secondsPerPair <= 4)
            starsForTime = 4;
        else if (secondsPerPair <= 6)
            starsForTime = 3;
        else if (secondsPerPair <= 8)
            starsForTime = 2;

        if (efficiency < 20)
            starsForEfficiency = 1;
        else if (efficiency <= 40)
            starsForEfficiency = 2;
        else if (efficiency <= 60)
            starsForEfficiency = 3;
        else if (efficiency <= 80)
            starsForEfficiency = 4;

        // finish scene markup which is forwarding to interface's modal method
        const finishSceneMarkup = (
            `<div class="finish-scene">
            <h2><i class="fas fa-trophy"></i> Congratulations!</h2>
    
            <p>You have successfully completed the game with the following result:</p>
    
            <div class="game-result">
                <p>
                    You discovered <span>${foundPairs} pairs</span> in <span>${gameTime} seconds</span>
                    and you were wrong <span>${missedPairs} times:</span>
                </p>
                <div class="stars">
                    <div class="star-section">
                        <span>It gives <strong>1 pair per ${secondsPerPair} seconds</strong></span>
                        <span>${drawStars(starsForTime)}</span>
                    </div>
                    <div class="star-section">
                        <span>It gives <strong>${efficiency}% efficiency</strong></span>
                        <span>${drawStars(starsForEfficiency)}</span>
                    </div>
                </div>
            </div>
    
            <button id="play-again-btn">Play again</button>
    
            </div>`
        );

        // show modal when game is finished
        setTimeout(() => {
            this.openModal(finishSceneMarkup);
            memory.sound.victory();

            // and set listener to "play again" button
            const playAgainButton = document.getElementById('play-again-btn');

            playAgainButton.addEventListener('click', () => {
                memory.breakGame();
                this.introduction(false);
                this.closeModal();
            });
        }, 500);
    }

    // breaking game method
    breakGame() {

        // when game stopped while being paused
        if (!this.gameActive) {
            this.containerNode.classList.remove('paused');
            this.pauseButtonNode.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }

        // when game stopped while finish scene was active
        if (this.containerNode.classList.contains('overlayed'))
            this.containerNode.classList.remove('overlayed');

        // hide cards, reset statistics and disable pause button
        this.cardsNodes.forEach(card => card.classList.add('hidden'));
        this.statistics.resetStatistics();
        this.pauseButtonNode.setAttribute('disabled', '');

        // delete cards nodes for better optimization
        setTimeout(() => {
            this.cardsNodes.forEach(card => {
                this.containerNode.removeChild(card);
            });
        }, 200);
    }
}

export default Memory;
