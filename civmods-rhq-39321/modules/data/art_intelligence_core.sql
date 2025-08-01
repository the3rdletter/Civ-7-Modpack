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
       ('PSEUDOYIELD_NEW_CITY', 100000), -- Default 400
       ('PSEUDOYIELD_REPAIR_BONUS', 100000), -- Default 10000
       ('PSEUDOYIELD_PARTIAL_CONSTRUCTION_BONUS', 1000), -- Default 1000
       ('PSEUDOYIELD_BUILD_QUEUE_IN_CITY', 2000), -- Default 2000
       ('PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 10000), -- Default 150
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
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 100000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_REPAIR_BONUS', 2), -- this is showing as still 1.0000 in ai_citydevelopment at any value
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_PARTIAL_CONSTRUCTION_BONUS', 10000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_BUILD_QUEUE_IN_CITY', 0), -- was 1000, testing 0'
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
       ('Major Construtables Biases', 'BUILDING_LAUNCH_PAD', 10000),
       ('Major Construtables Biases', 'BUILDING_AIRFIELD', 1),
       ('Major Construtables Biases', 'BUILDING_SAW_PIT', 1),
       ('Major Construtables Biases', 'BUILDING_BRICKYARD', 1),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_BRIDGE', 1),
       ('Major Construtables Biases', 'BUILDING_MONUMENT', 1),
       ('Major Construtables Biases', 'BUILDING_ALTAR', 1),
       ('Major Construtables Biases', 'BUILDING_LIGHTHOUSE', 1),
       ('Major Construtables Biases', 'BUILDING_MASTABA', 1),
       ('Major Construtables Biases', 'BUILDING_MORTUARY_TEMPLE', 1),
       ('Major Construtables Biases', 'BUILDING_ODEON', 1),
       ('Major Construtables Biases', 'BUILDING_PARTHENON', 1),
       ('Major Construtables Biases', 'BUILDING_DHARAMSHALA', 1),
       ('Major Construtables Biases', 'BUILDING_VIHARA', 1),
       ('Major Construtables Biases', 'BUILDING_JALAW', 1),
       ('Major Construtables Biases', 'BUILDING_KUH_NAH', 1),
       ('Major Construtables Biases', 'BUILDING_BASILICA', 1),
       ('Major Construtables Biases', 'BUILDING_TEMPLE_OF_JUPITER', 1),
       ('Major Construtables Biases', 'BUILDING_BLACKSMITH', 1),
       ('Major Construtables Biases', 'BUILDING_VILLA', 1),
       ('Major Construtables Biases', 'BUILDING_ARENA', 1),
       ('Major Construtables Biases', 'BUILDING_AMPHITHEATER', 1),
       ('Major Construtables Biases', 'BUILDING_BARRACKS', 1),
       ('Major Construtables Biases', 'BUILDING_LIBRARY', 1),
       ('Major Construtables Biases', 'BUILDING_ACADEMY', 1),
       ('Major Construtables Biases', 'BUILDING_GRANARY', 1),
       ('Major Construtables Biases', 'BUILDING_GARDEN', 1),
       ('Major Construtables Biases', 'BUILDING_BATH', 1),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_WALLS', 1),
       ('Major Construtables Biases', 'IMPROVEMENT_HILLFORT', 2),
       ('Major Construtables Biases', 'IMPROVEMENT_MEGALITH', 2),
       ('Major Construtables Biases', 'IMPROVEMENT_SOUQ', 2),
       ('Major Construtables Biases', 'IMPROVEMENT_ZIGGURAT', 2),
       ('Major Construtables Biases', 'WONDER_GATE_OF_ALL_NATIONS', 5),
       ('Major Construtables Biases', 'WONDER_ANGKOR_WAT', 5),
       ('Major Construtables Biases', 'WONDER_COLOSSEUM', 5),
       ('Major Construtables Biases', 'WONDER_COLOSSUS', 5),
       ('Major Construtables Biases', 'WONDER_DUR_SHARRUKIN', 5),
       ('Major Construtables Biases', 'WONDER_EMILE_BELL', 5),
       ('Major Construtables Biases', 'WONDER_GREAT_STELE', 5),
       ('Major Construtables Biases', 'WONDER_HA_AMONGA_A_MAUI', 5),
       ('Major Construtables Biases', 'WONDER_HANGING_GARDENS', 5),
       ('Major Construtables Biases', 'WONDER_MAUSOLEUM_OF_THEODORIC', 5),
       ('Major Construtables Biases', 'WONDER_MAUSOLEUM_AT_HALICARNASSUS', 5),
       ('Major Construtables Biases', 'WONDER_WAT_XIENG_THONG', 5),
       ('Major Construtables Biases', 'WONDER_GRAND_BAZAAR', 5),
       ('Major Construtables Biases', 'WONDER_UBUDIAH_MOSQUE', 5),
       ('Major Construtables Biases', 'WONDER_MONKS_MOUND', 5),
       ('Major Construtables Biases', 'WONDER_MUNDO_PERDIDO', 5),
       ('Major Construtables Biases', 'WONDER_NALANDA', 5),
       ('Major Construtables Biases', 'WONDER_ORACLE', 5),
       ('Major Construtables Biases', 'WONDER_PETRA', 5),
       ('Major Construtables Biases', 'WONDER_PYRAMID_OF_THE_SUN', 5),
       ('Major Construtables Biases', 'WONDER_PYRAMIDS', 5),
       ('Major Construtables Biases', 'WONDER_SANCHI_STUPA', 5),
       ('Major Construtables Biases', 'WONDER_TERRACOTTA_ARMY', 5),
       ('Major Construtables Biases', 'WONDER_WEIYANG_PALACE', 5);


-- Def Wonder Strat
UPDATE AiFavoredItems -- def 200, 330
SET Value = 500
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