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
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_REPAIR_BONUS', 100000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_PARTIAL_CONSTRUCTION_BONUS', 10000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_BUILD_QUEUE_IN_CITY', 10000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_TOWN_TO_CITY_UPGRADE_PER_POPULATION', 5000),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE', 5), -- default 5
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_STANDING_ARMY_COMMANDER', 0),
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_NEW_CITY', 100000), -- was 1000, 1500
       ('Major PsuedoYield Biases', 'PSEUDOYIELD_SETTLEMENT_CAP_INCREASE', 500), -- was 0	-- AI not researching enough settlement cap in the exploration and modern eras   
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


-- Add custom constructible biases
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Construtables Biases', 'BUILDING_SAW_PIT', 500),
       ('Major Construtables Biases', 'BUILDING_BRICKYARD', 500),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_BRIDGE', 50),
       ('Major Construtables Biases', 'BUILDING_MONUMENT', 10),
       ('Major Construtables Biases', 'BUILDING_ALTAR', 8),
       ('Major Construtables Biases', 'BUILDING_LIGHTHOUSE', 5),
       ('Major Construtables Biases', 'BUILDING_MASTABA', 5),
       ('Major Construtables Biases', 'BUILDING_MORTUARY_TEMPLE', 5),
       ('Major Construtables Biases', 'BUILDING_ODEON', 5),
       ('Major Construtables Biases', 'BUILDING_PARTHENON', 5),
       ('Major Construtables Biases', 'BUILDING_DHARAMSHALA', 5),
       ('Major Construtables Biases', 'BUILDING_VIHARA', 5),
       ('Major Construtables Biases', 'BUILDING_JALAW', 5),
       ('Major Construtables Biases', 'BUILDING_KUH_NAH', 5),
       ('Major Construtables Biases', 'BUILDING_BASILICA', 5),
       ('Major Construtables Biases', 'BUILDING_TEMPLE_OF_JUPITER', 5),
       ('Major Construtables Biases', 'BUILDING_BLACKSMITH', 2),
       ('Major Construtables Biases', 'BUILDING_VILLA', 3),
       ('Major Construtables Biases', 'BUILDING_ARENA', 3),
       ('Major Construtables Biases', 'BUILDING_AMPHITHEATER', 1),
       ('Major Construtables Biases', 'BUILDING_BARRACKS', 1),
       ('Major Construtables Biases', 'BUILDING_LIBRARY', 1),
       ('Major Construtables Biases', 'BUILDING_ACADEMY', 1),
       ('Major Construtables Biases', 'BUILDING_GARDEN', 1),
       ('Major Construtables Biases', 'BUILDING_BATH', 1),
       ('Major Construtables Biases', 'BUILDING_ANCIENT_WALLS', 1),
       ('Major Construtables Biases', 'IMPROVEMENT_HILLFORT', 5),
       ('Major Construtables Biases', 'IMPROVEMENT_MEGALITH', 5),
       ('Major Construtables Biases', 'IMPROVEMENT_SOUQ', 5),
       ('Major Construtables Biases', 'IMPROVEMENT_ZIGGURAT', 5);

-- Add Unit Biases
INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
       ('Major Unit Biases', 'UNIT_GALLEY', 1000);