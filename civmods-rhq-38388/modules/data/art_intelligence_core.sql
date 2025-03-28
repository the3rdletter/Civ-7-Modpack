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
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 5000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE', 5), -- default 5
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_ARMY_COMMANDER', 0),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_NEW_CITY', 2500), -- was 1000, 1500
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE', 350), -- was 0	-- AI not researching enough settlement cap in the exploration and modern eras   
       -- ('Major PsuedoYield Biases', 'PSEUDOYIELD_TECH_MASTERY', 50000), -- not really working at 10000..
       -- ('Major PsuedoYield Biases', 'PSEUDOYIELD_CIVIC_MASTERY', 50000), -- not really working at 10000..
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_SLOT_CIV_UNIQUE_TRADITION', 10),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_UNLOCK_CIV_UNIQUE_TRADITION', 10),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_BASE_UNIQUE_DISTRICT_VALUE', 5000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_NAVY_UNIT', 1000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_NAVY_COMBAT_VALUE', 12),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_GUARDS', 1),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_DEFENSES', -50), -- -50 wasn't strong enough... nor -100, let's try 0...
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_GREAT_WORK', 20),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_GREAT_WORK_SLOT', 50);

-- INSERT OR IGNORE custom construction biases
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Construtables Biases', 'BUILDING_ALTAR', 20),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_WALLS', -1000),
       ('Major Construtables Biases', 'BUILDING_MONUMENT', 500),
       ('Major Construtables Biases', 'BUILDING_MARKET', -10),
       ('Major Construtables Biases', 'BUILDING_SAW_PIT', 10),
       ('Major Construtables Biases', 'BUILDING_BRICKYARD', 20),
       ('Major Construtables Biases', 'BUILDING_AMPHITHEATER', 10),
       ('Major Construtables Biases', 'BUILDING_BARRACKS', 10),
       ('Major Construtables Biases', 'BUILDING_BLACKSMITH', 20),
       ('Major Construtables Biases', 'BUILDING_LIBRARY', 10),
       ('Major Construtables Biases', 'BUILDING_ACADEMY', 10),
       ('Major Construtables Biases', 'BUILDING_GARDEN', -50),
       ('Major Construtables Biases', 'BUILDING_LIGHTHOUSE', -20), -- Very important for resource capacity for ant resource victory, pvs -1000, 'Increases the Resource Capacity of this Settlement by 2.'
       ('Major Construtables Biases', 'BUILDING_BATH', -100),
       ('Major Construtables Biases', 'BUILDING_VILLA', 15),
       ('Major Construtables Biases', 'BUILDING_ARENA', 15),
       ('Major Construtables Biases', 'BUILDING_MASTABA', 500),
       ('Major Construtables Biases', 'BUILDING_MORTUARY_TEMPLE', 500),
       ('Major Construtables Biases', 'BUILDING_ODEON', 500),
       ('Major Construtables Biases', 'BUILDING_PARTHENON', 500),
       ('Major Construtables Biases', 'BUILDING_DHARAMSHALA', 500),
       ('Major Construtables Biases', 'BUILDING_VIHARA', 500),
       ('Major Construtables Biases', 'BUILDING_JALAW', 500),
       ('Major Construtables Biases', 'BUILDING_KUH_NAH', 500),
       ('Major Construtables Biases', 'BUILDING_BASILICA', 500),
       ('Major Construtables Biases', 'BUILDING_TEMPLE_OF_JUPITER', 500);

-- Def Wonder Strat
UPDATE AiFavoredItems -- def 200, 330
SET Value = 0
WHERE ListType = 'CityWonderBias' AND Item = 'WONDER';

-- Add Unit Biases
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Unit Biases', 'UNIT_GALLEY', 1000);

-- To get the AI to actually spend all their gold on Deity.
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Budget Biases', 'AI_BUDGET_STANDING_ARMY', 1000),
       ('Major Budget Biases', 'AI_BUDGET_CITY_DEVELOPMENT', 1000),
       ('Major Budget Biases', 'AI_BUDGET_EXPLORATION', 1000),
       ('Major Budget Biases', 'AI_BUDGET_EXPANSION', 1000),
       ('Major Budget Biases', 'AI_BUDGET_GARRISON', 1000),
       ('Major Budget Biases', 'AI_BUDGET_DIPLOMACY', 1000);


-- ==========================================================================
-- Construction Priority Boost
-- ==========================================================================
-- Triple the value of all construction biases -- Helps with uniques
UPDATE AiFavoredItems
SET Value = Value * 3
WHERE ListType LIKE '%Constructibles Biases%';