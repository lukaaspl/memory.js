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

    // reset statistics in case of starting new game
    resetStatistics() {
        clearInterval(this.timeInterval);

        this.nodes.pairsTotal.textContent = 0;
        this.nodes.gameTime.textContent = 0;
        this.nodes.missedPairs.textContent = 0;
        this.nodes.foundPairs.textContent = 0;
    }
}

export default Statistics;