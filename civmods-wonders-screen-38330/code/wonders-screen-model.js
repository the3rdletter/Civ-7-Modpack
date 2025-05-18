import { Icon } from '/core/ui/utilities/utilities-image.js';
import { ComponentID } from '/core/ui/utilities/utilities-component-id.js';
import { wondersScreenOptions, WondersModsBuildingInformationType } from '/wonders-screen/code/wonders-screen-options.js';

export class WonderScreenModel {
    constructor() {
        this._availableWonders = [];
        this._completedWonders = new Map();
        this._wondersBuildableByCity = new Map();
        this._wondersInProgress = new Map();
        this._wonderData = [];

        // Model version number for external compatibility such as claimed-wonders-notation mod
        this._version = 2;
    }

    get wonderData() {
        return this._wonderData;
    }

    /**
     * Singleton accessor
     */
    static getInstance() {
        if (!WonderScreenModel._Instance) {
            WonderScreenModel._Instance = new WonderScreenModel();
        }
        return WonderScreenModel._Instance;
    }

    static HasWonder(x, y) {
        const constructibles = MapConstructibles.getConstructibles(x, y);
        for (let i = 0; i < constructibles.length; i++) {
            const constructibleID = constructibles[i];
            const existingConstructible = Constructibles.getByComponentID(constructibleID);

            let constructibleDef = GameInfo.Constructibles.lookup(existingConstructible.type);
            if (constructibleDef != null && constructibleDef.ConstructibleClass == "WONDER") {
                const revealedState = GameplayMap.getRevealedState(GameContext.localPlayerID, x, y);
                return { wonder: constructibleDef.ConstructibleType, complete: existingConstructible.complete, visible: revealedState };
            }
        }

        return null;
    }

    onWonderCompleted(event) {
        const wonder = GameInfo.Wonders.lookup(event.constructibleType);
        const owningCityID = GameplayMap.getOwningCityFromXY(event.location.x, event.location.y);
        const revealedState = GameplayMap.getRevealedState(GameContext.localPlayerID, event.location.x, event.location.y);

        const city = Cities.get(owningCityID);
        const player = Players.get(owningCityID.owner);
        const leaderType = player.leaderType;
        const leader = GameInfo.Leaders.lookup(leaderType);
        const data = { wonder: wonder, city: owningCityID, cityName: city.name, leaderName: leader.Name, owningPlayerId: owningCityID.owner, visible: revealedState };
        this._completedWonders.set(wonder.ConstructibleType, data);
        this._wondersInProgress.delete(wonder.ConstructibleType);
        this._wondersBuildableByCity.delete(wonder.ConstructibleType);
    }

    onConstructibleAddedToMap(event) {
        const constructibleInfo = GameInfo.Constructibles.lookup(event.constructibleType);
        const owningCityID = GameplayMap.getOwningCityFromXY(event.location.x, event.location.y);
        if (constructibleInfo.ConstructibleClass == "WONDER") {
            const revealedState = GameplayMap.getRevealedState(GameContext.localPlayerID, event.location.x, event.location.y);
            const completed = event?.percentComplete ?? 0 == 100;

            const wonder = constructibleInfo.ConstructibleType;
            const city = Cities.get(owningCityID);
            const player = Players.get(owningCityID.owner);
            const leaderType = player.leaderType;
            const leader = GameInfo.Leaders.lookup(leaderType);
            const data = { wonder: wonder, city: owningCityID, cityName: city.name, leaderName: leader.Name, owningPlayerId: owningCityID.owner, visible: revealedState };
            if (!completed) {
                if (!this._wondersInProgress.has(wonder)) {
                    this._wondersInProgress.set(wonder, []);
                }
                this._wondersInProgress.get(wonder).push(data);
            }
            else {
                this._completedWonders.set(wonder, data);
            }
        }
    }

    onConstructibleVisibilityChanged(event) {
        const constructibleInfo = GameInfo.Constructibles.lookup(event.constructibleType);
        if (constructibleInfo.ConstructibleClass == "WONDER") {
            const existingConstructible = Constructibles.getByComponentID(event.constructible);
            if (!existingConstructible) {
                return;
            }
            const revealedState = GameplayMap.getRevealedState(GameContext.localPlayerID, event.location.x, event.location.y);
            if (existingConstructible.complete) {
                let data = this._completedWonders.get(constructibleInfo.ConstructibleType);
                // Use event visibility as getRevealedState doesn't seem to be up to date yet.
                data.visible = event.visibility;
                this._completedWonders.set(constructibleInfo.ConstructibleType, data);
            }
            else {
                let inProgressWonders = this._wondersInProgress.get(constructibleInfo.ConstructibleType);
                const owningCityID = GameplayMap.getOwningCityFromXY(event.location.x, event.location.y);
                for (let i = 0; i < inProgressWonders.length; ++i) {
                    let wonderData = inProgressWonders[i];
                    if (ComponentID.isMatch(wonderData.city, owningCityID)) {
                        if (wonderData.visible != revealedState) {
                            // constructible visiblity changed is also called when placing constructibles
                            // don't needlessly recalc our model if the visibility isn't changing
                            inProgressWonders[i].visible = revealedState;
                            this._wondersInProgress.set(constructibleInfo.ConstructibleType, inProgressWonders);
                        }
                        break;
                    }
                }
            }
        }
    }

    updateBuildableWonders() {
        this._wondersBuildableByCity = new Map();
        const completedWondersData = [...this._completedWonders.values()];
        const incompleteWonders = this._availableWonders.filter(w => !completedWondersData.some(c => c.wonder == w.ConstructibleType));

        const player = Players.get(GameContext.localPlayerID);
        const cities = player.Cities.getCities();

        for (let wonder of incompleteWonders) {
            const wonderType = wonder.ConstructibleType;
            let validCities = [];
            for (let city of cities) {
                const result = Game.CityOperations.canStart(city.id, CityOperationTypes.BUILD, { ConstructibleType: wonder.$index }, true);
                const inProgress = result.InProgress ?? false;
                const success = result.Success ?? false;

                if (success) {
                    const turns = city.BuildQueue.getTurnsLeft(wonderType);
                    const data = { city: city.id, inProgress: inProgress, turns: turns };
                    validCities.push(data);
                }
            }
            this._wondersBuildableByCity.set(wonderType, validCities);
        }
    }

    intializeCompletedWonders() {
        this._completedWonders = new Map();
        this._wondersInProgress = new Map();
        const width = GameplayMap.getGridWidth();
        const height = GameplayMap.getGridHeight();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let wonderInfo = WonderScreenModel.HasWonder(x, y);
                if (wonderInfo != null) {
                    let wonder = wonderInfo.wonder;

                    const owningCityID = GameplayMap.getOwningCityFromXY(x, y);

                    const city = Cities.get(owningCityID);
                    const player = Players.get(owningCityID.owner);
                    const leaderType = player.leaderType;
                    const leader = GameInfo.Leaders.lookup(leaderType);
                    const data = { wonder: wonder, city: owningCityID, cityName: city.name, leaderName: leader.Name, owningPlayerId: owningCityID.owner, visible: wonderInfo.visible };

                    if (wonderInfo.complete) {
                        this._completedWonders.set(wonder, data);
                    }
                    else {
                        if (!this._wondersInProgress.has(wonder)) {
                            this._wondersInProgress.set(wonder, []);
                        }
                        this._wondersInProgress.get(wonder).push(data);
                    }
                }
            }
        }
    }

    initialize() {
        console.log(`wonders-screen: WonderScreenModel::initialize`);
        for (let i = 0; i < GameInfo.Constructibles.length; ++i) {
            if (GameInfo.Constructibles[i].ConstructibleClass == "WONDER") {
                const thisWonder = GameInfo.Constructibles[i];
                this._availableWonders.push(thisWonder);
            }
        }

        this.intializeCompletedWonders();
        this.initializeUnlockData();
        this.updateBuildableWonders();
        this.rebuildWonderData();

        engine.on("WonderCompleted", this.onWonderCompleted, this);
        engine.on('ConstructibleAddedToMap', this.onConstructibleAddedToMap, this);
        engine.on('ConstructibleVisibilityChanged', this.onConstructibleVisibilityChanged, this);
        engine.on('CultureTreeRevealed', this.onCultureTreeRevealed, this);
        // TODO: CityTileOwnershipChanged, CityRemovedFromMap, CityAddedToMap, CityTransfered??
        // Additional events don't seem to be needed as I believe the constructible changes are forcing updates in any relevant cases.

        wondersScreenOptions.addChangeListener(this.onModOptionsChanged, this);
    }

    onCultureTreeRevealed(event) {
        if (event.player == GameContext.localPlayerID) {
            this.initalizeUnlocksForTree(event.tree);
        }
    }

    initalizeUnlocksForTree(tree) {
        const treeObject = Game.ProgressionTrees.getTree(GameContext.localPlayerID, tree);
        for (let eNode of treeObject?.nodes ?? []) {
            const nodeInfo = GameInfo.ProgressionTreeNodes.lookup(eNode.nodeType);
            if (!nodeInfo) {
                continue;
            }
            const nodeData = Game.ProgressionTrees.getNode(GameContext.localPlayerID, eNode.nodeType);
            if (!nodeData) {
                continue;
            }
            const unlockedWonders = this.getUnlockedWonders(nodeData);
            if (unlockedWonders.length > 0) {
                unlockedWonders.forEach(w => {
                    let data = this._availableWonders.find(i => i.ConstructibleType == w.wonder);
                    if (!data.unlocks) {
                        data.unlocks = [];
                    }
                    data.unlocks.push({node: nodeInfo.ProgressionTreeNodeType, depth: w.unlockDepth});

                });
            }
        }
    }

    initializeUnlockData() {
        console.log(`wonders-screen: initalizeUnlockData`);
        const player = Players.get(GameContext.localPlayerID);
        this.initalizeUnlocksForTree(player.Techs.getTreeType());

        const cultureTrees = player.Culture?.getAvailableTrees() ?? [];
        for (let treeType of cultureTrees) {
            this.initalizeUnlocksForTree(treeType);
        }
    }

    getUnlockedWonders(nodeData) {
        let unlockedWonders = [];
        for (let i of nodeData.unlockIndices) {
            const unlockInfo = GameInfo.ProgressionTreeNodeUnlocks[i];
            if (unlockInfo && !unlockInfo.Hidden) {
                if (unlockInfo.TargetKind == "KIND_CONSTRUCTIBLE") {
                    let targetType = unlockInfo.TargetType;
                    const constructibleInfo = GameInfo.Constructibles.lookup(targetType);
                    const buildingInfo = GameInfo.Buildings.lookup(targetType);
                    if (constructibleInfo != null && constructibleInfo.ConstructibleClass == "WONDER") {
                        unlockedWonders.push({wonder: constructibleInfo.ConstructibleType, unlockDepth: unlockInfo.UnlockDepth});
                    }
                }
            }
        }
        return unlockedWonders;
    }

    update() {
        console.log(`wonders-screen: WonderScreenModel::update`);
        // If the game is in an environment where the player cannot interact (e.g., auto-play); early out.
        if ((GameContext.localObserverID == PlayerIds.NO_PLAYER) || (GameContext.localObserverID == PlayerIds.OBSERVER_ID) || Autoplay.isActive) {
            return;
        }

        this.updateBuildableWonders();
        this.rebuildWonderData();
        this.onUpdate(this);
    }

    rebuildWonderData() {
        console.log(`wonders-screen: WonderScreenModel::rebuildWonderData`);
        const localPlayerDiplomacy = Players.get(GameContext.localPlayerID)?.Diplomacy;
        const localPlayer = Players.get(GameContext.localPlayerID);

        this._wonderData = [];
        this._availableWonders.forEach(wonder => {
            let constructibleType = wonder.ConstructibleType;
            let completedData = this._completedWonders.get(wonder.ConstructibleType);
            let completedLeader = completedData?.leaderName ?? null;
            let completedCity = completedData?.cityName ?? null;
            let icon = Icon.getConstructibleIconFromDefinition(wonder);

            let buildableCities = [];
            let constructingCities = [];
            let buildableInfo = this._wondersBuildableByCity.get(constructibleType);
            let isPlayerConstructing = false;
            let isNonPlayerConstructing = false;
            if (buildableInfo) {
                for (let buildableData of buildableInfo) {
                    const turnsIcon = `<img src='fs://game/hud_turn-timer.png' style='margin:-0.2em;height:1rem;width:1rem'/>`;
                    const city = Cities.get(buildableData.city);
                    if (!buildableData.inProgress) {
                        const displayString = `${Locale.compose(city.name)} (${buildableData.turns}${turnsIcon})`;
                        const data = { city: city.name, isTown: city.isTown, turns: buildableData.turns, displayString: displayString };
                        buildableCities.push(data);
                    }
                    else {
                        const player = Players.get(buildableData.city.owner);
                        const localPlayerConstructing = buildableData.city.owner == GameContext.localPlayerID;
                        const leaderType = player.leaderType;
                        const leader = GameInfo.Leaders.lookup(leaderType);

                        const cityStr = localPlayerConstructing ? `${Locale.compose(city.name)} (${Locale.compose('LOC_UI_WONDER_SCREEN_YOU')}) (${buildableData.turns}${turnsIcon})`
                            : `${Locale.compose(city.name)} (${Locale.compose(leader.Name)})`;

                        constructingCities.push(cityStr);

                        if (buildableData.city.owner == GameContext.localPlayerID) {
                            isPlayerConstructing = true;
                        }
                        else {
                            isNonPlayerConstructing = true;
                        }
                    }
                }
            }

            let progressInfo = this._wondersInProgress.get(constructibleType);
            if (progressInfo) {
                for (let buildableData of progressInfo) {
                    const player = Players.get(buildableData.city.owner);
                    const leaderType = player.leaderType;
                    const leader = GameInfo.Leaders.lookup(leaderType);
                    const playerOwned = buildableData.city.owner == GameContext.localPlayerID;
                    const unmetOwner = !playerOwned && !localPlayerDiplomacy.hasMet(buildableData.city.owner);

                    // Filter shown info based on user options
                    const displayInfo = buildableData.visible != RevealedStates.HIDDEN
                        || wondersScreenOptions.BuildingInformationType == WondersModsBuildingInformationType.ALL
                        || (wondersScreenOptions.BuildingInformationType == WondersModsBuildingInformationType.EXCLUDE_UNMET && !unmetOwner);

                    const cityStr = playerOwned ? `${Locale.compose(buildableData.cityName)} (${Locale.compose('LOC_UI_WONDER_SCREEN_YOU')})`
                        : unmetOwner ? Locale.compose('LOC_UI_WONDER_SCREEN_UNMET_CONSTRUCTOR')
                            : `${Locale.compose(buildableData.cityName)} (${Locale.compose(leader.Name)})`;

                    // Player constructing wonders are already captured by the buildable cities check
                    if (displayInfo && buildableData.city.owner != GameContext.localPlayerID) {
                        constructingCities.push(cityStr);
                        isNonPlayerConstructing = true;
                    }
                }
            }


            const ownerId = completedData?.owningPlayerId ?? -1;
            const playerOwned = ownerId == GameContext.localPlayerID;
            const unmetOwner = completedData && !playerOwned && !localPlayerDiplomacy.hasMet(completedData.owningPlayerId);
            const hideCityLocation = completedData?.visible == RevealedStates.HIDDEN;

            const ownerStr = !completedData ? ''
                : playerOwned ? `${Locale.compose('LOC_UI_WONDER_SCREEN_YOU')} (${Locale.compose(completedCity)})`
                : unmetOwner ? Locale.compose('LOC_UI_WONDER_SCREEN_UNMET_OWNER')
                : hideCityLocation ? `${Locale.compose(completedLeader)} (${Locale.compose('LOC_UI_WONDER_SCREEN_UNKNOWN_LOCATION')})`
                : `${Locale.compose(completedLeader)} (${Locale.compose(completedCity)})`;

            const buildableOnlyInTowns = !buildableCities.some(c => !c.isTown) && buildableCities.some(c => c.isTown);

            const wonderAge = wonder.Age;
            const ageDefinition = GameInfo.Ages.lookup(Game.age);
            const previousAge = wonderAge != ageDefinition.AgeType;

            buildableCities.sort((a, b) => a.turns - b.turns);

            const unlocks = wonder.unlocks ?? [];
            let isUnlocked = unlocks.length == 0;
            unlocks.forEach(u => {
                const nodeInfo = GameInfo.ProgressionTreeNodes.lookup(u.node);
                const nodeData = Game.ProgressionTrees.getNode(GameContext.localPlayerID, nodeInfo.$hash);
                if (nodeData.depthUnlocked >= u.depth)
                {
                    isUnlocked = true;
                }
            });

            const orStr = ` ${Locale.compose('LOC_UI_WONDER_SCREEN_REQUIREMENT_OR')} `;
            const requirementsStr = unlocks.map(u => Locale.compose(GameInfo.ProgressionTreeNodes.lookup(u.node).Name) + (u.depth > 1 ? ' II' : '')).join(orStr);
            const unlockStr = Locale.compose('LOC_UI_PRODUCTION_REQUIRES', requirementsStr);

            const data = {
                name: wonder.Name,
                type: constructibleType,
                description: wonder.Description,
                completed: completedData ? true : false,
                owningCity: completedCity,
                owningLeader: completedLeader,
                owningText: ownerStr,
                icon: icon,
                buildableCities: buildableCities,
                buildableOnlyInTowns: buildableOnlyInTowns,
                constructingCities: constructingCities,
                isPlayerConstructing: isPlayerConstructing,
                isNonPlayerConstructing: isNonPlayerConstructing,
                isCompeting: isPlayerConstructing && isNonPlayerConstructing,
                playerOwned: playerOwned,
                previousAge: previousAge,
                unlocks: wonder.unlocks ?? [],
                unlockString: unlockStr,
                isUnlocked: isUnlocked,
            };

            this._wonderData.push(data);
        });

        this._wonderData.sort(WonderScreenModel.wonderDataSorter);
    }

    static wonderDataSorter(a, b) {
        const aName = Locale.compose(a.name);
        const bName = Locale.compose(b.name);
        return aName.localeCompare(bName);
    }

    set updateCallback(callback) {
        this.onUpdate = callback;
    }

};

const WonderScreenModelInstance = WonderScreenModel.getInstance();
engine.whenReady.then(() => {
    WonderScreenModel.getInstance().initialize();
    const updateModel = () => {
        engine.updateWholeModel(WonderScreenModelInstance);
    };
    engine.createJSModel('g_WondersScreenModel', WonderScreenModelInstance);
    WonderScreenModelInstance.updateCallback = updateModel;
});

export { WonderScreenModelInstance as default };
