-- ProjectsText-ant
-- Author: JNR
--------------------------------------------------------------

-- English
--------------------------------------------------------------
INSERT OR REPLACE INTO EnglishText
		(Tag,															Text)
VALUES	('LOC_PROJECT_TOWN_INN_NAME',									'Hub Town'),
		('LOC_PROJECT_TOWN_INN_DESCRIPTION',							'+1[icon:YIELD_DIPLOMACY] Influence per Settlement Connected to this Town.'),
		
		('LOC_PROJECT_TOWN_FORT_DESCRIPTION_BUILDING_TAGS_JNR',			'Can purchase the Arena and Barracks buildings in this town.'),
		('LOC_PROJECT_TOWN_URBAN_CENTER_DESCRIPTION_BUILDING_TAGS_JNR',	'Can purchase the Library and Monument buildings in this town.'),
		('LOC_PROJECT_TOWN_GRANARY_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Garden building in this town.'),
		('LOC_PROJECT_TOWN_PRODUCTION_DESCRIPTION_BUILDING_TAGS_JNR',	'Can purchase the Blacksmiths building in this town.'),
		('LOC_PROJECT_TOWN_TRADE_DESCRIPTION_BUILDING_TAGS_JNR',		'Can purchase the Lighthouse and Market buildings in this town.'),
		('LOC_PROJECT_TOWN_INN_DESCRIPTION_BUILDING_TAGS_JNR',			'Can purchase the Bath and Villa buildings in this town.');
		
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FORT_NAME';
UPDATE LocalizedText SET Text = 'Colony'		WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_URBAN_CENTER_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_GRANARY_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_FISHING_NAME';
--UPDATE LocalizedText SET Text = '' WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_PRODUCTION_NAME';
UPDATE LocalizedText SET Text = 'Trade Post'	WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_TRADE_NAME';
UPDATE LocalizedText SET Text = 'Spa Town'		WHERE Language='en_US' AND Tag = 'LOC_PROJECT_TOWN_INN_NAME';
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
--------------------------------------------------------------