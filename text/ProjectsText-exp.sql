-- ProjectsText-exp
-- Author: JNR
--------------------------------------------------------------

-- English
--------------------------------------------------------------
INSERT OR REPLACE INTO EnglishText
		(Tag,															Text)
VALUES	('LOC_PROJECT_TOWN_FORT_DESCRIPTION_BUILDING_TAGS_JNR',			'Can purchase the Armory and Shipyard buildings in this town.'),
		('LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION_BUILDING_TAGS_JNR',	'Can purchase the Bank and University buildings in this town.'),
		('LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Inn and Wharf buildings in this town.'),
		('LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION_BUILDING_TAGS_JNR',	'Can purchase the Dungeon and Kiln buildings in this town.'),
		('LOC_PROJECT_TOWN_TRADE_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Bazaar and Guildhall buildings in this town.'),
		('LOC_PROJECT_TOWN_INN_DESCRIPTION_BUILDING_TAGS_JNR',			'Can purchase the Menagerie and Pavilion buildings in this town.'),
		('LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Hospital and Observatory buildings in this town.');
		
UPDATE LocalizedText SET Text = 'Castle Town'		WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FORT_NAME';
UPDATE LocalizedText SET Text = 'Charter Town'		WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_GRANARY_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FISHING_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_PRODUCTION_NAME';
UPDATE LocalizedText SET Text = 'Trade Post'		WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_TRADE_NAME';
UPDATE LocalizedText SET Text = 'Country Estate'	WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_INN_NAME';
UPDATE LocalizedText SET Text = 'Pilgrimage Site'	WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_TEMPLE_NAME';
--------------------------------------------------------------

-- LocalizedText
--------------------------------------------------------------				
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_FORT_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_FORT_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION_BUILDING_TAGS_JNR}'	WHERE Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_GRANARY_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_FISHING_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION_BUILDING_TAGS_JNR}'		WHERE Tag = 'LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_TRADE_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_TRADE_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_INN_DESCRIPTION_BUILDING_TAGS_JNR}'				WHERE Tag = 'LOC_PROJECT_TOWN_INN_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION';

UPDATE LocalizedText SET Text = REPLACE(Text, '+1', '+2') WHERE Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION';
UPDATE LocalizedText SET Text = REPLACE(Text, '+2', '+3') WHERE Tag = 'LOC_PROJECT_TOWN_TRADE_DESCRIPTION';
--------------------------------------------------------------