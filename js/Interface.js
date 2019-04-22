import Memory from './Memory';

// class for managing interface
class Interface {
    constructor() {
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
            footer: document.querySelector('footer'),
        }
    }

    // init interface buttons listeners
    init() {
        this.nodes.menuToggleButton
            .addEventListener('click', this.menuToggle.bind(this));

        this.nodes.menuButtons.forEach(menuButton => {
            menuButton.addEventListener('click', evt => this.captureMenuButton(evt));
        });

        this.isSoundMuted = false;
    }

    // loading scene
    loadingScene() {
        const loadingScene = document.querySelector('.loading-scene');
        const loadingLogo = document.querySelector('.loading-logo');

        window.addEventListener('load', () => {
            loadingLogo.classList.add('visible');

            setTimeout(() => {
                loadingLogo.classList.remove('visible');
                loadingScene.classList.add('hidden');
            }, 1400);
        });
    }

    // start new memory game
    startGame(pickedLevel) {
        this.memory = new Memory(this.nodes.board, pickedLevel);
        this.memory.renderCards();
        this.memory.fillCards();
        this.memory.handOutCards();

        // if sound was muted in previous game, keep this setting
        this.isSoundMuted ? this.memory.sound.mute() : this.memory.sound.setVolume(0.4);

        this.statistics = this.memory.statistics;
        this.nodes.footer.classList.add('hidden');
    }

    // when hamburger icon is clicked 
    menuToggle() {
        this.nodes.menuToggleButton.classList.toggle('active');
        this.nodes.menuBar.classList.toggle('active');
        this.nodes.board.classList.toggle('menu-active');
        this.nodes.logo.classList.toggle('menu-active');
    }

    // capture which menu button was clicked
    captureMenuButton(evt) {
        const action = evt.target.dataset.action;

        switch (action) {
            case 'new-game':
                // new game button
                this.memory.breakGame();
                this.introduction(false);

                // if modal wasn't close, close it
                if (this.nodes.board.classList.contains('modaled'))
                    this.closeModal();

                // if mobile view, toggle menu after clicking
                if (window.innerWidth < 1024)
                    this.menuToggle();
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
    }

    // introduction scene
    introduction(firstTime = true) {
        const newGameButton = document.querySelector(`[data-action="new-game"]`);
        const intro = this.nodes.intro;
        const footer = this.nodes.footer;

        footer.classList.remove('hidden');

        // if it is another game, just show introduction without adding listeners again
        if (!firstTime) {
            intro.classList.remove('hidden');
            newGameButton.disabled = true;
            return;
        }

        // difficulty form handling
        const difficultyForm = this.nodes.difficultyLevelForm;
        const difficultyDescription = this.nodes.difficultyDescription;
        let pickedLevel = 'normal';

        intro.classList.remove('hidden');
        newGameButton.disabled = true;

        difficultyForm.addEventListener('change', evt => {
            pickedLevel = evt.target.id;
            const activeDesc = difficultyDescription.querySelector('.active');
            const descToLoad = difficultyDescription.querySelector(`[data-level=${pickedLevel}]`);

            activeDesc.classList.remove('active');
            setTimeout(() => descToLoad.classList.add('active'), 100);
        });

        difficultyForm.addEventListener('submit', evt => {
            evt.preventDefault();

            newGameButton.disabled = false;
            intro.classList.add('hidden');

            // start new game
            this.startGame(pickedLevel);
        });
    }

    // show modal / type parameter intended for future game development
    // todo: prompt modal type
    openModal(content, type = 'default') {
        this.nodes.board.classList.add('modaled');
        this.nodes.modal.classList.remove('hidden');
        this.nodes.modal.innerHTML = content;

        // append close button to the modal
        const closeModalButton = document.createElement('i');
        closeModalButton.className = 'fas fa-window-close close-modal-btn';
        closeModalButton.addEventListener('click', () => this.closeModal());

        this.nodes.modal.appendChild(closeModalButton);
    }

    // close modal
    closeModal() {
        this.nodes.board.classList.remove('modaled');
        this.nodes.modal.classList.add('hidden');
    }
}

export default Interface;