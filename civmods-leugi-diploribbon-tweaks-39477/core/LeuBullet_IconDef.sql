----------------------------------
-- Agenda Bullets
----------------------------------
INSERT OR REPLACE INTO Icons
		(ID, Context)
VALUES	("LEU_BULLET_POSITIVE",		"DEFAULT"),
		("LEU_BULLET_NEGATIVE",		"DEFAULT");

INSERT OR REPLACE INTO IconDefinitions
		(ID, Path)
VALUES
		("LEU_BULLET_POSITIVE",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_bullet_positive.png"),
		("LEU_BULLET_NEGATIVE",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_bullet_negative.png");

----------------------------------
-- Relationship Icons
----------------------------------
INSERT OR REPLACE INTO IconContexts
		(Context,									AllowTinting)
VALUES	("LEUGI_DIPLO_ICONS",							0),
		("LEUGI_DIPLO_ICONS_HEARTY",					0),
		("HIGHCONTRAST_LEUGI_DIPLO_ICONS",				0),
		("HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",		0),
		("DISCORD_DIPLO_ICONS",							0);
		
INSERT OR REPLACE INTO Icons
		(ID,									Context)
VALUES	("PLAYER_RELATIONSHIP_ALLIANCE",		"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_ALLIANCE",		"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_ALLIANCE",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_ALLIANCE",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_ALLIANCE",		"DISCORD_DIPLO_ICONS"),
		--
		("PLAYER_RELATIONSHIP_AT_WAR",			"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_AT_WAR",			"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_AT_WAR",			"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_AT_WAR",			"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_AT_WAR",			"DISCORD_DIPLO_ICONS"),
		--
		("PLAYER_RELATIONSHIP_FRIENDLY",		"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_FRIENDLY",		"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_FRIENDLY",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_FRIENDLY",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_FRIENDLY",		"DISCORD_DIPLO_ICONS"),
		--
		("PLAYER_RELATIONSHIP_HELPFUL",		"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_HELPFUL",		"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_HELPFUL",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_HELPFUL",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_HELPFUL",		"DISCORD_DIPLO_ICONS"),
		--
		("PLAYER_RELATIONSHIP_HOSTILE",		"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_HOSTILE",		"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_HOSTILE",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_HOSTILE",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_HOSTILE",		"DISCORD_DIPLO_ICONS"),
		--
		("PLAYER_RELATIONSHIP_NEUTRAL",		"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_NEUTRAL",		"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_NEUTRAL",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_NEUTRAL",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_NEUTRAL",		"DISCORD_DIPLO_ICONS"),
		--
		("PLAYER_RELATIONSHIP_UNFRIENDLY",		"LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_UNFRIENDLY",		"LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_UNFRIENDLY",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS"),
		("PLAYER_RELATIONSHIP_UNFRIENDLY",		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY"),
		("PLAYER_RELATIONSHIP_UNFRIENDLY",		"DISCORD_DIPLO_ICONS");
		
		
INSERT OR REPLACE INTO IconDefinitions
		(ID, 	Context,	Path)
VALUES
		("PLAYER_RELATIONSHIP_ALLIANCE",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_alliance.png"),
		
		("PLAYER_RELATIONSHIP_ALLIANCE",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_alliance.png"),
		
		("PLAYER_RELATIONSHIP_ALLIANCE",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_alliance.png"),
		
		("PLAYER_RELATIONSHIP_ALLIANCE",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_alliance.png"),
		
		("PLAYER_RELATIONSHIP_ALLIANCE",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_alliance.png"),
		
		--	
		("PLAYER_RELATIONSHIP_AT_WAR",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_war.png"),
		
		("PLAYER_RELATIONSHIP_AT_WAR",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_war.png"),
		
		("PLAYER_RELATIONSHIP_AT_WAR",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_war.png"),
		
		("PLAYER_RELATIONSHIP_AT_WAR",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_war.png"),
		
		("PLAYER_RELATIONSHIP_AT_WAR",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_war.png"),
		
		--
		
		("PLAYER_RELATIONSHIP_FRIENDLY",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_friendly.png"),
		
		("PLAYER_RELATIONSHIP_FRIENDLY",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_friendly.png"),
		
		("PLAYER_RELATIONSHIP_FRIENDLY",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_friendly.png"),
		
		("PLAYER_RELATIONSHIP_FRIENDLY",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_friendly.png"),
		
		("PLAYER_RELATIONSHIP_FRIENDLY",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_friendly.png"),
		
		--
		
		("PLAYER_RELATIONSHIP_HELPFUL",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_helpful.png"),
		
		("PLAYER_RELATIONSHIP_HELPFUL",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_helpful_heart.png"),
		
		("PLAYER_RELATIONSHIP_HELPFUL",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_helpful.png"),
		
		("PLAYER_RELATIONSHIP_HELPFUL",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_helpful_heart.png"),
		
		("PLAYER_RELATIONSHIP_HELPFUL",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_helpful.png"),
		
		--
		
		("PLAYER_RELATIONSHIP_HOSTILE",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_hostile.png"),
		
		("PLAYER_RELATIONSHIP_HOSTILE",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_hostile.png"),
		
		("PLAYER_RELATIONSHIP_HOSTILE",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_hostile.png"),
		
		("PLAYER_RELATIONSHIP_HOSTILE",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_hostile.png"),
		
		("PLAYER_RELATIONSHIP_HOSTILE",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_hostile.png"),
		
		--
		
		("PLAYER_RELATIONSHIP_NEUTRAL",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_neutral.png"),
		
		("PLAYER_RELATIONSHIP_NEUTRAL",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_neutral.png"),
		
		("PLAYER_RELATIONSHIP_NEUTRAL",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_neutral.png"),
		
		("PLAYER_RELATIONSHIP_NEUTRAL",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_neutral.png"),
		
		("PLAYER_RELATIONSHIP_NEUTRAL",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_neutral.png"),
		
		--
		
		("PLAYER_RELATIONSHIP_UNFRIENDLY",
		"LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_unfriendly.png"),
		
		("PLAYER_RELATIONSHIP_UNFRIENDLY",
		"LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons/leu_dip_unfriendly.png"),
		
		("PLAYER_RELATIONSHIP_UNFRIENDLY",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_unfriendly.png"),
		
		("PLAYER_RELATIONSHIP_UNFRIENDLY",
		"HIGHCONTRAST_LEUGI_DIPLO_ICONS_HEARTY",
		"fs://game/leugi-diploribbon-tweaks/Icons_HigherContrast/hc_leu_dip_unfriendly.png"),
		
		("PLAYER_RELATIONSHIP_UNFRIENDLY",
		"DISCORD_DIPLO_ICONS",
		"fs://game/leugi-diploribbon-tweaks/Icons_Discord/disc_leu_dip_unfriendly.png");
		
		--
		
		
		