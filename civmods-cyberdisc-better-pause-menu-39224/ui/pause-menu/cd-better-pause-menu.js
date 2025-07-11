import { ScreenPauseMenu } from '/base-standard/ui/pause-menu/screen-pause-menu.js';

const cdBetterPauseMenuInit = () => {
    var Group; // Not exported so redefine it here
    (function (Group) {
        Group[Group["Primary"] = 0] = "Primary";
        Group[Group["Secondary"] = 1] = "Secondary";
    })(Group || (Group = {}));

    const sourceOnAttach = ScreenPauseMenu.prototype.onAttach;
    ScreenPauseMenu.prototype.onAttach = function (...args) {
        sourceOnAttach.apply(this, args);

		const headerTopFilagree = this.Root.querySelector(".pause-menu__header-top-filigree");
		headerTopFilagree.classList.remove('-mt-6');
		headerTopFilagree.classList.add('-mt-12');

		const headerBottomFilagreeContainer = this.Root.querySelector(".pause-menu__header-bottom-filigree");
		headerBottomFilagreeContainer.classList.remove('mb-12');
		headerBottomFilagreeContainer.classList.add('mb-6');

        // Hide player banner if not in MP:
        if (!Configuration.getGame().isNetworkMultiplayer) {
            const progressionContainer = this.Root.querySelector(".pause-menu__progression-container");
            progressionContainer.style.display = "none";
        }

        // TODO - Implement this in a more future compatible way by checking how many nodes are within each row and column, lazy right now so currently hardcoding the values:
        const rows = this.Root.querySelectorAll('.pause-menu__main-buttons');
        for (let i = 5; i < rows.length; i++) { // Remove all rows after the last one we use
            this.slot.removeChild(rows.item(i));
        }
        const dividers = this.Root.querySelectorAll('.pause-menu_button-divider-filigree');
        for (let i = 2; i < dividers.length; i++) { // Remove all dividers after the last one we use
            this.slot.removeChild(dividers.item(i));
        }

        // Add missing button definitions for existing buttons:
        this.resumeButton           = null;
        this.endGameButton          = null;
        this.eventButton            = null;
        this.codeOrRestartButton    = null;
        this.optionsButton          = null;
        this.socialButton           = null;
        this.challengesButton       = null;
        this.exitToMainMenuButton   = null;
        this.exitToDesktopButton    = null;

        this.progressButton         = null; // New button

        // Get the localization captions for each button:
        const buttons = this.buttons;
        for (let button of buttons) {
            const buttonCaption = button.getAttribute('caption');
            switch (buttonCaption) {
                case Locale.compose("LOC_GENERIC_RESUME"):
                    this.resumeButton           = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_NOMORETURNS"):
                    this.endGameButton          = button;
                    break
                case Locale.compose("LOC_PAUSE_MENU_RETIRE"):
                    this.endGameButton          = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_EVENT_RULES"):
                    this.eventButton            = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_COPY_JOIN_CODE"):
                    this.codeOrRestartButton    = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_RESTART"):
                    this.codeOrRestartButton    = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_OPTIONS"):
                    this.optionsButton          = button;
                    break;
                case Locale.compose("LOC_PROFILE_TAB_CHALLENGES"):
                    this.challengesButton       = button;
                    break;
                case Locale.compose("LOC_UI_MP_SOCIAL_BUTTON_LABEL"):
                    this.socialButton           = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_QUIT_TO_MENU"):
                    this.exitToMainMenuButton   = button;
                    break;
                case Locale.compose("LOC_PAUSE_MENU_QUIT_TO_DESKTOP"):
                    this.exitToDesktopButton    = button;
            }
        }

        // Rearrange the first row:
        rows.item(1).insertAdjacentElement('beforebegin', this.resumeButton);
        if (this.eventButton) {
            rows.item(1).insertAdjacentElement('beforebegin', this.eventButton);
        }

        // Rearrange the second row:
        rows.item(2).insertAdjacentElement('beforebegin', this.quickSaveButton);
        rows.item(2).insertAdjacentElement('beforebegin', this.saveButton);
        rows.item(2).insertAdjacentElement('beforebegin', this.loadButton);
        rows.item(2).insertAdjacentElement('beforebegin', this.optionsButton);
        rows.item(2).insertAdjacentElement('beforebegin', this.challengesButton);
        if (this.challengesButton) {
            if (!Configuration.getGame().isNetworkMultiplayer) {
                this.progressButton = this.addButton("LOC_PROFILE_TAB_PROGRESS", this.onClickedProgression, Group.Primary);
                this.challengesButton.insertAdjacentElement('beforebegin', this.progressButton);
            }
        }
        if (this.socialButton) {
            rows.item(2).insertAdjacentElement('beforebegin', this.socialButton);
            if (!Configuration.getGame().isNetworkMultiplayer && !Network.isFullAccountLinked()) { // Hide if current game isn't MP and 2K Account isn't linked
                this.socialButton.classList.add("hidden");
            }
        }
        rows.item(2).insertAdjacentElement('beforebegin', this.codeOrRestartButton);
        if (this.endGameButton) {
            rows.item(2).insertAdjacentElement('beforebegin', this.endGameButton);
        }
        /*
        // TODO - Fix Advanced Start logic
        if (!Players.get(GameContext.localPlayerID).AdvancedStart && Game.age != Game.getHash("AGE_ANTIQUITY") && !Configuration.getGame().isNetworkMultiplayer) {
            this.codeOrRestartButton.classList.add("hidden"); // Useless after Antiquity
        }
        */
        
        // Rearrange the third row:
        rows.item(3).insertAdjacentElement('beforebegin', this.exitToMainMenuButton);
        if (this.exitToMainMenuButton && this.exitToDesktopButton) { // Shouldn't need to check for exitToMainMenuButton since it should always be added but just in case
            this.exitToMainMenuButton.insertAdjacentElement('afterend', this.exitToDesktopButton); // Add the Exit to Desktop button after Exit to Main Menu
        }
    }
}

engine.whenReady.then(cdBetterPauseMenuInit);
