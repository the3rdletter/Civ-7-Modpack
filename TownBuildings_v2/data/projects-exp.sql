-- constructibles-exp
-- Author: JNR
--------------------------------------------------------------

-- TypeTags
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeTags
		(Tag,								Type)
VALUES	('TOWNPURCHASE_FORT_JNR',			'BUILDING_ARMORER'),
		('TOWNPURCHASE_FORT_JNR',			'BUILDING_SHIPYARD'),
		('TOWNPURCHASE_URBAN_CENTER_JNR',	'BUILDING_BANK'),
		('TOWNPURCHASE_URBAN_CENTER_JNR',	'BUILDING_UNIVERSITY'),
		('TOWNPURCHASE_GRANARY_JNR',		'BUILDING_TAVERN'),
		('TOWNPURCHASE_GRANARY_JNR',		'BUILDING_WHARF'),
		('TOWNPURCHASE_PRODUCTION_JNR',		'BUILDING_DUNGEON'),
		('TOWNPURCHASE_PRODUCTION_JNR',		'BUILDING_KILN'),
		('TOWNPURCHASE_TRADE_JNR',			'BUILDING_BAZAAR'),
		('TOWNPURCHASE_TRADE_JNR',			'BUILDING_GUILDHALL'),
		('TOWNPURCHASE_INN_JNR',			'BUILDING_PAVILION'),
		('TOWNPURCHASE_INN_JNR',			'BUILDING_MENAGERIE'),
		('TOWNPURCHASE_TEMPLE_JNR',			'BUILDING_OBSERVATORY'),
		('TOWNPURCHASE_TEMPLE_JNR',			'BUILDING_HOSPITAL');
--------------------------------------------------------------

-- ProjectModifiers
--------------------------------------------------------------
INSERT OR IGNORE INTO ProjectModifiers
		(ProjectType,					ModifierId)
VALUES	('PROJECT_TOWN_FORT',			'TOWNSPEC_FORT_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_URBAN_CENTER',	'TOWNSPEC_UBRAN_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_GRANARY',		'TOWNSPEC_GRANARY_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_FISHING',		'TOWNSPEC_GRANARY_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_PRODUCTION',		'TOWNSPEC_PRODUCTION_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_TRADE',			'TOWNSPEC_TRADE_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_INN',			'TOWNSPEC_INN_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR'),
		('PROJECT_TOWN_TEMPLE',			'TOWNSPEC_TEMPLE_TAGGED_BUILDING_PURCHASE_FROM_PROJECT_JNR');
--------------------------------------------------------------

-- ModifierArguments
--------------------------------------------------------------
UPDATE ModifierArguments SET Value=2 WHERE Name='Amount' AND ModifierId='ATTACH_URBAN_YIELDS_FROM_PROJECT';
--------------------------------------------------------------

-- Warehouse_YieldChanges
--------------------------------------------------------------
UPDATE Warehouse_YieldChanges SET YieldChange=3 WHERE ID='EXHappinessProjectResourceHappiness';
--------------------------------------------------------------