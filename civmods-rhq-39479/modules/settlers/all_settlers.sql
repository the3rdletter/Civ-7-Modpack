------------------------------------------
-- PlotEvaluations (Settlement Scoring System)
------------------------------------------

-- This system calculates scores for settlement locations.
-- Scores help decide where to place new cities.
-- Scores can be viewed in-game for recommended plots using Lua functions.

-- Important Notes:
-- 1. Favored flag is generally ignored in this scoring system.
-- 2. Fractions don't affect calculations. Only integer values are used.
-- 3. Scores update only at the start of each turn.
-- 4. Newly revealed tiles during a turn do not immediately change scores.

-- Parameters for Scoring (field: Item):
-- "Foreign Continent": Adds value if the plot is on a different continent.
--     - Only applies for the first settler if Favored=1.
-- "Coastal": Adds value for coastal tiles.
--     - If a tile has both coastal and freshwater, coastal might be ignored.
-- "Fresh Water": Adds value if the plot has freshwater (river or lake).
-- "Inner Ring Yield": Adds (Value * Yield) for the 6 tiles surrounding the central tile (central tile excluded).
-- "Total Yield": Adds (Value * Yield) across Rings 1-3 (overlaps with Inner Ring).
-- "Resource Class": Adds value for each revealed resource of a specific class in Rings 1-3.
-- "New Resources": Adds value for each new resource in Ring 1, regardless of improvements or tech requirements.
-- "Specific Resource": Adds value per revealed copy of a specified resource within Rings 1-3.
-- "Specific Feature": Adds value per specified feature within Rings 1-3.
--     - Note: For Natural Wonders, all wonders count as one category due to current limitations.
-- "Nearest Friendly City": Usually negative; adds (Value * Distance) from nearest friendly city. Default is -10, strongly encouraging spacing.
--     - Default minimum spacing typically 3-4 tiles.
-- "Cultural Pressure":
--     - Favored=0, Value>0: Only safe combination to discourage settling near enemy culture.
--     - Other combinations are risky or ignored.
-- "Nearest Enemy City": Currently defined but unused.

-- Additional Info:
-- - Hills and mountains are ignored directly. Hills affect scores only via their yields.
-- - Total scoring is the sum of all active parameter values.

-- Generic AI Lists:
-- - StandardSettlePlot (default civ)
-- - ExpansionSettlementPreferences (rapid expansion)
-- - NavalSettlementPreferences (naval civs)

-- Settlement Preferences (Controls Dynamics):
-- Settlement scoring involves minimum values needed to settle new cities.
-- - MIN_VALUE_NEEDED: Minimum score required to settle a new city.
-- - CITY_MINIMUM_VALUE: Increases minimum needed after settling.
-- - DECAY_AMOUNT and DECAY_TURNS: Over time, reduces the city minimum value, allowing faster settlement.
-- - ADDITIONAL_VALUE_PER_CITY and CITY_VALUE_MULTIPLIER: Influence minimum required scores (exact functionality unclear).

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value, StringVal, TooltipString)
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
    ('Default Settlement Plot Evaluations', 'Specific Feature', 8, 'FEATURE_BERMUDA_TRIANGLE', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES'),
    ('Default Settlement Plot Evaluations', 'Specific Feature', 3, 'FEATURE_MOUNT_EVEREST', 'LOC_SETTLEMENT_RECOMMENDATION_FEATURES');

    
UPDATE AiFavoredItems 
SET Value = 2
WHERE Value > 2 
  AND ListType LIKE '%Settle Plot Conditions%'
  AND ListType NOT LIKE 'Default Settle Plot Conditions';

UPDATE AiFavoredItems 
SET Favored = 0
WHERE Favored = 1 
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
SET Value = 2
Where ListType = 'Default Settlement Plot Evaluations' and Item = 'Fresh Water';

-- Update the values for the specified rows to 2
Update AiFavoredItems
SET Value = 2
WHERE ListType = 'Default Settlement Plot Evaluations' 
  AND Item = 'Resource Class' 
  AND Favored = 'false' 
  AND StringVal = 'RESOURCECLASS_EMPIRE';

Update AiFavoredItems
SET Value = 2
WHERE ListType = 'Default Settlement Plot Evaluations' 
  AND Item = 'Resource Class' 
  AND Favored = 'false' 
  AND StringVal = 'RESOURCECLASS_CITY';

Update AiFavoredItems
SET Value = 2
WHERE ListType = 'Default Settlement Plot Evaluations' 
  AND Item = 'Resource Class' 
  AND Favored = 'false' 
  AND StringVal = 'RESOURCECLASS_BONUS';

------------------------------------------
-- City Proximity Settings
------------------------------------------

--Default -2 was -1 working

-- NEW 

UPDATE AiFavoredItems
SET Value = -5
WHERE ListType = 'Default Settlement Plot Evaluations' 
  AND Item = 'Nearest Enemy City' 
  AND Favored = '1';

UPDATE AiFavoredItems --
SET Value = -2
WHERE ListType = 'Default Settlement Plot Evaluations' AND Favored = '0' AND Item = 'Nearest Friendly City'; 

-- This was removed in patch 1.1.1 ... I am adding it back...
UPDATE AiFavoredItems -- 
SET Value = 10
WHERE ListType = 'Default Settlement Plot Evaluations' AND Favored = '1' AND Item = 'Nearest Friendly City';

-- This fixed settles.. this is important. No idea why it was removed...
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value, Favored, TooltipString)
VALUES
('Default Settlement Plot Evaluations', 'Nearest Friendly City', 5, 1, 'LOC_SETTLEMENT_RECOMMENDATION_NEAREST_CITY');

-- Attempt removing the nonfavored row
-- DELETE FROM AiFavoredItems WHERE Item = 'Nearest Friendly City' AND Favored = 0;

-- Shut off the desire for resource diversity, I think it might be
-- a major cause of forward settling, and I'm not sure it actually matters in game
-- I have found it does matter in the game. but i think city wise, not empire wise. 
UPDATE AiFavoredItems SET Value = 1 WHERE ListType = 'Default Settlement Plot Evaluations' AND TooltipString = 'LOC_SETTLEMENT_RECOMMENDATION_NEW_RESOURCES' AND Item = 'Resource Class' AND StringVal ='RESOURCECLASS_BONUS'; 

