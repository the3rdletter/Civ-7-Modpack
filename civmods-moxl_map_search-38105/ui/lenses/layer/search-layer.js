/**
 * @file search-layer
 * @copyright 2021 - 2024, Firaxis Games, 2025 moxl
 * @description Lens layer used to display searched results
 */
import LensManager from '/core/ui/lenses/lens-manager.js';
// From appeal-layer.js
const HexToFloat4 = (hex, alpha = 1) => {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return { x: r / 255, y: g / 255, z: b / 255, w: Math.min(1, Math.max(0, alpha)) };
};
const HIGHLIGHT_COLOR = HexToFloat4(0x00FF7F, .6);
class SearchLensLayer {
    constructor() {
        this.searchOverlayGroup = WorldUI.createOverlayGroup("SearchOverlayGroup", 1);
        this.searchOverlay = this.searchOverlayGroup.addPlotOverlay();
        this.searchPlots = [];
    }
    clearOverlay() {
        this.searchOverlayGroup.clearAll();
        this.searchOverlay.clear();
        this.searchPlots = [];
    }
    initLayer() {
    }
    applyLayer() {
        this.clearOverlay();
        const width = GameplayMap.getGridWidth();
        const height = GameplayMap.getGridHeight();
        const searchString = UI.getOption("user", "Interface", "search-lens-value");
        if (searchString == null) {
            return;
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let plotCoord = { x: x, y: y };
                if (this.hasSearchItem(plotCoord, searchString)) {
                    this.searchPlots.push(plotCoord);
                }
            }
        }
        this.searchOverlay.addPlots(this.searchPlots, { fillColor: HIGHLIGHT_COLOR });
    }
    removeLayer() {
        this.clearOverlay();
    }
    hasSearchItem(plotCoord, searchString) {
        if (!this.isRevealed(plotCoord)) {
            return false;
        }

        const searchStringLower = searchString.toLowerCase();

        const hasResource = this.hasResource(plotCoord, searchStringLower);
        const hasOwner = this.hasOwner(plotCoord, searchStringLower);
        const hasTerrainOrBiome = this.hasTerrainOrBiome(plotCoord, searchStringLower);
        const hasConstructible = this.hasConstructible(plotCoord, searchStringLower);
        const hasUnit = this.hasVisibleUnit(plotCoord, searchStringLower);

        return (hasResource || hasOwner || hasTerrainOrBiome || hasConstructible || hasUnit);
    }
    hasVisibleUnit(plotCoord, searchString) {
        const localPlayerID = GameContext.localPlayerID;
        let plotUnits = MapUnits.getUnits(plotCoord.x, plotCoord.y);
        if (plotUnits && plotUnits.length > 0) {
            for (let i = 0; i < plotUnits.length; i++) {
                const unit = Units.get(plotUnits[i]);
                if (unit) {
                    if (!Visibility.isVisible(localPlayerID, unit?.id)) {
                        continue;
                    }
                    const unitName = Locale.compose(unit.name);
                    if (unitName.toLowerCase().includes(searchString)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    hasResource(plotCoord, searchString) {
        const resource = this.getResource(plotCoord);
        if ( resource != null) {
            const rscStr = Locale.compose(resource.Name).toLowerCase();
            if (rscStr.includes(searchString)) {
                return true;
            }
        }
        return false;
    }
    hasOwner(plotCoord, searchString) {
        const civName = Locale.compose(GameplayMap.getOwnerName(plotCoord.x, plotCoord.y));
        if (civName.toLowerCase().includes(searchString)) {
            return true;
        }
        return false;
    }
    hasTerrainOrBiome(plotCoord, searchString) {
        const terrainLabel = this.getTerrainLabel(plotCoord)
        if (terrainLabel.toLowerCase().includes(searchString)) {
            return true;
        }
        const biomeLabel = this.getBiomeLabel(plotCoord)
        if (biomeLabel.toLowerCase().includes(searchString)) {
            return true;
        }
        const label = Locale.compose("{1_TerrainName} {2_BiomeName}", terrainLabel, biomeLabel);
        if (label.toLowerCase().includes(searchString)) {
            return true;
        }

        return false;
    }
    hasConstructible(plotCoord, searchString) {
        const constructibles = MapConstructibles.getHiddenFilteredConstructibles(plotCoord.x, plotCoord.y);
        for (const item of constructibles) {
            const instance = Constructibles.getByComponentID(item);
            if (instance) {
                const info = GameInfo.Constructibles.lookup(instance.type);
                if (Locale.compose(info.Name).toLowerCase().includes(searchString)) {
                    return true;
                }
                // Special handling for discoveries
                if ("discovery".includes(searchString) && info.Discovery) {
                    return true;
                }
                // Special handling for wonders
                if ("wonder".includes(searchString) && info.ConstructibleClass == "WONDER") {
                    return true;
                }

            }
        }

        return false;
    }

    // From ui/tooltops/plot-tooltip.js
    getResource(plotCoord) {
        const resourceType = GameplayMap.getResourceType(plotCoord.x, plotCoord.y);
        return GameInfo.Resources.lookup(resourceType);
    }
    isRevealed(plotCoord) {
        const localPlayerID = GameContext.localPlayerID;
        if (Players.isValid(localPlayerID)) {
            const revealedState = GameplayMap.getRevealedState(localPlayerID, plotCoord.x, plotCoord.y);
            return (revealedState == RevealedStates.REVEALED || revealedState == RevealedStates.VISIBLE);
        }
        return false;
    }
    getTerrainLabel(plotCoord) {
        const terrainType = GameplayMap.getTerrainType(plotCoord.x, plotCoord.y);
        const terrain = GameInfo.Terrains.lookup(terrainType);
        if (terrain) {
            // despite being "coast" this is a check for a lake
            if (terrain.TerrainType == "TERRAIN_COAST" && GameplayMap.isLake(plotCoord.x, plotCoord.y)) {
                return Locale.compose("LOC_TERRAIN_LAKE_NAME");
            }
            return Locale.compose(terrain.Name);
        }
        else {
            return "";
        }
    }
    getBiomeLabel(location) {
        const biomeType = GameplayMap.getBiomeType(location.x, location.y);
        const biome = GameInfo.Biomes.lookup(biomeType);
        // Do not show a label if marine biome.
        if (biome && biome.BiomeType != "BIOME_MARINE") {
            return Locale.compose(biome.Name);
        }
        else {
            return "";
        }
    }
}
LensManager.registerLensLayer('mod-search-layer', new SearchLensLayer());
