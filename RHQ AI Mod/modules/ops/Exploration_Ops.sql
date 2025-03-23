

--------------

-- Allow more Attacks

UPDATE AiFavoredItems
SET Value = 2
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_ASSAULT';


UPDATE AiOperationDefs SET Priority = 3, MaxTargetDistInRegion = -1, MaxTargetDistInArea = 22, MaxTargetDistInWorld = 35,  MinOddsOfSuccess = 0.17, MustHaveUnits = 5 WHERE OperationName = 'Attack Enemy City' AND TargetType = 'TARGET_ENEMY_CITY';

-- New -- Not Currently Defined
UPDATE AiOperationDefs SET Priority = 2, MaxTargetDistInRegion = -1, MaxTargetDistInArea = 20, MaxTargetDistInWorld = 28,  MinOddsOfSuccess = 0.17, MustHaveUnits = 3 WHERE OperationName = 'Attack Enemy Independent' AND TargetType = 'TARGET_ENEMY_INDEPENDENT';
