------------------------------------------
-- Operation Limits
------------------------------------------
UPDATE AiFavoredItems
SET Value = 2
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_FOUNDING';

------------------------------------------
-- AI Operation Definitions
------------------------------------------
UPDATE AiOperationDefs
SET BehaviorTree = 'Settle New Town', Priority = 4
WHERE OperationName = 'City Founding';

