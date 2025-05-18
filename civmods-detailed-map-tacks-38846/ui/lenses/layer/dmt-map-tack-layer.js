import MapTackUtils from '../../map-tack-core/dmt-map-tack-utils.js';
import LensManager, { LensActivationEventName } from '/core/ui/lenses/lens-manager.js';
import BuildingPlacementManager from '/base-standard/ui/building-placement/building-placement-manager.js';

class MapTackLensLayer {
    constructor() {
    }
    onGameLoaded() {
        LensManager.enableLayer("dmt-map-tack-layer"); // Enable map tack layer by default.
    }
    initLayer() {
        window.addEventListener("user-interface-loaded-and-ready", this.onGameLoaded.bind(this));
        window.addEventListener('layer-hotkey', this.onLayerHotkey.bind(this));
        window.addEventListener(LensActivationEventName, this.onActiveLensChanged.bind(this));

        this.mapTackModelGroup = WorldUI.createModelGroup("MapTackModelGroup");
    }
    applyLayer() {
        window.dispatchEvent(new Event("ui-show-map-tack-icons"));
    }
    removeLayer() {
        window.dispatchEvent(new Event("ui-hide-map-tack-icons"));
    }
    onLayerHotkey(hotkey) {
        if (hotkey.detail?.name == "toggle-map-tack-layer") {
            LensManager.toggleLayer("dmt-map-tack-layer");
        }
    }
    onActiveLensChanged(event) {
        this.clearHiglights();
        if (event.detail?.activeLens == "fxs-building-placement-lens") { // Building placement lens.
            // Highlight corresponding plots.
            const type = BuildingPlacementManager?.currentConstructible?.ConstructibleType;
            if (type) {
                const plotCoords = MapTackUtils.getMapTackTypePlots(type) || [];
                this.highlightMapTackPlot(plotCoords);
            }
        } else if (event.detail?.activeLens == "fxs-settler-lens") { // Settler lens.
            // Enable map tack layer in settler lens by default.
            if (!LensManager.isLayerEnabled("dmt-map-tack-layer")) {
                LensManager.enableLayer("dmt-map-tack-layer");
            }
            // Highlight city center plots.
            const plotCoords = MapTackUtils.getCityCenterMapTackPlots() || [];
            this.highlightMapTackPlot(plotCoords);
        }
    }
    highlightMapTackPlot(plotCoords = []) {
        for (const plotCoord of plotCoords) {
            this.mapTackModelGroup?.addVFXAtPlot("VFX_3dUI_Tut_SelectThis_01", plotCoord, { x: 0, y: 0, z: 0 });
            this.mapTackModelGroup?.addVFXAtPlot("VFX_3dUI_Unit_Selected_01", plotCoord, { x: 0, y: 0, z: 0 });
        }
    }
    clearHiglights() {
        this.mapTackModelGroup?.clear();
    }
    getKey(x, y) {
        return `${x}-${y}`;
    }
}
LensManager.registerLensLayer("dmt-map-tack-layer", new MapTackLensLayer());