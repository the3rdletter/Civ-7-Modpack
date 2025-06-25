-- constructibles-ant
-- Author: JNR
--------------------------------------------------------------

-- Types
--------------------------------------------------------------
INSERT OR IGNORE INTO Types
		(Type,						Kind)
VALUES	('WONDER_GREAT_LIBRARY',	'KIND_CONSTRUCTIBLE');
--------------------------------------------------------------

-- TypeQuotes
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeQuotes
		(Type,						Quote,								QuoteAuthor)
VALUES	('WONDER_GREAT_LIBRARY',	'LOC_QUOTE_WONDER_GREAT_LIBRARY',	'LOC_QUOTE_AUTHOR_WONDER_GREAT_LIBRARY');
--------------------------------------------------------------

-- TypeTags
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeTags
		(Type,						Tag)
VALUES	('WONDER_GREAT_LIBRARY',	'GREATWORK');
--------------------------------------------------------------

-- Constructibles
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructibles
		(ConstructibleType,			Age,				Cost,	AdjacentDistrict,	ConstructibleClass,	Population,	ImmuneDamage,	RequiresUnlock,	Name,								Description,							Tooltip)
VALUES	('WONDER_GREAT_LIBRARY',	'AGE_ANTIQUITY',	375,	'DISTRICT_URBAN',	'WONDER',			0,			1,				1,				'LOC_WONDER_GREAT_LIBRARY_NAME',	'LOC_WONDER_GREAT_LIBRARY_DESCRIPTION',	'LOC_WONDER_GREAT_LIBRARY_TOOLTIP');
--------------------------------------------------------------

-- Wonders
--------------------------------------------------------------
INSERT OR IGNORE INTO Wonders
		(ConstructibleType,			MaxWorldInstances)
VALUES	('WONDER_GREAT_LIBRARY',	1);
--------------------------------------------------------------

-- Constructible_ValidTerrains
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructible_ValidTerrains
		(ConstructibleType,			TerrainType)
VALUES	('WONDER_GREAT_LIBRARY',	'TERRAIN_FLAT');
--------------------------------------------------------------

-- Constructible_ValidDistricts
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructible_ValidDistricts
		(ConstructibleType,			DistrictType)
VALUES	('WONDER_GREAT_LIBRARY',	'DISTRICT_WONDER');
--------------------------------------------------------------

-- Constructible_Advisories
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructible_Advisories
		(ConstructibleType,			AdvisoryClassType)
VALUES	('WONDER_GREAT_LIBRARY',	'ADVISORY_CLASS_SCIENCE');
--------------------------------------------------------------

-- ProgressionTreeNodeUnlocks
--------------------------------------------------------------
INSERT OR IGNORE INTO ProgressionTreeNodeUnlocks
		(TargetType,				TargetKind,				ProgressionTreeNodeType,	UnlockDepth)
SELECT	 'WONDER_GREAT_LIBRARY',	'KIND_CONSTRUCTIBLE',	ProgressionTreeNodeType,	2
FROM	ProgressionTreeNodes
WHERE	ProgressionTreeNodeType='NODE_TECH_AQ_WRITING';
--------------------------------------------------------------

-- Constructible_YieldChanges
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructible_YieldChanges
		(ConstructibleType,			YieldType,			YieldChange)
VALUES	('WONDER_GREAT_LIBRARY',	'YIELD_DIPLOMACY',	2);
--------------------------------------------------------------

-- Constructible_GreatWorks
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructible_GreatWorks
		(ConstructibleType,			GreatWorkSlotType,	NumSlots)
SELECT	 'WONDER_GREAT_LIBRARY',	GreatWorkSlotType,	2
FROM	GreatWorkSlotTypes
WHERE	GreatWorkSlotType='GREATWORKSLOT_WRITING';
--------------------------------------------------------------

-- Types
--------------------------------------------------------------
INSERT OR IGNORE INTO Types
		(Type,														Kind)
VALUES	('MODIFIER_JNR_SINGLE_CITY_ADJUST_YIELD_PER_GREAT_WORK',	'KIND_MODIFIER');
--------------------------------------------------------------

-- DynamicModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO DynamicModifiers
		(ModifierType,												CollectionType,		EffectType)
VALUES	('MODIFIER_JNR_SINGLE_CITY_ADJUST_YIELD_PER_GREAT_WORK',	'COLLECTION_OWNER',	'EFFECT_CITY_ADJUST_YIELD_PER_GREAT_WORK');
--------------------------------------------------------------

-- Modifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO Modifiers
		(ModifierId,									ModifierType)
VALUES	('MOD_JNR_GREAT_LIBRARY_GREAT_WORK_SCIENCE',	'MODIFIER_JNR_SINGLE_CITY_ADJUST_YIELD_PER_GREAT_WORK');
--------------------------------------------------------------

-- ModifierArguments
--------------------------------------------------------------
INSERT OR IGNORE INTO ModifierArguments
		(ModifierId,									Name,			Value)
VALUES	('MOD_JNR_GREAT_LIBRARY_GREAT_WORK_SCIENCE',	'YieldType',	'YIELD_SCIENCE'),
		('MOD_JNR_GREAT_LIBRARY_GREAT_WORK_SCIENCE',	'Amount',		1),
		('MOD_JNR_GREAT_LIBRARY_GREAT_WORK_SCIENCE',	'Tooltip',		'LOC_WONDER_GREAT_LIBRARY_NAME');
--------------------------------------------------------------

-- ConstructibleModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO ConstructibleModifiers
		(ModifierId,									ConstructibleType)
VALUES	('MOD_JNR_GREAT_LIBRARY_GREAT_WORK_SCIENCE',	'WONDER_GREAT_LIBRARY');
--------------------------------------------------------------

-- CivilopediaPageExcludes
--------------------------------------------------------------
DELETE FROM CivilopediaPageExcludes WHERE PageID='WONDER_GREAT_LIBRARY';
--------------------------------------------------------------