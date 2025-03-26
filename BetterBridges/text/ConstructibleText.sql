-- ConstructibleText
-- Author: JNR
--------------------------------------------------------------

-- English
--------------------------------------------------------------
INSERT OR REPLACE INTO EnglishText
		(Tag,													Text)
VALUES	('LOC_MOD_JNR_EX_ANCIENT_BRIDGE_REPLACE_DESCRIPTION',	'Ancient Bridges are upgraded to Medieval Bridges.'),
		('LOC_MOD_JNR_MO_MEDIEVAL_BRIDGE_REPLACE_DESCRIPTION',	'Medieval Bridges are upgraded to Modern Bridges.');
		
UPDATE LocalizedText SET Text = REPLACE(Text, 'Gold Building.', 'Gold Building and ageless bridge building which upgrades automatically once available.') WHERE Tag IN (
		'LOC_BUILDING_ANCIENT_BRIDGE_DESCRIPTION',
		'LOC_BUILDING_ANCIENT_BRIDGE_TOOLTIP',
		'LOC_BUILDING_MEDIEVAL_BRIDGE_DESCRIPTION',
		'LOC_BUILDING_MEDIEVAL_BRIDGE_TOOLTIP',
		'LOC_BUILDING_MODERN_BRIDGE_DESCRIPTION',
		'LOC_BUILDING_MODERN_BRIDGE_TOOLTIP');
		
UPDATE LocalizedText SET Text = REPLACE(Text, 'Allows Land', '+1[icon:YIELD_GOLD] Gold for each adjacent quarter. Allows Land') WHERE Tag IN (
		'LOC_BUILDING_MEDIEVAL_BRIDGE_DESCRIPTION',
		'LOC_BUILDING_MODERN_BRIDGE_DESCRIPTION');
		
UPDATE LocalizedText SET Text = REPLACE(Text, 'Allows Land', '+1[icon:YIELD_GOLD] Gold for each adjacent quarter[NEWLINE]Allows Land') WHERE Tag IN (
		'LOC_BUILDING_MEDIEVAL_BRIDGE_TOOLTIP',
		'LOC_BUILDING_MODERN_BRIDGE_TOOLTIP');
--------------------------------------------------------------