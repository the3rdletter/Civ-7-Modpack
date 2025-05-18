--------------

-- Allow more Attacks

UPDATE AiFavoredItems
SET Value = 2
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_ASSAULT';