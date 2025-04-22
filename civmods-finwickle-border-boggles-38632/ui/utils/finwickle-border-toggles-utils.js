import LensManager from '/core/ui/lenses/lens-manager.js';

const logPrefix = "Border Toggles (Finwickle): ";

export class BorderTogglesUtils {
	static toggleCityBorder(lensType, borderEnabled) {
		if (LensManager.lenses.has(lensType)) {
			// save active lens
			const prevLens = LensManager.getActiveLens();
			if (LensManager.setActiveLens(lensType) && (LensManager.isLayerEnabled('fxs-city-borders-layer') != borderEnabled)) {
				LensManager.toggleLayer('fxs-city-borders-layer');
				console.warn(logPrefix + "city border " + (borderEnabled ? "en" : "dis") + "abled for " + lensType);
			}
			// switch back to previous lens
			LensManager.setActiveLens(prevLens);
		}
	}
}
