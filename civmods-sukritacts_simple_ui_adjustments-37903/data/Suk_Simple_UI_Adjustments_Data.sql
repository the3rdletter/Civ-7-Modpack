--========================================================================================================================
--========================================================================================================================
	-- Settlement Cap Increase
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_SETTLEMENT_LIMIT'
	WHERE TargetType LIKE '%SETTLEMENT\_CAP\_INCREASE%' ESCAPE '\';

	-- Specialist Cap Increase
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_SPECILAIST_CAP'
	WHERE TargetType LIKE '%SPECIALIST\_CAP\_INCREASE%' ESCAPE '\';

	-- Codices
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_GREATWORK_CODEX'
	WHERE TargetType IN (
		'MOD_AQ_CODEX',
		'MOD_AQ_CODEX_CIVIC',
		'MOD_AQ_MATHEMATICS_CODEX'
	);

	-- Relics
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_GREATWORK_RELIC'
	WHERE TargetType IN (
		'MOD_EX_RELIC'
	);

	-- Espionage
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_ESPIONAGE_UNLOCK'
	WHERE TargetType IN (
		'DIPLOMACY_ACTION_ESPIONAGE_MILITARY_INFILTRATION',
		'DIPLOMACY_ACTION_ESPIONAGE_STEAL_TECH'
	);

	-- Religion
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_RELIGION_BELIEF'
	WHERE TargetType IN (
		'MOD_PANTHEON_UNLOCK'
	);

	-- Policy Slots
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_POLICY_SLOT'
	WHERE TargetType LIKE 'MOD\_%\_TRADITION\_SLOT%' ESCAPE '\';

	-- Ideologies
	UPDATE ProgressionTreeNodeUnlocks
	SET IconString = 'MOD_UNLOCK_IDEOLOGY'
	WHERE TargetType IN (
		'MOD_UNLOCK_IDEOLOGY'
	);
--========================================================================================================================
--========================================================================================================================