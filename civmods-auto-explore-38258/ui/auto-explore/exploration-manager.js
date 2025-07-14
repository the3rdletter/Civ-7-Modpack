import * as Settings from "./settings.js";
import * as map_globals from '/base-standard/maps/map-globals.js';
import WorldInput from '/base-standard/ui/world-input/world-input.js';


class Deque {
    constructor(maxSize = Infinity, popCallback = undefined) {
        this._size = 0;
        this.maxSize = maxSize;
        this.popCallback = popCallback
        this.front = this.back = undefined;
    }
    addFront(value) {
        this._size++;
        if (!this.front) this.front = this.back = { value };
        else this.front = this.front.next = { value, prev: this.front };

        if (this._size > this.maxSize) this.removeBack();
    }
    removeFront() {
        let value = this.peekFront();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.front = this.front.prev).next = undefined;
        this._size--;
        if (this.popCallback) this.popCallback(value);
        return value;
    }
    peekFront() { 
        return this.front && this.front.value;
    }
    addBack(value) {
        this._size++;
        if (!this.front) this.front = this.back = { value };
        else this.back = this.back.prev = { value, next: this.back };

        if (this._size > this.maxSize) this.removeFront();
    }
    removeBack() {
        let value = this.peekBack();
        if (this.front === this.back) this.front = this.back = undefined;
        else (this.back = this.back.next).back = undefined;
        this._size--;
        if (this.popCallback) this.popCallback(value);
        return value;
    }
    peekBack() { 
        return this.back && this.back.value;
    }
}

export class ExplorationManager {
    static instance = null;
    static isReady = false;

    constructor() {
        if (ExplorationManager.instance) {
            return ExplorationManager.instance;
        }

        // All unit.id are stored as strings with unitToJUnitID
        this.targetAssignments = new Map(); // Unit.id -> {x, y}
        this.autoExploringUnits = new Set(); // Track units that are auto-exploring

        // Create empty 2d boards
        this.width = GameplayMap.getGridWidth()
        this.height = GameplayMap.getGridHeight()

        this.revealedMap = Array(this.height).fill().map(() => Array(this.width).fill(0));
        // A map of reserved tiles. If a unit is moving to a tile, that path will be marked as reserved
        this.reservedMap = Array(this.height).fill().map(() => Array(this.width).fill(-1));

        this.playerID = GameContext.localPlayerID;

        // Cache
        this.cacheCanGoIntoOcean = new Set();
        this.cacheCanGoIntoCoast = new Set();

        // Goody huts
        this.goodyHuts = new Set();
        this.initGoodyHutData();

        // Track what natural wonders we've found
        this.foundNaturalWonders = new Set();
        
        ExplorationManager.instance = this;
    }

    static getInstance() {
        if (!ExplorationManager.instance) {
            ExplorationManager.instance = new ExplorationManager();
        }
        return ExplorationManager.instance;
    }

    addExplorer(unit) {
        const jUnitID = this.unitToJUnitID(unit);
        this.autoExploringUnits.add(jUnitID);
        this.update(); // @TODO dont do a full update here, just do the portion needed for explorer
    }

    /**
     * Remove a unit from the exploration manager.
     * This doesn't necessarily mean the unit is deleted, it just means it's no longer auto exploring.
     */
    removeExplorer(unit) {
        let jUnitID = unit;
        if (unit.id != undefined) {
            jUnitID = this.unitToJUnitID(unit);
        }
        
        this.autoExploringUnits.delete(jUnitID);
        this.targetAssignments.delete(jUnitID);
    }

    startAutoExplore(unit) {
        if (!ExplorationManager.isReady) return;

        this.autoExploringUnits.add(this.unitToJUnitID(unit));
        this.addExplorer(unit);
        console.error(`Auto-explore started for unit ${this.unitToJUnitID(unit)}`);
    }

    stopAutoExplore(unit) {
        if (!ExplorationManager.isReady) return;

        const unitID = this.unitToJUnitID(unit);
        this.autoExploringUnits.delete(unitID);
        this.removeExplorer(unit);
        console.error(`Auto-explore stopped for unit ${unitID}`);
        Game.UnitCommands?.sendRequest(unit.id, "UNITCOMMAND_CANCEL", {});
        this.moveUnitTo(unit, unit.location);
        
    }

    unitToJUnitID(unit) {
        return `${unit.id.owner},${unit.id.id},${unit.id.type}`;
    }

    jUnitIDToUnit(jUnitID) {
        const parts = jUnitID.split(',');
        const id = {
            owner: parseInt(parts[0]),
            id: parseInt(parts[1]),
            type: parseInt(parts[2])
        }
        return Units.get(id);
    }

    isAutoExploring(unit) {
        if (!ExplorationManager.isReady) return false;

        return this.autoExploringUnits.has(this.unitToJUnitID(unit));
    }

    /**
     * Get the best target for a unit
     */
    getBestTarget(unit) {
        if (!unit) {
            console.error("ERR [getBestTarget]: unit is undefined");
            return;
        }

        let bestTarget = {x: -9999, y: -9999};
        let highestWeight = -Infinity;

        var grid = this.createWeightedGrid(unit);

        // debug @TODO remove
        // print the grid
        // console.error("----- GRID -----");
        // for (let y = 0; y < grid.length; y++) {
        //     let row = []
        //     for (let x = 0; x < grid[0].length; x++) {
        //         const loc = this.getMapLocationFromGridLocation(x, y, grid, unit);
        //         row.push(`(x=${loc.x}, y=${loc.y}) ${grid[y][x]}`)
        //     }
        //     console.error(row.join(', '));
        // }

        // Search the grid for the best weight
        for (let tx = 0; tx < grid[0].length; tx++) {
            for (let ty = 0; ty < grid.length; ty++) {
                if (grid[ty][tx] > highestWeight) {
                    highestWeight = grid[ty][tx];
                }
            }
        }

        // Multiple tiles may have the same value, so grab all of them and select one
        const options = [];
        for (let tx = 0; tx < grid[0].length; tx++) {
            for (let ty = 0; ty < grid.length; ty++) {
                if (grid[ty][tx] == highestWeight) {
                    options.push(this.getMapLocationFromGridLocation(tx, ty, grid, unit));
                }
            }
        }

        bestTarget = this.handleMultipleTargets(unit, options);

        if (bestTarget.x == -9999 && bestTarget.y == -9999) {
            console.error("ERR [getBestTarget]: no target found! This shouldn't happen...");
        }
        return bestTarget;
    }

    /**
     * Handle multiple targets based on the settings
     */
    handleMultipleTargets(unit, targets) {
        if (targets.length == 1) return targets[0];

        if (Settings.HANDLE_TIES == "random") {
            const idx = Math.floor(Math.random() * targets.length);
            return targets[idx];
        } else if (Settings.HANDLE_TIES == "first") {
            return targets[0];
        } else if (Settings.HANDLE_TIES == "last") {
            return targets[targets.length - 1];
        } else if (Settings.HANDLE_TIES == "closest" || Settings.HANDLE_TIES == "furthest") {
            let closestDist = Infinity;
            let furthestDist = -Infinity;
            let distTargets = [];
            for (let target of targets) {
                // Don't consider the current location
                if (target.x == unit.location.x && target.y == unit.location.y) {
                    continue;
                }

                const dist = Math.round(Math.sqrt((target.x - unit.location.x) ** 2 + (target.y - unit.location.y) ** 2));
                if (dist < closestDist) {
                    closestDist = dist;
                }
                if (dist > furthestDist) {
                    furthestDist = dist;
                }
            }

            // Find targets that match our distance
            for (let target of targets) {
                const dist = Math.round(Math.sqrt((target.x - unit.location.x) ** 2 + (target.y - unit.location.y) ** 2));
                if ((Settings.HANDLE_TIES == "closest" && dist == closestDist) || 
                    (Settings.HANDLE_TIES == "furthest" && dist == furthestDist)) {
                    distTargets.push(target);
                }
            }
            
            // Randomly choose one of the targets matching our distance
            const idx = Math.floor(Math.random() * distTargets.length);
            return distTargets[idx];
        } else {
            console.error(`ERR [handleMultipleTargets]: invalid setting ${Settings.HANDLE_TIES}`);
            return targets[0];
        }
    }

    /**
     * Updates the revealed map
     */
    updateRevealedMap() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                try {
                    this.revealedMap[y][x] = GameplayMap.getRevealedState(this.playerID, x, y);
                } catch (error) {
                    continue;
                    // ignore - sometimes the map isn't fully loaded yet
                }
            }
        }
    }

    clearReservedMap() {
        this.reservedMap = Array(this.height).fill().map(() => Array(this.width).fill(-1));
    }

    /**
     * Get a priority for a unit to move to a tile
     */
    getTilePriority(unit, tile) {
        if (tile.x == unit.location.x && tile.y == unit.location.y) {
            return {
                weight: Settings.WEIGHT_STARTING_LOCATION,
                hostileFound: false
            }
        }

        const ownerId = GameplayMap.getOwner(tile.x, tile.y);
        let hostileFound = false;

        let weight = 0;
        if (this.revealedMap[tile.y][tile.x] == 0) {
            weight += Settings.WEIGHT_UNEXPLORED_TILES;
        }
        if (!this.foundNaturalWonders.has(GameplayMap.getFeatureType(tile.x, tile.y))
            && GameplayMap.isNaturalWonder(tile.x, tile.y)
        ) {
            weight += Settings.WEIGHT_UNEXPLORED_WONDERS;
        }
        if (this.reservedMap[tile.y][tile.x] != -1) {
            weight += Settings.WEIGHT_FOLLOW_UNITS;
        }
        if (this.isHostileOnTile(tile)) {
            weight += Settings.WEIGHT_HOSTILE;
            hostileFound = true;
        }
        if (this.goodyHuts.has(`${tile.x},${tile.y}`)) {
            weight += Settings.WEIGHT_GOODY_HUTS;
        }
        // Someone owns this land, and it ain't us.
        if (ownerId != -1 // -1 means no one owns it
            && ownerId != this.playerID 
            && Players.get(ownerId).name != "LOC_CIVILIZATION_NONE_NAME" // Goody huts are "owned" but by "NONE"
        ) {
            const remainingTurns = this.getTurnsRemainingWithOpenBorders(ownerId);
            if (remainingTurns == -1) {
                weight += -Infinity; // Can't get there since we don't have open borders
            } else if (Settings.MIN_OPEN_BORDER_TURNS_REMAINING != -1 && remainingTurns < remainingTurns) {
                weight += Settings.WEIGHT_EXPIRING_OPEN_BORDERS;
            }
        }

        return {
            weight: weight + this.getWaterPenalty(unit, tile),
            hostileFound: hostileFound
        }
    }

    /**
     * Gets the number of turns remaining for open borders with a player.
     * returns -1 if you don't have open borders with the player
     */
    getTurnsRemainingWithOpenBorders(pid) {
        const turn = Game.turn;
        for (let event of Game.Diplomacy.getPlayerEvents(this.playerID)) {
            if (event.targetPlayer != pid) continue;

            if (event.name == "LOC_DIPLOMACY_PROJECT_OPEN_BORDERS_NAME" && 
                event.responseType == DiplomaticResponseTypes.DIPLOMACY_RESPONSE_ACCEPT) {
                    const endTurn = event.gameTurnStart + event.completionScore;
                    return endTurn - turn;
            }
        }
        return -1;
    }



    /**
     * Checks if there is a hostile unit on the tile
     */
    isHostileOnTile(tile) {
        const unitIds = MapUnits.getUnits(tile.x, tile.y);
        for (let unitId of unitIds) {
            const pid = unitId.owner;
            var hostility;
            // Handle independent powers
            if (Players.get(pid).isIndependent) {
                hostility = Game.IndependentPowers.getIndependentHostility(pid, this.playerID);
            }
            else {
                hostility = Players.get(this.playerID).Diplomacy.getRelationshipLevelName(pid);
            }
            if (hostility.includes("HOSTILE")) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get all the paths to all tiles in a radius around the unit
     */
    getPathsToAllTiles(unit) {
        const unitPos = unit.location;
        const paths = [];
    
        for (let dx = -Settings.EXPLORATION_RADIUS; dx <= Settings.EXPLORATION_RADIUS; dx++) {
            for (let dy = -Settings.EXPLORATION_RADIUS; dy <= Settings.EXPLORATION_RADIUS; dy++) {
                const x = (unitPos.x + dx + this.width) % this.width;
                const y = (unitPos.y + dy + this.height) % this.height;
                const tile = { x, y };
    
                const result = Units.getPathTo(unit.id, tile);
                if (result && result.plots.length > 0) {
                    paths.push(result);
                }
            }
        }
    
        return paths;
    }

    /**
     * Get the (x, y) coordinate within the grid that represents the tile.
     * 
     * This is needed as the game map has (0,0) as the bottom left, but 2d arrays are top left.
     * @NOTE map coordinates would be indexed as (y, x) in a 2d array since it's row major
     */
    getXY(tile, unit, grid) {
        const dx = tile.x - unit.location.x + Settings.EXPLORATION_RADIUS;
        const dy = grid[0].length - 1 - (tile.y - unit.location.y + Settings.EXPLORATION_RADIUS);
        return { x: dx, y: dy };
    }

    /**
     * Get the map location from the grid location
     */
    getMapLocationFromGridLocation(x, y, grid, unit) {
        const mapX = (unit.location.x + x - Settings.EXPLORATION_RADIUS + this.width) % this.width;
        const mapY = (
            unit.location.y               // base unit location
            + grid[0].length - 1 - y      // offset into the grid from the bottom of it
            - Settings.EXPLORATION_RADIUS // offset from the center of the grid
            + this.height) % this.height; // rollover
        return { x: mapX, y: mapY };
    }
    /**
     * Get the updated path weights for a unit
     */
    getUpdatedPathWeights(unit, grid, paths) {
        const weights = Array(Settings.EXPLORATION_RADIUS * 2 + 1).fill().map(() => Array(Settings.EXPLORATION_RADIUS * 2 + 1).fill(-Infinity));

        // Get the set of all plot numbers within the radius
        const allowablePlots = new Set();
        for (let dx = -Settings.EXPLORATION_RADIUS; dx <= Settings.EXPLORATION_RADIUS; dx++) {
            for (let dy = -Settings.EXPLORATION_RADIUS; dy <= Settings.EXPLORATION_RADIUS; dy++) {
                const x = (unit.location.x + dx + this.width) % this.width;
                const y = (unit.location.y + dy + this.height) % this.height;
                allowablePlots.add(GameplayMap.getIndexFromLocation({x, y}));
            }
        }

        // Force the weight where the unit is to 0
        grid[Settings.EXPLORATION_RADIUS][Settings.EXPLORATION_RADIUS] = 0;

        // For each path, calculate a weighted sum of the path
        for (let path of paths) {
            let weight = 0; // Weight of the path
            var valid = true;

            for (let i = 0; i < path.plots.length; i++) {
                const plot = path.plots[i];
                // Some paths might attempt to go outside the radius, which we don't want since we won't have those weights
                if (!allowablePlots.has(plot)) {
                    valid = false;
                    break;
                }

                const turn = path.turns[i];
                const location = GameplayMap.getLocationFromIndex(plot);
                const gxy = this.getXY(location, unit, grid);
                weight += grid[gxy.y][gxy.x] * (0.95 ** turn);
            }

            if (!valid) continue;

            // If the path is better than the current weight, update the weight
            const updateLocation = GameplayMap.getLocationFromIndex(path.plots[path.plots.length - 1]);
            const updateLoc = this.getXY(updateLocation, unit, grid);
            if (weight > weights[updateLoc.y][updateLoc.x]) {
                weights[updateLoc.y][updateLoc.x] = weight;
            }
        }

        return weights;
    }

    /**
     * Update surrounding locations of the grid with the minimum of the old weight and weight
     */
    updateSurroundingXY(grid, location, weight, radius) {
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const gx = dx + location.x;
                const gy = dy + location.y;
                if (gx >= 0 && gx < grid[0].length && gy >= 0 && gy < grid.length) {
                    grid[gy][gx] = Math.min(weight, grid[gy][gx]);
                }
            }
        }
    }

    /**
     * Creates a 2d grid of weights in a radius representing priority for a unit to explore
     */
    createWeightedGrid(unit) {
        const grid = Array(Settings.EXPLORATION_RADIUS * 2 + 1).fill().map(() => Array(Settings.EXPLORATION_RADIUS * 2 + 1).fill(Infinity));
        const unitPos = unit.location;
        const gridHeight = grid[0].length - 1;

        // Step 1. Create a weighted grid of the radius around the unit (2r + 1, 2r + 1)
        for (let dx = -Settings.EXPLORATION_RADIUS; dx <= Settings.EXPLORATION_RADIUS; dx++) {
            for (let dy = -Settings.EXPLORATION_RADIUS; dy <= Settings.EXPLORATION_RADIUS; dy++) {
                const tx = (unitPos.x + dx + this.width) % this.width;
                const ty = (unitPos.y + dy + this.height) % this.height;
                const gx = dx + Settings.EXPLORATION_RADIUS;
                const gy = gridHeight - (dy + Settings.EXPLORATION_RADIUS);
                const tile = {x: tx, y: ty };
    
                // Assign weights based on various factors
                const priority = this.getTilePriority(unit, tile);

                // @TODO remove - debug
                // console.error(`tile priority at (x=${tx}, y=${ty}): ${priority.weight}`);

                grid[gy][gx] = Math.min(priority.weight, grid[gy][gx]);
                if (priority.hostileFound && Settings.UPDATE_HOSTILE_RADIUS > 0) {
                    this.updateSurroundingXY(grid, {x: gx, y: gy}, Settings.WEIGHT_HOSTILE, Settings.UPDATE_HOSTILE_RADIUS);
                }
            }
        }

        // Step 2. Get all the paths to all the tiles in the radius
        const paths = this.getPathsToAllTiles(unit);

        // Step 3. Update path weights
        const weights = this.getUpdatedPathWeights(unit, grid, paths);

        return weights;
    }


    /**
     * Get water penalty for a unit moving to a destination
     */
    getWaterPenalty(unit, dest) {
        const jUnitID = this.unitToJUnitID(unit);
        const canGoIntoOcean = this.cacheCanGoIntoOcean.has(jUnitID);
        const canGoIntoCoast = this.cacheCanGoIntoCoast.has(jUnitID);

        const terrainAtDest = GameplayMap.getTerrainType(dest.x, dest.y);
        if (!canGoIntoCoast) {
            if (terrainAtDest == map_globals.g_CoastTerrain || terrainAtDest == map_globals.g_OceanTerrain) {
                return -Infinity;
            }
        }

        if (!canGoIntoOcean) {
            if (terrainAtDest == map_globals.g_OceanTerrain) {
                return -Infinity;
            }
        }

        return 0;
    }

    /**
     * Determines if a unit can go into the coast
     */
    canGoIntoCoast(unit) {
        // If the unit is of the sea then it can go into the coast
        const unitDef = GameInfo.Units.lookup(unit.type);
        if (unitDef.Domain == "DOMAIN_SEA") {
            return true;
        }

        // Check antiquity age + sailing completed
        if (Game.age == Database.makeHash('AGE_ANTIQUITY')) {
            let player = Players.get(this.playerID);
            let playerTechs = player.Techs;
            if (playerTechs?.isNodeUnlocked("NODE_TECH_AQ_SAILING")) {
                return true;
            }
            return false;
        }

        // If exploration age or modern age then it can go into the coast
        if (Game.age == Database.makeHash('AGE_EXPLORATION') || Game.age == Database.makeHash('AGE_MODERN')) {
            return true;
        }

        console.error("ERR [canGoIntoCoast]: did not expect to get here");
        return false;
    }

    /**
     * Determines if a unit can go into the open ocean
     */
    canGoIntoOcean(unit) {
        const unitDef = GameInfo.Units.lookup(unit.type);
        let player = Players.get(this.playerID);
        let playerTechs = player.Techs;
        // Check if the unit is a sea unit and the age is exploration
        if (unitDef.Domain == "DOMAIN_SEA" && Game.age == Database.makeHash('AGE_EXPLORATION')) {
            
            // If cartography is unlocked then the unit can go into the ocean, otherwise see if the setting is enabled
            if (playerTechs?.isNodeUnlocked("NODE_TECH_EX_CARTOGRAPHY")) {
                return true;
            } else {
                return !Settings.WAIT_FOR_SAFE_OCEAN_EXPLORATION;
            }
        }
        // Land units can only go into ocean during the exploration age if cartography is unlocked
        else if (unitDef.Domain == "DOMAIN_LAND" && Game.age == Database.makeHash('AGE_EXPLORATION')) {
            if (playerTechs?.isNodeUnlocked("NODE_TECH_EX_CARTOGRAPHY")) {
                return true;
            } else {
                return false;
            }
        }
        // Do whatever you want - you got wings
        else if (unitDef.Domain == "DOMAIN_AIR") {
            return true;
        }
        // Can do whatever you want in the modern age
        else if (Game.age == Database.makeHash('AGE_MODERN')) {
            return true;
        }
        // Can't go into the ocean if you're antiquity
        else if (Game.age == Database.makeHash('AGE_ANTIQUITY')) {
            return false;
        }

        console.error('ERR [canGoIntoOcean]: did not expect to get here');
        return false;
    }

    /**
     * Assigns exploration targets to units
     */
    assignExplorationTargets() {
        for (let jUnitID of this.autoExploringUnits) {
            const unit = this.jUnitIDToUnit(jUnitID);
            const target = this.getBestTarget(unit);
            this.targetAssignments.set(jUnitID, target);

            // Now that the unit has a valid target, get the path to it
            var path = []
            const result = Units.getPathTo(unit.id, target);
            if (result && result.plots.length > 0) {
                for (let plot of result.plots) {
                    path.push(GameplayMap.getLocationFromIndex(plot));
                }
                
                this.reservePath(unit.id, path, Settings.RESERVE_PATH_USE_SIGHT_RANGE);
            }
        }
    }



    /**
     * Move a unit to a specified target
     */
    moveUnitTo(unit, target) {
        if (!unit) {
            console.error("moveUnitTo: unit is undefined");
            return;
        }

        const parameters = {
            X: target.x,
            Y: target.y,
        }

        WorldInput.requestMoveOperation(unit.id, parameters);
    }

    /**
     * Move units to their assigned targets
     */
    moveUnits() {
        for (let [jUnitID, target] of this.targetAssignments) {
            const unit = this.jUnitIDToUnit(jUnitID);
            this.moveUnitTo(unit, target);
        }
    }

    /**
     * Update the reserved map with the path the unit is taking
     */
    reservePath(unitID, path, includeSightRange = false) {
        if (includeSightRange) {
            const sightRange = this.getSightRange(Units.get(unitID));
            for (let plot of path) {
                for (let dx = -sightRange; dx <= sightRange; dx++) {
                    for (let dy = -sightRange; dy <= sightRange; dy++) {
                        let tx = (plot.x + dx + this.width) % this.width;
                        let ty = (plot.y + dy + this.height) % this.height;
                        this.reservedMap[ty][tx] = unitID;
                    }
                }
            }
        } else {
            for (let plot of path) {
                this.reservedMap[plot.y][plot.x] = unitID;
            }
        }
    }

    /**
     * Verify that units still exist. It's possible they get deleted/killed.
     * This should be able to be done through engine.on() events but I'm doing it here.
     */
    verifyUnitsExist() {
        var markForRemoval = [];
        for (let jUnitID of this.autoExploringUnits) {
            const unit = this.jUnitIDToUnit(jUnitID);
            if (!unit) {
                markForRemoval.push(jUnitID);
            }
        }

        for (let jUnitID of markForRemoval) {
            this.removeExplorer(jUnitID);
        }
    }

    /**
     * Update the cache for units that can go into the ocean and coast
     */
    updateCache() {
        this.cacheCanGoIntoCoast.clear();
        this.cacheCanGoIntoOcean.clear();

        for (let jUnitID of this.autoExploringUnits) {
            const unit = this.jUnitIDToUnit(jUnitID);
            if (unit) {
                if (this.canGoIntoOcean(unit)) this.cacheCanGoIntoOcean.add(jUnitID);
                if (this.canGoIntoCoast(unit)) this.cacheCanGoIntoCoast.add(jUnitID);
            } else {
                console.error(`ERR [updateCache]: unit ${jUnitID} is undefined`);
            }
        }
    }

    /**
     * Main update method - to be called every turn
     */
    update() {
        if (!ExplorationManager.isReady) return;

        this.verifyUnitsExist();
        this.clearReservedMap();
        this.updateRevealedMap();
        this.updateCache();
        this.assignExplorationTargets();
        this.moveUnits();
    }

    updateFoundNaturalWonders(x, y) {
        const featureType = GameplayMap.getFeatureType(x, y);
        this.foundNaturalWonders.add(featureType);
    }

    // Init the locations of all the goody huts
    initGoodyHutData() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const constructibles = MapConstructibles.getConstructibles(x, y);
                for (const constructible of constructibles) {
                    const instance = Constructibles.getByComponentID(constructible);
                    if (instance) {
                        const info = GameInfo.Constructibles.lookup(instance.type);
                        if ((info) && (info.ConstructibleClass == "IMPROVEMENT") && info.Discovery) {
                            this.goodyHuts.add(`${x},${y}`);
                        }
                    }
                }
            }
        }
    }
}




// =========================================
// Engine events
// =========================================

engine.whenReady.then(() => {
    // Override the Game.UnitOperations.canStart and Game.UnitOperations.sendRequest
    const originalCanStart = Game.UnitOperations?.canStart;
    Game.UnitOperations.canStart = function(unitID, operationType, parameters, returnResult=false) {
        const unit = Units.get(unitID);
        const manager = ExplorationManager.getInstance();
        const isAutoExploring = manager.isAutoExploring(unit);
        const isEnabled = Players.get(GameContext.localPlayerID).isTurnActive;

        if (operationType === "C_UNITCOMMAND_AUTO_EXPLORE") {
            if (returnResult) {
                return { Success: !isAutoExploring }; 
            } else {
                return { Success: isEnabled };
            }
        } else if (operationType === "C_UNITCOMMAND_STOP_AUTO_EXPLORE") {
            if (returnResult) {
                return { Success: isAutoExploring }; 
            } else {
                return { Success: isEnabled };
            }
        } else {
            // Call the original function
            return originalCanStart?.call(Game.UnitOperations, unitID, operationType, parameters, returnResult);
        }
    };

    const originalSendRequest = Game.UnitOperations?.sendRequest;
    Game.UnitOperations.sendRequest = function(unitID, operationType, parameters) {
        if (operationType === "C_UNITCOMMAND_AUTO_EXPLORE") {
            const unit = Units.get(unitID);
            const manager = ExplorationManager.getInstance();
            manager.startAutoExplore(unit);
        } else if (operationType === "C_UNITCOMMAND_STOP_AUTO_EXPLORE") {
            const unit = Units.get(unitID);
            const manager = ExplorationManager.getInstance();
            manager.stopAutoExplore(unit);
        } else {
            // Call the original function
            originalSendRequest?.call(Game.UnitOperations, unitID, operationType, parameters);
        }
    };


});

// @TODO update the below to be a part of the main class

engine.on('NaturalWonderRevealed', (u) => {
    const manager = ExplorationManager.getInstance();
    manager.updateFoundNaturalWonders(u.location.x, u.location.y);
});

engine.on('LocalPlayerTurnBegin', () => {
    ExplorationManager.isReady = true;
    if (Settings.DEBUG_LOG) {
        const manager = ExplorationManager.getInstance();
        for (let jUnitID of manager.autoExploringUnits) {
            if (!manager.targetAssignments.has(jUnitID)) {
                console.error(`ERR [LocalPlayerTurnBegin]: unit ${jUnitID} is auto-exploring but has no target assignment`);
            }
        }
        for (let jUnitID of manager.targetAssignments.keys()) {
            if (!manager.autoExploringUnits.has(jUnitID)) {
                console.error(`ERR [LocalPlayerTurnBegin]: unit ${jUnitID} has a target assignment but is not auto-exploring`);
            }
        }
    }
    ExplorationManager.getInstance().update();
});

// Handle constructibles removed. Needed for goody huts
engine.on('ConstructibleRemovedFromMap', (c) => {
    const ctype = c.constructibleType;
    const info = GameInfo.Constructibles.lookup(ctype);

    if (info && info.Discovery && info.ConstructibleClass == "IMPROVEMENT") {
        const key = `${c.location.x},${c.location.y}`;
        const manager = ExplorationManager.getInstance();
        manager.goodyHuts.delete(key);
    }
});

// engine.on('PlotVisibilityChanged', (plot) => {
    
//     const x = plot.location.x;
//     const y = plot.location.y;
//     console.error(`changing visibility at x=${x}, y=${y} to ${plot.visibility}`);
//     ExplorationManager.getInstance().revealedMap[y][x] = plot.visibility

// });

//# sourceMappingURL=file:///base-standard/ui/auto-explore/exploration-manager.js.map