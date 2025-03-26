
--------------------------------------------------------------------------------------------------------
-- RHAI ANT VICT

/*
UPDATE AiFavoredItems
SET DefaultValue = 75
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

UPDATE Yields
SET DefaultValue = 1.1
WHERE YieldType = 'YIELD_DIPLOMACY';

UPDATE Yields
SET DefaultValue = 0.95
WHERE YieldType = 'YIELD_GOLD';
*/

UPDATE Yields
SET DefaultValue = 1.4
WHERE YieldType = 'YIELD_PRODUCTION';

UPDATE Yields
SET DefaultValue = 1.05
WHERE YieldType = 'YIELD_CULTURE';


/*
UPDATE StrategyConditions
SET Exclusive = 'false'
WHERE StrategyType IN ('LEGACY_PATH_STRATEGY_IMPORTS', 'LEGACY_PATH_STRATEGY_WONDERS')
AND ConditionFunction = 'HasLeaderTrait';
*/
-- Todo reenter strategyconditions to enable multiple to work in sim -- Consistently results in error
/*
[2025-02-26 12:35:58]	[gameplay] ERROR: FOREIGN KEY constraint failed
[2025-02-26 12:35:58]	[gameplay] ERROR: FOREIGN KEY constraint failed
[2025-02-26 12:35:58]	[gameplay]: Validating Foreign Key Constraints...
[2025-02-26 12:35:58]	[gameplay] ERROR: Invalid Reference on AiFavoredItems.ListType - "LEGACY_PATH_STRATEGY_IMPORTS" does not exist in AiListTypes
[2025-02-26 12:35:58]	[gameplay] ERROR: Invalid Reference on AiFavoredItems.ListType - "LEGACY_PATH_STRATEGY_SCIENCE" does not exist in AiListTypes
*/

/*
		<!-- Military Victory -->
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="GovernmentMatches" ThresholdValue="1" StringValue="GOVERNMENT_DESPOTISM"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="NumCities" ThresholdValue="4"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="NumConqueredCities" ThresholdValue="1"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="TopMilitaryPercent" ThresholdValue="25"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="NumCommanders" ThresholdValue="2"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="HasLeaderTrait" ThresholdValue="1" StringValue="TRAIT_LEADER_ATTRIBUTE_MILITARISTIC"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="HasLeaderTrait" ThresholdValue="1" StringValue="TRAIT_LEADER_ATTRIBUTE_EXPANSIONIST"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_MILITARY_VICTORY"/>
		<!-- Science Victory -->
		<Row StrategyType="LEGACY_PATH_STRATEGY_SCIENCE" ConditionFunction="GovernmentMatches" ThresholdValue="1" StringValue="GOVERNMENT_DESPOTISM"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_SCIENCE" ConditionFunction="NumCities" ThresholdValue="3"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_SCIENCE" ConditionFunction="TopSciencePercent" ThresholdValue="33"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_SCIENCE" ConditionFunction="NumGreatWorks" ThresholdValue="2"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_SCIENCE" ConditionFunction="HasLeaderTrait" ThresholdValue="1" StringValue="TRAIT_LEADER_ATTRIBUTE_SCIENTIFIC"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_SCIENCE" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_SCIENCE_VICTORY"/>
		<!-- Culture Victory -->
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="GovernmentMatches" ThresholdValue="1" StringValue="GOVERNMENT_CLASSICAL_REPUBLIC"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="TopYieldPercent" ThresholdValue="33" StringValue="YIELD_PRODUCTION"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="NumWonders" ThresholdValue="2"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="HasLeaderTrait" ThresholdValue="1" StringValue="TRAIT_LEADER_ATTRIBUTE_CULTURAL"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_CULTURE_VICTORY"/>
		<!-- Economic Victory -->
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="GovernmentMatches" ThresholdValue="1" StringValue="GOVERNMENT_OLIGARCHY"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="NumMajorsMet" ThresholdValue="2"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="LimitedWars" ThresholdValue="2"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="VictoryPoints" ThresholdValue="3" StringValue="VICTORY_ANTIQUITY_ECONOMIC"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="HasLeaderTrait" ThresholdValue="1" StringValue="TRAIT_LEADER_ATTRIBUTE_POLITICAL"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="HasLeaderTrait" ThresholdValue="1" StringValue="TRAIT_LEADER_ATTRIBUTE_ECONOMIC"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_ECONOMIC_VICTORY"/>
		
		<!-- Expansion -->
		<Row ListType="LegacyPathStrategyExpansionBudgetBiases" Item="AI_BUDGET_STANDING_ARMY" Value="50"/>
		<Row ListType="LegacyPathStrategyExpansionBudgetBiases" Item="AI_BUDGET_EXPLORATION" Value="50"/>
		<Row ListType="LegacyPathStrategyExpansionPseudoYieldBiases" Item="PSEUDOYIELD_NEW_CITY" Value="10"/>
		<Row ListType="LegacyPathStrategyExpansionPseudoYieldBiases" Item="PSEUDOYIELD_STANDING_ARMY_UNIT" Value="50"/>
		<Row ListType="LegacyPathStrategyExpansionPseudoYieldBiases" Item="PSEUDOYIELD_STANDING_ARMY_UNIT_COMBAT_VALUE" Value="25"/>
		<Row ListType="LegacyPathStrategyExpansionPseudoYieldBiases" Item="PSEUDOYIELD_COMMANDER_XP_PERCENT_BONUS" Value="25"/>
		<Row ListType="LegacyPathStrategyExpansionPseudoYieldBiases" Item="PSEUDOYIELD_SETTLEMENT_CAP_INCREASE" Value="100"/>
		<Row ListType="LegacyPathStrategyExpansionPseudoYieldBiases" Item="PSEUDOYIELD_RESOURCE_IMPORT" Value="-80"/>
		<Row ListType="LegacyPathStrategyExpansionYieldBiases" Item="YIELD_PRODUCTION" Value="10"/>
		<Row ListType="LegacyPathStrategyExpansionConstructibleClassesBiases" Item="WONDER" Value="-80"/>
		<Row ListType="LegacyPathStrategyExpansionTagBiases" Item="MILITARY" Value="200"/>
		<!-- Science -->
		<Row ListType="LegacyPathStrategyScienceConstructibleBiases" Item="BUILDING_LIBRARY" Value="400"/>
		<Row ListType="LegacyPathStrategyScienceConstructibleBiases" Item="BUILDING_ACADEMY" Value="800"/>
		<Row ListType="LegacyPathStrategyScienceConstructibleBiases" Item="WONDER_NALANDA" Value="200"/>
		<Row ListType="LegacyPathStrategyScienceConstructibleBiases" Item="WONDER_DUR_SHARRUKIN" Value="50"/>
		<Row ListType="LegacyPathStrategyScienceConstructibleBiases" Item="WONDER_MUNDO_PERDIDO" Value="50"/>
		<Row ListType="LegacyPathStrategyScienceYieldBiases" Item="Yield_SCIENCE" Value="10"/>
		<Row ListType="LegacyPathStrategySciencePseudoYieldBiases" Item="PSEUDOYIELD_GREAT_WORK" Value="200"/>
		<Row ListType="LegacyPathStrategySciencePseudoYieldBiases" Item="PSEUDOYIELD_GREAT_WORK_SLOT" Value="200"/>
		<Row ListType="LegacyPathStrategySciencePseudoYieldBiases" Item="PSEUDOYIELD_BUILD_QUEUE_IN_CITY" Value="400"/>
		<Row ListType="LegacyPathStrategyScienceConstructibleClassesBiases" Item="WONDER" Value="-50"/>
		<Row ListType="LegacyPathStrategyScienceBudgetBiases" Item="AI_BUDGET_CITY_DEVELOPMENT" Value="50"/>
		<Row ListType="LegacyPathStrategyScienceProgressionTreeNodesBiases" Item="NODE_TECH_AQ_MATHEMATICS" Value="2000"/>
		<!-- Wonders -->
		<Row ListType="LegacyPathStrategyWondersConstructibleClassesBiases" Item="WONDER" Value="200"/>
		<Row ListType="LegacyPathStrategyWondersYieldBiases" Item="YIELD_PRODUCTION" Value="10"/>
		<Row ListType="LegacyPathStrategyWondersYieldBiases" Item="YIELD_CULTURE" Value="10"/>
		<Row ListType="LegacyPathStrategyWondersPseudoYieldBiases" Item="PSEUDOYIELD_BUILD_QUEUE_IN_CITY" Value="200"/>
		<Row ListType="LegacyPathStrategyWondersPseudoYieldBiases" Item="PSEUDOYIELD_NEW_CITY" Value="-25"/>
		<!-- Imports -->
		<Row ListType="LegacyPathStrategyImportsBudgetBiases" Item="AI_BUDGET_STANDING_ARMY" Value="-50"/>
		<Row ListType="LegacyPathStrategyImportsBudgetBiases" Item="AI_BUDGET_GARRISON" Value="100"/>
		<Row ListType="LegacyPathStrategyImportsBudgetBiases" Item="AI_BUDGET_CITY_DEVELOPMENT" Value="100"/>
		<Row ListType="LegacyPathStrategyExpansionBudgetBiases" Item="AI_BUDGET_EXPLORATION" Value="100"/>
		<Row ListType="LegacyPathStrategyImportsPseudoYieldBiases" Item="PSEUDOYIELD_CITY_DEFENSES" Value="25"/>
		<Row ListType="LegacyPathStrategyImportsPseudoYieldBiases" Item="PSEUDOYIELD_CITY_GUARDS" Value="25"/>
		<Row ListType="LegacyPathStrategyImportsPseudoYieldBiases" Item="PSEUDOYIELD_NEW_CITY" Value="-50"/>
		<Row ListType="LegacyPathStrategyImportsPseudoYieldBiases" Item="PSEUDOYIELD_RESOURCE_IMPORT" Value="1000"/>
		<Row ListType="LegacyPathStrategyImportsProgressionTreeNodesBiases" Item="NODE_CIVIC_AQ_MAIN_CITIZENSHIP" Value="500"/>
		<Row ListType="LegacyPathStrategyImportsUnitBiases" Item="UNIT_MERCHANT" Value="400"/>
		<Row ListType="LegacyPathStrategyImportsUnitBiases" Item="UNIT_WATONATHI" Value="400"/>		
*/

--------------------------------------------------------------------------------------------------

-- Wonder Culture Victory

UPDATE AiFavoredItems
SET Value = -10
WHERE ListType = 'LegacyPathStrategyScienceConstructibleClassesBiases' AND Item = 'WONDER';

UPDATE AiFavoredItems -- pvs 400, 500
SET Value = 500
WHERE ListType = 'LegacyPathStrategyWondersConstructibleClassesBiases' AND Item = 'WONDER';




-- Def Wonder Yield Strat

UPDATE AiFavoredItems -- def 10
SET Value = 25
WHERE ListType = 'LegacyPathStrategyWondersYieldBiases' AND Item = 'YIELD_PRODUCTION';

UPDATE AiFavoredItems -- def 10
SET Value = 20
WHERE ListType = 'LegacyPathStrategyWondersYieldBiases' AND Item = 'YIELD_CULTURE';


------------------------------------------------------------------
-- Expansion Strat High Diff
UPDATE AiFavoredItems
SET Value = -40
WHERE ListType = 'LegacyPathStrategyExpansionConstructibleClassesBiases' AND Item = 'WONDER';

UPDATE AiFavoredItems -- 50 -- Production is a much better use
SET Value = 15
WHERE ListType = 'LegacyPathStrategyExpansionBudgetBiases' AND Item = 'AI_BUDGET_STANDING_ARMY';

UPDATE AiFavoredItems -- -80, -40
SET Value = -5
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_RESOURCE_IMPORT';

UPDATE AiFavoredItems -- 10, 75, 110, 75
SET Value = 150
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

UPDATE AiFavoredItems
SET Value = 1000
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE';

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('LegacyPathStrategyExpansionYieldBiases', 				'YIELD_HAPPINESS',  25); -- Important if Over the City Cap


-------------------------------------------------------------------
-- Science

UPDATE AiFavoredItems -- 200, 320
SET Value = 350
WHERE ListType = 'LegacyPathStrategySciencePseudoYieldBiases' AND Item = 'PSEUDOYIELD_GREAT_WORK_SLOT';

UPDATE AiFavoredItems -- 200, 225 -- Not doing enough masteries, 700 Warps the Tech tree way too much, at 350 skips all but 1 of the tech tree Codices masteries turn 63 when could get them a lot more quickly
SET Value = 575
WHERE ListType = 'LegacyPathStrategySciencePseudoYieldBiases' AND Item = 'PSEUDOYIELD_GREAT_WORK';















/*
	<StrategyConditions>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_ECONOMIC_VICTORY"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_CULTURE_VICTORY"/>
*/

-- Extra Strategy High Diff Pseudo Biases

INSERT OR IGNORE INTO AiListTypes (ListType) VALUES
('RHAI_ANT_WONDERS'),
('RHAI_ANT_IMPORTS'),
('RHAI_ANT_SCIENCE');


INSERT OR IGNORE INTO AiLists (ListType, System) VALUES
('RHAI_ANT_WONDERS',   'PseudoYieldBiases'),
('RHAI_ANT_IMPORTS',  	'PseudoYieldBiases'),
('RHAI_ANT_SCIENCE',	'PseudoYieldBiases');

INSERT OR IGNORE INTO Strategy_Priorities (StrategyType, ListType) VALUES
('LEGACY_PATH_STRATEGY_WONDERS', 'RHAI_ANT_WONDERS'),
('LEGACY_PATH_STRATEGY_IMPORTS', 'RHAI_ANT_IMPORTS'),
('LEGACY_PATH_STRATEGY_SCIENCE', 'RHAI_ANT_SCIENCE');

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('RHAI_ANT_WONDERS', 				'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE',  50),
('RHAI_ANT_WONDERS', 				'PSEUDOYIELD_RESOURCE_IMPORT', 			 400);

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('RHAI_ANT_IMPORTS', 	'PSEUDOYIELD_NEW_CITY', 				100),
('RHAI_ANT_IMPORTS', 	'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE',  500);

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('RHAI_ANT_SCIENCE', 	'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE',   100),
('RHAI_ANT_SCIENCE', 	'PSEUDOYIELD_RESOURCE_IMPORT', 			 500);





UPDATE AiFavoredItems
SET Value = 35
WHERE ListType = 'LegacyPathStrategyScienceYieldBiases' AND Item = 'Yield_SCIENCE';

UPDATE AiFavoredItems
SET Value = 40
WHERE ListType = 'LegacyPathStrategyExpansionYieldBiases' AND Item = 'YIELD_PRODUCTION';


INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('LegacyPathStrategyScienceYieldBiases', 	'YIELD_HAPPINESS',  10);

INSERT OR IGNORE INTO AiListTypes (ListType) VALUES
('RH Antiquity Budget Biases');

INSERT OR IGNORE INTO AiLists (ListType, LeaderType, System) VALUES
('RH Antiquity Budget Biases', 'TRAIT_ANTIQUITY_CIV', 'AiBudgetBiases');

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES

('Antiquity Constructible Biases', 'BUILDING_BRICKYARD', 		10),
('Antiquity Constructible Biases', 'BUILDING_LIBRARY', 			100), -- Very worth it for Codices
('Antiquity Constructible Biases', 'BUILDING_LIGHTHOUSE', 		300), -- Very important for resources, pvs 250

('RH Antiquity Budget Biases', 'AI_BUDGET_EXPANSION', 		25),
('RH Antiquity Budget Biases', 'AI_BUDGET_CITY_DEVELOPMENT', 100); -- pvs 50, 75


UPDATE AiFavoredItems
SET Value = -50
WHERE ListType = 'Antiquity Constructible Biases' AND Item = 'BUILDING_GARDEN';
	   
/*	  
		<Row ListType="LegacyPathStrategyImportsPseudoYieldBiases" Item="PSEUDOYIELD_CITY_DEFENSES" Value="25"/>
		<Row ListType="LegacyPathStrategyImportsPseudoYieldBiases" Item="PSEUDOYIELD_CITY_GUARDS" Value="25"/>
*/	


---------------------------------------------------
-- City Wonder Bias Heavy, For cities with Lots of Extra Production, on higher difficulties in the Antiquity Era -- For Antiquity Cultural Victory Condition Build 7 Wonders

-- Insert the strategy into AiListTypes
INSERT OR IGNORE INTO AiListTypes (ListType) VALUES ('RHQCityWonderBiasHeavyBiasAnt');

-- INSERT OR IGNORE the strategy into Strategies
INSERT OR IGNORE INTO Strategies (StrategyType, CityStrategy, MinNumConditionsNeeded, MaxNumConditionsNeeded) 
VALUES ('CITY_STRATEGY_RHQ_WONDERS_HEAVY_ANT', 1, 1, 1);

-- INSERT OR IGNORE the condition into StrategyConditions
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue) 
VALUES ('CITY_STRATEGY_RHQ_WONDERS_HEAVY_ANT', 'HasProductionGreaterThan', 45);

INSERT OR IGNORE INTO Strategy_Priorities (StrategyType, ListType) 
VALUES ('CITY_STRATEGY_RHQ_WONDERS_HEAVY_ANT', 'RHQCityWonderBiasHeavyBiasAnt');

INSERT OR IGNORE INTO AiLists (ListType, System) 
VALUES ('RHQCityWonderBiasHeavyBiasAnt', 'ConstructibleClassBiases');

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) 
VALUES ('RHQCityWonderBiasHeavyBiasAnt', 'WONDER', 2000);
	