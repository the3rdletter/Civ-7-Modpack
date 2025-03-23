


UPDATE PseudoYields SET DefaultValue = 400 -- 200 Def, pvs 500
WHERE PseudoYieldType = 'PSEUDOYIELD_NEW_CITY'; -- 400 early


UPDATE PseudoYields SET DefaultValue = 5
WHERE PseudoYieldType = 'PSEUDOYIELD_CITY_DEFENSES';

UPDATE PseudoYields SET DefaultValue = 10
WHERE PseudoYieldType = 'PSEUDOYIELD_CITY_GUARDS';

UPDATE PseudoYields SET DefaultValue = 25
WHERE PseudoYieldType = 'PSEUDOYIELD_CITY_GARRISON_COMBAT_VALUE';

-- This might be too much, but we don't see any air units right now.
UPDATE PseudoYields SET DefaultValue = 1000 -- def 120
WHERE PseudoYieldType = 'PSEUDOYIELD_STANDING_AIR_UNIT';

-- This might be too much, but we don't see any air units right now.
UPDATE PseudoYields SET DefaultValue = 100 -- def 6
WHERE PseudoYieldType = 'PSEUDOYIELD_STANDING_AIR_COMBAT_VALUE';