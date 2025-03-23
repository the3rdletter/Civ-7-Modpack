



UPDATE PseudoYields SET DefaultValue = 675 -- 200 Def, pvs 500
WHERE PseudoYieldType = 'PSEUDOYIELD_NEW_CITY'; -- 400 early


UPDATE PseudoYields SET DefaultValue = 5
WHERE PseudoYieldType = 'PSEUDOYIELD_CITY_DEFENSES';

UPDATE PseudoYields SET DefaultValue = 5
WHERE PseudoYieldType = 'PSEUDOYIELD_CITY_GUARDS';

UPDATE PseudoYields SET DefaultValue = 10
WHERE PseudoYieldType = 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE';

---------------------------------------------------------

-- Only Sovereign

-- Delete existing entries for LEGACY_PATH_STRATEGY_BUILDINGS
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_BUILDINGS';


INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_BUILDINGS', 'GovernmentMatches', 25, 'GOVERNMENT_PLUTOCRACY'),
    ('LEGACY_PATH_STRATEGY_BUILDINGS', 'TopSciencePercent', 30, NULL),
    ('LEGACY_PATH_STRATEGY_BUILDINGS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_SCIENTIFIC'),
    ('LEGACY_PATH_STRATEGY_BUILDINGS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_EXPANSIONIST');

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_BUILDINGS', 'HasLeaderTrait', 1, 'TRAIT_EX_SCIENCE_VICTORY', 0);



---------------------------------------------------------


UPDATE AiFavoredItems -- 50
SET ListType = 'LegacyPathStrategyDistantSettlementsBudgetBiases'
WHERE Value = 35 AND Item = 'AI_BUDGET_STANDING_ARMY';


UPDATE AiFavoredItems -- 50
SET ListType = 'LegacyPathStrategyTreasureFleetBudgetBiases'
WHERE Value = 15 AND Item = 'AI_BUDGET_GARRISON';


-- More than in Standard

UPDATE AiFavoredItems -- pvs 100
SET Value = 500
WHERE ListType = 'LegacyPathStrategyDistantSettlementsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE';

UPDATE AiFavoredItems -- pvs 100
SET Value = 200
WHERE ListType = 'LegacyPathStrategyDistantSettlementsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';


-- LegacyPathStrategyBuildings

UPDATE AiFavoredItems
SET Value = -5
WHERE ListType = 'LegacyPathStrategyBuildingsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';


UPDATE AiFavoredItems -- 100
SET Value = 175
WHERE ListType = 'LegacyPathStrategyBuildingsBudgetBiases' AND Item = 'AI_BUDGET_CITY_DEVELOPMENT';




 -- Sovereign+ Building Bias

-- Insert into AiListTypes
INSERT INTO AiListTypes (ListType) VALUES 
    ('RHMAJORExplorSov_ConstructibleClassBiases');

-- Insert into AiLists
INSERT INTO AiLists (ListType, LeaderType, System) VALUES 
    ('RHMAJORExplorSov_ConstructibleClassBiases', 'TRAIT_LEADER_MAJOR_CIV', 'ConstructibleClassBiases');

-- Insert into AiFavoredItems
INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES 
    ('RHMAJORExplorSov_ConstructibleClassBiases', 'WONDER', 15);


-- Much More in larger cities

-- Insert into Strategies (defining the city strategy)
INSERT INTO Strategies (StrategyType, CityStrategy, MinNumConditionsNeeded, MaxNumConditionsNeeded) VALUES 
    ('CITY_STRATEGY_WONDERS_RH_EXP', 1, 1, 1);

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue) VALUES 
    ('CITY_STRATEGY_WONDERS_RH_EXP', 'HasProductionGreaterThan', 40);

INSERT INTO Strategy_Priorities (StrategyType, ListType) VALUES 
    ('CITY_STRATEGY_WONDERS_RH_EXP', 'RHCityWonderBiasEXP');

INSERT INTO AiListTypes (ListType) VALUES 
    ('RHCityWonderBiasEXP');

INSERT INTO AiLists (ListType, System) VALUES 
    ('RHCityWonderBiasEXP', 'ConstructibleClassBiases');

INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES 
    ('RHCityWonderBiasEXP', 'WONDER', 150);



---------------------------------------------------
-- City Wonder Bias Heavy, For cities with Lots of Extra Production, on higher difficulties in the Antiquity Era

-- Insert the strategy into AiListTypes
INSERT INTO AiListTypes (ListType) VALUES ('RHQCityWonderBiasHeavyBiasExploration');

-- Insert the strategy into Strategies
INSERT INTO Strategies (StrategyType, CityStrategy, MinNumConditionsNeeded, MaxNumConditionsNeeded) 
VALUES ('CITY_STRATEGY_RHQ_WONDERS_HEAVY_EXPLORATION', 1, 1, 1);

-- Insert the condition into StrategyConditions
INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue) 
VALUES ('CITY_STRATEGY_RHQ_WONDERS_HEAVY_EXPLORATION', 'HasProductionGreaterThan', 100);

-- Insert the priority into Strategy_Priorities
INSERT INTO Strategy_Priorities (StrategyType, ListType) 
VALUES ('CITY_STRATEGY_RHQ_WONDERS_HEAVY_EXPLORATION', 'RHQCityWonderBiasHeavyBiasExploration');

-- Insert the AI list definition
INSERT INTO AiLists (ListType, System) 
VALUES ('RHQCityWonderBiasHeavyBiasExploration', 'ConstructibleClassBiases');

-- Insert the favored item for AI
INSERT INTO AiFavoredItems (ListType, Item, Value) 
VALUES ('RHQCityWonderBiasHeavyBiasExploration', 'WONDER', 950);
	



