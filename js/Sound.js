import pop from '../assets/pop.wav';
import negative from '../assets/negative.wav';
import positive from '../assets/positive.wav';
import victory from '../assets/victory.mp3';

// class for managing sound
class Sound {
    constructor() {
        // set default volume in case of invalid volume parameter
        this.defaultVolume = 0.4;

        // keep sound unmuted as default
        this.muted = false;

        // sound sources
        this.sounds = {
            pop: new Audio(pop),
            negative: new Audio(negative),
            positive: new Audio(positive),
            victory: new Audio(victory),
        }
    }

    // set volume method
    setVolume(volume) {
        if (volume < 0 || volume > 1)
            return false;

        this.defaultVolume = volume;

        for (let key in this.sounds)
            this.sounds[key].volume = volume;
    }

    // mute / unmute methods
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

    // play sound methods
    pop() {
        this.sounds.pop.play();
    }

    negative() {
        this.sounds.negative.play();
    }

    positive() {
        this.sounds.positive.play();
    }

    victory() {
        this.sounds.victory.play();
    }
}

export default Sound;