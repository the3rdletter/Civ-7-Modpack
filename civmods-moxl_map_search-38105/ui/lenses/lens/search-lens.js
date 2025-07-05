/**
 * @file search-lens
 * @copyright 2022-2023, Firaxis Games
 * @description Lens used when searching for tiles
 */
import LensManager from '/core/ui/lenses/lens-manager.js';
class SearchLens {
    constructor() {
        this.activeLayers = new Set([
            'fxs-hexgrid-layer',
            'fxs-resource-layer',
            'fxs-culture-borders-layer',
            'mod-search-layer'
        ]);
        this.allowedLayers = new Set([
            'fxs-yields-layer'
        ]);
    }
}
LensManager.registerLens('mod-search-lens', new SearchLens());
