-- Diplomacy Favors and Grievances
-- This file contains the SQL commands to update the Diplomacy Favors and Grievances data in the database.

------------------------------------------
-- Diplomatic Priorities
------------------------------------------
-- Diplomatic Action Preferences
-- Giving an influence token is 20

DELETE FROM AiFavoredItems WHERE ListType = 'Default Diplomatic';

INSERT OR IGNORE INTO AiFavoredItems (ListType, Item, Value) VALUES 
    ('Default Diplomatic', 'DIPLOMACY_ACTION_GIVE_INFLUENCE_TOKEN', 20),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_GINSING_AGREEMENT', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_FRIEND_OF_WA', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_DENOUNCE', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_DECLARE_FORMAL_WAR', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_DENOUNCE_MILITARY_PRESENCE', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_INCITE_RAID', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_DECLARE_WAR', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_TRADE_MAP', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_GRANT_POLICY_SLOT', 0),
    ('Default Diplomatic', 'DIPLOMACY_ACTION_SABOTAGE_TRADE_CAPACITY', 0);

-- Default 10
UPDATE DiplomacyFavorsGrievancesEventsData
SET Range = 6
WHERE DiplomacyFavorGrievanceEventType = 'GRIEVANCE_FROM_CLOSE_LAND_CLAIM';

-- Default 0
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = 2
WHERE DiplomacyFavorGrievanceEventType = 'GRIEVANCE_FROM_CLOSE_MILITARY';

-- Default 0
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = 2
WHERE DiplomacyFavorGrievanceEventType = 'GRIEVANCE_FROM_REJECTED_ALLIANCE';

-- Default 0
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = 2
WHERE DiplomacyFavorGrievanceEventType = 'GRIEVANCE_FROM_REJECTED_ENDEAVOR';

-- Default 0
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = 2
WHERE DiplomacyFavorGrievanceEventType = 'GRIEVANCE_FROM_OPPOSE';

--Default 15
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = 20
WHERE DiplomacyFavorGrievanceEventType = 'GRIEVANCE_FROM_WAR_OPPOSITION_3RD_PARTY';

--Default 10
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = 15
WHERE DiplomacyFavorGrievanceEventType = 'HISTORICAL_EVENT_MUTUAL_WAR';

--Default -10
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = -15
WHERE DiplomacyFavorGrievanceEventType = 'HISTORICAL_EVENT_BORDERS_TOUCH';

--Default -10
UPDATE DiplomacyFavorsGrievancesEventsData
SET Amount = -10
WHERE DiplomacyFavorGrievanceEventType = 'HISTORICAL_EVENT_COMPETATAIVE_VICTORIES';