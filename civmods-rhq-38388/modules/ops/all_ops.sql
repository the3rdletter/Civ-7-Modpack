------------------------------------------
-- Operation Limits
------------------------------------------
UPDATE AiFavoredItems
SET Value = 2
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_FOUNDING';


UPDATE AiFavoredItems
SET Value = 1
WHERE ListType = 'BaseOperationsLimits' AND Item = 'CITY_ASSAULT';

UPDATE AiFavoredItems
SET Value = 1
WHERE ListType = 'PerWarOperationsLimits' AND Item = 'CITY_ASSAULT';

------------------------------------------
-- AI Operation Definitions
------------------------------------------
UPDATE AiOperationDefs
SET BehaviorTree = 'Settle New Town v2', MaxTargetDefense = 1, Priority = 4
WHERE OperationName = 'City Founding';

UPDATE AiOperationDefs
SET BehaviorTree = 'Simple City Assault', MinOddsOfSuccess = 0.05
WHERE OperationName = 'Attack Enemy City';

-- Trying to troubleshoot DOW bug in base game.
UPDATE AiOperationDefs
SET EnemyType = 'WAR', MinOddsOfSuccess = .05
WHERE OperationName = 'Attack Enemy Independent';

-- Trying to troubleshoot DOW bug in base game.
UPDATE AiOperationDefs
SET EnemyType = 'WAR'
WHERE OperationName = 'City Defense';

-- This has been changed to be a little more aggressive.
--INSERT INTO AiOperationDefs (OperationName, TargetType, BehaviorTree, Priority, MinOddsOfSuccess, MustHaveUnits)
--VALUES ('Attack City No Diplo', 'TARGET_ENEMY_CITY', 'Simple City Assault No Diplo', 3, 0.15, 5);

------------------------------------------
-- AI Operation Teams Configuration
------------------------------------------
UPDATE AIOperationTeams
SET SafeRallyPoint = 0
WHERE OperationName = 'City Founding';

UPDATE AIOperationTeams
SET InitialStrengthAdvantage = -1, OngoingStrengthAdvantage = 1
WHERE OperationName = 'Attack Enemy City';

UPDATE AIOperationTeams
SET InitialStrengthAdvantage = -1, OngoingStrengthAdvantage = 0
WHERE OperationName = 'Independent Camp Attack';

-- Lowered Initial Strength Advantage to -1 to always defend cities.
UPDATE AIOperationTeams
SET InitialStrengthAdvantage = 0, OngoingStrengthAdvantage = 0
WHERE OperationName = 'City Defense';

------------------------------------------
-- AI Operation Team Requirements
------------------------------------------
UPDATE OpTeamRequirements
SET MinNumber = 1, MaxNumber = 4
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_MELEE';

UPDATE OpTeamRequirements
SET MinNumber = 4, MaxNumber = 6 -- Too high and the AI won't attack
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_RANGED';

UPDATE OpTeamRequirements
SET MinNumber = 0, MaxNumber = 3 -- Too high and the AI won't attack
WHERE TeamName = 'Enemy City Attack' AND ClassTag = 'UNIT_CLASS_SIEGE';

INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, Property, MaxNumber)
VALUES ('Enemy City Attack', 'UNIT_CLASS_CREATE_TOWN', 'LandClaimCharges', 0);

--INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, MaxNumber)
--VALUES ('Enemy City Attack', 'UNIT_CLASS_NON_COMBAT', 0);

-- Trying reconsider while preparing.

--UPDATE OpTeamRequirements
--SET ReconsiderWhilePreparing = true
--WHERE TeamName = 'Enemy City Attack';

-- Independent Camp Attack
UPDATE OpTeamRequirements
SET MinNumber = 2, MaxNumber = 4
WHERE TeamName = 'Independent Camp Attack' AND ClassTag = 'UNIT_CLASS_MELEE';

UPDATE OpTeamRequirements
SET MinNumber = 4, MaxNumber = 6
WHERE TeamName = 'Independent Camp Attack' AND ClassTag = 'UNIT_CLASS_RANGED';

INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, Property, MaxNumber)
VALUES ('Independent Camp Attack', 'UNIT_CLASS_CREATE_TOWN', 'LandClaimCharges', 0);

INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, MaxNumber)
VALUES ('Independent Camp Attack', 'UNIT_CLASS_NON_COMBAT', 0);

-- City Defense
INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, Property, MaxNumber)
VALUES ('City Defense', 'UNIT_CLASS_CREATE_TOWN', 'LandClaimCharges', 0);

-- Already Set to 0, this is for documentation to know why it's not set.
-- INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, MaxNumber)
-- VALUES ('City Defense', 'UNIT_CLASS_NON_COMBAT', 0);

UPDATE OpTeamRequirements
SET MinNumber = 2, MaxNumber = 4
WHERE TeamName = 'City Defense' AND ClassTag = 'UNIT_CLASS_COMBAT';

INSERT OR IGNORE INTO OpTeamRequirements (TeamName, ClassTag, MinNumber, MaxNumber)
VALUES ('City Defense', 'UNIT_CLASS_MELEE', 1, 4),
       ('City Defense', 'UNIT_CLASS_RANGED', 2, 6),
       ('City Defense', 'UNIT_CLASS_SIEGE', 0, 2);

-- City Founders
UPDATE OpTeamRequirements
SET MinNumber = 0, MaxNumber = 2
WHERE TeamName = 'City Founders' AND ClassTag = 'UNIT_CLASS_COMBAT';

UPDATE OpTeamRequirements
SET MaxNumber = 0
WHERE TeamName = 'City Founders' AND ClassTag = 'UNIT_CLASS_ARMY_COMMANDER';



------------------------------------------
-- New Aggressive Attack OP
------------------------------------------

-- Aggressive City Assault
INSERT OR IGNORE INTO AiOperationTypes(OperationType) VALUES
('OP_RH_AGR_ATTACK');

REPLACE INTO AiFavoredItems(ListType, Item, Value) VALUES
('BaseOperationsLimits',   'OP_RH_AGR_ATTACK', 1),
('PerWarOperationsLimits', 'OP_RH_AGR_ATTACK', 1);


INSERT OR IGNORE INTO AiOperationLists (ListType) VALUES
('Aggressive Civ Operations');

INSERT OR IGNORE INTO AllowedOperations (ListType, OperationDef) VALUES
('Aggressive Civ Operations', 'RH AGR ATTACK');

INSERT OR IGNORE INTO AllowedOperations (ListType, OperationDef) VALUES
('Major Civ Operations', 'RH AGR ATTACK');



INSERT OR IGNORE INTO AiOperationDefs (OperationName,TargetType, OperationType, MinOddsOfSuccess, EnemyType, SelfStart, 	BehaviorTree,		Priority,	MaxTargetDistInRegion,MaxTargetDistInArea,MaxTargetDistInWorld,MustHaveUnits) VALUES 
('RH AGR ATTACK',							'TARGET_ENEMY_CITY','OP_RH_AGR_ATTACK',		0.01, 		'NONE',		 1, 	'Simple City Assault',		4,			-1,						14,					14,						4);

INSERT OR IGNORE INTO AiTeams (TeamName) VALUES
('RH AGR Team');
INSERT OR IGNORE INTO AiOperationTeams (TeamName,OperationName,		InitialStrengthAdvantage,OngoingStrengthAdvantage) VALUES
('RH AGR Team',									'RH AGR ATTACK',			-2,			0);


INSERT OR IGNORE INTO OpTeamRequirements (TeamName,ClassTag,MinNumber,MaxNumber) VALUES
('RH AGR Team', 'UNIT_CLASS_COMBAT',           4, 11); 

INSERT OR IGNORE INTO OpTeamRequirements (TeamName,ClassTag,MinNumber,MaxNumber) VALUES

('RH AGR Team', 'UNIT_CLASS_CREATE_TOWN',		0, 0), -- no settlers game
('RH AGR Team', 'UNIT_CLASS_RECON',				0, 0), -- no scouts


('RH AGR Team', 'UNIT_CLASS_MELEE',           2, 6),
('RH AGR Team', 'UNIT_CLASS_RANGED',          1, 6),
('RH AGR Team', 'UNIT_CLASS_SIEGE',    		  0, 3), 
('RH AGR Team', 'UNIT_CLASS_ARMY_COMMANDER',  1, 2), 
('RH AGR Team', 'UNIT_CLASS_NAVAL',  		  0, 0), 
('RH AGR Team', 'UNIT_CLASS_LOGISTICS',  	  0, 2), 
('RH AGR Team', 'UNIT_CLASS_HEALER',  	  	  0, 2);




--('RH AGR Team', 'UNITTYPE_AIR',             0, 3),
--('RH AGR Team', 'UNITTYPE_NUCLEAR',         0, 1),
--('RH AGR Team', 'UNITTYPE_AIR_SIEGE',       0, 2), 
--('RH AGR Team', 'UNITTYPE_SIEGE_ALL',    	2, 6), 






/*
	<AiOperationTeams>
		<Row TeamName="Enemy City Attack" OperationName="Attack Enemy City" InitialStrengthAdvantage="0" OngoingStrengthAdvantage="4"/>
		<Row TeamName="Independent Camp Attack" OperationName="Attack Enemy Independent" InitialStrengthAdvantage="0" OngoingStrengthAdvantage="2"/>
		<Row TeamName="City Defense" OperationName="City Defense" InitialStrengthAdvantage="-1" OngoingStrengthAdvantage="1"/>
		<Row TeamName="City Founders" OperationName="City Founding" InitialStrengthAdvantage="0" OngoingStrengthAdvantage="1"/>
		<Row TeamName="Independent Civ Force" OperationName="Independent Raid" InitialStrengthAdvantage="-3" OngoingStrengthAdvantage="0"/>
		<Row TeamName="Independent Large Civ Force" OperationName="Independent Large Raid" InitialStrengthAdvantage="0" OngoingStrengthAdvantage="2"/>
		<Row TeamName="Independent Civ Assault Force" OperationName="Independent Assault" InitialStrengthAdvantage="-1" OngoingStrengthAdvantage="1"/>
		<Row TeamName="Aid Suzerain Attack Force" OperationName="Aid Suzerain" InitialStrengthAdvantage="-2" OngoingStrengthAdvantage="0"/>
	</AiOperationTeams>
	<OpTeamRequirements>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_MELEE" MinNumber="2"/>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_RANGED" MinNumber="0" MaxNumber="3"/>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_SIEGE" MaxNumber="3"/>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_ARMY_COMMANDER" MinNumber="1" MaxNumber="3"/>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_NAVAL" MaxNumber="0"/>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_LOGISTICS" MaxNumber="2"/>
		<Row TeamName="Enemy City Attack" ClassTag="UNIT_CLASS_HEALER" MinNumber="0"/>
		<Row TeamName="Independent Camp Attack" ClassTag="UNIT_CLASS_MELEE" MinNumber="1" MaxNumber="5"/>
		<Row TeamName="Independent Camp Attack" ClassTag="UNIT_CLASS_RANGED" MaxNumber="2"/>
		<Row TeamName="Independent Camp Attack" ClassTag="UNIT_CLASS_ARMY_COMMANDER" MinNumber="1" MaxNumber="1"/>
		<Row TeamName="Independent Camp Attack" ClassTag="UNIT_CLASS_NAVAL" MaxNumber="0"/>
		<Row TeamName="Independent Camp Attack" ClassTag="UNIT_CLASS_RECON" MaxNumber="0"/>
		<Row TeamName="City Defense" ClassTag="UNIT_CLASS_ARMY_COMMANDER" MaxNumber="1"/>
		<Row TeamName="City Defense" ClassTag="UNIT_CLASS_NAVAL" MaxNumber="0"/>
		<Row TeamName="City Defense" ClassTag="UNIT_CLASS_NON_COMBAT" MaxNumber="0"/>
		<Row TeamName="City Defense" ClassTag="UNIT_CLASS_COMBAT" MinNumber="0"/>
		<Row TeamName="City Defense" ClassTag="UNIT_CLASS_RECON" MaxNumber="0"/>
		<Row TeamName="City Founders" ClassTag="UNIT_CLASS_CREATE_TOWN" Property="LandClaimCharges" MinNumber="1" MaxNumber="1"/>
		<Row TeamName="City Founders" ClassTag="UNIT_CLASS_COMBAT" MaxNumber="6"/>
		<Row TeamName="City Founders" ClassTag="UNIT_CLASS_ARMY_COMMANDER" MaxNumber="1"/>
		<Row TeamName="City Founders" ClassTag="UNIT_CLASS_NAVAL" MaxNumber="0"/>
		<Row TeamName="City Founders" ClassTag="UNIT_CLASS_RECON" MaxNumber="0"/>
		<Row TeamName="Independent Civ Force" ClassTag="UNIT_CLASS_COMBAT" MinNumber="2" MaxNumber="2"/>
		<Row TeamName="Independent Civ Force" ClassTag="UNIT_CLASS_MELEE" MinNumber="0"/>
		<Row TeamName="Independent Civ Force" ClassTag="UNIT_CLASS_RANGED" MaxNumber="1"/>
		<Row TeamName="Independent Large Civ Force" ClassTag="UNIT_CLASS_COMBAT" MinNumber="4"/>
		<Row TeamName="Independent Large Civ Force" ClassTag="UNIT_CLASS_MELEE" MinNumber="0"/>
		<Row TeamName="Independent Large Civ Force" ClassTag="UNIT_CLASS_RANGED" MaxNumber="2"/>
		<Row TeamName="Independent Civ Assault Force" ClassTag="UNIT_CLASS_COMBAT" MinNumber="4"/>
		<Row TeamName="Independent Civ Assault Force" ClassTag="UNIT_CLASS_RANGED" MaxNumber="1"/>
		<Row TeamName="Independent Civ Assault Force" ClassTag="UNIT_CLASS_ARMY_COMMANDER" MinNumber="1"/>
		<Row TeamName="Aid Suzerain Attack Force" ClassTag="UNIT_CLASS_MELEE" MinNumber="0"/>
		<Row TeamName="Aid Suzerain Attack Force" ClassTag="UNIT_CLASS_RANGED" MinNumber="0"/>
	</OpTeamRequirements>
	
	<!-- Operations. Most should be age specific, consider moving this one in the future, but start with it here -->Favored	<AiOperationTypes>
		<Row OperationType="ATTACK_BARBARIANS"/>
		<Row OperationType="CITY_ASSAULT"/>
		<Row OperationType="CITY_FOUNDING"/>
	</AiOperationTypes>
	<AiListTypes>
		<Row ListType="BaseOperationsLimits"/>
		<Row ListType="PerWarOperationsLimits"/>
	</AiListTypes>
	<AiLists>
		<Row ListType="BaseOperationsLimits" LeaderType="TRAIT_LEADER_MAJOR_CIV" System="AiOperationTypes"/>
		<Row ListType="PerWarOperationsLimits" LeaderType="TRAIT_LEADER_MAJOR_CIV" System="PerWarOperationTypes"/>
	</AiLists>
	<AiFavoredItems>
		<Row ListType="BaseOperationsLimits" Item="ATTACK_BARBARIANS" Value="1"/>
		<Row ListType="BaseOperationsLimits" Item="CITY_ASSAULT" Value="1"/>
		<Row ListType="BaseOperationsLimits" Item="CITY_FOUNDING" Value="1"/>
		<Row ListType="PerWarOperationsLimits" Item="CITY_ASSAULT" Value="0"/>
	</AiFavoredItems>
	<AiOperationLists>
		<Row ListType="Major Civ Operations"/>
		<Row ListType="Independent Civ Operations"/>
		<Row ListType="City State Operations"/>
	</AiOperationLists>
	<AllowedOperations>
		<Row ListType="Major Civ Operations" OperationDef="Attack Enemy City"/>
		<Row ListType="Major Civ Operations" OperationDef="Attack Enemy Independent"/>
		<Row ListType="Major Civ Operations" OperationDef="City Defense"/>
		<Row ListType="Major Civ Operations" OperationDef="City Founding"/>
		<Row ListType="Independent Civ Operations" OperationDef="Independent Raid"/>
		<Row ListType="Independent Civ Operations" OperationDef="Independent Assault"/>
		<Row ListType="Independent Civ Operations" OperationDef="Independent Large Raid"/>
		<Row ListType="City State Operations" OperationDef="Aid Suzerain"/>
		<Row ListType="City State Operations" OperationDef="City Defense"/>
	</AllowedOperations>
	<AiOperationDefs>
		<Row OperationName="Attack Enemy City" TargetType="TARGET_ENEMY_CITY" EnemyType="WAR" OperationType="CITY_ASSAULT" BehaviorTree="Simple City Assault" SelfStart="True" Priority="3" MaxTargetDistInRegion="-1" MaxTargetDistInArea="30" MaxTargetDistInWorld="45" MinOddsOfSuccess="0.25" MustHaveUnits="5"/>
		<Row OperationName="Attack Enemy Independent" TargetType="TARGET_ENEMY_INDEPENDENT" BehaviorTree="Minor Power Assault" Priority="2"/>
		<Row OperationName="City Defense" TargetType="TARGET_MY_CITY" BehaviorTree="Simple City Defense" Priority="4" MaxTargetDistInRegion="-1" MaxTargetDistInArea="-1" MaxTargetDistInWorld="0"/>
		<Row OperationName="City Founding" TargetType="TARGET_NEW_CITY" BehaviorTree="Settle New Town" Priority="2" SelfStart="false" MaxTargetDistInRegion="-1" MaxTargetDistInArea="-1" MaxTargetDistInWorld="0"/>
		<Row OperationName="Independent Raid" TargetType="TARGET_ENEMY_CITY" EnemyType="WAR" BehaviorTree="Independent Power Raid" SelfStart="false" Priority="3"/>
		<Row OperationName="Independent Assault" TargetType="TARGET_ENEMY_CITY" EnemyType="WAR" BehaviorTree="Independent Power Assault" SelfStart="false" Priority="2"/>
		<Row OperationName="Independent Large Raid" TargetType="TARGET_ENEMY_CITY" EnemyType="WAR" BehaviorTree="Independent Power Raid" SelfStart="false" Priority="3"/>
		<Row OperationName="Aid Suzerain" TargetType="TARGET_SUZERAIN_SUPPORT" EnemyType="ALLY" OperationType="CITY_ASSAULT" BehaviorTree="Reinforce Ally" Priority="3" SelfStart="true" MaxTargetDistInRegion="-1" MaxTargetDistInArea="45"/>
	</AiOperationDefs>
	<AiTeams>
		<Row TeamName="Enemy City Attack"/>
		<Row TeamName="Independent Camp Attack"/>
		<Row TeamName="City Defense"/>
		<Row TeamName="City Founders"/>
		<Row TeamName="Independent Civ Force"/>
		<Row TeamName="Independent Large Civ Force"/>
		<Row TeamName="Independent Civ Assault Force"/>
		<Row TeamName="Aid Suzerain Attack Force"/>
	</AiTeams>	
*/