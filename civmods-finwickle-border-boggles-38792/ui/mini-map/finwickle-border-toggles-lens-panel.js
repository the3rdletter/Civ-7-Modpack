/**
 * Based on Trade Lens by BlobRoss: https://forums.civfanatics.com/resources/trade-lens.31886/
 * Huge shoutout (from BlobRoss, and now from me as well) to @realitymeltdown in the official Civ VII Discord for figuring this out.
 */

export class BorderTogglesPanelMiniMapDecorator {
    constructor(val) {
        this.miniMap = val;
    }
    beforeAttach() { 
    }
    afterAttach() {
		// create checkboxes for "decorations" = layers
		this.miniMap.createLayerCheckbox("LOC_MOD_UI_MINI_MAP_BORDERS", "fxs-culture-borders-layer");
        this.miniMap.createLayerCheckbox("LOC_MOD_UI_MINI_MAP_CITY_BORDERS", "fxs-city-borders-layer");
    }
    beforeDetach() { }
    afterDetach() { }
    onAttributeChanged(name, prev, next) { }
}

Controls.decorate('lens-panel', (val) => new BorderTogglesPanelMiniMapDecorator(val));
