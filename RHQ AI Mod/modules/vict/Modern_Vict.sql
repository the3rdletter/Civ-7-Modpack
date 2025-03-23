-- ==========================================================================
-- RHQ AI Mod - Modern Age Victory Path Settings
-- ==========================================================================
-- Victory path specific AI behavior settings for modern era gameplay
-- Adjusts strategy conditions and biases for different victory types

-- ==========================================================================
-- Science Victory Strategy Adjustments
-- ==========================================================================
-- Clear previous strategy conditions
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_SPACE_RACE';

-- Define new conditions for science victory pursuit
INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'GovernmentMatches', 25, 'GOVERNMENT_ELECTIVE_REPUBLIC'),
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'TopSciencePercent', 35, NULL), -- Increased from 25
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'TopSciencePercent', 50, NULL), -- Was previously 50, then 60
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'VictoryPoints', 1, 'VICTORY_MODERN_SCIENCE'),
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_SCIENTIFIC'),
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_MILITARISTIC');

-- Exclusive condition that strongly pushes toward science victory
INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES 
    ('LEGACY_PATH_STRATEGY_SPACE_RACE', 'HasLeaderTrait', 1, 'TRAIT_MO_SCIENCE_VICTORY', 0);

-- ==========================================================================
-- Economic Expansion Adjustments
-- ==========================================================================
-- Increase city expansion priority for railroad strategy (from default 25)
UPDATE AiFavoredItems
SET Value = 75
WHERE ListType = 'LegacyPathStrategyRailroadsPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

-- ==========================================================================
-- Aggressive Behavior Integration
-- ==========================================================================
-- Link military victory path with aggressive behavior templates
INSERT OR IGNORE INTO Strategy_Priorities (StrategyType, ListType) VALUES
('LEGACY_PATH_STRATEGY_IDEOLOGY', 'RHAI_AGGRESSIVE'),
('LEGACY_PATH_STRATEGY_IDEOLOGY', 'RHAI_AGGRESSIVE_PSEUDOYIELDBIASES'),
('LEGACY_PATH_STRATEGY_IDEOLOGY', 'RHAI_AGGRESSIVE_DIPLO');

-- ==========================================================================
-- Commented Legacy Code (Preserved for Reference)
-- ==========================================================================
/*
-- Military Victory
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_IDEOLOGY';

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'TopMilitaryPercent', 45, NULL), -- pvs 50
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'TopMilitaryPercent', 25, NULL),
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'NumCommanders', 4, NULL),
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'NumConqueredCities', 1, NULL),
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'GovernmentMatches', 25, 'GOVERNMENT_AUTHORITARIANISM'),
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_MILITARISTIC'),
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_POLITICAL');

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES 
    ('LEGACY_PATH_STRATEGY_IDEOLOGY', 'HasLeaderTrait', 1, 'TRAIT_MO_MILITARY_VICTORY', 1);

-- Economic Victory
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_RAILROAD_TYCOON';

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'GovernmentMatches', NULL, 'GOVERNMENT_BUREAUCRATIC_MONARCHY'),
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'YieldIncome', 70, 'YIELD_PRODUCTION'), -- pvs 60
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'NumCities', 4, NULL),
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'VictoryPoints', 1, 'VICTORY_MODERN_ECONOMIC'),
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_ECONOMIC'),
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_EXPANSIONIST');

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES 
    ('LEGACY_PATH_STRATEGY_RAILROAD_TYCOON', 'HasLeaderTrait', 1, 'TRAIT_MO_ECONOMIC_VICTORY', 1);

-- Culture Victory
DELETE FROM StrategyConditions WHERE StrategyType = 'LEGACY_PATH_STRATEGY_ARTIFACTS';

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue) VALUES 
    ('LEGACY_PATH_STRATEGY_ARTIFACTS', 'GovernmentMatches', 25, 'GOVERNMENT_ELECTIVE_REPUBLIC'),
    ('LEGACY_PATH_STRATEGY_ARTIFACTS', 'NumGreatWorks', 3, NULL), -- pvs 3, 4 , broke at 4
    ('LEGACY_PATH_STRATEGY_ARTIFACTS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_CULTURAL'),
    ('LEGACY_PATH_STRATEGY_ARTIFACTS', 'HasLeaderTrait', 1, 'TRAIT_LEADER_ATTRIBUTE_POLITICAL');

INSERT INTO StrategyConditions (StrategyType, ConditionFunction, ThresholdValue, StringValue, Exclusive) VALUES 
    ('LEGACY_PATH_STRATEGY_ARTIFACTS', 'HasLeaderTrait', 1, 'TRAIT_MO_CULTURE_VICTORY', 1);
*/

----------------
-- Temp Civ Preferences

INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_LAFAYETTE', 'CIVILIZATION_MEXICO', 4);

INSERT INTO LeaderCivPriorities (Leader, Civilization, Priority)  
VALUES ('LEADER_CHARLEMAGNE', 'CIVILIZATION_MEXICO', 3);




---------------------------
-- Progression Tree Node Test



-- Insert the AI List Type
INSERT INTO AiListTypes (ListType) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Modern');

-- Insert the Leader's AI List System association
INSERT INTO AiLists (ListType, LeaderType, System) 
VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Modern', 'TRAIT_MODERN_CIV', 'ProgressionTreeNodeBiases');

-- Insert the favored item for AI
--INSERT INTO AiFavoredItems (ListType, Item, Value) 
--VALUES ('RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases', 'NODE_CIVIC_AQ_MAIN_MYSTICISM', 500);
		
		
INSERT INTO AiFavoredItems (ListType, Item, Value) 
SELECT 'RHQ ALL CIV UNIQUE ProgressionTreeNodes Biases Modern', ProgressionTreeNodeType, 500
FROM ProgressionTreeNodes
WHERE ProgressionTree LIKE 'TREE_CIVICS_AQ_%'
AND ProgressionTree NOT LIKE '%MAIN%';		
		