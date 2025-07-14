/**
 * @file discovery-layer
 * @description Lens layer to show discovery icons on the map
 */
import LensManager from '/core/ui/lenses/lens-manager.js';
import PlotIconsManager from '/core/ui/plot-icons/plot-icons-manager.js';

class DiscoveryLensLayer {
    constructor() {
        // A cached map of each resource at the time it was visisble to us. Entries are only removed when we see the empty tile.
        this.discoveryMap = new Map();
        this.discoveryHashes = [];
        this.constructibleRemovedFromMapListener = (data) => { this.onConstructibleRemovedFromMap(data); };
        this.constructibleVisibilityChangedListener = (data) => { this.onConstructibleVisibilityChanged(data); };
        this.plotVisibilityChangedListener = (data) => { this.onPlotVisibilityChanged(data); };
        this.isApplied = false;
    }
    initLayer() {
        this.discoveryHashes = [];
        // Keep the hashes of the valid things we care about for fast lookups
        for (const key in DiscoveryVisualTypes) {
            this.discoveryHashes.push(DiscoveryVisualTypes[key]);
        }

        engine.on('ConstructibleRemovedFromMap', this.onConstructibleRemovedFromMap, this);
        engine.on('ConstructibleVisibilityChanged', this.onConstructibleVisibilityChanged, this)
        engine.on('PlotVisibilityChanged', this.plotVisibilityChangedListener, this);
        const width = GameplayMap.getGridWidth();
        const height = GameplayMap.getGridHeight();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.hasDiscoverable(x, y))
                {
                    const key = this.makeKey(x, y);
                    this.discoveryMap.set(key, { location: { x: x, y: y} });
                }
            }
        }
        window.addEventListener('layer-hotkey', this.onLayerHotkeyListener);
    }
    hasDiscoverable(x, y)
    {
        const constructibles = MapConstructibles.getHiddenFilteredConstructibles(x, y);
        for (let i = 0; i < constructibles.length; i++) {
            const constructibleID = constructibles[i];
            const existingConstructible = Constructibles.getByComponentID(constructibleID);

            let constructibleDef = GameInfo.Constructibles.lookup(existingConstructible.type);
            if (constructibleDef != null && constructibleDef.Discovery) {
                return true;
            }
        }

        return false;
    }
    onConstructibleRemovedFromMap(data) {
        if (this.discoveryHashes.find(element => element == data.constructibleType.valueOf())) {
            const key = this.makeKey(data.location.x, data.location.y);
            if (this.discoveryMap.has(key))
            {
                this.discoveryMap.delete(key);
                PlotIconsManager.removePlotIcons('plot-icon-discovery', data.location);
            }
        }
    }
    applyLayer() {
        if (!this.isApplied) {
            this.isApplied = true;
            this.discoveryMap.forEach((entry) => {
                PlotIconsManager.addPlotIcon('plot-icon-discovery', entry.location);
            });
        }
    }
    removeLayer() {
        if (this.isApplied) {
            this.isApplied = false;
            PlotIconsManager.removePlotIcons('plot-icon-discovery');
        }
    }
    makeKey(x, y) {
        return `${x},${y}`;
    }
}
LensManager.registerLensLayer('fxs-discovery-layer', new DiscoveryLensLayer());
