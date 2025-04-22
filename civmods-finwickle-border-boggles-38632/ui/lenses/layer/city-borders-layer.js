/**
 * @file city-borders-layer
 * @copyright 2024, Firaxis Games
 * @description Lens layer for city borders where individual city bounds are represented if two cities are adjacent
 */

/* All edits have a comment with Finwickle; changes summary:
	- set borderStyle for plots that have a new owner; fixes border color staying on previous color after settlement changes owner
	- don't incorrectly create a border overlay when clearing a goody hut (discovery); fixes some single plot issues
	- clear prior owner city center from overlay map, so it doesn't keep a separate border; fixes all (?) other single plot issues
	- added lot of debug logging
*/

import { ComponentID } from '/core/ui/utilities/utilities-component-id.js';
import LensManager from '/core/ui/lenses/lens-manager.js';
import { OVERLAY_PRIORITY } from '/base-standard/ui/utilities/utilities-overlay.js';
const logPrefix = "Border Toggles (Finwickle) city-borders-layer.js: "; // Finwickle: added for debugging
var BorderStyleTypes;
(function (BorderStyleTypes) {
    BorderStyleTypes["Closed"] = "CultureBorder_Closed";
    BorderStyleTypes["CityStateClosed"] = "CultureBorder_CityState_Closed";
    BorderStyleTypes["CityStateOpen"] = "CultureBorder_CityState_Open";
})(BorderStyleTypes || (BorderStyleTypes = {}));
// TODO: Pull from database or gamecore when implemented
const independentPrimaryColor = 0xFF333333;
const independentSecondaryColor = 0xFFCCFFFF;
/** Default style - Only used to initialize the BorderOverlay */
const defaultStyle = {
    style: BorderStyleTypes.CityStateOpen,
    primaryColor: independentPrimaryColor,
    secondaryColor: independentSecondaryColor
};
const thicknessZoomMultiplier = 3;
class CityBordersLayer {
    constructor() {
        this.cityOverlayGroup = WorldUI.createOverlayGroup("CityBorderOverlayGroup", OVERLAY_PRIORITY.CULTURE_BORDER);
        /** Map of border overlays keyed by the PlotIndex of the city */
        this.borderOverlayMap = new Map();
        /** Map of city center plot indexes keyed by plot indexes owned by that city */
        this.ownedPlotMap = new Map();
        this.lastZoomLevel = -1;
        this.onPlotOwnershipChanged = (data) => {
            const plotIndex = GameplayMap.getIndexFromLocation(data.location);
			// Remove plot from prior owner if valid
			if (data.priorOwner != PlayerIds.NO_PLAYER) {
				console.warn(logPrefix + "plotIndex " + plotIndex + " had prior owner " + (data.priorOwner == 63 ? "63 (goody hut)" : data.priorOwner)); // Finwickle: added for debugging
				const previousOverlay = this.getBorderOverlay(plotIndex, true); // Finwickle: added true to prevent creation of a border overlay, for goody huts and for plots of a prior settlement that was removed with removePriorSettlementOverlay()
				if (previousOverlay) { // Finwickle: added check now that overlay is not created when not found
					previousOverlay.clearPlotGroups(plotIndex);
					if (data.owner == PlayerIds.NO_PLAYER) { // Finwickle: added
						this.removePriorSettlementOverlay(plotIndex, previousOverlay); // Finwickle: added to remove all plots from a razed/dispersed settlement at once
					}
				}
				this.ownedPlotMap.delete(plotIndex);
			}
			// Add plot to new owner
			if (data.owner != PlayerIds.NO_PLAYER) {
				console.warn(logPrefix + "plotIndex " + plotIndex + " now has owner " + data.owner + (data.priorOwner == data.owner ? ", identical to prior owner" : "")); // Finwickle: added for debugging
				this.ownedPlotMap.set(plotIndex, this.findCityCenterIndexForPlotIndex(plotIndex));
				const newOverlay = this.getBorderOverlay(plotIndex);
				newOverlay.setDefaultStyle(this.getBorderGroupStyle(plotIndex)); // Finwickle: added to set the correct border color after a plot changed owner
				newOverlay.setPlotGroups(plotIndex, 0);
			}
        };
        this.onCameraChanged = (camera) => {
            if (this.lastZoomLevel != camera.zoomLevel) {
                this.lastZoomLevel = camera.zoomLevel;
                this.borderOverlayMap.forEach((borderOverlay) => {
                    borderOverlay.setThicknessScale(camera.zoomLevel * thicknessZoomMultiplier); // Set thickness to 0 when zoomed all the way in.
                });
            }
        };
    }
    initLayer() {
        console.warn(logPrefix + "init started"); // Finwickle: added for debugging
		const alivePlayers = Players.getAlive();
        alivePlayers.forEach((player) => {
            if (player.isIndependent) {
                this.initBordersForIndependent(player);
            }
            else {
                this.initBordersForPlayer(player);
            }
        });
        engine.on('CameraChanged', this.onCameraChanged);
        engine.on('PlotOwnershipChanged', this.onPlotOwnershipChanged);
        this.cityOverlayGroup.setVisible(false);
		console.warn(logPrefix + "init done"); // Finwickle: added for debugging
    }
    getBorderOverlay(plotIndex, preventCreation = false) { // Finwickle: added preventCreation parameter
        // First assuming we're looking for the border overlay by city center plot index
        const borderOverlay = this.borderOverlayMap.get(plotIndex);
        if (borderOverlay) {
			console.warn(logPrefix + "plotIndex " + plotIndex + " found in the borderOverlayMap, meaning a settlement center"); // Finwickle: added for debugging
            return borderOverlay;
        }
        // If that fails see if this plot index is tied to an existing border overlay
        const owningPlot = this.ownedPlotMap.get(plotIndex);
        if (owningPlot) {
            const borderOverlay = this.borderOverlayMap.get(owningPlot);
            if (borderOverlay) {
				console.warn(logPrefix + "plotIndex " + plotIndex + " found in the ownedPlotMap"); // Finwickle: added for debugging
                return borderOverlay;
            }
        }
		if (preventCreation) { // Finwickle: added
			console.warn(logPrefix + "plotIndex " + plotIndex + " had no previous borderOverlay "); // Finwickle: added for debugging
			return undefined; // Finwickle: added
		}
		console.warn(logPrefix + "plotIndex " + plotIndex + " had no previous borderOverlay; creating one now"); // Finwickle: added for debugging
        return this.createBorderOverlay(plotIndex);
    }
    createBorderOverlay(plotIndex) {
        const borderOverlay = this.cityOverlayGroup.addBorderOverlay(defaultStyle);
		const borderStyle = this.getBorderGroupStyle(plotIndex); // Finwickle: changed to call the now separate method
		if (borderStyle) { // Finwickle: added check to mimic original behaviour
			borderOverlay.setDefaultStyle(borderStyle);
			this.borderOverlayMap.set(plotIndex, borderOverlay);
		}
        return borderOverlay;
    }
	getBorderGroupStyle(plotIndex) { // Finwickle: separated from createBorderOverlay()
        // Find the owning player for this plot index
        const plotLocation = GameplayMap.getLocationFromIndex(plotIndex);
        const ownerId = GameplayMap.getOwner(plotLocation.x, plotLocation.y);
        const owner = Players.get(ownerId);
        if (!owner) {
            console.error(`city-borders-layer: getBorderGroupStyle() failed to find owner for plotIndex ${plotIndex}`); // Finwickle: changed error message
            return undefined; // Finwickle: changed
        }
		// Set border group style
        const primary = UI.Player.getPrimaryColorValueAsHex(owner.id);
        const secondary = UI.Player.getSecondaryColorValueAsHex(owner.id);
        const borderStyle = {
            style: BorderStyleTypes.Closed,
            primaryColor: primary,
            secondaryColor: secondary
        };
        // Check if we want to use city-state or independent styles
        if (owner.isIndependent) {
            borderStyle.style = BorderStyleTypes.CityStateOpen;
            borderStyle.primaryColor = independentPrimaryColor;
            borderStyle.secondaryColor = independentSecondaryColor;
        }
        else if (!owner.isMajor) {
            borderStyle.style = BorderStyleTypes.CityStateClosed;
        }
		return borderStyle;
	}
	removePriorSettlementOverlay(referencePlotIndex, borderOverlay) { // Finwickle: added this method
		console.warn(logPrefix + "starting removal of a previous settlement"); // Finwickle: added for debugging
		const settlementCenterPlotIndex = this.ownedPlotMap.get(referencePlotIndex); // Finwickle: find settlement center plot
		if (!settlementCenterPlotIndex) {
			console.error(logPrefix + "removePriorSettlementOverlay() failed to find previous settlement center for plotIndex " + referencePlotIndex);
			return;
		}
		const previousSettlementPlotsMap = new Map([...this.ownedPlotMap].filter(([key, value]) => value == settlementCenterPlotIndex)); // Finwickle: find all previous settlement plots
		previousSettlementPlotsMap.forEach((centerPlotIndex, plotIndex) => { 
			borderOverlay.clearPlotGroups(plotIndex); // Finwickle: remove each plot from the border overlay
			this.ownedPlotMap.delete(plotIndex); // Finwickle: remove each plot from the owned plots map
			console.warn(logPrefix + "removed plotIndex " + plotIndex + " from border overlay of previous settlement at " + centerPlotIndex); // Finwickle: added for debugging
		});
		this.borderOverlayMap.delete(settlementCenterPlotIndex); // Finwickle: remove this settlement from the border overlay map
		console.warn(logPrefix + "previous settlement at plotIndex " + settlementCenterPlotIndex + " completely removed"); // Finwickle: added for debugging
	}
    initBordersForPlayer(player) {
        const playerCities = player.Cities?.getCities();
        if (!playerCities) {
            console.error(`city-borders-layer: initLayer() failed to find cities for PlayerID ${player.id}`);
            return;
        }
        // Find all the plots owned by the player
        playerCities.forEach((city) => {
            const cityPlots = city.getPurchasedPlots();
            if (cityPlots.length > 0) {
                const cityPlotIndex = GameplayMap.getIndexFromLocation(city.location);
                this.ownedPlotMap.set(cityPlotIndex, cityPlotIndex);
                const borderOverlay = this.getBorderOverlay(cityPlotIndex);
                borderOverlay.setPlotGroups(cityPlots, 0);
                cityPlots.forEach((plotIndex) => {
                    this.ownedPlotMap.set(plotIndex, cityPlotIndex);
                });
            }
        });
    }
    initBordersForIndependent(player) {
        let villagePlotIndex = -1;
        let plotIndexes = [];
        player.Constructibles?.getConstructibles().forEach(construct => {
            const constructDef = GameInfo.Constructibles.lookup(construct.type);
            if (constructDef) {
                if (constructDef.ConstructibleType == "IMPROVEMENT_VILLAGE" || constructDef.ConstructibleType == "IMPROVEMENT_ENCAMPMENT") {
                    villagePlotIndex = GameplayMap.getIndexFromLocation(construct.location);
                    plotIndexes = plotIndexes.concat(villagePlotIndex);
                    const adjacentPlotDirection = [
                        DirectionTypes.DIRECTION_NORTHEAST,
                        DirectionTypes.DIRECTION_EAST,
                        DirectionTypes.DIRECTION_SOUTHEAST,
                        DirectionTypes.DIRECTION_SOUTHWEST,
                        DirectionTypes.DIRECTION_WEST,
                        DirectionTypes.DIRECTION_NORTHWEST
                    ];
                    // Loop through each direction type, and if they are not hidden and owned, add.
                    for (let directionIndex = 0; directionIndex < adjacentPlotDirection.length; directionIndex++) {
                        let plot = GameplayMap.getAdjacentPlotLocation(construct.location, adjacentPlotDirection[directionIndex]);
                        let owner = GameplayMap.getOwner(plot.x, plot.y);
                        if (owner == player.id) {
                            plotIndexes = plotIndexes.concat(GameplayMap.getIndexFromLocation(plot));
                        }
                    }
                }
            }
        });
        if (plotIndexes.length > 0) {
            const borderOverlay = this.getBorderOverlay(villagePlotIndex);
            borderOverlay.setPlotGroups(plotIndexes, 0);
        }
    }
    findCityCenterIndexForPlotIndex(plotIndex) {
        const plotCoord = GameplayMap.getLocationFromIndex(plotIndex);
        const owningCityId = GameplayMap.getOwningCityFromXY(plotCoord.x, plotCoord.y);
        if (!owningCityId) {
            return -1; // off the map
        }
        const player = Players.get(owningCityId.owner);
        if (!player) {
            console.error(`city-borders-layer: findCityCenterIndexForPlotIndex failed to find owning player for plotIndex ${plotIndex}`);
            return -1;
        }
        if (player.isIndependent) {
            let villagePlotIndex = -1;
            player.Constructibles?.getConstructibles().forEach(construct => {
                const constructDef = GameInfo.Constructibles.lookup(construct.type);
                if (constructDef) {
                    if (constructDef.ConstructibleType == "IMPROVEMENT_VILLAGE") {
                        villagePlotIndex = GameplayMap.getIndexFromLocation(construct.location);
                    }
                }
            });
            if (villagePlotIndex == -1) {
                console.error(`city-borders-layer: findCityCenterIndexForPlotIndex failed to find villagePlotIndex for plotIndex ${plotIndex}`);
            }
            return villagePlotIndex;
        }
        const owningCity = player.Cities?.getCities().find((city) => {
            return ComponentID.isMatch(city.id, owningCityId);
        });
        if (!owningCity) {
            console.error(`city-borders-layer: findCityCenterIndexForPlotIndex failed to find owningCity for plotIndex ${plotIndex}`);
            return -1;
        }
        return GameplayMap.getIndexFromLocation(owningCity.location);
    }
    applyLayer() {
        this.cityOverlayGroup.setVisible(true);
    }
    removeLayer() {
        this.cityOverlayGroup.setVisible(false);
    }
}
LensManager.registerLensLayer('fxs-city-borders-layer', new CityBordersLayer());

//# sourceMappingURL=file:///base-standard/ui/lenses/layer/city-borders-layer.js.map
