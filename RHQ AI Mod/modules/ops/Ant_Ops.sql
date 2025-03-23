
---------------------------------------------------
-- AI OPS Ant Era

-- AI Operation Team Requirements
UPDATE OpTeamRequirements
SET MinNumber = 0 -- trying off in the new patch, MaxNumber = 6
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_MELEE';

UPDATE OpTeamRequirements
SET MinNumber = 0 -- trying off in the new patch, MaxNumber = 9 -- Too high and the AI won't attack
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_RANGED';


-- This is way too far, really we would rather them focus on closer targets in Antiquity. Just like settling.
UPDATE AiOperationDefs SET Priority = 3, MaxTargetDistInRegion = -1, MaxTargetDistInArea = 15, MaxTargetDistInWorld = 25,  MinOddsOfSuccess = 0.17, MustHaveUnits = 8 WHERE OperationName = 'Attack Enemy City' AND TargetType = 'TARGET_ENEMY_CITY';

UPDATE AiOperationDefs SET Priority = 3, MaxTargetDistInRegion = -1, MaxTargetDistInArea = 15, MaxTargetDistInWorld = 25,  MinOddsOfSuccess = 0.1, MustHaveUnits = 5 WHERE OperationName = 'Attack Enemy Independent' AND TargetType = 'TARGET_ENEMY_INDEPENDENT';

UPDATE AiOperationDefs SET Priority = 4, MaxTargetDistInRegion = -1, MaxTargetDistInArea = 10, MaxTargetDistInWorld = 10 WHERE OperationName = 'City Founding' AND TargetType = 'TARGET_NEW_CITY';

-- Todo more attacks for Military Victory

-- I know this isn't ops, but I am stealing it to test something. - q
-- Default GoodValue is -20 and PoorValue is -50
-- In antiquity, I want this way closer...

-- Fairly drastic, but I don't hate it....
UPDATE PlotEvalConditions SET GoodValue = -6, PoorValue = -11 WHERE ConditionType = 'Nearest Friendly City';
-- Try positive values first... still close settles.
-- okay, try just setting bad value since good value won't work in negatives here...
-- Hard to tell because ai's need more vision to make settle decisions.. will work on that, but leave this on.
-- it SEEMS like it helps..
UPDATE PlotEvalConditions SET PoorValue = 5 WHERE ConditionType = 'Nearest Enemy City';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = 0 WHERE ConditionType = 'Coastal';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = 0 WHERE ConditionType = 'Foreign Continent';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = 0 WHERE ConditionType = 'Foreign Hemisphere';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Specific Terrain';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Specific Feature';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Specific Resource';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Resource Class';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Specific Biome';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Lake';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'New Resources';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Fresh Water';

-- Default GoodValue is 26 and PoorValue is 18
UPDATE PlotEvalConditions SET GoodValue = 13, PoorValue = 9 WHERE ConditionType = 'Inner Ring Yield';
-- Default GoodValue is 50 and PoorValue is 30
UPDATE PlotEvalConditions SET GoodValue = 25, PoorValue = 10 WHERE ConditionType = 'Total Yield';
