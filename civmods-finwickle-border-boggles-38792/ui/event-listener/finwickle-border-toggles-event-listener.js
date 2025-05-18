import borderTogglesOptions from '/finwickle-border-boggles/ui/options/finwickle-border-toggles-options.js';
import { BorderTogglesUtils } from '/finwickle-border-boggles/ui/utils/finwickle-border-toggles-utils.js';

const logPrefix = "Border Toggles (Finwickle): ";

class BorderTogglesSingleton {
    static getInstance() {
        if (!BorderTogglesSingleton.singletonInstance) {
            BorderTogglesSingleton.singletonInstance = new BorderTogglesSingleton();
        }
        return BorderTogglesSingleton.singletonInstance;
    }
    constructor() {
        engine.whenReady.then(() => { this.onReady(); });
    }
	onReady() {
		// run when UI is loaded, including UI reloads
		window.addEventListener("user-interface-loaded-and-ready", this.onGameLoaded.bind(this)); // This has a 1 second delay.
	}
	onGameLoaded() {
		this.toggleCityBorders();
	}
    toggleCityBorders() {
		console.warn(logPrefix + "applying options.");
		// default lens
		BorderTogglesUtils.toggleCityBorder('fxs-default-lens', borderTogglesOptions.enabledByDefault);
		// trade lens
		BorderTogglesUtils.toggleCityBorder('fxs-trade-lens', borderTogglesOptions.enabledForTrade);
		// wltk's Detailed Map Tacks - https://forums.civfanatics.com/resources/wltks-detailed-map-tacks.32126/
		BorderTogglesUtils.toggleCityBorder('dmt-map-tack-lens', borderTogglesOptions.enabledForMapTacks);
		// Religion lens from Craimasjien's Mod Pack - https://forums.civfanatics.com/resources/craimasjiens-mod-pack-religion-lens-ui-fixes-and-more-to-come.31880/
		BorderTogglesUtils.toggleCityBorder('cmp-religion-lens', borderTogglesOptions.enabledForReligion);
		// And1210's Missionary Lens - https://forums.civfanatics.com/resources/and1210s-missionary-lens.31981/
		BorderTogglesUtils.toggleCityBorder('aml-missionary-lens', borderTogglesOptions.enabledForReligion);
		console.warn(logPrefix + "options applied.");
    }
}

// Create mod instance
const finwickleBorderToggles = BorderTogglesSingleton.getInstance();
export { finwickleBorderToggles as default };
