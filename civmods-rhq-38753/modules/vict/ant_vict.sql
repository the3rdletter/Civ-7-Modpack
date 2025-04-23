-- RH Victory Conditions
---------------------------------------------------------------
-- LEGACY_PATH_STRATEGY_IMPORTS
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_IMPORTS';


UPDATE Strategies
SET MinNumConditionsNeeded = 2, MaxNumConditionsNeeded = 6
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_IMPORTS' AND LegacyPathType = 'LEGACY_PATH_ANTIQUITY_ECONOMIC';


INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
  --  ('LEGACY_PATH_STRATEGY_IMPORTS', 		'GovernmentMatches',	 '1', 		'GOVERNMENT_OLIGARCHY'),
	
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'NumCities', 			5, 				    NULL),	
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'NumMajorsMet', 		'2', 				NULL),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'LimitedWars', 			'2', 				NULL),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'VictoryPoints', 		'3', 			'VICTORY_ANTIQUITY_ECONOMIC'),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'HasLeaderTrait', 		'1', 			'TRAIT_LEADER_ATTRIBUTE_POLITICAL'),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'HasLeaderTrait', 		'1', 			'TRAIT_LEADER_ATTRIBUTE_ECONOMIC');
	
	
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES 	
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'HasLeaderTrait', 		1, 			'TRAIT_AQ_ECONOMIC_VICTORY', 0);


/*
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Disqualifier) VALUES 
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'NumCities',	 '1', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'NumCities',	 '2', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_IMPORTS', 		'NumCities',	 '3', 		NULL, 1);
*/

---------------------------------------------------------------
-- Delete existing entries for LEGACY_PATH_STRATEGY_WONDERS
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_WONDERS';


UPDATE Strategies
SET MinNumConditionsNeeded = 2, MaxNumConditionsNeeded = 4
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_WONDERS' AND LegacyPathType = 'LEGACY_PATH_ANTIQUITY_CULTURE';

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
  --  ('LEGACY_PATH_STRATEGY_WONDERS', 'GovernmentMatches', 1, 'GOVERNMENT_CLASSICAL_REPUBLIC'),
  
    ('LEGACY_PATH_STRATEGY_WONDERS', 'NumCities', 		5, 				NULL),
    ('LEGACY_PATH_STRATEGY_WONDERS', 'TopYieldPercent', 35, 'YIELD_PRODUCTION'),
    ('LEGACY_PATH_STRATEGY_WONDERS', 'NumWonders', 		2, NULL),
    ('LEGACY_PATH_STRATEGY_WONDERS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_CULTURAL');

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_WONDERS', 'HasLeaderTrait', 1, 'TRAIT_AQ_CULTURE_VICTORY', 0);


/*
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Disqualifier) VALUES 
    ('LEGACY_PATH_STRATEGY_WONDERS', 		'NumCities',	 '1', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_WONDERS', 		'NumCities',	 '2', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_WONDERS', 		'NumCities',	 '3', 		NULL, 1);
*/


----------------------------------------------------------------
-- Delete existing entries for LEGACY_PATH_STRATEGY_SCIENCE
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_SCIENCE';

UPDATE Strategies
SET MinNumConditionsNeeded = 3, MaxNumConditionsNeeded = 6
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_SCIENCE' AND LegacyPathType = 'LEGACY_PATH_ANTIQUITY_SCIENCE';


INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'GovernmentMatches', 1, 'GOVERNMENT_DESPOTISM'),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'NumCities', 5, NULL),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'NumCities', 7, NULL),	
	
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'TopSciencePercent', 50, NULL),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'NumGreatWorks', 2, NULL),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_SCIENTIFIC');

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_SCIENCE', 'HasLeaderTrait', 1, 'TRAIT_AQ_SCIENCE_VICTORY', 0);

/*
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Disqualifier) VALUES 
    ('LEGACY_PATH_STRATEGY_SCIENCE', 		'NumCities',	 '1', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 		'NumCities',	 '2', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_SCIENCE', 		'NumCities',	 '3', 		NULL, 1);
*/

-------------------------------------------------------------

-- 		<Row StrategyType="LEGACY_PATH_STRATEGY_EXPANSION" LegacyPathType="LEGACY_PATH_ANTIQUITY_MILITARY" MinNumConditionsNeeded="2" MaxNumConditionsNeeded="7"/>

-- DELETE existing entries for LEGACY_PATH_STRATEGY_EXPANSION
DELETE FROM StrategyConditions
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_EXPANSION';

UPDATE Strategies
SET MinNumConditionsNeeded = 3, MaxNumConditionsNeeded = 7
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_EXPANSION' AND LegacyPathType = 'LEGACY_PATH_ANTIQUITY_MILITARY';


INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'GovernmentMatches', '1', 'GOVERNMENT_DESPOTISM'),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'NumCities', '4', NULL),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'NumConqueredCities', '1', NULL),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'TopMilitaryPercent', '25', NULL),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'NumCommanders', '2', NULL),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'HasLeaderTrait', '1', 'TRAIT_LEADER_ATTRIBUTE_MILITARISTIC'),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'HasLeaderTrait', '1', 'TRAIT_LEADER_ATTRIBUTE_EXPANSIONIST');

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES
    ('LEGACY_PATH_STRATEGY_EXPANSION', 'HasLeaderTrait', 1, 'TRAIT_AQ_MILITARY_VICTORY', 0);


/*
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Disqualifier) VALUES 
    ('LEGACY_PATH_STRATEGY_EXPANSION', 		'NumCities',	 			 '1', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 		'NumCities',				 '2', 		NULL, 1),
    ('LEGACY_PATH_STRATEGY_EXPANSION', 		'NumCities',	 			 '3', 		NULL, 1);
*/


-------------------------------------------------------------









INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES
    -- Antiquity Majors
 --   ('Antiquity Tag Biases', 'PRODUCTION', 100),
  --  ('Antiquity Constructible Biases', 'BUILDING_GARDEN', -50),

    ('Antiquity Unit Biases', 'UNIT_MERCHANT', 750), -- Important for Resource Victory and Success -- pvs 175, 220, 300
    ('Antiquity Unit Biases', 'UNIT_WATONATHI', 1000); -- 330



-- Bug Fix -- Expansion in Import Budget Biases


UPDATE AiFavoredItems
SET ListType = 'LegacyPathStrategyImportsBudgetBiases'
WHERE Value = 33 AND Item = 'AI_BUDGET_EXPLORATION';

-- Budgets

UPDATE AiFavoredItems -- def 100
SET Value = 40
WHERE ListType = 'LegacyPathStrategyImportsBudgetBiases' AND Item = 'AI_BUDGET_GARRISON';

UPDATE AiFavoredItems -- def -50
SET Value = -50
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

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES

    ('LegacyPathStrategyExpansionBudgetBiases', 'AI_BUDGET_EXPANSION', 55); -- Expand Quickly


-- Insert into AiListTypes
INSERT INTO AiListTypes (ListType)
VALUES ('RHQ Expansion Const Preferences');

-- Insert into Strategy_Priorities
INSERT INTO Strategy_Priorities (StrategyType, ListType)
VALUES ('LEGACY_PATH_STRATEGY_SCIENCE', 'RHQ Expansion Const Preferences');


-- Insert into AiLists
INSERT INTO AiLists (ListType, System)
VALUES ('RHQ Expansion Const Preferences', 'ConstructibleBiases');


INSERT OR IGNORE INTO AiFavoredItems (ListType, Item,  Value) VALUES
('RHQ Expansion Const Preferences', 				'WONDER_GATE_OF_ALL_NATIONS',  950); -- Important for War





UPDATE AiFavoredItems
SET Value = 75
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';


INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES

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
SET Value = 5000
WHERE ListType = 'Maya Constructibles Biases' 
AND Item IN ('BUILDING_JALAW', 'BUILDING_KUH_NAH'); -- Really OP


----------------------------------------------------------------------------
-- Antiquity Civ Preferences -- To be moved eventually


UPDATE LeaderCivPriorities
SET Priority = 4
WHERE Leader = 'LEADER_LAFAYETTE' 
AND Civilization = 'CIVILIZATION_ROME';


INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_BENJAMIN_FRANKLIN', 'CIVILIZATION_MAYA', 4);

-- LEADER_CONFUCIUS

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CONFUCIUS', 'CIVILIZATION_MISSISSIPPIAN', 3);

UPDATE LeaderCivPriorities -- Def 4
SET Priority = 3
WHERE Leader = 'LEADER_CONFUCIUS' 
AND Civilization = 'CIVILIZATION_HAN';


-- LEADER_HARRIET_TUBMAN

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_HARRIET_TUBMAN', 'CIVILIZATION_MAYA', 3); -- Above Others at 2

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_HARRIET_TUBMAN', 'CIVILIZATION_GREECE', 2); -- New

UPDATE LeaderCivPriorities -- Def 2
SET Priority = 1
WHERE Leader = 'LEADER_HARRIET_TUBMAN' 
AND Civilization = 'CIVILIZATION_EGYPT';




INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_TRUNG_TRAC', 'CIVILIZATION_ROME', 3);

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CHARLEMAGNE', 'CIVILIZATION_MAURYA', 3);

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_ISABELLA', 'CIVILIZATION_MAYA', 3);

-- LEADER_AUGUSTUS
--		<Row Leader="LEADER_AUGUSTUS" Civilization="CIVILIZATION_CARTHAGE" Priority="1"/> */


UPDATE LeaderCivPriorities -- Def 1 -- Can only have one city -- Combos really well with bonus' to Towns
SET Priority = 2
WHERE Leader = 'LEADER_AUGUSTUS' 
AND Civilization = 'CIVILIZATION_CARTHAGE';


-- LEADER_CATHERINE

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CATHERINE', 'CIVILIZATION_MAYA', 4);

UPDATE LeaderCivPriorities
SET Priority = 1
WHERE Leader = 'LEADER_CATHERINE' 
AND Civilization = 'CIVILIZATION_ROME';


-- LEADER_HIMIKO
	/*	<Row Leader="LEADER_HIMIKO" Civilization="CIVILIZATION_MISSISSIPPIAN" Priority="2"/>
		<Row Leader="LEADER_HIMIKO" Civilization="CIVILIZATION_KHMER" Priority="2"/> */

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  -- Op for Science Scaling
VALUES ('LEADER_HIMIKO', 'CIVILIZATION_MAYA', 3);

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  -- Happiness Focus
VALUES ('LEADER_HIMIKO', 'CIVILIZATION_MAURYA', 1);

--		<Row Leader="LEADER_JOSE_RIZAL" Civilization="CIVILIZATION_MISSISSIPPIAN" Priority="2"/>
--		<Row Leader="LEADER_JOSE_RIZAL" Civilization="CIVILIZATION_MAYA" Priority="2"/>

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  -- Happiness Focus
VALUES ('LEADER_JOSE_RIZAL', 'CIVILIZATION_MAURYA', 2);

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  -- Happiness Focus
VALUES ('LEADER_JOSE_RIZAL', 'CIVILIZATION_ROME', 1);


--		<Row Leader="LEADER_MACHIAVELLI" Civilization="CIVILIZATION_ROME" Priority="1"/>
--		<Row Leader="LEADER_MACHIAVELLI" Civilization="CIVILIZATION_GREECE" Priority="1"/>

UPDATE LeaderCivPriorities
SET Priority = 2
WHERE Leader = 'LEADER_MACHIAVELLI' 
AND Civilization = 'CIVILIZATION_ROME';

UPDATE LeaderCivPriorities
SET Priority = 2
WHERE Leader = 'LEADER_MACHIAVELLI' 
AND Civilization = 'CIVILIZATION_GREECE';


UPDATE LeaderCivPriorities -- Def 1
SET Priority = 2
WHERE Leader = 'LEADER_HATSHEPSUT' 
AND Civilization = 'CIVILIZATION_AKSUM';


	--	<Row Leader="LEADER_XERXES" Civilization="CIVILIZATION_PERSIA" Priority="4"/>
	--	<Row Leader="LEADER_XERXES" Civilization="CIVILIZATION_MAURYA" Priority="1"/>
	
INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_XERXES', 'CIVILIZATION_ROME', 2);


-- 		<Row Leader="LEADER_AMINA" Civilization="CIVILIZATION_AKSUM" Priority="2"/>
--		<Row Leader="LEADER_AMINA" Civilization="CIVILIZATION_EGYPT" Priority="2"/>

UPDATE LeaderCivPriorities -- Def 2
SET Priority = 3
WHERE Leader = 'LEADER_AMINA' 
AND Civilization = 'CIVILIZATION_AKSUM';

--		<Row Leader="LEADER_FRIEDRICH" Civilization="CIVILIZATION_ROME" Priority="2"/>
--		<Row Leader="LEADER_FRIEDRICH" Civilization="CIVILIZATION_EGYPT" Priority="1"/>

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  -- Commander and Attacking Bonus
VALUES ('LEADER_FRIEDRICH', 'CIVILIZATION_PERSIA', 2);

-------------------------------------------------------------------------------------------
-- Progression Tree Node Changes



		
-- INSERT OR IGNORE the AI List Type
INSERT OR IGNORE INTO AiListTypes (ListType) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT');

-- INSERT OR IGNORE the Leader's AI List System association
INSERT OR IGNORE INTO AiLists (ListType, LeaderType, System) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT', 'TRAIT_ANTIQUITY_CIV', 'ProgressionTreeNodeBiases');

-- INSERT OR IGNORE the favored item for AI
--INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) 
--VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases', 'NODE_CIVIC_AQ_MAIN_MYSTICISM', 500);
		
		
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) 
SELECT 'RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT', ProgressionTreeNodeType, 550
FROM ProgressionTreeNodes
WHERE ProgressionTree LIKE 'TREE_CIVICS_AQ_%' 
AND ProgressionTree NOT LIKE '%MAIN%';


INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES
 ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases ANT', 'NODE_CIVIC_AQ_MAIN_MYSTICISM', 850);



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