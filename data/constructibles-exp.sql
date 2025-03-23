-- constructibles-exp
-- Author: JNR
--------------------------------------------------------------

-- Buildings
--------------------------------------------------------------
UPDATE Buildings SET Town=1 WHERE ConstructibleType='BUILDING_ANCIENT_BRIDGE';
UPDATE Buildings SET Town=1 WHERE ConstructibleType='BUILDING_MEDIEVAL_BRIDGE';
--------------------------------------------------------------

-- Constructibles
--------------------------------------------------------------
UPDATE Constructibles SET Age=NULL, RequiresUnlock=1	WHERE ConstructibleType='BUILDING_ANCIENT_BRIDGE';
UPDATE Constructibles SET Age=NULL						WHERE ConstructibleType='BUILDING_MEDIEVAL_BRIDGE';

UPDATE Constructibles SET Cost=(SELECT Cost FROM Constructibles WHERE ConstructibleType='BUILDING_MEDIEVAL_BRIDGE') WHERE ConstructibleType='BUILDING_ANCIENT_BRIDGE';
--------------------------------------------------------------

-- Constructible_YieldChanges
--------------------------------------------------------------
DELETE FROM Constructible_YieldChanges WHERE ConstructibleType='BUILDING_ANCIENT_BRIDGE';
--------------------------------------------------------------

-- Adjacency_YieldChanges
--------------------------------------------------------------
INSERT OR IGNORE INTO Adjacency_YieldChanges
		(ID,			AdjacentQuarter,	YieldType,		YieldChange)
VALUES	('QuarterGold',	1,					'YIELD_GOLD',	1);
--------------------------------------------------------------

-- Constructible_Adjacencies
--------------------------------------------------------------
INSERT OR IGNORE INTO Constructible_Adjacencies
		(ConstructibleType,				YieldChangeId)
VALUES	('BUILDING_MEDIEVAL_BRIDGE',	'QuarterGold');
--------------------------------------------------------------

-- TypeTags
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeTags
		(Tag,								Type)
--		('IGNORE_DISTRICT_PLACEMENT_CAP',	'BUILDING_ANCIENT_BRIDGE'),
VALUES	('AGELESS',							'BUILDING_ANCIENT_BRIDGE'),
		('PERSISTENT',						'BUILDING_ANCIENT_BRIDGE'),
		('WATER',							'BUILDING_ANCIENT_BRIDGE'),
		('BRIDGE',							'BUILDING_ANCIENT_BRIDGE'),
--		('IGNORE_DISTRICT_PLACEMENT_CAP',	'BUILDING_MEDIEVAL_BRIDGE'),
		('AGELESS',							'BUILDING_MEDIEVAL_BRIDGE'),
		('PERSISTENT',						'BUILDING_MEDIEVAL_BRIDGE');
		
-- DELETE FROM TypeTags WHERE Tag='GOLD' AND Type='BUILDING_MEDIEVAL_BRIDGE';
--------------------------------------------------------------

-- Requirements
--------------------------------------------------------------
INSERT OR IGNORE INTO Requirements
		(RequirementId,							RequirementType,											Inverse)
VALUES	('REQUIRES_JNR_TECH_BRIDGE_UPGRADE',	'REQUIREMENT_PLAYER_HAS_COMPLETED_PROGRESSION_TREE_NODE',	1);
--------------------------------------------------------------

-- RequirementArguments
--------------------------------------------------------------
INSERT OR IGNORE INTO RequirementArguments
		(RequirementId,						Name,						Value)
SELECT	'REQUIRES_JNR_TECH_BRIDGE_UPGRADE',	'ProgressionTreeNodeType',	ProgressionTreeNodeType
FROM	ProgressionTreeNodeUnlocks
WHERE	TargetType='BUILDING_MEDIEVAL_BRIDGE';

INSERT OR IGNORE INTO RequirementArguments
		(RequirementId,						Name,						Value)
SELECT	'REQUIRES_JNR_TECH_BRIDGE_UPGRADE',	'MinDepth',					UnlockDepth
FROM	ProgressionTreeNodeUnlocks
WHERE	TargetType='BUILDING_MEDIEVAL_BRIDGE';
--------------------------------------------------------------

-- RequirementSets
--------------------------------------------------------------
INSERT OR IGNORE INTO RequirementSets
		(RequirementSetId,				RequirementSetType)
VALUES	('REQSET_JNR_BRIDGE_UPGRADE',	'REQUIREMENTSET_TEST_ALL');
--------------------------------------------------------------

-- RequirementSetRequirements
--------------------------------------------------------------
INSERT OR IGNORE INTO RequirementSetRequirements
		(RequirementSetId,				RequirementId)
VALUES	('REQSET_JNR_BRIDGE_UPGRADE',	'REQUIRES_JNR_TECH_BRIDGE_UPGRADE');
--------------------------------------------------------------		

-- Types
--------------------------------------------------------------
INSERT OR IGNORE INTO Types
		(Type,													Kind)
VALUES	('MODIFIER_JNR_ALL_PLAYERS_GRANT_CONSTRUCTIBLE_UNLOCK',	'KIND_MODIFIER'),
		('MODIFIER_JNR_SINGLE_PLAYER_REPLACE_CONSTRUCTIBLE',	'KIND_MODIFIER');
--------------------------------------------------------------

-- DynamicModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO DynamicModifiers
		(ModifierType,											CollectionType,				EffectType)
VALUES	('MODIFIER_JNR_ALL_PLAYERS_GRANT_CONSTRUCTIBLE_UNLOCK',	'COLLECTION_ALL_PLAYERS',	'EFFECT_PLAYER_GRANT_CONSTRUCTIBLE_UNLOCK'),
		('MODIFIER_JNR_SINGLE_PLAYER_REPLACE_CONSTRUCTIBLE',	'COLLECTION_OWNER',			'EFFECT_PLAYER_REPLACE_CONSTRUCTIBLE');
--------------------------------------------------------------

-- Modifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO Modifiers
		(ModifierId,							ModifierType,											SubjectRequirementSetId,		Permanent,	RunOnce)
VALUES	('MOD_JNR_EX_ANCIENT_BRIDGE_UNLOCK',	'MODIFIER_JNR_ALL_PLAYERS_GRANT_CONSTRUCTIBLE_UNLOCK',	'REQSET_JNR_BRIDGE_UPGRADE',	0,			0),
		('MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE',	'MODIFIER_JNR_SINGLE_PLAYER_REPLACE_CONSTRUCTIBLE',		NULL,							1,			1);
--------------------------------------------------------------

-- ModifierArguments
--------------------------------------------------------------
INSERT OR IGNORE INTO ModifierArguments
		(ModifierId,							Name,					Value)
VALUES	('MOD_JNR_EX_ANCIENT_BRIDGE_UNLOCK',	'ConstructibleType',	'BUILDING_ANCIENT_BRIDGE'),
		('MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE',	'Destroy',				'BUILDING_ANCIENT_BRIDGE'),
		('MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE',	'Create',				'BUILDING_MEDIEVAL_BRIDGE');
--------------------------------------------------------------

-- ModifierStrings
--------------------------------------------------------------
INSERT OR IGNORE INTO ModifierStrings
		(ModifierId,							Context,		Text)
VALUES	('MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE',	'Description',	'LOC_MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE_DESCRIPTION');
--------------------------------------------------------------


-- GameModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO GameModifiers
		(ModifierId)
VALUES	('MOD_JNR_EX_ANCIENT_BRIDGE_UNLOCK');
--------------------------------------------------------------

-- ProgressionTreeNodeUnlocks
--------------------------------------------------------------
INSERT OR IGNORE INTO ProgressionTreeNodeUnlocks
		(ProgressionTreeNodeType,	TargetType,								TargetKind,			UnlockDepth)
SELECT	ProgressionTreeNodeType,	'MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE',	'KIND_MODIFIER',	UnlockDepth
FROM	ProgressionTreeNodeUnlocks
WHERE	TargetType='BUILDING_MEDIEVAL_BRIDGE';
--------------------------------------------------------------		