/**
 * Add a mini-map button without overriding the mini-map panel class per https://forums.civfanatics.com/threads/additive-ui-elements.695406/
 */
export class KayleeR_PanelMiniMapDecorator {
    constructor(val) {
        this.miniMap = val;
    }

    beforeAttach() {
    }

    afterAttach() {
        this.miniMap.createLayerCheckbox("LOC_UI_MINI_MAP_DISCOVERY", "fxs-discovery-layer");
    }

    beforeDetach() { }

    afterDetach() { }

    onAttributeChanged(name, prev, next) { }
}

Controls.decorate('lens-panel', (val) => new KayleeR_PanelMiniMapDecorator(val));