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

/*
UPDATE AiFavoredItems
SET DefaultValue = 75
WHERE ListType = 'LegacyPathStrategyExpansionPseudoYieldBiases' AND Item = 'PSEUDOYIELD_NEW_CITY';

The problem I see updating Yields is there are psuedoyields that are not in the Yields table, and do not increase 
*/
UPDATE Yields
SET DefaultValue = 1.05
WHERE YieldType = 'YIELD_DIPLOMACY';

UPDATE Yields
SET DefaultValue = 1.0
WHERE YieldType = 'YIELD_GOLD';


UPDATE Yields
SET DefaultValue = 1.15
WHERE YieldType = 'YIELD_PRODUCTION';

UPDATE Yields
SET DefaultValue = 1.05
WHERE YieldType = 'YIELD_CULTURE';

UPDATE Yields
SET DefaultValue = 1.05
WHERE YieldType = 'YIELD_SCIENCE';

UPDATE Yields
SET DefaultValue = 1
WHERE YieldType = 'YIELD_FOOD';

------------------------------------------
-- Base Psueudo Yields
------------------------------------------
INSERT OR IGNORE INTO PseudoYields (PseudoYieldType, DefaultValue) VALUES 
       ('PSEUDOYIELD_NEW_CITY', 5000), -- Default 400
       ('PSEUDOYIELD_REPAIR_BONUS', 100000), -- Default 10000
       ('PSEUDOYIELD_PARTIAL_CONSTRUCTION_BONUS', 10000), -- Default 1000
       ('PSEUDOYIELD_BUILD_QUEUE_IN_CITY', 2000), -- Default 2000
       ('PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 1000), -- Default 150
       ('PSEUDOYIELD_VICTORY_PROJECT', 5000); -- Default 1500 

------------------------------------------
-- AI Lists and Types
------------------------------------------
INSERT OR IGNORE INTO AILists (LeaderType, ListType, System) VALUES 
       ('TRAIT_LEADER_MAJOR_CIV', 'Major PsuedoYield Biases', 'YieldBiases'),
       ('TRAIT_LEADER_MAJOR_CIV', 'Major Construtables Biases', 'ConstructibleBiases'),
       ('TRAIT_LEADER_MAJOR_CIV', 'Major Budget Biases', 'AiBudgetBiases'),
       ('TRAIT_LEADER_MAJOR_CIV', 'Major Unit Biases', 'UnitBiases');

INSERT OR IGNORE INTO AIListTypes (ListType) VALUES 
       ('Major PsuedoYield Biases'), 
       ('Major Construtables Biases'),
       ('Major Budget Biases'),
       ('Major Unit Biases');

-- INSERT OR IGNORE custom pseudo yield biases
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 10000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_REPAIR_BONUS', 2), -- this is showing as still 1.0000 in ai_citydevelopment at any value
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_PARTIAL_CONSTRUCTION_BONUS', 10000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_BUILD_QUEUE_IN_CITY', 1000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE', 5), -- default 5
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_ARMY_COMMANDER', 0),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_NEW_CITY', 500000), -- was 1000, 1500
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE', 50000), -- was 0	-- AI not researching enough settlement cap in the exploration and modern eras   
       -- ('Major PsuedoYield Biases', 'PSEUDOYIELD_TECH_MASTERY', 50000), -- not really working at 10000..
       -- ('Major PsuedoYield Biases', 'PSEUDOYIELD_CIVIC_MASTERY', 50000), -- not really working at 10000..
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_SLOT_CIV_UNIQUE_TRADITION', 10),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_UNLOCK_CIV_UNIQUE_TRADITION', 10),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_BASE_UNIQUE_DISTRICT_VALUE', 5000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_NAVY_UNIT', 1000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_NAVY_COMBAT_VALUE', 12),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_GUARDS', 1),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_DEFENSES', 1), -- This always seems to be 1.
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_GREAT_WORK', 20),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_GREAT_WORK_SLOT', 50);


-- Add custom constructible biases
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Construtables Biases', 'BUILDING_LAUNCH_PAD', 500000),
       ('Major Construtables Biases', 'BUILDING_AIRFIELD', 500000),
       ('Major Construtables Biases', 'BUILDING_SAW_PIT', 50000),
       ('Major Construtables Biases', 'BUILDING_BRICKYARD', 500000),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_BRIDGE', 0),
       ('Major Construtables Biases', 'BUILDING_MONUMENT', 1000),
       ('Major Construtables Biases', 'BUILDING_ALTAR', 800),
       ('Major Construtables Biases', 'BUILDING_LIGHTHOUSE', 500),
       ('Major Construtables Biases', 'BUILDING_MASTABA', 500),
       ('Major Construtables Biases', 'BUILDING_MORTUARY_TEMPLE', 500),
       ('Major Construtables Biases', 'BUILDING_ODEON', 500),
       ('Major Construtables Biases', 'BUILDING_PARTHENON', 500),
       ('Major Construtables Biases', 'BUILDING_DHARAMSHALA', 500),
       ('Major Construtables Biases', 'BUILDING_VIHARA', 500),
       ('Major Construtables Biases', 'BUILDING_JALAW', 500),
       ('Major Construtables Biases', 'BUILDING_KUH_NAH', 500),
       ('Major Construtables Biases', 'BUILDING_BASILICA', 500),
       ('Major Construtables Biases', 'BUILDING_TEMPLE_OF_JUPITER', 500),
       ('Major Construtables Biases', 'BUILDING_BLACKSMITH', 20),
       ('Major Construtables Biases', 'BUILDING_VILLA', 15),
       ('Major Construtables Biases', 'BUILDING_ARENA', 15),
       ('Major Construtables Biases', 'BUILDING_AMPHITHEATER', 10),
       ('Major Construtables Biases', 'BUILDING_BARRACKS', 10),
       ('Major Construtables Biases', 'BUILDING_LIBRARY', 10),
       ('Major Construtables Biases', 'BUILDING_ACADEMY', 10),
       ('Major Construtables Biases', 'BUILDING_GRANARY', -500),
       ('Major Construtables Biases', 'BUILDING_GARDEN', -50),
       ('Major Construtables Biases', 'BUILDING_BATH', -100),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_WALLS', -1000),
       ('Major Construtables Biases', 'IMPROVEMENT_HILLFORT', 500),
       ('Major Construtables Biases', 'IMPROVEMENT_MEGALITH', 500),
       ('Major Construtables Biases', 'IMPROVEMENT_SOUQ', 500),
       ('Major Construtables Biases', 'IMPROVEMENT_ZIGGURAT', 500),
       ('Major Construtables Biases', 'WONDER_GATE_OF_ALL_NATIONS', 10000),
       ('Major Construtables Biases', 'WONDER_ANGKOR_WAT', 10000),
       ('Major Construtables Biases', 'WONDER_COLOSSEUM', 10000),
       ('Major Construtables Biases', 'WONDER_COLOSSUS', 10000),
       ('Major Construtables Biases', 'WONDER_DUR_SHARRUKIN', 10000),
       ('Major Construtables Biases', 'WONDER_EMILE_BELL', 10000),
       ('Major Construtables Biases', 'WONDER_GREAT_STELE', 10000),
       ('Major Construtables Biases', 'WONDER_HA_AMONGA_A_MAUI', 10000),
       ('Major Construtables Biases', 'WONDER_HANGING_GARDENS', 10000),
       ('Major Construtables Biases', 'WONDER_MAUSOLEUM_OF_THEODORIC', 10000),
       ('Major Construtables Biases', 'WONDER_MONKS_MOUND', 10000),
       ('Major Construtables Biases', 'WONDER_MUNDO_PERDIDO', 10000),
       ('Major Construtables Biases', 'WONDER_NALANDA', 10000),
       ('Major Construtables Biases', 'WONDER_ORACLE', 10000),
       ('Major Construtables Biases', 'WONDER_PETRA', 10000),
       ('Major Construtables Biases', 'WONDER_PYRAMID_OF_THE_SUN', 10000),
       ('Major Construtables Biases', 'WONDER_PYRAMIDS', 10000),
       ('Major Construtables Biases', 'WONDER_SANCHI_STUPA', 10000),
       ('Major Construtables Biases', 'WONDER_TERRACOTTA_ARMY', 10000),
       ('Major Construtables Biases', 'WONDER_WEIYANG_PALACE', 10000);


-- Def Wonder Strat
UPDATE AiFavoredItems -- def 200, 330
SET Value = 50000
WHERE ListType = 'CityWonderBias' AND Item = 'WONDER';

-- Add Unit Biases
-- Army Commanders through here doesn't work well because they scale. Have to do it through ops.
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Unit Biases', 'UNIT_GALLEY', 1000),
       ('Major Unit Biases', 'UNIT_BALLISTA', 1000),
       --('Major Unit Biases', 'UNIT_ARMY_COMMANDER', 100),
       --('Major Unit Biases', 'UNIT_MWAMI', 100),
       --('Major Unit Biases', 'UNIT_NOYAN', 100),
       --('Major Unit Biases', 'UNIT_HAZARAPATIS', 100),
       --('Major Unit Biases', 'UNIT_LEGATUS', 100),
       ('Major Unit Biases', 'UNIT_HORSEMAN', 1000),
       ('Major Unit Biases', 'UNIT_SETTLER', 100000);

-- To get the AI to actually spend all their gold on Deity.
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Budget Biases', 'AI_BUDGET_STANDING_ARMY', 1),
       ('Major Budget Biases', 'AI_BUDGET_CITY_DEVELOPMENT', 2),
       ('Major Budget Biases', 'AI_BUDGET_EXPLORATION', 1),
       ('Major Budget Biases', 'AI_BUDGET_EXPANSION', 2),
       ('Major Budget Biases', 'AI_BUDGET_GARRISON', 1),
       ('Major Budget Biases', 'AI_BUDGET_DIPLOMACY', 1);

-- ==========================================================================
-- Construction Priority Boost
-- ==========================================================================
-- Triple the value of all construction biases -- Helps with uniques
UPDATE AiFavoredItems
SET Value = Value * 4
WHERE ListType LIKE '%Constructibles Biases%';

-- Lower Maya jaguar

UPDATE AiFavoredItems
SET Value = 25
WHERE Item = 'UNIT_JAGUAR_SLAYER';

-- remove unit class from Jaguar's so they aren't used as military units since they can't upgrade.
DELETE from TypeTags where Type = 'UNIT_JAGUAR_SLAYER' and Tag = 'UNIT_CLASS_MELEE';