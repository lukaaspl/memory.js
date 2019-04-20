/**
 * @license
 * Memory Puzzles game written in JavaScript
 * Copyright Łukasz Roman <https://github.com/lukaaspl>
 * Relased under MIT license
 */

class Memory {
    constructor(containerNode) {
        this.containerNode = containerNode;

        // game flags 
        this.gameActive = false;
        this.gameTime = 0;
        this.cardPicked = 'none';
        this.firstCard = '';
        this.secondCard = '';

        // array with pairs which were found
        this.foundPairs = [];
    }

    // render cards divs elements
    renderCards(pairs) {
        this.pairs = pairs;

        for (let i = 0; i < pairs * 2; i++) {
            const card = document.createElement('div');
            card.className = 'card';

            this.containerNode.appendChild(card);
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

    // switch game on/off
    gameOn(state) {
        const gameTime = document.querySelector('.game-time');
        const toBe = gameTime.querySelector('.to-be');
        const clock = gameTime.querySelector('.clock');

        if (state) {
            this.gameActive = true;

            gameTime.style.opacity = 1;

            this.gameTimeInterval = setInterval(() => {
                ++this.gameTime;
                clock.textContent = this.gameTime;
            }, 1000);
        } else {
            this.gameActive = false;

            clearInterval(this.gameTimeInterval);
            toBe.textContent = 'were';
        }
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
        if (!this.gameActive)
            this.gameOn(true);

        const cardBackgroundColor = card.getAttribute('data-card-color');

        // adjust behavior depending on the type of card selection
        switch (this.cardPicked) {
            case 'none':
                // picked first card
                this.cardPicked = 'first';
                this.firstCard = cardBackgroundColor;
                this.invertCard(card);
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
                } else
                    // cards do not fit
                    this.coverCardsTimeout = (
                        setTimeout(this.coverInvertedCards.bind(this), 1000)
                    );
                break;

            case 'second':
                // pick card before timeout function fires
                // so invert clicked card and cover at once inverted ones before
                this.coverInvertedCards();
                clearTimeout(this.coverCardsTimeout);

                // so it's treated as first card picking
                this.cardPicked = 'first';
                this.firstCard = cardBackgroundColor;
                this.invertCard(card);
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
        card.innerHTML = `<h3 class="color-desc">${cardBackgroundColor}</h3>`;
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
                invertedCard.innerHTML = '';
            }
        });

        // reset card flags
        this.unsetPickedCards();
    }

    // add pair to game collection
    addPair() {
        this.foundPairs.push(this.firstCard);
        --this.pairs;

        // check if there still are pairs to uncover
        if (this.pairs === 0)
            this.gameOn(false);
    }

    // reset card flags
    unsetPickedCards() {
        this.firstCard = '';
        this.secondCard = '';
        this.cardPicked = 'none';
    }
}

const board = document.querySelector('.board');
const memory = new Memory(board);

memory.renderCards(16);
memory.fillCards();