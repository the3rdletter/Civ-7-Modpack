import LensManager from '/core/ui/lenses/lens-manager.js';
class FounderLens {
    constructor() {
        this.activeLayers = new Set([
            'fxs-appeal-layer',
            'fxs-hexgrid-layer',
            'fxs-resource-layer',
            'fxs-random-events-layer',
            'fxs-settlement-recommendations-layer',
            'fxs-yields-layer',
            'fxs-culture-borders-layer'
        ]);
        this.allowedLayers = new Set();
    }
}
LensManager.registerLens('fxs-founder-lens', new FounderLens());