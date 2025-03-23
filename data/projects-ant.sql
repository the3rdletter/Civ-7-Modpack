-- constructibles-exp
-- Author: JNR
--------------------------------------------------------------

-- Types
--------------------------------------------------------------
INSERT OR IGNORE INTO Types
		(Type,											Kind)
VALUES	('PROJECT_TOWN_INN',							'KIND_PROJECT'),
		('INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT_TYPE',	'KIND_MODIFIER');
--------------------------------------------------------------

-- Projects
--------------------------------------------------------------
INSERT OR IGNORE INTO Projects
		(ProjectType,			Name,							ShortName,							Description,						Food,	ExclusiveSpecialization,	TownOnly,	PrereqPopulation)
VALUES	('PROJECT_TOWN_INN',	'LOC_PROJECT_TOWN_INN_NAME',	'LOC_PROJECT_TOWN_INN_SHORT_NAME',	'LOC_PROJECT_TOWN_INN_DESCRIPTION',	1,		1,							1,			7);
--------------------------------------------------------------

-- DynamicModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO DynamicModifiers
		(ModifierType,									CollectionType,		EffectType)
VALUES	('INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT_TYPE',	'COLLECTION_OWNER',	'EFFECT_CITY_ADJUST_YIELD_PER_CONNECTED_CITY');
--------------------------------------------------------------

-- Modifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO Modifiers
		(ModifierId,								ModifierType)
VALUES	('INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT',	'INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT_TYPE');
--------------------------------------------------------------

-- ModifierArguments
--------------------------------------------------------------
INSERT OR IGNORE INTO ModifierArguments
		(ModifierId,								Name,			Value)
VALUES	('INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT',	'YieldType',	'YIELD_DIPLOMACY'),
		('INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT',	'Amount',		1);
--------------------------------------------------------------

-- TypeTags
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeTags
		(Tag,								Type)
VALUES	('TOWNPURCHASE_FORT_JNR',			'BUILDING_BARRACKS'),
		('TOWNPURCHASE_FORT_JNR',			'BUILDING_ARENA'),
		('TOWNPURCHASE_URBAN_CENTER_JNR',	'BUILDING_LIBRARY'),
		('TOWNPURCHASE_URBAN_CENTER_JNR',	'BUILDING_MONUMENT'),
		('TOWNPURCHASE_GRANARY_JNR',		'BUILDING_GARDEN'),
		('TOWNPURCHASE_PRODUCTION_JNR',		'BUILDING_BLACKSMITH'),
		('TOWNPURCHASE_TRADE_JNR',			'BUILDING_LIGHTHOUSE'),
		('TOWNPURCHASE_TRADE_JNR',			'BUILDING_MARKET'),
		('TOWNPURCHASE_INN_JNR',			'BUILDING_BATH'),
		('TOWNPURCHASE_INN_JNR',			'BUILDING_VILLA');
--------------------------------------------------------------

-- ProjectModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO ProjectModifiers
		(ProjectType,					ModifierId)
VALUES	('PROJECT_TOWN_INN',			'INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT'),

		('PROJECT_TOWN_FORT',			'TOWNSPEC_FORT_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_URBAN_CENTER',	'TOWNSPEC_UBRAN_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_GRANARY',		'TOWNSPEC_GRANARY_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_FISHING',		'TOWNSPEC_GRANARY_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_PRODUCTION',		'TOWNSPEC_PRODUCTION_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_TRADE',			'TOWNSPEC_TRADE_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_INN',			'TOWNSPEC_INN_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR');
--------------------------------------------------------------