/**
 * @file resource-layer
 * @copyright 2022-2024, Firaxis Games
 * @description Lens layer to show resource icons on the map
 */
import LensManager from '/core/ui/lenses/lens-manager.js';
import PlotIconsManager from '/core/ui/plot-icons/plot-icons-manager.js';
;
class ResourceLensLayer {
    constructor() {
        // A cached map of each resource visible
        this.resourceMap = new Map();
        this.resourceAddedToMapListener = (data) => { this.onResourceAddedToMap(data); };
        this.resourceRemovedFromMapListener = (data) => { this.onResourceRemovedFromMap(data); };
        this.onLayerHotkeyListener = this.onLayerHotkey.bind(this);
        this.isApplied = false;
    }
    initLayer() {
        engine.on('ResourceAddedToMap', this.resourceAddedToMapListener);
        engine.on('ResourceRemovedFromMap', this.resourceRemovedFromMapListener);
        const width = GameplayMap.getGridWidth();
        const height = GameplayMap.getGridHeight();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const resource = GameplayMap.getResourceType(x, y);
                if (resource == ResourceTypes.NO_RESOURCE) {
                    continue;
                }
                const resourceDefinition = GameInfo.Resources.lookup(resource);
                if (resourceDefinition) {
                    const resourceType = resourceDefinition.ResourceType;
                    const key = this.makeKey(x, y);
                    this.resourceMap.set(key, { location: { x: x, y: y }, resource: resourceType });
                }
                else {
                    console.error(`Could not find resource with type ${resource}.`);
                }
            }
        }
        window.addEventListener('layer-hotkey', this.onLayerHotkeyListener);
    }
    applyLayer() {
        if (!this.isApplied) {
            this.isApplied = true;
            this.resourceMap.forEach((entry) => {
                PlotIconsManager.addPlotIcon('plot-icon-resource', entry.location, new Map([['resource', entry.resource]]));
            });
        }
    }
    removeLayer() {
        if (this.isApplied) {
            this.isApplied = false;
            PlotIconsManager.removePlotIcons('plot-icon-resource');
        }
    }
    makeKey(x, y) {
        return `${x},${y}`;
    }
    onResourceAddedToMap(data) {
        const key = this.makeKey(data.location.x, data.location.y);
        const resourceDefinition = GameInfo.Resources.lookup(data.resourceType);
        if (resourceDefinition) {
            const resourceType = resourceDefinition.ResourceType;
            this.resourceMap.set(key, { location: data.location, resource: resourceType });
            PlotIconsManager.addPlotIcon('plot-icon-resource', data.location, new Map([['resource', resourceType]]));
        }
        else {
            console.error(`Could not find resource with type ${data.resourceType}.`);
            this.resourceMap.delete(key);
        }
    }
    onResourceRemovedFromMap(data) {
        const key = this.makeKey(data.location.x, data.location.y);
        this.resourceMap.delete(key);
    }
    onLayerHotkey(hotkey) {
        if (hotkey.detail.name == 'toggle-resources-layer') {
            LensManager.toggleLayer('fxs-resource-layer');
        }
    }
}
LensManager.registerLensLayer('fxs-resource-layer', new ResourceLensLayer());

//# sourceMappingURL=file:///base-standard/ui/lenses/layer/resource-layer.js.map
