/**
 * This file controls the settings associated with auto exploration.
 * If you want to see the pseudocode for the algorithm, check out the README.md
 */

// The radius around the unit to consider for exploration.
// This technically makes a square with side length 2*EXPLORATION_RADIUS + 1
// For example, if EXPLORATION_RADIUS = 2, then the square would be 5x5 where the unit is at the center (2,2)
export var EXPLORATION_RADIUS = 5;
// The radius around a hostile unit to also mark with WEIGHT_HOSTILE.
// This will help prevent the unit from going too close to a hostile unit.
// This technically makes a square with side length 2*UPDATE_HOSTILE_RADIUS + 1.
// If you want to disable this, set to -1.
export var UPDATE_HOSTILE_RADIUS = 1;

// Whether or not to wait for it to be safe before exploring the open ocean
// If you're unable to go to the ocean, you simply won't attempt it.
// If you can go into ocean (deep ocean), but it will damage you, this will wait until you're safe.
export var WAIT_FOR_SAFE_OCEAN_EXPLORATION = true;

// Units will only go into territory with players/AI if we have open borders with them.
// Because open borders can expire, we don't want to get stuck.
// This is the minimum number of turns remaining on the open borders agreement before the auto exploring unit
// will consider going into the territory of the player/AI. Once it goes below this threshold, the tiles will be
// marked with WEIGHT_EXPIRING_OPEN_BORDERS.
// If you want to ignore this, set to -1 and it will never consider this.
export var MIN_OPEN_BORDER_TURNS_REMAINING = 4;

// ========================================================
// Weights for determining where a unit should prioritize exploring
// ========================================================
// Weight to give a tile that is unexplored, i.e. still in the fog of war
export var WEIGHT_UNEXPLORED_TILES = 5;
// Weight to give for a tile that has an unexplored wonder on it
export var WEIGHT_UNEXPLORED_WONDERS = 10;
// Weight to give for a tile that has a goody hut
export var WEIGHT_GOODY_HUTS = 100;
// Weight associated with having a unit follow in a path of another
export var WEIGHT_FOLLOW_UNITS = -20; 
// Weight for a tile that has a hostile unit on it. This could be an independent power or, an AI, or another player
export var WEIGHT_HOSTILE = -1000;
// Weight for the starting location of the unit. "You don't have to go home, but you can't stay here"
export var WEIGHT_STARTING_LOCATION = -1000;
// Weight for a tile that is in another civ's territory for which we currently have open borders, but they're soon expiring.
export var WEIGHT_EXPIRING_OPEN_BORDERS = -500;

// Whether or not to account for a units sight range as it reserves a custom path to traverse
// If unit A is marking (5,5) as a tile it will traverse and has a sight range of 1, it would mark the following as well:
// (4,6), (4,5), (4,4), (5,4), (6,4), (6,5), (6,6), (5,6)
export var RESERVE_PATH_USE_SIGHT_RANGE = false;

// How to handle ties when looking for the best tile to explore
// "random" - randomly choose one of the best tiles
// "first" - choose the first tile found
// "last" - choose the last tile found
// "closest" - choose the tile that is closest to the unit - additional ties broken randomly
// "furthest" - choose the tile that is furthest from the unit - additional ties broken randomly
export var HANDLE_TIES = "furthest"; // "random", "first", "last", "closest", "furthest"

export var DEBUG_LOG = true;