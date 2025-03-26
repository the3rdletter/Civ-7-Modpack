-- ProjectsText-mod
-- Author: JNR
--------------------------------------------------------------

-- English
--------------------------------------------------------------
INSERT OR REPLACE INTO EnglishText
		(Tag,															Text)
VALUES	('LOC_PROJECT_TOWN_TEMPLE_NAME',								'Religious Site'),
		('LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION',							'+2[icon:YIELD_SCIENCE] Science on all Rural tiles in this Settlement that have at least 1 Happiness.'),
		
		('LOC_PROJECT_TOWN_FORT_DESCRIPTION_BUILDING_TAGS_JNR',			'Can purchase the Aerodrome and Military Academy buildings in this town.'),
		('LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION_BUILDING_TAGS_JNR',	'Can purchase the Department Store and Schoolhouse buildings in this town.'),
		('LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Cannery and Tenement buildings in this town.'),
		('LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION_BUILDING_TAGS_JNR',	'Can purchase the Factory building in this town.'),
		('LOC_PROJECT_TOWN_TRADE_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Factory building in this town.'),
		('LOC_PROJECT_TOWN_INN_DESCRIPTION_BUILDING_TAGS_JNR',			'Can purchase the Opera House and Radio Station buildings in this town.'),
		('LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Laboratory and Museum buildings in this town.');

UPDATE LocalizedText SET Text = 'Garrison Town'	WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FORT_NAME';
UPDATE LocalizedText SET Text = 'Suburb'		WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_GRANARY_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FISHING_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_PRODUCTION_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FACTORY_NAME';
UPDATE LocalizedText SET Text = 'Art Community'	WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_INN_NAME';
UPDATE LocalizedText SET Text = 'College Town'	WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_TEMPLE_NAME';
--------------------------------------------------------------

-- LocalizedText
--------------------------------------------------------------		
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_FORT_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_FORT_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION_BUILDING_TAGS_JNR}'	WHERE Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_GRANARY_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_FISHING_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION_BUILDING_TAGS_JNR}'		WHERE Tag = 'LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION';
UPDATE LocalizedText SET Text = 		 '{LOC_PROJECT_TOWN_TRADE_DESCRIPTION_BUILDING_TAGS_JNR} ' || Text	WHERE Tag = 'LOC_PROJECT_TOWN_FACTORY_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_INN_DESCRIPTION_BUILDING_TAGS_JNR}'				WHERE Tag = 'LOC_PROJECT_TOWN_INN_DESCRIPTION';
UPDATE LocalizedText SET Text = Text || ' {LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION_BUILDING_TAGS_JNR}'			WHERE Tag = 'LOC_PROJECT_TOWN_TEMPLE_DESCRIPTION';

UPDATE LocalizedText SET Text = REPLACE(Text, '+1', '+3') WHERE Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION';
UPDATE LocalizedText SET Text = REPLACE(Text, '+2', '+3') WHERE Tag = 'LOC_PROJECT_TOWN_INN_DESCRIPTION';
--------------------------------------------------------------