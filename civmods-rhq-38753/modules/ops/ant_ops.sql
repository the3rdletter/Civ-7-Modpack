---------------------------------------------------
-- AI OPS Ant Era

UPDATE AiOperationDefs
SET MaxTargetDefense = -1, Priority = 4, MaxTargetDistInArea = 10, MaxTargetDistInRegion = 10, MaxTargetDistInWorld = 10, MinOddsOfSuccess = 0.01
WHERE OperationName = 'City Founding';