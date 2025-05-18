import UpdateGate from '/core/ui/utilities/utilities-update-gate.js';
import { sortAttribute, sortMultiple } from './unit-management-helpers.js';

class UnitManagementModel {
    constructor() {
        this.updateGate = new UpdateGate(() => { this.update(); });
        this._localPlayer = null;
    }
    contructor() {
        this.updateGate.call('constructor');
    }
    update() {
        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) {
            console.error(`model-unlocks: Failed to retrieve PlayerLibrary for Player ${GameContext.localPlayerID}`);
            return [];
        }
        this._localPlayer = localPlayer;
        if (this.onUpdate) {
            this.onUpdate(this);
        }
        return;
    }
    get localPlayer() {
        return this._localPlayer;
    }
    set updateCallback(callback) {
        this.onUpdate = callback;
    }

    getPlayerUnits() {
        const localPlayer = Players.get(GameContext.localPlayerID);
        const armies = localPlayer?.Units?.getUnits();
        const units = [];
        armies?.forEach(unit => {
            const reinforcementCommanderId = localPlayer.Armies?.getUnitReinforcementCommanderId(unit.id, GameContext.localPlayerID);
            const playerUnit = this.buildUnit(unit);
            if (unit.isCommanderUnit) {
                    playerUnit.packedUnits = this.getPackedUnits(playerUnit);
                    units.push(playerUnit);
            } else {
                if ((playerUnit.armyId.id == -1 && reinforcementCommanderId == -1) || (playerUnit.coreClass == 'CORE_CLASS_CIVILIAN') || playerUnit.coreClass == 'CORE_CLASS_RELIGIOUS') {
                    units.push(playerUnit);
                }
            }
        })

        return units.sort(sortMultiple('-isCommander', 'name','-experience.level'));
    }

    getPackedUnits(commander) {
        const localPlayer = Players.get(GameContext.localPlayerID);
        const armies = localPlayer?.Units?.getUnits();
        const units = [];
        armies?.forEach(unit => {
            const reinforcementCommanderId = localPlayer.Armies?.getUnitReinforcementCommanderId(unit.id, GameContext.localPlayerID);

            if (!unit.isCommanderUnit && (unit.armyId.id == commander.armyId.id || reinforcementCommanderId == commander.id.id)) {
                const playerUnit = this.buildUnit(unit);
                if (playerUnit) {
                    units.push(playerUnit);
                }
            }
        })

        return units.sort(sortAttribute('name'));
    }

    buildUnit(unit) {
        const localPlayer = Players.get(GameContext.localPlayerID);
        const unitInfo = GameInfo.Units.lookup(unit.type);

        // Unit Promotions and Upgrades Available
        const upgradeAvailable = Game.UnitCommands?.canStart(unit.id, 'UNITCOMMAND_UPGRADE', { X: -9999, Y: -9999 } , true);
        const promotionAvailable = ((unit.Experience?.getStoredPromotionPoints > 0 || unit.Experience?.getStoredCommendations > 0) ? true : false);

        // Unit Operations
        const unitOperation = GameInfo.UnitOperations.lookup(unit.getOperationType(0));

        // Reinforcement Units
        const reinforcementTurns = localPlayer.Armies.getUnitReinforcementETA(unit.id, GameContext.localPlayerID);
        const reinforcementCommanderId = localPlayer.Armies?.getUnitReinforcementCommanderId(unit.id, GameContext.localPlayerID);

        // Army ID
        var packedUnitCommanderId = {
            'owner': -1,
            'id': -1,
            'type': 0
        };
        var packedUnitArmyLocation = { X: -9999, Y: -9999 };
        var commanderToLookup = -1;
        if (reinforcementCommanderId != -1) {
            commanderToLookup = reinforcementCommanderId;
        } else {
            if (unit.armyId?.id != -1) {
                commanderToLookup = unit.armyId?.id;
            }
        }
        if (commanderToLookup != -1) {
            const packedArmy = localPlayer?.Units?.getUnits().find(c => { return c.armyId.id == commanderToLookup && c.isCommanderUnit; });
            if (packedArmy) {
                packedUnitCommanderId = packedArmy.id;
                // Army Location
                packedUnitArmyLocation = packedArmy.location;
             }
        }

        if (unitInfo) {
            const playerUnit = {
                id: unit.id,
                armyId: unit.armyId,
                armyLocation: packedUnitArmyLocation,
                commanderId: packedUnitCommanderId,
                isCommander: unit.isCommanderUnit,
                health: unit.Health,
                experience: {
                    level: unit.Experience?.getLevel || 1,
                    canEarn: unit.Experience?.canEarnExperience, 
                    currentExpPoints: unit.Experience?.experiencePoints,
                    expPointsToLevel: unit.Experience?.experienceToNextLevel,
                    promotionAvailable: ((upgradeAvailable.Success || promotionAvailable) ? true : false)
                },
                name: unit.name,
                unitTypeName: unitInfo.Name,
                type: unitInfo.UnitType,
                movementClass: unitInfo.UnitMovementClass,
                coreClass: unitInfo.CoreClass,
                movementRealm: 'Land',
                location: unit.location,
                activityId: unit.activityType,
                hasPendingOperations: unit.hasPendingOperations,
                operationType: unitOperation,
                operationTurns: reinforcementTurns,
                religionType: unit.Religion.religionType,
                spreadCharges: unit.Religion.spreadCharges,
                packedUnits: []
            };

            //To account for some inconsistencies in categorization
            switch (unitInfo.UnitMovementClass) {                
                case 'UNIT_MOVEMENT_CLASS_AIR':
                    playerUnit.movementRealm = 'Air';
                    break;
                case 'UNIT_MOVEMENT_CLASS_NAVAL':
                    playerUnit.movementRealm = 'Naval';
                    break;
                case 'NO_UNIT_MOVEMENT_CLASS':
                    if (playerUnit.type == 'UNIT_AERODROME_COMMANDER') {
                        playerUnit.movementRealm = 'Air';
                    }
                    break;
                default:
                    if (playerUnit.type == 'UNIT_SQUADRON_COMMANDER') {
                        playerUnit.movementRealm = 'Air';
                        break;
                    }

                    playerUnit.movementRealm = 'Land';
                    break;
            }

            //Changing some values to fit within the "Military, Religious, Civilian" model
            switch (unitInfo.CoreClass) {
                case 'CORE_CLASS_CIVILIAN':
                    if (playerUnit.type == 'UNIT_AERODROME_COMMANDER') {
                        playerUnit.coreClass = 'CORE_CLASS_MILITARY';
                    }   
                    if (playerUnit.religionType != -1) {
                        playerUnit.coreClass = 'CORE_CLASS_RELIGIOUS';
                    }
                    break;
                case 'CORE_CLASS_RECON':
                    playerUnit.coreClass = 'CORE_CLASS_MILITARY';
                    break;
                case 'CORE_CLASS_MILITARY':
                    if (unitInfo.UnitType == 'UNIT_GREAT_MERCHANT') {
                        playerUnit.coreClass = 'CORE_CLASS_CIVILIAN';
                    }
                    break;
                case 'CORE_CLASS_SUPPORT':
                    if (unitInfo.FormationClass == 'FORMATION_CLASS_COMMAND' && unitInfo.UnitType != 'UNIT_TREASURE_FLEET_SMALL') {
                        playerUnit.coreClass = 'CORE_CLASS_MILITARY';
                        break;
                    }
                    if (unitInfo.UnitType == 'UNIT_TREASURE_FLEET_SMALL') {
                        playerUnit.coreClass = 'CORE_CLASS_CIVILIAN';
                        break;
                    }

                    playerUnit.coreClass = 'CORE_CLASS_CIVILIAN';
                    break;
                default:
                    break;
            }

            return (playerUnit);
        }
    }
}


const UnitManagement = new UnitManagementModel();
engine.whenReady.then(() => {
    const updateModel = () => {
        engine.updateWholeModel(UnitManagement);
    };
    engine.createJSModel('g_UnitManagementModel', UnitManagement);
    UnitManagement.updateCallback = updateModel;
});
export { UnitManagement as default };

//# sourceMappingURL=file:///game/senzanis_unit_management/ui/unit-management/model-unit-management.js.map
