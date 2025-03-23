/**
 * Huge shoutout to @realitymeltdown in the official Civ VII Discord for figuring this out.
 */
export class TradeLensPanelMiniMapDecorator {
    constructor(val) {
        this.miniMap = val;
    }

    beforeAttach() { 
    }

    afterAttach() {
        this.miniMap.createLensButton("LOC_UI_MINI_MAP_TRADE", "fxs-trade-lens", "lens-group");
    }

    beforeDetach() { }

    afterDetach() { }

    onAttributeChanged(name, prev, next) { }
}

Controls.decorate('lens-panel', (val) => new TradeLensPanelMiniMapDecorator(val));
