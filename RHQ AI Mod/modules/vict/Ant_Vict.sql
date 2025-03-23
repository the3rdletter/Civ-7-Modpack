
--------------------------------------------------------------------------------------------------------
-- RHAI ANT VICT

/*
UPDATE AiFavoredItems
SET Value = 75
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

UPDATE Yields
SET Value = 1.25
WHERE YieldType = 'YIELD_PRODUCTION';

UPDATE Yields
SET Value = 1.1
WHERE YieldType = 'YIELD_DIPLOMACY';

UPDATE Yields
SET Value = 0.95
WHERE YieldType = 'YIELD_GOLD';
*/


UPDATE PseudoYields SET DefaultValue = 500
WHERE PseudoYieldType = 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION'; -- def 150


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


-- RH Victory Conditions
---------------------------------------------------------------
-- LEGACY_PATH_STRATEGY_IMPORTS
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_IMPORTS';

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'GovernmentMatches',	 '1', 		'GOVERNMENT_OLIGARCHY'),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'NumMajorsMet', 		'2', 				NULL),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'LimitedWars', 			'2', 				NULL),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'VictoryPoints', 		'3', 			'VICTORY_ANTIQUITY_ECONOMIC'),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'HasLeaderTrait', 		'1', 			'TRAIT_LEADER_ATTRIBUTE_POLITICAL'),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'HasLeaderTrait', 		'1', 			'TRAIT_LEADER_ATTRIBUTE_ECONOMIC');
	
	
INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES 	
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'HasLeaderTrait', 		1, 			'TRAIT_AQ_ECONOMIC_VICTORY', 0);


---------------------------------------------------------------
-- Delete existing entries for LEGACY_PATH_STRATEGY_WONDERS
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_WONDERS';

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_WONDERS', 'GovernmentMatches', 1, 'GOVERNMENT_CLASSICAL_REPUBLIC'),
    ('LEGACY_PATH_STRATEGY_WONDERS', 'TopYieldPercent', 50, 'YIELD_PRODUCTION'), -- pvs 40
    ('LEGACY_PATH_STRATEGY_WONDERS', 'NumWonders', 1, NULL),
    ('LEGACY_PATH_STRATEGY_WONDERS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_CULTURAL');

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_WONDERS', 'HasLeaderTrait', 1, 'TRAIT_AQ_CULTURE_VICTORY', 0);


----------------------------------------------------------------
-- Delete existing entries for LEGACY_PATH_STRATEGY_SCIENCE
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_SCIENCE';

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'GovernmentMatches', 1, 'GOVERNMENT_DESPOTISM'),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'NumCities', 3, NULL),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'TopSciencePercent', 40, NULL),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'NumGreatWorks', 2, NULL),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_SCIENTIFIC');

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'HasLeaderTrait', 1, 'TRAIT_AQ_SCIENCE_VICTORY', 0);


-------------------------------------------------------------

INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES
    -- Antiquity Majors
 --   ('Antiquity Tag Biases', 'PRODUCTION', 100),
  --  ('Antiquity Constructible Biases', 'BUILDING_GARDEN', -50),

    ('Antiquity Unit Biases', 'UNIT_MERCHANT', 750), -- Important for Resource Victory and Success -- pvs 175, 220, 300
    ('Antiquity Unit Biases', 'UNIT_WATONATHI', 1000); -- 330



-- Bug Fix -- Expansion in Import Budget Biases


UPDATE AiFavoredItems
SET ListType = 'LegacyPathStrategyImportsBudgetBiases'
WHERE Value = 75 AND Item = 'AI_BUDGET_EXPLORATION';

-- Budgets

UPDATE AiFavoredItems -- def 100
SET Value = 60
WHERE ListType = 'LegacyPathStrategyImportsBudgetBiases' AND Item = 'AI_BUDGET_GARRISON';

UPDATE AiFavoredItems -- def -50
SET Value = -40
WHERE ListType = 'LegacyPathStrategyImportsBudgetBiases' AND Item = 'AI_BUDGET_STANDING_ARMY';

--

UPDATE AiFavoredItems
SET Value = 35
WHERE ListType = 'LegacyPathStrategyWondersPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

UPDATE AiFavoredItems -- pvs -50 lol
SET Value = 50
WHERE ListType = 'LegacyPathStrategyImportsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';


----------------------------------------------------------------------------
-- Military

INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES

    ('LegacyPathStrategyExpansionBudgetBiases', 'AI_BUDGET_EXPANSION', 55); -- Expand Quickly







UPDATE AiFavoredItems
SET Value = 75
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';


INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES

    ('LegacyPathStrategyExpansionBudgetBiases', 'AI_BUDGET_EXPANSION', 60); -- Expand Quickly

	--	<Row ListType="LegacyPathStrategyExpansionBudgetBiases" Item="" Value="100"/>



-- Todo Enable Aggressive Attack




INSERT OR IGNORE INTO Strategy_Priorities (StrategyType, ListType) VALUES
('LEGACY_PATH_STRATEGY_EXPANSION', 'RHAI_AGGRESSIVE'),
('LEGACY_PATH_STRATEGY_EXPANSION', 'RHAI_AGGRESSIVE_PSEUDOYIELDBIASES'),
('LEGACY_PATH_STRATEGY_EXPANSION', 'RHAI_AGGRESSIVE_DIPLO');








/*
	<StrategyConditions>
		<Row StrategyType="LEGACY_PATH_STRATEGY_IMPORTS" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_ECONOMIC_VICTORY"/>
		<Row StrategyType="LEGACY_PATH_STRATEGY_WONDERS" ConditionFunction="HasLeaderTrait" Exclusive="true" ThresholdValue="1" StringValue="TRAIT_AQ_CULTURE_VICTORY"/>
*/


/*
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
('RHAI_ANT_WONDERS', 				'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE',  50);

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('RHAI_ANT_IMPORTS', 				'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE',  60);

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('RHAI_ANT_SCIENCE', 				'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE',  75);



UPDATE AiFavoredItems
SET Value = 30 -- Def 10
WHERE ListType = 'LegacyPathStrategyScienceYieldBiases' AND Item = 'Yield_SCIENCE';

UPDATE AiFavoredItems
SET Value = 20
WHERE ListType = 'LegacyPathStrategyExpansionYieldBiases' AND Item = 'YIELD_PRODUCTION';


INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('LegacyPathStrategyScienceYieldBiases', 	'YIELD_HAPPINESS',  10);

*/


-- Per Civ Strats


UPDATE AiFavoredItems
SET Value = 1000
WHERE ListType = 'Maya Constructibles Biases' 
AND Item IN ('BUILDING_JALAW', 'BUILDING_KUH_NAH'); -- Really OP


----------------
-- Temp Civ Preferences


UPDATE LeaderCivPriorities
SET Priority = 4
WHERE Leader = 'LEADER_LAFAYETTE' 
AND Civilization = 'CIVILIZATION_ROME';


INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_BENJAMIN_FRANKLIN', 'CIVILIZATION_MAYA', 4);


INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CONFUCIUS', 'CIVILIZATION_MISSISSIPPIAN', 3);

INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_HARRIET_TUBMAN', 'CIVILIZATION_MAYA', 3);

INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_TRUNG_TRAC', 'CIVILIZATION_ROME', 2);

INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CHARLEMAGNE', 'CIVILIZATION_MAURYA', 3);

INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_ISABELLA', 'CIVILIZATION_MAYA', 3);


UPDATE LeaderCivPriorities
SET Priority = 4
WHERE Leader = 'LEADER_CATHERINE' 
AND Civilization = 'CIVILIZATION_MAYA';


UPDATE LeaderCivPriorities
SET Priority = 1
WHERE Leader = 'LEADER_CATHERINE' 
AND Civilization = 'CIVILIZATION_ROME';









---------------------------
-- Progression Tree Node Test



		
-- Insert the AI List Type
INSERT INTO AiListTypes (ListType) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT');

-- Insert the Leader's AI List System association
INSERT INTO AiLists (ListType, LeaderType, System) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT', 'TRAIT_ANTIQUITY_CIV', 'ProgressionTreeNodeBiases');

-- Insert the favored item for AI
--INSERT INTO AiFavoredItems (ListType, Item, Value) 
--VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases', 'NODE_CIVIC_AQ_MAIN_MYSTICISM', 500);
		
		
INSERT INTO AiFavoredItems (ListType, Item, Value) 
SELECT 'RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT', ProgressionTreeNodeType, 900
FROM ProgressionTreeNodes
WHERE ProgressionTree LIKE 'TREE_CIVICS_AQ_%' 
AND ProgressionTree NOT LIKE '%MAIN%';

		
		
		


/*		
		TREE_CIVICS_AQ_GREECE
		
		
		
		<Row ListType="Antiquity Constructible Biases" LeaderType="TRAIT_ANTIQUITY_CIV" System="ConstructibleBiases"/>		
		
		
		
		<ProgressionTreeNodes>	
		<!-- Egypt -->
		<Row ProgressionTreeNodeType="NODE_CIVIC_AQ_EGYPT_ARRIVAL_OF_HAPI" ProgressionTree="TREE_CIVICS_AQ_EGYPT" Cost="150" Name="LOC_CIVIC_ARRIVAL_OF_HAPI_NAME" IconString="cult_egypt" />
		<Row ProgressionTreeNodeType="NODE_CIVIC_AQ_EGYPT_SCALES_OF_ANUBIS" ProgressionTree="TREE_CIVICS_AQ_EGYPT" Cost="150" Name="LOC_CIVIC_SCALES_OF_ANUBIS_NAME" IconString="cult_egypt" />
		<Row ProgressionTreeNodeType="NODE_CIVIC_AQ_EGYPT_LIGHT_OF_AMUN_RA" ProgressionTree="TREE_CIVICS_AQ_EGYPT" Cost="250" Name="LOC_CIVIC_LIGHT_OF_AMUN_RA_NAME" IconString="cult_egypt" />
		<!-- Greece -->
		<Row ProgressionTreeNodeType="NODE_CIVIC_AQ_GREECE_EKKLESIA" ProgressionTree="TREE_CIVICS_AQ_GREECE" Cost="150" Name="LOC_CIVIC_EKKLESIA_NAME" IconString="cult_greece" />
		<Row ProgressionTreeNodeType="NODE_CIVIC_AQ_GREECE_AGOGE" ProgressionTree="TREE_CIVICS_AQ_GREECE" Cost="150" Name="LOC_CIVIC_AGOGE_NAME" IconString="cult_greece" />		
		</ProgressionTreeNodes>
*/