import { resolveModifierById } from "../modifiers.js";
import { addYieldsAmount, addYieldsPercentForCitySubject, addYieldTypeAmount, addYieldTypeAmountNoMultiplier } from "./yields.js";
import { computeConstructibleMaintenanceEfficiencyReduction, findCityConstructibles, findCityConstructiblesMatchingAdjacency, getBuildingsCountForModifier, getPlayerBuildingsCountForModifier } from "../game/constructibles.js";
import { getYieldsForAdjacency, getPlotsGrantingAdjacency, AdjancenciesCache } from "../game/adjacency.js";
import { retrieveUnitTypesMaintenance, isUnitTypeInfoTargetOfArguments, getArmyCommanders } from "../game/units.js";
import { getCityAssignedResourcesCount, getCityGreatWorksCount, getCitySpecialistsCount, getCityYieldHappiness } from "../game/city.js";
import { calculateMaintenanceEfficiencyToReduction, parseArgumentsArray } from "../game/helpers.js";
import { resolveSubjectsWithRequirements } from "../requirements/resolve-subjects.js";
import { getPlayerActiveTraditionsForModifier, getPlayerCityStatesSuzerain, getPlayerCompletedMasteries, getPlayerOngoingDiplomacyActions, getPlayerRelationshipsCountForModifier } from "../game/player.js";
import { findCityConstructiblesMatchingWarehouse, getYieldsForWarehouseChange } from "../game/warehouse.js";
import { PolicyYieldsContext } from "../core/execution-context.js";
import { assertSubjectCity, assertSubjectPlayer, assertSubjectPlot, assertSubjectUnit } from "../requirements/assert-subject.js";
import { PolicyYieldsCache } from "../cache.js";

/**
 * @param {PolicyYieldsContext} yieldsContext 
 * @param {Subject[]} subjects 
 * @param {ResolvedModifier} modifier 
 * @returns 
 */
export function applyYieldsForSubjects(yieldsContext, subjects, modifier) {
    subjects.forEach(subject => {
        applyYieldsForSubject(yieldsContext, subject, modifier);
    });
}

/**
 * @param {PolicyYieldsContext} context 
 * @param {Subject} subject
 * @param {ResolvedModifier} modifier
 */
function applyYieldsForSubject(context, subject, modifier) {
    const player = Players.get(GameContext.localPlayerID);

    // We can't apply new-only modifiers here. These are modifiers applied
    // only when the condition is met, dynamically, not constantly.
    // Check `IUS_REFORMANDI` in the Exploration Age
    if (modifier.Modifier.NewOnly) {
        return;
    }

    switch (modifier.EffectType) {
        // ==============================
        // ========== Player ============
        // ==============================
        case "EFFECT_PLAYER_ADJUST_YIELD_PER_ACTIVE_TRADITION": {
            assertSubjectPlayer(subject);
            const count = subject.isEmpty ? 0 : getPlayerActiveTraditionsForModifier(subject.player, modifier);
            return context.addSubjectYieldsTimes(subject, modifier, count);
        }

        case "EFFECT_DIPLOMACY_ADJUST_YIELD_PER_PLAYER_RELATIONSHIP": {
            assertSubjectPlayer(subject);
            const allies = subject.isEmpty ? 0 : getPlayerRelationshipsCountForModifier(subject.player, modifier);
            return context.addSubjectYieldsTimes(subject, modifier, allies);
        }

        // TODO Converts x% of yield from trade route into another yield
        case "EFFECT_MODIFY_PLAYER_TRADE_YIELD_CONVERSION": {
            throw new Error("EFFECT_MODIFY_PLAYER_TRADE_YIELD_CONVERSION not implemented");
            return;
        }

        case "EFFECT_PLAYER_ADJUST_CONSTRUCTIBLE_YIELD": {
            assertSubjectPlayer(subject);
            const buildingsCount = subject.isEmpty ? 0 : getPlayerBuildingsCountForModifier(subject.player, modifier);
            return context.addYieldsAmountTimes(modifier, buildingsCount);
        }

        case "EFFECT_PLAYER_ADJUST_CONSTRUCTIBLE_YIELD_BY_ATTRIBUTE": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const attributePoints = subject.player.Identity?.getSpentAttributePoints(modifier.Arguments.getAsserted('AttributeType')) || 0;
            const buildingsCount = getPlayerBuildingsCountForModifier(subject.player, modifier);
            return context.addYieldsAmountTimes(modifier, attributePoints * buildingsCount);
        }

        case "EFFECT_PLAYER_ADJUST_YIELD_PER_ATTRIBUTE_AND_ALLIANCES": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);
            const attributePoints = subject.player.Identity?.getSpentAttributePoints(modifier.Arguments.getAsserted('AttributeType')) || 0;
            const allPlayers = Players.getAlive();
            const allies = allPlayers.filter(otherPlayer => 
                otherPlayer.isMajor && 
                otherPlayer.id != GameContext.localPlayerID && 
                player.Diplomacy?.hasAllied(otherPlayer.id)
            ).length;
            return context.addYieldsAmountTimes(modifier, attributePoints * allies);
        }

        case "EFFECT_PLAYER_ADJUST_YIELD": {
            assertSubjectPlayer(subject);
            return context.addSubjectYieldsTimes(subject, modifier, subject.isEmpty ? 0 : 1);
        }

        // TODO This is really complex, like "+1 for each time a disaster provided fertility".
        // We'd need to check disasters, not sure how right now.
        case "EFFECT_PLAYER_ADJUST_YIELD_FROM_DISTATERS": {
            throw new Error("EFFECT_PLAYER_ADJUST_YIELD_FROM_DISTATERS not implemented");
            return;
        }

        case "EFFECT_PLAYER_ADJUST_YIELD_PER_NUM_CITIES": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            let numSettlements = 0;
            if (modifier.Arguments.Cities?.Value === 'true') numSettlements += player.Stats.numCities;            
            if (modifier.Arguments.Towns?.Value === 'true') numSettlements += player.Stats.numTowns;
            return context.addYieldsAmountTimes(modifier, numSettlements);
        }

        case "EFFECT_PLAYER_ADJUST_YIELD_PER_NUM_TRADE_ROUTES": {
            assertSubjectPlayer(subject);
            const numTradeRoutes = subject.isEmpty ? 0 : subject.player.Trade.countPlayerTradeRoutes();
            return context.addYieldsAmountTimes(modifier, numTradeRoutes);
        }

        case "EFFECT_PLAYER_ADJUST_YIELD_PER_RESOURCE": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const resourcesCount = modifier.Arguments.Imported?.Value === 'true'
                ? player.Resources.getCountImportedResources()
                : player.Resources.getResources().length;
            return context.addYieldsAmountTimes(modifier, resourcesCount);
        }

        case "EFFECT_PLAYER_ADJUST_YIELD_PER_SUZERAIN": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const cityStates = getPlayerCityStatesSuzerain(player).length;
            return context.addSubjectYieldsTimes(subject, modifier, cityStates);
        }

        case "EFFECT_PLAYER_ADJUST_YIELD_PER_COMPLETED_MASTERY": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const completedMasteries = getPlayerCompletedMasteries(player, modifier);
            return context.addSubjectYieldsTimes(subject, modifier, completedMasteries);
        }

        case "EFFECT_ATTACH_MODIFIERS": {
            // Nested modifiers; they are applied once for each subject from the parent modifier.
            const nestedModifierId = modifier.Arguments.getAsserted('ModifierId');
            const nestedModifier = resolveModifierById(nestedModifierId);
            const nestedSubjects = resolveSubjectsWithRequirements(player, nestedModifier, subject);
            return applyYieldsForSubjects(context, nestedSubjects, nestedModifier);
        }


        // Player (Units)
        case "EFFECT_PLAYER_ADJUST_UNIT_MAINTENANCE_EFFICIENCY": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return addYieldTypeAmountNoMultiplier(context.delta, "YIELD_GOLD", 0);

            const unitTypes = retrieveUnitTypesMaintenance(subject.player);
            let totalReduction = 0;
            let totalCost = 0;
            for (let unitType in unitTypes) {
                if (!unitTypes[unitType]) continue; // Just for TS
                
                if (!isUnitTypeInfoTargetOfArguments(unitTypes[unitType].UnitType, modifier.Arguments)) {
                    continue;
                }

                const reduction = calculateMaintenanceEfficiencyToReduction(
                    modifier, 
                    unitTypes[unitType].Count, 
                    unitTypes[unitType].MaintenanceCost
                );

                totalReduction += reduction;
                totalCost += unitTypes[unitType].MaintenanceCost;
            }
            
            return addYieldTypeAmountNoMultiplier(context.delta, "YIELD_GOLD", totalReduction);
        }

        // Player (Diplomacy)
        case "EFFECT_DIPLOMACY_ADJUST_YIELD_PER_PLAYER_INVOLVED_ACTION": {
            assertSubjectPlayer(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const ongoingActions = getPlayerOngoingDiplomacyActions(player);
            return context.addYieldsAmountTimes(modifier, ongoingActions.length);
        }


        // ==============================
        // ========== City ==============
        // ==============================
        case "EFFECT_CITY_ADJUST_YIELD_PER_ATTRIBUTE": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);
            const attributePoints = player.Identity?.getSpentAttributePoints(modifier.Arguments.getAsserted('AttributeType')) || 0;
            return context.addYieldsAmountTimes(modifier, attributePoints);
        }

        case "EFFECT_CITY_ADJUST_YIELD": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            // TODO Check `TRADITION_TIRAKUNA` for `Arguments.Apply` with `Rate` value.
            // TODO Implement `Arguments.PercentMultiplier` (check TRADITION_ASSEMBLY_LINE) 
            if (modifier.Arguments.Percent) {
                return addYieldsPercentForCitySubject(context.delta, modifier, subject.city, Number(modifier.Arguments.Percent.Value)); 
            }
            else if (modifier.Arguments.Amount) {
                return context.addYieldsAmount(modifier, Number(modifier.Arguments.Amount.Value));
            }
            else {
                throw new Error(`Unhandled EFFECT_CITY_ADJUST_YIELD (${modifier.Modifier.ModifierId}) ModifierArguments: ${JSON.stringify(modifier.Arguments)}`);
            }
        }

        case "EFFECT_CITY_ACTIVATE_CONSTRUCTIBLE_ADJACENCY": {
            assertSubjectCity(subject);
            const adjancencies = parseArgumentsArray(modifier.Arguments, 'ConstructibleAdjacency'); 
            adjancencies.forEach(adjacencyId => {
                const adjacencyType = AdjancenciesCache.get(adjacencyId);
                if (!adjacencyType) {
                    throw new Error(`AdjacencyType not found for ID: ${adjacencyId}`);
                }
                // console.warn("EFFECT_CITY_ACTIVATE_CONSTRUCTIBLE_ADJACENCY AdjacencyType", adjacencyType.ID, subject.city?.name);
                
                const validConstructibles = findCityConstructiblesMatchingAdjacency(subject.isEmpty ? null : subject.city, adjacencyId);
                if (validConstructibles.length === 0 || subject.isEmpty) {
                    return context.addYieldTypeAmount(adjacencyType.YieldType, 0);
                }

                validConstructibles.forEach(constructible => {
                    const plotIndex = GameplayMap.getIndexFromLocation(constructible.location);
                    const specialists = subject.city.Workers.getNumWorkersAtPlot(plotIndex) || 0;
                    const amount = getYieldsForAdjacency(constructible.location, adjacencyType);                    
                    
                    // Debugging
                    // if (amount > 0) {
                    //     const constructibleType = GameInfo.Constructibles.lookup(constructible.type);
                    //     console.warn("Valid constructible at", `(amount ${amount})`, constructibleType?.ConstructibleType, constructible.location.x, ",", constructible.location.y, "with specialists", specialists);
                    // }

                    context.addYieldTypeAmount(adjacencyType.YieldType, amount + (amount / 2) * specialists);
                });
            });
            return;
        }
        
        case "EFFECT_CITY_ADJUST_ADJACENCY_FLAT_AMOUNT": {
            assertSubjectCity(subject);
            const adjancencies = parseArgumentsArray(modifier.Arguments, 'Adjacency_YieldChange');
            adjancencies.forEach(adjacencyId => {
                const adjacencyType = AdjancenciesCache.get(adjacencyId);
                if (!adjacencyType) {
                    throw new Error(`AdjacencyType not found for ID: ${adjacencyId}`);
                }
                
                const validConstructibles = findCityConstructiblesMatchingAdjacency(subject.isEmpty ? null : subject.city, adjacencyId);
                if (validConstructibles.length === 0 || subject.isEmpty) {
                    return context.addYieldTypeAmount(adjacencyType.YieldType, 0);
                }

                // console.warn("EFFECT_CITY_ADJUST_ADJACENCY_FLAT_AMOUNT AdjacencyType", adjacencyType.ID, subject.city.name);

                validConstructibles.forEach((constructible) => {
                    if (!adjacencyType) {
                        console.error(`AdjacencyType not found for ID: ${adjacencyId}`);
                        return;
                    }

                    const plotIndex = GameplayMap.getIndexFromLocation(constructible.location);
                    const specialists = subject.city.Workers.getNumWorkersAtPlot(plotIndex) || 0;

                    // The granted bonus is fixed (maybe this is the `Flat` in the name). 
                    // It does not depend on the number of adjacent plots, it just requires that
                    // the constructible _may_ receive the bonus (e.g. `RiverFood` is used to indicate
                    // all buildings that can get a Food bonus from being near a river). 
                    const adjacentPlots = 1; // getPlotsGrantingAdjacency(constructible.location, adjacencyType).length;
                    const multiplier = adjacentPlots + (adjacentPlots / 2) * specialists;

                    // Debugging
                    // if (adjacentPlots > 0) {
                    //     const ctype = GameInfo.Constructibles.lookup(constructible.type);
                    //     console.warn("Valid constructible at", `(amount ${adjacentPlots})`, ctype?.ConstructibleType, constructible.location.x, ",", constructible.location.y, "with specialists", specialists);
                    // }

                    // TODO Are we sure about `Divisor`?
                    const amount = Number(modifier.Arguments.Amount?.Value) * multiplier / Number(modifier.Arguments.Divisor?.Value || 1);
                    context.addYieldTypeAmount(adjacencyType.YieldType, amount);
                });
            });
            return;
        }

        case "EFFECT_CITY_GRANT_WAREHOUSE_YIELD": {
            assertSubjectCity(subject);
            const warehousesYieldChanges = parseArgumentsArray(modifier.Arguments, 'WarehouseYieldChange');
            warehousesYieldChanges.forEach(warehouseYield => {
                const warehouseYieldType = GameInfo.Warehouse_YieldChanges.find(wyc => wyc.ID === warehouseYield);
                if (!warehouseYieldType) {
                    throw new Error(`WarehouseYieldType not found for ID: ${warehouseYield}`);
                }

                if (subject.isEmpty) {
                    return context.addYieldTypeAmount(warehouseYieldType.YieldType, 0);
                }
                
                const amount = getYieldsForWarehouseChange(subject.city, warehouseYieldType);
                // console.warn("EFFECT_CITY_GRANT_WAREHOUSE_YIELD", warehouseYieldType.ID, subject.city.name, "amount=", amount);
                context.addYieldTypeAmount(warehouseYieldType.YieldType, amount);
            });
            return;
        }

        case "EFFECT_CITY_ACTIVATE_CONSTRUCTIBLE_WAREHOUSE_YIELD": {
            assertSubjectCity(subject);
            const warehousesYields = parseArgumentsArray(modifier.Arguments, 'ConstructibleWarehouseYield');
            warehousesYields.forEach(warehouseYield => {
                const warehouseYieldType = GameInfo.Warehouse_YieldChanges.find(wyc => wyc.ID === warehouseYield);
                if (!warehouseYieldType) {
                    throw new Error(`WarehouseYieldType not found for ID: ${warehouseYield}`);
                }

                const constructibles = findCityConstructiblesMatchingWarehouse(subject.isEmpty ? null : subject.city, warehouseYieldType);
                if (!constructibles.length || subject.isEmpty) {
                    return context.addYieldTypeAmount(warehouseYieldType.YieldType, 0);
                }

                // The amount is the same for each Constructible, since it's a bonus based on all the plots
                // in the city.
                // So we calculate it once and apply it to all the Constructibles.
                // I personally suppose that there is only _one_ Constructible per city that can get this bonus,
                // but I'm not sure.
                const amount = getYieldsForWarehouseChange(subject.city, warehouseYieldType);
                constructibles.forEach(constructible => {
                    context.addYieldTypeAmount(warehouseYieldType.YieldType, amount);
                });
            });
            return;
        }

        case "EFFECT_CITY_ADJUST_BUILDING_MAINTENANCE_EFFICIENCY": {
            assertSubjectCity(subject);
            if (subject.isEmpty) {
                addYieldTypeAmountNoMultiplier(context.delta, "YIELD_GOLD", 0);
                addYieldTypeAmountNoMultiplier(context.delta, "YIELD_HAPPINESS", 0);
                return;
            }

            const constructibles = findCityConstructibles(subject.city);
            let totalGoldReduction = 0;
            let totalHappinessReduction = 0;
            constructibles.forEach(({ constructible, constructibleType }) => {
                if (!constructibleType) return;
                const { gold, happiness } = computeConstructibleMaintenanceEfficiencyReduction(
                    subject.city, 
                    constructible, 
                    constructibleType, 
                    modifier
                );
                totalGoldReduction += gold;
                totalHappinessReduction += happiness;
            });

            addYieldTypeAmountNoMultiplier(context.delta, "YIELD_GOLD", totalGoldReduction);
            addYieldTypeAmountNoMultiplier(context.delta, "YIELD_HAPPINESS", totalHappinessReduction);
            return;
        }

        case "EFFECT_CITY_ADJUST_CONSTRUCTIBLE_YIELD": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const buildingsCount = getBuildingsCountForModifier([subject.city], modifier);
            return context.addYieldsAmountTimes(modifier, buildingsCount);
        }

        // It's just the growth rate, so no food yield
        case "EFFECT_CITY_ADJUST_GROWTH": {
            // throw new Error(`EFFECT_CITY_ADJUST_GROWTH not implemented`);
            return;
        }

        // +X% to Production to overbuild
        case "EFFECT_CITY_ADJUST_OVERBUILD_PRODUCTION_MOD": return;
        // +X% to Production to adjust project production
        case "EFFECT_CITY_ADJUST_PROJECT_PRODUCTION": return;
        // +X% to Production to adjust constructible production
        case "EFFECT_CITY_ADJUST_CONSTRUCTIBLE_PRODUCTION": return;

        case "EFFECT_CITY_ADJUST_TRADE_YIELD": {
            // Hard to find trade yields. Seems a bug in `city.Yields.getTradeYields()`
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);
            let tradeYield = PolicyYieldsCache.getCityTradeYields(subject.city);
            if (tradeYield == null) {
                console.error(`TradeYield not found for city ${subject.city.name}`);
                tradeYield = 0;
            }

            const percent = Number(modifier.Arguments.getAsserted('Percent'));
            return context.addYieldsAmount(modifier, tradeYield * percent / 100);
        }

        // City (Workers)
        case "EFFECT_CITY_ADJUST_WORKER_YIELD": {
            assertSubjectCity(subject);
            const specialists = subject.isEmpty ? 0 : getCitySpecialistsCount(subject.city);
            return context.addYieldsAmountTimes(modifier, specialists);
        }

        case "EFFECT_CITY_ADJUST_WORKER_MAINTENANCE_EFFICIENCY": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const specialists = getCitySpecialistsCount(subject.city);
            const maintenanceCost = 2 * specialists; // Total Maintenance Cost is 2 per specialist. We could read from `WorkerYields` table where < 0
            const value = calculateMaintenanceEfficiencyToReduction(
                modifier,
                specialists,
                maintenanceCost
            );
            return context.addYieldsAmount(modifier, value);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_COMMANDER_LEVEL": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);
            const commanders = getArmyCommanders(player);
            const totalLevels = commanders.reduce((acc, commander) => acc + commander.Experience.getLevel, 0);
            return context.addYieldsAmountTimes(modifier, totalLevels);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_GREAT_WORK": {
            assertSubjectCity(subject);
            const greatWorks = subject.isEmpty ? 0 : getCityGreatWorksCount(subject.city);
            return context.addYieldsAmountTimes(modifier, greatWorks);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_POPULATION": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            if (modifier.Arguments.Urban?.Value === 'true') {
                const urbanFactor = subject.city.urbanPopulation / Number(modifier.Arguments.Divisor?.Value || 1);
                context.addYieldsAmountTimes(modifier, urbanFactor);
            }
            if (modifier.Arguments.Rural?.Value === 'true') {
                const ruralFactor = subject.city.ruralPopulation / Number(modifier.Arguments.Divisor?.Value || 1);
                context.addYieldsAmountTimes(modifier, ruralFactor);
            }

            // Should have at least one of the two
            if (!modifier.Arguments.Urban?.Value && !modifier.Arguments.Rural?.Value) {
                throw new Error(`${modifier.Modifier.ModifierId} - EFFECT_CITY_ADJUST_YIELD_PER_POPULATION, missing arguments: ${JSON.stringify(modifier.Arguments)}`);
            }
            return
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_RESOURCE": {
            assertSubjectCity(subject);
            const assignedResources = subject.isEmpty ? 0 : getCityAssignedResourcesCount(subject.city);
            return context.addYieldsAmountTimes(modifier, assignedResources);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_SUZERAIN": {
            assertSubjectCity(subject);
            const cityStates = subject.isEmpty ? 0 : getPlayerCityStatesSuzerain(player).length;
            return context.addYieldsAmountTimes(modifier, cityStates);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_SURPLUS_HAPPINESS": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);
            const happiness = getCityYieldHappiness(subject.city);
            const surplusAmount = happiness / Number(modifier.Arguments.Divisor?.Value || 1);
            return context.addYieldsAmountTimes(modifier, surplusAmount);
        }

        case "EFFECT_DIPLOMACY_ADJUST_CITY_YIELD_PER_PLAYER_RELATIONSHIP": {
            assertSubjectCity(subject);
            const allies = subject.isEmpty ? 0 : getPlayerRelationshipsCountForModifier(player, modifier);
            return context.addSubjectYieldsTimes(subject, modifier, allies);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_ACTIVE_TRADITION": {
            assertSubjectCity(subject);
            const count = subject.isEmpty ? 0 : getPlayerActiveTraditionsForModifier(player, modifier);
            return context.addYieldsAmountTimes(modifier, count);
        }

        case "EFFECT_CITY_ADJUST_YIELD_PER_NUM_CITIES": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const numSettlements = modifier.Arguments.Towns?.Value === 'true' 
                ? subject.player.Stats.numTowns 
                : subject.player.Stats.numCities; // Not sure about the latter.
            
            return context.addSubjectYieldsTimes(subject, modifier, numSettlements);
        }

        case "EFFECT_CITY_ADJUST_SUZERAIN_OF_CONSTRUCTIBLE_YIELD": {
            assertSubjectCity(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);

            const cityStates = getPlayerCityStatesSuzerain(player);
            return context.addYieldsAmountTimes(modifier, cityStates.length);
        }

        // ==============================
        // ========== Plot ==============
        // ==============================
        case "EFFECT_PLOT_ADJUST_YIELD": {
            assertSubjectPlot(subject);
            if (subject.isEmpty) return context.addYieldsAmount(modifier, 0);
            // TODO Percent?
            const amount = Number(modifier.Arguments.getAsserted('Amount'));
            return context.addYieldsAmount(modifier, amount);
        }

        // ==============================
        // ========== Unit ==============
        // ==============================

        case "EFFECT_DIPLOMACY_ADJUST_UNIT_MAINTENANCE_PER_PLAYER_RELATIONSHIP": {
            assertSubjectUnit(subject);
            if (subject.isEmpty) return context.addYieldTypeAmount("YIELD_GOLD", 0);

            const allies = getPlayerRelationshipsCountForModifier(player, modifier);
            const bonus = Number(modifier.Arguments.getAsserted('Amount')) * allies;            
            
            // A way to limit the bonus to the maintenance cost of the unit.
            // not sure if it's correct.
            const unitType = GameInfo.Units.lookup(subject.unit.type);
            const amount = Math.max(bonus, unitType?.Maintenance || 0);
            return context.addYieldTypeAmount("YIELD_GOLD", amount);
        }

        case "EFFECT_UNIT_ADJUST_PLAYER_YIELD": {
            assertSubjectUnit(subject);
            return context.addSubjectYieldsTimes(subject, modifier, subject.isEmpty ? 0 : 1);
        }

        // Ignored effects
        case "EFFECT_CITY_ADJUST_UNIT_PRODUCTION":
        case "EFFECT_CITY_ADJUST_AVOID_RANDOM_EVENT":
        case "EFFECT_UNIT_ADJUST_MOVEMENT":
        case "EFFECT_ADJUST_PLAYER_OR_CITY_BUILDING_PURCHASE_EFFICIENCY":
        case "EFFECT_ADJUST_PLAYER_OR_CITY_UNIT_PURCHASE_EFFICIENCY":
        case "EFFECT_ADJUST_PLAYER_UNITS_PILLAGE_BUILDING_MODIFIER":
        case "EFFECT_ADJUST_PLAYER_UNITS_PILLAGE_IMPROVEMENT_MODIFIER":
        case "EFFECT_DIPLOMACY_ADJUST_DIPLOMATIC_ACTION_TYPE_EFFICIENCY":
        case "EFFECT_DIPLOMACY_ADJUST_DIPLOMATIC_ACTION_TYPE_EFFICIENCY_PER_GREAT_WORK":
        case "EFFECT_DIPLOMACY_AGENDA_TIMED_UPDATE":
        case "EFFECT_DISTRICT_ADJUST_FORTIFIED_COMBAT_STRENGTH":
        case "EFFECT_PLAYER_ADJUST_SETTLEMENT_CAP":
        case "EFFECT_CITY_ADJUST_RESOURCE_CAP":
        case "EFFECT_CITY_ADJUST_TRADE_ROUTE_RANGE":
        case "EFFECT_CITY_ADJUST_UNIT_PRODUCTION":
        case "EFFECT_CITY_ADJUST_WONDER_PRODUCTION":
        case "EFFECT_CITY_ADJUST_UNIT_PRODUCTION_MOD_PER_SETTLEMENT":
        case "TRIGGER_PLAYER_GRANT_YIELD_ON_UNIT_CREATED":
        case "EFFECT_CITY_GRANT_UNIT":
        case "TRIGGER_CITY_GRANT_YIELD_ON_CONSTRUCTIBLE_CREATED":
        case "EFFECT_ADJUST_UNIT_POST_COMBAT_YIELD":
        case "EFFECT_ADJUST_UNIT_STRENGTH_MODIFIER":
        case "EFFECT_ADJUST_UNIT_CIV_UNIQUE_TRADITION_COMBAT_MODIFIER":
        case "EFFECT_ADJUST_UNIT_IGNORE_ZOC":     
        case "EFFECT_ADJUST_UNIT_SIGHT":
        case "EFFECT_ADJUST_UNIT_SPREAD_CHARGES":
        case "EFFECT_ARMY_ADJUST_EXPERIENCE_RATE":
        case "EFFECT_ARMY_ADJUST_MOVEMENT_RATE": 
        case "EFFECT_UNIT_ADJUST_ABILITY":
        case "EFFECT_UNIT_ADJUST_COMMAND_AWARD":
        case "EFFECT_UNIT_ADJUST_HEAL_PER_TURN":
        case "EFFECT_UNIT_ADJUST_MOVEMENT":
        case "EFFECT_UNIT_ADJUST_EMBARKATION_TYPE":
        // Ignored attribute effects
        case "EFFECT_PLAYER_ADJUST_PROGRESSION_TREE_MASTERY_EFFICIENCY":
        case "EFFECT_DIPLOMACY_ADJUST_RELATIONSHIP_GAIN_FROM_EVENT":
        case "EFFECT_CITY_ADD_FOOD_AFTER_GROWTH_EVENT":
        case "EFFECT_CITY_ADJUST_TOWN_UPGRADE_DISCOUNT":
        case "EFFECT_DIPLOMACY_ADJUST_DIPLOMATIC_ACTION_TOKEN_BONUS":
        case "EFFECT_ADJUST_CITY_IGNORE_UNHAPPINESS_EFFECT": // Todo we _could_ implement this
        case "EFFECT_ADJUST_CITY_COMMANDER_UNHAPPINESS_REDUCTION":
        case "EFFECT_GRANT_UNIT_PROMOTION":
        case "EFFECT_DIPLOMACY_ADJUST_DIPLOMATIC_RESPONSE_EFFICIENCY":
        case "EFFECT_PLAYER_ADJUST_GOLDEN_AGE_DURATION":
        case "EFFECT_PLAYER_GRANT_TRADITION_SLOTS":
        case "EFFECT_DO_NOTHING":
        case "EFFECT_UNIT_ADJUST_FLANKING_ATTACK_MODIFIER":
        case "EFFECT_PLAYER_ATTRIBUTE":
        case "EFFECT_PLAYER_ADJUST_AGE_PROGRESS":
        case "EFFECT_PLAYER_GRANT_WONDER_PURCHASING":
        case "EFFECT_PLAYER_OPEN_ARCHAEOLOGY":
        case "EFFECT_CITY_ADJUST_WORKER_CAP":
        case "EFFECT_ADJUST_UNIT_EMBARKED_MOVEMENT":
        case "EFFECT_CITY_ADJUST_POPULATION":
        case "EFFECT_PLAYER_ADD_GOLDEN_AGE_CHOICE":
        case "EFFECT_UNITS_EXTRA_RANDOM_EVENT_DAMAGE":
        case "EFFECT_UNITS_IMMUNE_TO_RANDOM_EVENTS":
        case "EFFECT_ADJUST_PLAYER_TRADE_DURING_WAR":
        // Tree
        case "EFFECT_GRANT_GREAT_WORK":
        case "EFFECT_PLAYER_UNLOCK_PANTHEON":
            return;

        default:
            if (modifier.EffectType?.startsWith('TRIGGER_')) {
                return;
            }
            
            throw new Error(`${modifier.Modifier.ModifierId}: Unhandled EffectType: ${modifier.EffectType}`);
    }
}