import { ScreenExtras } from 'ui/shell/extras/screen-extras.js';
import { MainMenu } from 'ui/shell/main-menu/main-menu.js';

// TODO - Add error handling
const cdBetterMainMenuInit = () => {
    const screenExtrasOnAttach = ScreenExtras.prototype.onAttach;
    ScreenExtras.prototype.onAttach = function (...args) {
        screenExtrasOnAttach.apply(this, args);

        // TODO - Move rest of this screen's changes from the file override to here
        // Hide (but don't remove) mods button from additional content screen as it's no longer needed:
        const modsButton = this.Root.querySelector('.extras-item-mods');
        modsButton.classList.add('hidden');
    }

    const mainMenuOnAttach = MainMenu.prototype.onAttach;
    MainMenu.prototype.onAttach = function (...args) {
        mainMenuOnAttach.apply(this, args);

        // Add new main menu buttons:
        this.modsButton =           this.createMainMenuButton({ name: "LOC_UI_MANAGE_MODS", audio: "additional-content", buttonListener: () => { if (this.canPerformInputs()) this.openMods(); } });
        this.progressionButton =    this.createMainMenuButton({ name: "LOC_MAIN_MENU_META_PROGRESSION", audio: "additional-content", buttonListener: () => { if (this.canPerformInputs()) this.showProfilePage(); } });
        this.socialButton =         this.createMainMenuButton({ name: "LOC_UI_MP_SOCIAL_BUTTON_LABEL", audio: "additional-content", buttonListener: () => { if (this.canPerformInputs()) this.showSocialPage(); } });
        this.accountButton =        this.createMainMenuButton({ name: "LOC_UI_LINK_ACCOUNT_SUBTITLE", audio: "additional-content", buttonListener: () => { if (this.canPerformInputs()) this.onClickedAccount(); } });

        // Hide main menu elements using the invisible tag as it's not used (no risk of it being toggled off unlike 'hidden'):
        const buildInfo = this.Root.querySelector('.main-menu-build-info');
        buildInfo.classList.add('invisible');
        const connectionStatus = this.Root.querySelector('.connection-status');
        connectionStatus.classList.add('invisible');
        const accountStatus = this.Root.querySelector('.account-status');
        accountStatus.classList.add('invisible');
        const motd = this.Root.querySelector('.motd-box');
        motd.classList.add('invisible');
        const profileHeader = this.Root.querySelector('profile-header');
        profileHeader.classList.add('invisible');
        const carousel = this.Root.querySelector('.carousel-outer');
        carousel.classList.add('invisible');
        const carouselTitle = this.Root.querySelector('.carousel-thumb-bg');
        carouselTitle.classList.add('invisible');

        // Get main menu buttons:
        this.exitButton     = null;
        this.storeButton    = null;
        this.extrasButton   = null;
        this.optionsButton  = null;

        this.mainMenuButtons.forEach((button) => {
            let buttonCaption = button.getAttribute("caption");
            switch (buttonCaption) { // has to match stylized setup, see onAttach() buttonList:
                case Locale.stylize("LOC_MAIN_MENU_EXIT").toUpperCase():
                    this.exitButton = button;
                    break;
                case Locale.stylize("LOC_UI_STORE_LAUNCHER_TITLE").toUpperCase():
                    this.storeButton = button;
                    break;
                case Locale.stylize("LOC_MAIN_MENU_ADDITIONAL_CONTENT").toUpperCase():
                    this.extrasButton = button;
                    break;
                case Locale.stylize("LOC_MAIN_MENU_OPTIONS").toUpperCase():
                    this.optionsButton = button;
                    break;
            }
        });

        // Rearrange main menu buttons:
        const dividers = this.Root.querySelectorAll('.main-menu-filigree-divider');
        if (this.modsButton) {
            dividers.item(1).insertAdjacentElement('afterend', this.modsButton);
            if (this.progressionButton && this.socialButton && this.accountButton && this.optionsButton) {
                this.modsButton.insertAdjacentElement('afterend', this.progressionButton);
                this.progressionButton.insertAdjacentElement('afterend', this.socialButton);
                this.socialButton.insertAdjacentElement('afterend', this.accountButton);
                this.accountButton.insertAdjacentElement('afterend', this.optionsButton);
            }
        }

        // Hide main menu buttons:
        if (this.socialButton && !Network.isFullAccountLinked())    this.socialButton.classList.add('hidden');
        if (this.storeButton)                                       this.storeButton.classList.add('hidden');
        if (this.exitButton)                                        this.slot.insertAdjacentElement('beforeend', this.exitButton); // Always ensure the exit to desktop button is the last button in the list
    }

    const mainMenuBuild3DScene = MainMenu.prototype.build3DScene;
    MainMenu.prototype.build3DScene = function (...args) {
        mainMenuBuild3DScene.apply(this, args);

        // Add randomized menu backgrounds and change mask:
        const backgroundStrings = [
            "lsbg_aksum_1080", "lsbg_egypt_1080", "lsbg_greece_1080", "lsbg_han_1080", "lsbg_khmer_1080", "lsbg_maurya_1080", "lsbg_maya_1080", "lsbg_mississippian_1080", "lsbg_persia_1080", "lsbg_rome_1080", "lsbg_abbasid_1080", "lsbg_chola_1080", "lsbg_hawaii_1080", "lsbg_inca_1080", "lsbg_majapahit_1080", "lsbg_ming_1080", "lsbg_mongolia_1080", "lsbg_norman_1080", "lsbg_songhai_1080", "lsbg_spain_1080", "lsbg_america_1080", "lsbg_buganda_1080", "lsbg_french_empire_1080", "lsbg_meiji_1080", "lsbg_mexico_1080", "lsbg_mughal_1080", "lsbg_prussia_1080", "lsbg_qing_1080", "lsbg_russia_1080", "lsbg_siam_1080"];

        const backgroundIndex = Math.floor(Math.random() * backgroundStrings.length);
        let backgroundName = backgroundStrings[backgroundIndex];

        WorldUI.addMaskedBackgroundLayer(backgroundName, "age_sel_bg_mask", { stretch: StretchMode.UniformFill, alignY: AlignMode.Maximum }); // uniform anchored at bottom
    }
}

engine.whenReady.then(cdBetterMainMenuInit);
