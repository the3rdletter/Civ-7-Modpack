-- ==========================================================================
-- RHQ AI Mod - Exploration Age Victory Path Settings
-- ==========================================================================
-- Victory path specific AI behavior settings for exploration era gameplay
-- Adjusts strategy conditions, pseudoyields, and biases for different victory types

-- ==========================================================================
-- Global Expansion and City Growth Adjustments
-- ==========================================================================
-- Increase city founding priority (from default 200) -- pvs 400, 550
UPDATE PseudoYields SET DefaultValue = 1500
WHERE PseudoYieldType = 'PSEUDOYIELD_NEW_CITY';

-- Increase town to city upgrade priority (from default 150)
UPDATE PseudoYields SET DefaultValue = 700
WHERE PseudoYieldType = 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION';

-- ==========================================================================
-- Strategy Condition Requirements Adjustments
-- ==========================================================================
-- Make cultural exploration path easier to trigger
UPDATE Strategies
SET MinNumConditionsNeeded = 2
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_RELICS' AND LegacyPathType = 'LEGACY_PATH_EXPLORATION_CULTURE';

-- Make economic exploration path easier to trigger
UPDATE Strategies
SET MinNumConditionsNeeded = 1
WHERE StrategyType = 'LEGACY_PATH_STRATEGY_RESOURCES' AND LegacyPathType = 'LEGACY_PATH_EXPLORATION_ECONOMIC';

-- ==========================================================================
-- Military Victory Strategy (Distant Settlements)
-- ==========================================================================
-- Reset and redefine conditions for military expansion victory
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS';

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'GovernmentMatches', 25, 'GOVERNMENT_FEUDAL_MONARCHY'),
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'TopMilitaryPercent', 25, NULL),
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'NumCommanders', 3, NULL),
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'VictoryPoints', 1, 'VICTORY_EXPLORATION_MILITARY'),
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_MILITARISTIC'),
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_EXPANSIONIST');

-- Add exclusive condition that strongly favors military victory
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'HasLeaderTrait', 1, 'TRAIT_EX_MILITARY_VICTORY', 0);

-- ==========================================================================
-- Economic Victory Strategy (Resources)
-- ==========================================================================
-- Reset and redefine conditions for economic resource victory
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_RESOURCES';

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_RESOURCES', 'GovernmentMatches', 25, 'GOVERNMENT_FEUDAL_MONARCHY'),
    ('LEGACY_PATH_STRATEGY_RESOURCES', 'VictoryPoints', 8, 'VICTORY_EXPLORATION_ECONOMIC'), -- Reduced from default 10
    ('LEGACY_PATH_STRATEGY_RESOURCES', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_ECONOMIC'),
    ('LEGACY_PATH_STRATEGY_RESOURCES', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_POLITICAL');

-- Add exclusive condition that strongly favors economic victory
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_RESOURCES', 'HasLeaderTrait', 1, 'TRAIT_EX_ECONOMIC_VICTORY', 0);

-- ==========================================================================
-- Cultural Victory Strategy (Relics)
-- ==========================================================================
-- Reset and redefine conditions for cultural relic victory
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_RELICS';

INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_RELICS', 'GovernmentMatches', 25, 'GOVERNMENT_THEOCRACY'),
    ('LEGACY_PATH_STRATEGY_RELICS', 'NumCities', 		7, NULL),
    ('LEGACY_PATH_STRATEGY_RELICS', 'NumGreatWorks',    3, NULL),
    ('LEGACY_PATH_STRATEGY_RELICS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_CULTURAL'),
    ('LEGACY_PATH_STRATEGY_RELICS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_POLITICAL');

-- Add exclusive condition that strongly favors cultural victory
INSERT OR IGNORE INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES  
    ('LEGACY_PATH_STRATEGY_RELICS', 'HasLeaderTrait', 1, 'TRAIT_EX_CULTURE_VICTORY', 0);

-- ==========================================================================
-- Building Priority Adjustments
-- ==========================================================================
-- Increase priority for fishing quay in treasure fleet strategy (from 200)
UPDATE AiFavoredItems
SET Value = 500
WHERE ListType = 'LegacyPathStrategyTreasureFleetConstructibleBiases' AND Item = 'BUILDING_FISHING_QUAY';

-- Make fishing quay a high priority city building
UPDATE AiFavoredItems
SET Value = 2000
WHERE ListType = 'CityStrategyBuildingsBiases' AND Item = 'BUILDING_FISHING_QUAY';

-- ==========================================================================
-- Distant Settlements Strategy Adjustments
-- ==========================================================================
-- Increase settlement cap priority (from 100)
UPDATE AiFavoredItems
SET Value = 1000
WHERE ListType = 'LegacyPathStrategyDistantSettlementsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE';

-- Adjust new city priority (from 100) for distant settlements strategy
UPDATE AiFavoredItems
SET Value = 400
WHERE ListType = 'LegacyPathStrategyDistantSettlementsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

-- Link distant settlements strategy with aggressive behavior templates
INSERT OR IGNORE INTO Strategy_Priorities (StrategyType, ListType) VALUES
('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'RHAI_AGGRESSIVE'),
('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'RHAI_AGGRESSIVE_PSEUDOYIELDBIASES'),
('LEGACY_PATH_STRATEGY_DISTANT_SETTLEMENTS', 'RHAI_AGGRESSIVE_DIPLO');

-- Discourage tall building strategy from expanding too much
UPDATE AiFavoredItems
SET Value = -15
WHERE ListType = 'LegacyPathStrategyBuildingsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

-- ==========================================================================
-- General Exploration Era Adjustments
-- ==========================================================================
-- Add biases for important buildings and units in exploration era
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES
('Exploration Constructible Biases', 'BUILDING_GRISTMILL', 350), -- Resource Capacity
('Exploration Unit Biases', 'UNIT_MERCHANT', 			   500); -- Important for Resource Victory and Success


-- ==========================================================================
-- Commented Legacy Code (Preserved for Reference)
-- ==========================================================================
/*
-- Already Exists
INSERT OR IGNORE INTO AiListTypes (ListType) VALUES
('RHAI_EXP_RESOURCES');

INSERT OR IGNORE INTO AiLists (ListType, System) VALUES
('RHAI_EXP_RESOURCES',	'ConstructibleBiases');

INSERT OR IGNORE INTO Strategy_Priorities (StrategyType, ListType) VALUES
('LEGACY_PATH_STRATEGY_SCIENCE', 'RHAI_EXP_RESOURCES');
*/



----------------
-- Exploration Civ Preferences

UPDATE LeaderCivPriorities
SET Priority = 4
WHERE Leader = 'LEADER_LAFAYETTE' 
AND Civilization = 'CIVILIZATION_NORMAN';

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_LAFAYETTE', 'CIVILIZATION_MONGOLIA', 2);




INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_BENJAMIN_FRANKLIN', 'CIVILIZATION_ABBASID', 4);

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_BENJAMIN_FRANKLIN', 'CIVILIZATION_SONGHAI', 3);



-- LEADER_CONFUCIUS
-- 				<Row Leader="LEADER_CONFUCIUS" Civilization="CIVILIZATION_MING" Priority="3"/>
-- 				<Row Leader="LEADER_CONFUCIUS" Civilization="CIVILIZATION_MONGOLIA" Priority="2"/>

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CONFUCIUS', 'CIVILIZATION_ABBASID', 4); -- New

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CONFUCIUS', 'CIVILIZATION_SONGHAI', 2);


UPDATE LeaderCivPriorities
SET Priority = 2
WHERE Leader = 'LEADER_CONFUCIUS' 
AND Civilization = 'CIVILIZATION_MING';

UPDATE LeaderCivPriorities
SET Priority = 1
WHERE Leader = 'LEADER_CONFUCIUS' 
AND Civilization = 'CIVILIZATION_MONGOLIA';



--		<Row Leader="LEADER_CHARLEMAGNE" Civilization="CIVILIZATION_NORMAN" Priority="3"/>
--		<Row Leader="LEADER_CHARLEMAGNE" Civilization="CIVILIZATION_SPAIN" Priority="1"/>


INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CHARLEMAGNE', 'CIVILIZATION_MONGOLIA', 4);


-- LEADER_HIMIKO

INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_HIMIKO', 'CIVILIZATION_ABBASID', 3); -- New

UPDATE LeaderCivPriorities -- Def 2
SET Priority = 3
WHERE Leader = 'LEADER_HIMIKO' 
AND Civilization = 'CIVILIZATION_HAWAII';



INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CATHERINE', 'CIVILIZATION_HAWAII', 3);

-- MAYA doesn't exist in exploration era
--INSERT OR IGNORE INTO LeaderCivPriorities (Leader, Civilization, Priority)  
--VALUES ('LEADER_CATHERINE', 'CIVILIZATION_MAYA', 3);


--LEADER_AUGUSTUS
/*		<Row Leader="LEADER_AUGUSTUS" Civilization="CIVILIZATION_ABBASID" Priority="2"/>
		<Row Leader="LEADER_AUGUSTUS" Civilization="CIVILIZATION_SPAIN" Priority="2"/>
*/


--------------------------
-- Progression Tree Node Test




-- Insert the AI List Type
INSERT INTO AiListTypes (ListType) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration');

-- Insert the Leader's AI List System association
INSERT INTO AiLists (ListType, LeaderType, System) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration', 'TRAIT_EXPLORATION_CIV', 'ProgressionTreeNodeBiases');

-- Insert the favored item for AI
--INSERT INTO AiFavoredItems (ListType, Item, Value) 
--VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases', 'NODE_CIVIC_AQ_MAIN_MYSTICISM', 500);
		

INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES
 ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration', 'NODE_CIVIC_EX_MAIN_ECONOMICS', 550),
 ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration', 'NODE_CIVIC_EX_MAIN_PIETY', 	950), -- Religion
-- Tech
 ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration', 'NODE_TECH_EX_CARTOGRAPHY', 750), -- Exploration
 ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration', 'NODE_TECH_EX_SHIPBUILDING', 550); -- Exploration, no more damage on ships -- unit movement penalty removed -- units damage as well with mastery


		
INSERT INTO AiFavoredItems (ListType, Item, Value) 
SELECT 'RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Exploration', ProgressionTreeNodeType, 500
FROM ProgressionTreeNodes
WHERE ProgressionTree LIKE 'TREE_CIVICS_AQ_%'
AND ProgressionTree NOT LIKE '%MAIN%';		
		