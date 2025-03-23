/*
==============================================
RHQ AI Enhancement Mod
Version: 1.0
==============================================
This module enhances the base game AI behavior
by modifying core operation parameters and
introducing custom pseudo yield biases.
==============================================
*/

------------------------------------------
-- AI Operation Definitions
------------------------------------------
UPDATE AiOperationDefs
SET BehaviorTree = 'Settle New Town v2', MaxTargetDefense = 1, Priority = 4
WHERE OperationName = 'City Founding';

UPDATE AiOperationDefs
SET BehaviorTree = 'Simple City Assault v2', MinOddsOfSuccess = 0.17
WHERE OperationName = 'Attack Enemy City';

-- Trying to troubleshoot DOW bug in base game.
UPDATE AiOperationDefs
SET EnemyType = 'WAR', MinOddsOfSuccess = .15
WHERE OperationName = 'Attack Enemy Independent';

-- This has been changed to be a little more aggressive.
INSERT INTO AiOperationDefs (OperationName, TargetType, BehaviorTree, Priority, MinOddsOfSuccess, MustHaveUnits)
VALUES ('Attack City No Diplo', 'TARGET_ENEMY_CITY', 'Simple City Assault No Diplo', 3, 0.15, 5);

------------------------------------------
-- AI Operation Teams Configuration
------------------------------------------
UPDATE AIOperationTeams
SET SafeRallyPoint = 0
WHERE OperationName = 'City Founding';

UPDATE AIOperationTeams
SET InitialStrengthAdvantage = -1, OngoingStrengthAdvantage = 1
WHERE OperationName = 'Attack Enemy City';

UPDATE AIOperationTeams
SET InitialStrengthAdvantage = -1, OngoingStrengthAdvantage = 0
WHERE OperationName = 'Independent Camp Attack';

-- Lowered Initial Strength Advantage to -1 to always defend cities.
UPDATE AIOperationTeams
SET InitialStrengthAdvantage = -1, OngoingStrengthAdvantage = 0
WHERE OperationName = 'City Defense';

------------------------------------------
-- AI Lists and Types
------------------------------------------
INSERT INTO AILists (LeaderType, ListType, System)
VALUES ('TRAIT_LEADER_MAJOR_CIV', 'Major PsuedoYield Biases', 'YieldBiases');

INSERT INTO AIListTypes (ListType)
VALUES ('Major PsuedoYield Biases');

------------------------------------------
-- Operation Limits
------------------------------------------
UPDATE AiFavoredItems
SET Value = 2
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_FOUNDING';

-- This can be Naval Attack as well.
UPDATE AiFavoredItems
SET Value = 4
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_ASSAULT';

UPDATE AiFavoredItems
SET Value = 4
WHERE ListType = 'PerWarOperationsLimits' AND Item = 'CITY_ASSAULT';

-- INSERT INTO AiFavoredItems (ListType, Item, Value)
-- VALUES ('BaseOperationsLimits', 'CITY_DEFENSE', 2);

-- Insert custom pseudo yield biases
INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 1000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE', 5), -- default 5
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_ARMY_COMMANDER', 100),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_NEW_CITY', 750);

------------------------------------------
-- Tactical Priorities
------------------------------------------
-- Shut off the desire for resource diversity, I think it might be
-- a major cause of forward settling, and I'm not sure it actually matters in game
-- I have found it does matter in the game. but i think city wise, not empire wise. 
UPDATE AiFavoredItems SET Value = 1 WHERE ListType = 'Default Settlement Plot Evaluations' AND TooltipString = 'LOC_SETTLEMENT_RECOMMENDATION_NEW_RESOURCES' AND Item = 'Resource Class' AND StringVal ='RESOURCECLASS_BONUS'; 

-- Insert Default Tactical Capture City
INSERT INTO AiFavoredItems (ListType, Item, Value)
VALUES ('Default Tactical', 'Capture City', 7);

UPDATE AiFavoredItems
SET Value = 8
WHERE ListType = 'Default Tactical' AND Item = 'First Turn Settle';

UPDATE AiFavoredItems
SET Value = 7
WHERE ListType = 'Default Tactical' AND Item IN ('Air Assault', 'Air Rebase', 'Use WMD', 'Take Razing City', 'Capture City');

-- Insert 'Capture City' at some point to try
UPDATE AiFavoredItems
SET Value = 6
WHERE ListType = 'Default Tactical' AND Item IN ('Heal');

UPDATE AiFavoredItems
SET Value = 5
WHERE ListType = 'Default Tactical' AND Item IN ('Attack High Priority Unit');

UPDATE AiFavoredItems
SET Value = 4
WHERE ListType = 'Default Tactical' AND Item IN ('Attack Medium Priority Unit');

UPDATE AiFavoredItems
SET Value = 3
WHERE ListType = 'Default Tactical' AND Item IN ('Attack Low Priority Unit');

UPDATE AiFavoredItems
SET Value = 2
WHERE ListType = 'Default Tactical' AND Item IN ('Form Army', 'Explore', 'Plunder Trade Route', 'Upgrade Units', 'Defend Home');

UPDATE AiFavoredItems
SET Value = 1
WHERE ListType = 'Default Tactical' AND Item IN ('Wander near city', 'Use Great Person', 'Escort Embarked');

UPDATE AiFavoredItems
SET Value = 0
WHERE ListType = 'Default Tactical' AND Item IN ('Wander', 'Block Enemy Expansion', 'Army Overrun');

------------------------------------------
-- AI Operation Team Requirements
------------------------------------------
UPDATE OpTeamRequirements
SET MinNumber = 0 -- trying off again after the patch , MaxNumber = 7
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_MELEE';

UPDATE OpTeamRequirements
SET MinNumber = 0 -- trying off again after the patch , MaxNumber = 9 -- Too high and the AI won't attack
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_RANGED';

INSERT INTO OpTeamRequirements (TeamName, ClassTag, Property, MaxNumber)
VALUES ('Enemy City Attack', 'UNIT_CLASS_CREATE_TOWN', 'LandClaimCharges', 0);

INSERT INTO OpTeamRequirements (TeamName, ClassTag, MaxNumber)
VALUES ('Enemy City Attack', 'UNIT_CLASS_NON_COMBAT', 0);

-- Trying reconsider while preparing.

--UPDATE OpTeamRequirements
--SET ReconsiderWhilePreparing = true
--WHERE TeamName = 'Enemy City Attack';

-- Independent Camp Attack
UPDATE OpTeamRequirements
SET MinNumber = 2 -- trying off again after the patch , MaxNumber = 6
WHERE TeamName = 'Independent Camp Attack' AND ClassTag = 'UNIT_CLASS_MELEE';

UPDATE OpTeamRequirements
SET MinNumber = 3 -- trying off again after the patch MaxNumber = 8
WHERE TeamName = 'Independent Camp Attack' AND ClassTag = 'UNIT_CLASS_RANGED';

INSERT INTO OpTeamRequirements (TeamName, ClassTag, Property, MaxNumber)
VALUES ('Independent Camp Attack', 'UNIT_CLASS_CREATE_TOWN', 'LandClaimCharges', 0);

INSERT INTO OpTeamRequirements (TeamName, ClassTag, MaxNumber)
VALUES ('Independent Camp Attack', 'UNIT_CLASS_NON_COMBAT', 0);

-- City Defense
INSERT INTO OpTeamRequirements (TeamName, ClassTag, Property, MaxNumber)
VALUES ('City Defense', 'UNIT_CLASS_CREATE_TOWN', 'LandClaimCharges', 0);

-- Already Set to 0, this is for documentation to know why it's not set.
-- INSERT INTO OpTeamRequirements (TeamName, ClassTag, MaxNumber)
-- VALUES ('City Defense', 'UNIT_CLASS_NON_COMBAT', 0);

UPDATE OpTeamRequirements
SET MinNumber = 2 -- MaxNumber = 8
WHERE TeamName = 'City Defense' AND ClassTag = 'UNIT_CLASS_COMBAT';

INSERT INTO OpTeamRequirements (TeamName, ClassTag, MinNumber, MaxNumber)
VALUES ('City Defense', 'UNIT_CLASS_MELEE', 1, 4),
       ('City Defense', 'UNIT_CLASS_RANGED', 1, 6),
       ('City Defense', 'UNIT_CLASS_SIEGE', 0, 2);

-- City Founders
UPDATE OpTeamRequirements
SET MinNumber = 0, MaxNumber = 1
WHERE TeamName = 'City Founders' AND ClassTag = 'UNIT_CLASS_COMBAT';

UPDATE OpTeamRequirements
SET MaxNumber = 0
WHERE TeamName = 'City Founders' AND ClassTag = 'UNIT_CLASS_ARMY_COMMANDER';

------------------------------------------
-- Settlement Evaluations
------------------------------------------
-- Natural Wonder plot evaluations
-- Scaled to number of tiles...
INSERT INTO AiFavoredItems (ListType, Item, Value, StringVal, TooltipString)
VALUES 
    ('Default Settlement Plot Evaluations', 'Specific Feature', 4, 'FEATURE_VALLEY_OF_FLOWERS', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 2, 'FEATURE_BARRIER_REEF', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_REDWOOD_FOREST', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 2, 'FEATURE_GRAND_CANYON', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 8, 'FEATURE_GULLFOSS', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 2, 'FEATURE_HOERIKWAGGO', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 8, 'FEATURE_IGUAZU_FALLS', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_KILIMANJARO', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 4, 'FEATURE_ZHANGJIAJIE', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 2, 'FEATURE_THERA', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_TORRES_DEL_PAINE', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 8, 'FEATURE_ULURU', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_MACHAPUCHARE', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_MOUNT_FUJI', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_VIHREN', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 2, 'FEATURE_VINICUNCA', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 8, 'FEATURE_BERMUDA_TRIANGLE', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES');
    
UPDATE AiFavoredItems 
SET Value = 2
WHERE Value > 2 
  AND ListType LIKE '%Settle Plot Conditions%'
  AND ListType NOT LIKE 'Default Settle Plot Conditions';

-- Try to lower the value of coast further because coast can surround 3 rings of a city. It's not that valuable.
Update AiFavoredItems
SET Value = 0
Where ListType = 'Default Settlement Plot Evaluations' and Item = 'Coastal';

-- Carthage specific coast removal
Update AiFavoredItems
Set Value = 0 
Where ListType = 'Default Settlement Plot Evaluations' and Item = 'Specific Terrain' and StringVal = 'TERRAIN_COAST';

Update AiFavoredItems
SET Value = 1
Where ListType = 'Default Settlement Plot Evaluations' and Item = 'Fresh Water';

------------------------------------------
-- Legacy Path Adjustments
------------------------------------------
-- Increase science bias for Legacy Path Science
UPDATE AiFavoredItems
SET Value = 15 -- Def 10
WHERE ListType = 'LegacyPathStrategyScienceYieldBiases' AND Item = 'Yield_SCIENCE';

-- Increase production bias for Legacy Path Expansion
UPDATE AiFavoredItems
SET Value = 15
WHERE ListType = 'LegacyPathStrategyExpansionYieldBiases' AND Item = 'YIELD_PRODUCTION';

------------------------------------------
-- City Proximity Settings
------------------------------------------

--Default -2 was -1 working

UPDATE AiFavoredItems --
SET Value = -2
WHERE ListType = 'Default Settlement Plot Evaluations' AND Favored = '0' AND Item = 'Nearest Friendly City'; 

-- Default 5

UPDATE AiFavoredItems -- 
SET Value = 5
WHERE ListType = 'Default Settlement Plot Evaluations' AND Favored = '1' AND Item = 'Nearest Friendly City';