--========================================================================================================================
--========================================================================================================================
	UPDATE IconDefinitions
	SET Path = 'fs://game/sukritacts_simple_ui_adjustments/textures/Suk_SUA_UnlockGreatWork.png'
	WHERE ID IN (
		'MOD_GREATWORK_CODEX',
		'MOD_GREATWORK_RELIC'
	);

	UPDATE IconDefinitions
	SET Path = 'fs://game/sukritacts_simple_ui_adjustments/textures/Suk_SUA_UnlockReligion.png'
	WHERE ID IN (
		'MOD_RELIGION_BELIEF'
	);
--========================================================================================================================
--========================================================================================================================