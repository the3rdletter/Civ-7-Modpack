-- ==========================================================================
-- RHQ AI Mod - All Victory Types Core Settings
-- ==========================================================================
-- Core AI behavior settings that apply across all victory paths
-- Creates aggressive AI behavior templates and adjusts diplomatic biases

-- ==========================================================================
-- Define AI List Types for Aggressive Behavior
-- ==========================================================================
INSERT OR IGNORE INTO AiListTypes (ListType) VALUES
('RHAI_AGGRESSIVE'),                     -- For operation types
('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES'),   -- For yield preferences
('RHAI_AGGRESSIVE_DIPLO');               -- For diplomatic actions

-- Connect the list types to their appropriate systems
INSERT OR IGNORE INTO AiLists (ListType, System) VALUES
('RHAI_AGGRESSIVE',                     'AiOperationTypes'),
('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES',   'PseudoYieldBiases'),
('RHAI_AGGRESSIVE_DIPLO',               'DiplomaticActions');

-- ==========================================================================
-- Operation Settings for Aggressive AI
-- ==========================================================================
INSERT INTO AiFavoredItems(ListType, Item, Value) VALUES
('RHAI_AGGRESSIVE', 'OP_RH_AGR_ATTACK', 1);

-- ==========================================================================
-- Pseudoyield Bias Adjustments for Aggressive AI
-- ==========================================================================
-- These reduce the AI's focus on defensive investments and diplomatic relationships
INSERT INTO AiFavoredItems (ListType, Item, Value) VALUES
    ('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES', 'PSEUDOYIELD_CITY_DEFENSES',               -75), 
    ('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES', 'PSEUDOYIELD_CITY_GUARDS',                 -80),
    ('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES', 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE',  -75),
    ('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES', 'PSEUDOYIELD_DIPLOMATIC_RELATIONSHIP',     -35),
    ('RHAI_AGGRESSIVE_PSEUDOYIELDBIASES', 'PSEUDOYIELD_DIPLOMATIC_TOKEN',            -15);

-- ==========================================================================
-- Global Diplomatic Relationship Adjustments
-- ==========================================================================
-- Reduce the default value of diplomatic relationships (original default: 1.0, was 0.75)
UPDATE PseudoYields SET DefaultValue = .6
WHERE PseudoYieldType = 'PSEUDOYIELD_DIPLOMATIC_RELATIONSHIP';

-- Adjust diplomatic token yield (original default: 500, was 470)
UPDATE PseudoYields SET DefaultValue = 500
WHERE PseudoYieldType = 'PSEUDOYIELD_DIPLOMATIC_TOKEN';

-- ==========================================================================
-- Diplomatic Action Preferences for Aggressive AI
-- ==========================================================================
INSERT INTO AiFavoredItems(ListType, Item, Value) VALUES
-- War-related actions
('RHAI_AGGRESSIVE_DIPLO', 'DIPLOMACY_ACTION_DECLARE_FORMAL_WAR', 75),
('RHAI_AGGRESSIVE_DIPLO', 'DIPLOMACY_ACTION_DENOUNCE',           15),
('RHAI_AGGRESSIVE_DIPLO', 'DIPLOMACY_ACTION_DECLARE_WAR',        10),

-- Sabotage actions
('RHAI_AGGRESSIVE_DIPLO', 'DIPLOMACY_ACTION_SABOTAGE_MILITARY_PRODUCTION', 25),
('RHAI_AGGRESSIVE_DIPLO', 'DIPLOMACY_ACTION_SABOTAGE_RESEARCH',           25),
('RHAI_AGGRESSIVE_DIPLO', 'DIPLOMACY_ACTION_SABOTAGE_CIVIC_STUDY',        15);



-- ==========================================================================
-- Construction Priority Boost
-- ==========================================================================
-- Triple the value of all construction biases -- Helps with uniques
UPDATE AiFavoredItems
SET Value = Value * 3
WHERE ListType LIKE '%Constructibles Biases%';