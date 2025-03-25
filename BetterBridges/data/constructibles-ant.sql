-- constructibles-ant
-- Author: JNR
--------------------------------------------------------------

-- Buildings
--------------------------------------------------------------
UPDATE Buildings SET Town=1 WHERE ConstructibleType='BUILDING_ANCIENT_BRIDGE';
--------------------------------------------------------------

-- Constructibles
--------------------------------------------------------------
UPDATE Constructibles SET Age=NULL WHERE ConstructibleType='BUILDING_ANCIENT_BRIDGE';
--------------------------------------------------------------

-- TypeTags
--------------------------------------------------------------
INSERT OR IGNORE INTO TypeTags
		(Tag,								Type)
--		('IGNORE_DISTRICT_PLACEMENT_CAP',	'BUILDING_ANCIENT_BRIDGE'),
VALUES	('AGELESS',							'BUILDING_ANCIENT_BRIDGE'),
		('PERSISTENT',						'BUILDING_ANCIENT_BRIDGE');
		
-- DELETE FROM TypeTags WHERE Tag='GOLD' AND Type='BUILDING_ANCIENT_BRIDGE';
--------------------------------------------------------------