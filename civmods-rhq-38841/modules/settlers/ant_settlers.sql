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
-- "Coastal": Adds value for coastal tiles.
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
-- "Nearest Enemy City": Currently defined but unused.

-- Additional Info:
-- - Hills and mountains are ignored directly. Hills affect scores only via their yields.
-- - Total scoring is the sum of all active parameter values.

-- This file contains the SQL commands to modify the behavior of settlers in Antiquity.
-- Default GoodValue is -20 and PoorValue is -50
-- In antiquity, I want this way closer...

-- Fairly drastic, but I don't hate it....
-- this worked last, trying more aggressive...
--UPDATE PlotEvalConditions SET GoodValue = -6, PoorValue = -11 WHERE ConditionType = 'Nearest Friendly City';
UPDATE PlotEvalConditions SET GoodValue = -6, PoorValue = -11 WHERE ConditionType = 'Nearest Friendly City';
-- Try positive values first... still close settles.
-- okay, try just setting bad value since good value won't work in negatives here...
-- Hard to tell because ai's need more vision to make settle decisions.. will work on that, but leave this on.
-- it SEEMS like it helps..
UPDATE PlotEvalConditions SET GoodValue = -6, PoorValue = -10 WHERE ConditionType = 'Nearest Enemy City';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Coastal';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Foreign Continent';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Foreign Hemisphere';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Specific Terrain';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Specific Feature';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Specific Resource';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Resource Class';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Specific Biome';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'Lake';
UPDATE PlotEvalConditions SET GoodValue = 0, PoorValue = -1 WHERE ConditionType = 'New Resources';
UPDATE PlotEvalConditions SET GoodValue = 1, PoorValue = 0 WHERE ConditionType = 'Fresh Water';

-- Default GoodValue is 26 and PoorValue is 18
UPDATE PlotEvalConditions SET GoodValue = 13, PoorValue = 5 WHERE ConditionType = 'Inner Ring Yield';
-- Default GoodValue is 50 and PoorValue is 30
UPDATE PlotEvalConditions SET GoodValue = 25, PoorValue = 8 WHERE ConditionType = 'Total Yield';


-- Favored for Settle Plots makes the settles crazy.

UPDATE AiFavoredItems SET Favored = 0 WHERE ListType = '%Settle Plot Conditions';