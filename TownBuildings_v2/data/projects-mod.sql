-- constructibles-exp
-- Author: JNR
--------------------------------------------------------------

-- Types
--------------------------------------------------------------
INSERT OR IGNORE INTO Types
		(Type,					Kind)
VALUES	('PROJECT_TOWN_TEMPLE',	'KIND_PROJECT');
--------------------------------------------------------------

-- Projects
--------------------------------------------------------------
INSERT OR IGNORE INTO Projects
		(ProjectType,			Name,							ShortName,								Description,							Food,	ExclusiveSpecialization,	TownOnly,	PrereqPopulation)
VALUES	('PROJECT_TOWN_TEMPLE',	'LOC_PROJECT_TOWN_TEMPLE_NAME',	'LOC_PROJECT_TOWN_TEMPLE_SHORT_NAME',	'LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION',	1,		1,							1,			7);
--------------------------------------------------------------

-- RequirementSets
--------------------------------------------------------------
INSERT OR IGNORE INTO RequirementSets
		(RequirementSetId,					RequirementSetType)
VALUES	('COLLEGE_TOWN_REQUIREMENTS_JNR',	'REQUIREMENTSET_TEST_ALL');
--------------------------------------------------------------

-- RequirementSetRequirements
--------------------------------------------------------------
INSERT OR IGNORE INTO RequirementSetRequirements
		(RequirementSetId,					RequirementId)
VALUES	('COLLEGE_TOWN_REQUIREMENTS_JNR',	'REQ_PLOT_DISTRICT_CLASS_RURAL'),
		('COLLEGE_TOWN_REQUIREMENTS_JNR',	'MOD_SHWEDAGON_ZEDI_DAW_TILE_APPEAL_SCIENCE_SUBJECT_REQUIREMENTS_3');
--------------------------------------------------------------		
		
-- Modifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO Modifiers
		(ModifierId,									ModifierType,										SubjectRequirementSetId)
VALUES	('SCIENCE_ON_APPEAL_IN_CITY_FROM_PROJECT_JNR',	'MOD_SHWEDAGON_ZEDI_DAW_TILE_APPEAL_SCIENCE_TYPE',	'COLLEGE_TOWN_REQUIREMENTS_JNR');
--------------------------------------------------------------

-- ModifierArguments
--------------------------------------------------------------
INSERT OR IGNORE INTO ModifierArguments
		(ModifierId,									Name,			Value)
VALUES	('SCIENCE_ON_APPEAL_IN_CITY_FROM_PROJECT_JNR',	'YieldType',	'YIELD_SCIENCE'),
		('SCIENCE_ON_APPEAL_IN_CITY_FROM_PROJECT_JNR',	'Amount',		2),
		('SCIENCE_ON_APPEAL_IN_CITY_FROM_PROJECT_JNR',	'Tooltip',		'LOC_PROJECT_TOWN_TEMPLE_NAME');
--------------------------------------------------------------

-- TypeTags
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeTags
		(Tag,								Type)
VALUES	('TOWNPURCHASE_FORT_JNR',			'BUILDING_AIRFIELD'),
		('TOWNPURCHASE_FORT_JNR',			'BUILDING_MILITARY_ACADEMY'),
		('TOWNPURCHASE_URBAN_CENTER_JNR',	'BUILDING_DEPARTMENT_STORE'),
		('TOWNPURCHASE_URBAN_CENTER_JNR',	'BUILDING_SCHOOLHOUSE'),
		('TOWNPURCHASE_GRANARY_JNR',		'BUILDING_CANNERY'),
		('TOWNPURCHASE_GRANARY_JNR',		'BUILDING_TENEMENT'),
		('TOWNPURCHASE_PRODUCTION_JNR',		'BUILDING_FACTORY'),
		('TOWNPURCHASE_TRADE_JNR',			'BUILDING_FACTORY'),
		('TOWNPURCHASE_INN_JNR',			'BUILDING_OPERA_HOUSE'),
		('TOWNPURCHASE_INN_JNR',			'BUILDING_RADIO_STATION'),
		('TOWNPURCHASE_TEMPLE_JNR',			'BUILDING_MUSEUM'),
		('TOWNPURCHASE_TEMPLE_JNR',			'BUILDING_LABORATORY');
--------------------------------------------------------------

-- ProjectModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO ProjectModifiers
		(ProjectType,					ModifierId)
VALUES	('PROJECT_TOWN_TEMPLE',			'SCIENCE_ON_APPEAL_IN_CITY_FROM_PROJECT_JNR'),

		('PROJECT_TOWN_FORT',			'TOWNSPEC_FORT_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_URBAN_CENTER',	'TOWNSPEC_UBRAN_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_GRANARY',		'TOWNSPEC_GRANARY_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_FISHING',		'TOWNSPEC_GRANARY_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_PRODUCTION',		'TOWNSPEC_PRODUCTION_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_FACTORY',		'TOWNSPEC_TRADE_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_INN',			'TOWNSPEC_INN_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_TEMPLE',			'TOWNSPEC_TEMPLE_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR');
--------------------------------------------------------------

-- ModifierArguments
--------------------------------------------------------------
UPDATE ModifierArguments SET Value=3 WHERE Name='Amount' AND ModifierId='INFLUENCE_ON_INNS_IN_CITY_FROM_PROJECT';
UPDATE ModifierArguments SET Value=3 WHERE Name='Amount' AND ModifierId='ATTACH_URBAN_YIELDS_FROM_PROJECT';
--------------------------------------------------------------

-- Buildings
--------------------------------------------------------------
UPDATE Buildings SET Town=0 WHERE ConstructibleType="BUILDING_FACTORY";
--------------------------------------------------------------