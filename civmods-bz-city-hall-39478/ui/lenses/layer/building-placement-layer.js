import { L as LensManager } from '/core/ui/lenses/lens-manager.chunk.js';
import { C as ComponentID } from '/core/ui/utilities/utilities-component-id.chunk.js';
import { BuildingPlacementHoveredPlotChangedEventName, BuildingPlacementManager } from '/base-standard/ui/building-placement/building-placement-manager.js';
import { S as SortYields } from '/base-standard/ui/utilities/utilities-city-yields.chunk.js';

const adjacencyIcons = /* @__PURE__ */ new Map([
    [DirectionTypes.DIRECTION_EAST, "adjacencyarrow_east"],
    [DirectionTypes.DIRECTION_NORTHEAST, "adjacencyarrow_northeast"],
    [DirectionTypes.DIRECTION_NORTHWEST, "adjacencyarrow_northwest"],
    [DirectionTypes.DIRECTION_SOUTHEAST, "adjacencyarrow_southeast"],
    [DirectionTypes.DIRECTION_SOUTHWEST, "adjacencyarrow_southwest"],
    [DirectionTypes.DIRECTION_WEST, "adjacencyarrow_west"]
]);
function adjacencyYield(building) {
    if (!building) return [];
    const adjTypes = GameInfo.Constructible_Adjacencies.filter(at =>
        at.ConstructibleType == building.ConstructibleType && !at.RequiresActivation
    );
    const adjYields = adjTypes.map(at => GameInfo.Adjacency_YieldChanges.find(
        ay => ay.ID == at.YieldChangeId));
    const yieldSet = new Set(adjYields.map(ay => ay.YieldType));
    return [...yieldSet];
}
function gatherBuildingsTagged(tag) {
    return new Set(GameInfo.TypeTags.filter(e => e.Tag == tag).map(e => e.Type));
}
const BZ_LARGE = gatherBuildingsTagged("FULL_TILE");
class WorkerYieldsLensLayer {
    BUILD_SLOT_SPRITE_PADDING = 12;
    YIELD_SPRITE_HEIGHT = 6;
    YIELD_SPRITE_ANGLE = Math.PI / 6;  // 30°
    YIELD_SPRITE_PADDING = 11;
    YIELD_WRAP_AT = 3;
    YIELD_WRAPPED_ROW_OFFSET = 8;
    yieldSpriteGrid = WorldUI.createSpriteGrid("BuildingPlacementYields_SpriteGroup", true);
    adjacenciesSpriteGrid = WorldUI.createSpriteGrid("Adjacencies_SpriteGroup", true);
    buildingPlacementPlotChangedListener = this.onBuildingPlacementPlotChanged.bind(this);
    initLayer() {
        this.yieldSpriteGrid.setVisible(false);
        this.adjacenciesSpriteGrid.setVisible(false);
    }
    applyLayer() {
        this.realizeBuidlingPlacementSprites();
        this.yieldSpriteGrid.setVisible(true);
        window.addEventListener(
            BuildingPlacementHoveredPlotChangedEventName,
            this.buildingPlacementPlotChangedListener
        );
    }
    removeLayer() {
        this.yieldSpriteGrid.clear();
        this.yieldSpriteGrid.setVisible(false);
        this.adjacenciesSpriteGrid.clear();
        this.adjacenciesSpriteGrid.setVisible(false);
        window.removeEventListener(
            BuildingPlacementHoveredPlotChangedEventName,
            this.buildingPlacementPlotChangedListener
        );
    }
    /** Add the yield deltas and building slots to each valid plot for the current building */
    realizeBuidlingPlacementSprites() {
        if (!BuildingPlacementManager.cityID) {
            console.error(
                "building-placement-layer: No assigned cityID in the BuildingPlacementManager when attempting to realizeBuildingPlacementSprites"
            );
            return;
        }
        if (!BuildingPlacementManager.currentConstructible) {
            console.error(
                "building-placement-layer: No assigned currentConstructible in the BuildingPlacementManager when attempting to realizeBuildingPlacementSprites"
            );
            return;
        }
        const city = Cities.get(BuildingPlacementManager.cityID);
        if (!city) {
            console.error(
                "building-placement-layer: No valid city with city ID: " + ComponentID.toLogString(BuildingPlacementManager.cityID)
            );
            return;
        }
        if (!city.Yields) {
            console.error(
                "building-placement-layer: No valid Yields object attached to city with city ID: " + ComponentID.toLogString(BuildingPlacementManager.cityID)
            );
            return;
        }
        const validPlots = BuildingPlacementManager.expandablePlots.concat(
            BuildingPlacementManager.developedPlots.concat(BuildingPlacementManager.urbanPlots.concat(BuildingPlacementManager.bzReservedPlots))
        );
        for (const plotIndex of validPlots) {
            const plotYieldGainPills = [];
            const plotYieldLossPills = [];
            // Add the yield gain and loss pills
            BuildingPlacementManager.getTotalYieldChanges(plotIndex)?.forEach((yieldChangeInfo) => {
                if (yieldChangeInfo.yieldChange != 0) {
                    const yieldPillData = {
                        iconURL: BuildingPlacementManager.getYieldPillIcon(
                            yieldChangeInfo.yieldType.toString(),
                            yieldChangeInfo.yieldChange
                        ),
                        yieldDelta: yieldChangeInfo.yieldChange,
                        yieldType: yieldChangeInfo.yieldType
                    };
                    if (yieldChangeInfo.yieldChange > 0) {
                        plotYieldGainPills.push(yieldPillData);
                    } else {
                        plotYieldLossPills.push(yieldPillData);
                    }
                }
            });
            SortYields(plotYieldGainPills);
            SortYields(plotYieldLossPills);
            const pillOffsets = this.getXYOffsetForPill(plotYieldGainPills.length + plotYieldLossPills.length);
            const location = GameplayMap.getLocationFromIndex(plotIndex);
            plotYieldGainPills.forEach((yieldPillData, i) => {
                const pillOffset = pillOffsets[i];
                this.yieldSpriteGrid.addSprite(location, yieldPillData.iconURL, {
                    x: pillOffset.x,
                    y: pillOffset.y,
                    z: 5
                });
                this.yieldSpriteGrid.addText(
                    location,
                    yieldPillData.yieldDelta.toString(),
                    { x: pillOffset.x, y: pillOffset.y - 3, z: 5 },
                    { fonts: ["TitleFont"], fontSize: 4, faceCamera: true }
                );
            });
            plotYieldLossPills.forEach((yieldPillData, i) => {
                const pillOffset = pillOffsets[i + plotYieldGainPills.length];
                this.yieldSpriteGrid.addSprite(location, yieldPillData.iconURL, {
                    x: pillOffset.x,
                    y: pillOffset.y,
                    z: 5
                });
                this.yieldSpriteGrid.addText(
                    location,
                    yieldPillData.yieldDelta.toString(),
                    { x: pillOffset.x, y: pillOffset.y - 3, z: 5 },
                    { fonts: ["TitleFont"], fontSize: 4, faceCamera: true }
                );
            });
            // Add any filled or open building slots
            const district = Districts.getAtLocation(plotIndex);
            if (district) {
                this.realizeBuildSlots(district);
            }
        }
    }
    /**
     * Returns an array of offsets for yield pills for totalPills count passed in
     * Will wrap to 2 lines once hitting a limit but won't wrap more than once
     * @param totalPills total number of yield pills that will be displayed on the tile
     * @returns array of offsets indexed to the sourced array of pills. ie: 3rd pill (index of 2) offset at offsetArray[2]
     */
    getXYOffsetForPill(totalPills) {
        const offsets = [];
        // Determine if we should wrap and if so how many pills in the top and bottom rows
        const shouldWrap = totalPills > this.YIELD_WRAP_AT;
        const numPillsBottomRow = shouldWrap ? Math.trunc(totalPills / 2) : 0;
        const numPillsTopRow = totalPills - numPillsBottomRow;
        // Group width based on top row which should always be the longest row
        const groupWidth = (numPillsTopRow - 1) * this.YIELD_SPRITE_PADDING;
        for (let i = 0; i < totalPills; i++) {
            const isPillInTopRow = i + 1 <= numPillsTopRow;
            // If this pill is in the bottom row base the index for positioning off relative index within the bottom row
            const rowPosition = isPillInTopRow ? i : i - numPillsTopRow;
            // Generate y offset based on if we need to wrap and what row the pill is in
            let yOffset = 0;
            if (shouldWrap) {
                yOffset = isPillInTopRow ? this.YIELD_WRAPPED_ROW_OFFSET : -this.YIELD_WRAPPED_ROW_OFFSET;
            }
            const offset = {
                x: rowPosition * this.YIELD_SPRITE_PADDING + groupWidth / 2 - groupWidth,
                y: yOffset
            };
            offsets.push(offset);
        }
        return offsets;
    }
    /*Show building slots below each tile*/
    realizeBuildSlots(district, grid=this.yieldSpriteGrid) {
        const districtDefinition = GameInfo.Districts.lookup(district.type);
        if (!districtDefinition) {
            console.error(
                "building-placement-layer: Unable to retrieve a valid DistrictDefinition with DistrictType: " + district.type
            );
            return;
        }
        const constructibles = MapConstructibles.getConstructibles(
            district.location.x,
            district.location.y
        );
        const buildingSlots = [];
        let maxSlots = districtDefinition.MaxConstructibles;
        for (const constructibleID of constructibles) {
            const existingConstructible = Constructibles.getByComponentID(constructibleID);
            if (!existingConstructible) {
                console.error(
                    "building-placement-layer: Unable to find a valid Constructible with ComponentID: " + ComponentID.toLogString(constructibleID)
                );
                continue;
            }
            const building = GameInfo.Constructibles.lookup(
                existingConstructible.type
            );
            if (!building) {
                console.error("building-placement-layer: Unable to find a valid ConstructibleDefinition with type: " + existingConstructible.type);
                continue;
            }
            // skip walls
            if (building.ExistingDistrictOnly) continue;
            // large buildings take up an extra slot
            if (BZ_LARGE.has(building.ConstructibleType)) maxSlots -= 1;
            // building icon
            const iconURL = UI.getIconBLP(building.ConstructibleType) || "";
            // building yield type flag
            const yields = adjacencyYield(building)
                // .map(y => UI.getIconBLP(y + "_5", "YIELD"));
                .map(y => BuildingPlacementManager.getYieldPillIcon(y, 1, true));
            buildingSlots.push({ iconURL, yields, });
        }
        for (let i = 0; i < maxSlots; i++) {
            const groupWidth = (maxSlots - 1) * this.BUILD_SLOT_SPRITE_PADDING;
            const xPos = (i * this.BUILD_SLOT_SPRITE_PADDING) + (groupWidth / 2) - groupWidth;
            grid.addSprite(district.location, UI.getIconBLP('BUILDING_UNFILLED'), { x: xPos, y: -28, z: 0 });
            const slot = buildingSlots[i];
            if (slot) {
                const p = { x: xPos, y: -27.5, z: 0 };
                for (const [j, yieldIcon] of slot.yields.entries()) {
                    const w = slot.yields.length - 1;
                    const dx = this.YIELD_SPRITE_PADDING * 2/3 * (j - w/2);
                    const dy = this.YIELD_SPRITE_HEIGHT * Math.cos(this.YIELD_SPRITE_ANGLE);
                    const dz = this.YIELD_SPRITE_HEIGHT * Math.sin(this.YIELD_SPRITE_ANGLE);
                    const pf = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
                    grid.addSprite(district.location, yieldIcon, pf, { scale: 3/4 });
                }
                grid.addSprite(district.location, slot.iconURL, p, { scale: 0.7 });
            }
        }
    }
    /* Update displayed info when hovering a new plot */
    onBuildingPlacementPlotChanged() {
        this.adjacenciesSpriteGrid.clear();
        this.adjacenciesSpriteGrid.setVisible(false);
        if (!BuildingPlacementManager.cityID) {
            console.error(
                "building-placement-layer: No assigned cityID in the BuildingPlacementManager when attempting to realizeBuildingPlacementSprites"
            );
            return;
        }
        if (!BuildingPlacementManager.currentConstructible) {
            console.error(
                "building-placement-layer: No assigned currentConstructible in the BuildingPlacementManager when attempting to realizeBuildingPlacementSprites"
            );
            return;
        }
        const city = Cities.get(BuildingPlacementManager.cityID);
        if (!city) {
            console.error(
                "building-placement-layer: No valid city with city ID: " + ComponentID.toLogString(BuildingPlacementManager.cityID)
            );
            return;
        }
        if (!city.Yields) {
            console.error(
                "building-placement-layer: No valid Yields object attached to city with city ID: " + ComponentID.toLogString(BuildingPlacementManager.cityID)
            );
            return;
        }
        if (!BuildingPlacementManager.hoveredPlotIndex || !BuildingPlacementManager.isValidPlacementPlot(BuildingPlacementManager.hoveredPlotIndex)) {
            return;
        }
        const yieldAdjacencies = city.Yields.calculateAllAdjacencyYieldsForConstructible(
            BuildingPlacementManager.currentConstructible.ConstructibleType,
            BuildingPlacementManager.hoveredPlotIndex
        );
        if (yieldAdjacencies.length <= 0) {
            return;
        }
        const multiArrow = {};
        yieldAdjacencies.forEach((adjacency) => {
            const yieldDef = GameInfo.Yields.lookup(adjacency.yieldType);
            if (!yieldDef) {
                console.error(
                    "building-placement-layer: No valid yield definition for yield type: " + adjacency.yieldType.toString()
                );
                return;
            }
            const buildingLocation = GameplayMap.getLocationFromIndex(BuildingPlacementManager.hoveredPlotIndex);
            const adjacencyLocation = GameplayMap.getLocationFromIndex(adjacency.sourcePlotIndex);
            const adjacencyDirection = GameplayMap.getDirectionToPlot(buildingLocation, adjacencyLocation);
            // show arrow icons
            const arrowIcon = adjacencyIcons.get(adjacencyDirection);
            if (arrowIcon === void 0) {
                console.error(
                    "building-placement-layer: No valid adjacency icon for direction: " + adjacencyDirection.toString()
                );
                return;
            }
            const arrowOffset = this.calculateAdjacencyDirectionOffsetLocation(adjacencyDirection);
            // handle multiple adjacencies from the same direction
            const arrowCount = multiArrow[adjacencyDirection] ?? 0;
            multiArrow[adjacencyDirection] = arrowCount + 1;
            const shift = 1.5 + 0.3 * arrowCount;
            // show yield icons
            const yieldIcon = UI.getIconBLP(yieldDef.YieldType + "_5", "YIELD");
            const yieldOffset = { x: shift * arrowOffset.x, y: shift * arrowOffset.y };
            // scale -1 to flip the arrows to indicate incoming adjacencies
            this.adjacenciesSpriteGrid.addSprite(buildingLocation, arrowIcon, arrowOffset, { scale: -1 });
            this.adjacenciesSpriteGrid.addSprite(buildingLocation, yieldIcon, yieldOffset, { scale: 1 });
            // TODO: outgoing adjacencies once implemented in GameCore
        });
        this.adjacenciesSpriteGrid.setVisible(true);
    }
    /* Determine where adjacency arrows should go based on adjacency location */
    calculateAdjacencyDirectionOffsetLocation(adjacencyDirection) {
        switch (adjacencyDirection) {
            case DirectionTypes.DIRECTION_EAST:
                return { x: 32, y: 0 };
            case DirectionTypes.DIRECTION_WEST:
                return { x: -32, y: 0 };
            case DirectionTypes.DIRECTION_NORTHEAST:
                return { x: 16, y: 28 };
            case DirectionTypes.DIRECTION_NORTHWEST:
                return { x: -16, y: 28 };
            case DirectionTypes.DIRECTION_SOUTHEAST:
                return { x: 16, y: -28 };
            case DirectionTypes.DIRECTION_SOUTHWEST:
                return { x: -16, y: -28 };
            default:
                return { x: 32, y: 0 };
        }
    }
}

export { WorkerYieldsLensLayer };
LensManager.registerLensLayer("fxs-building-placement-layer", new WorkerYieldsLensLayer());
//# sourceMappingURL=building-placement-layer.js.map
