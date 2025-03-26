------------------------------------------
-- Tactical Priorities (Delete and Reinsert Ordered by Priority)
------------------------------------------

DELETE FROM AiFavoredItems WHERE ListType = 'Default Tactical';
INSERT INTO AiFavoredItems (ListType, Item, Value)
VALUES
  ('Default Tactical', 'First Turn Settle', 0),
  ('Default Tactical', 'Take Razing City', 0),
  ('Default Tactical', 'Capture City', 0),
  ('Default Tactical', 'Use WMD', 0),
  ('Default Tactical', 'Pillage Improvement', 0),
  ('Default Tactical', 'Move to Safety', 0),
  ('Default Tactical', 'Heal', 0),
  ('Default Tactical', 'Air Assault', 0),
  ('Default Tactical', 'Air Rebase', 0),
  ('Default Tactical', 'Use Great Person', 0),
  ('Default Tactical', 'Chase Target', 0),
  ('Default Tactical', 'Plunder Trade Route', 0),
  ('Default Tactical', 'Attack High Priority Unit', 0),
  ('Default Tactical', 'Attack Medium Priority Unit', 0),
  ('Default Tactical', 'Attack Low Priority Unit', 0),
  ('Default Tactical', 'Form Army', 0),
  ('Default Tactical', 'Defend Home', 0),
  ('Default Tactical', 'Upgrade Units', 0),
  ('Default Tactical', 'Explore', 0),
  ('Default Tactical', 'Escort Embarked', 0),
  ('Default Tactical', 'Wander', 0),
  ('Default Tactical', 'Wander near city', 0),
  ('Default Tactical', 'Block Enemy Expansion', 0),
  ('Default Tactical', 'Army Overrun', 0);
