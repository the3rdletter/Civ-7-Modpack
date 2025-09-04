// We add a dependency on the Options module to ensure default options are loaded before we add our own
import '/core/ui/options/screen-options.js';

import { d as CategoryData, C as CategoryType, O as Options, a as OptionType } from '/core/ui/options/editors/index.chunk.js';

import { Leu_RelationshipIcons, Leu_ExpressiveLeaders, Leu_HelpfulIcon, Leu_ColoredIdeologies, Leu_TeamIdeologies } from 'fs://game/leugi-diploribbon-tweaks/core/settings.js';

CategoryType["Mods"] = "mods";
CategoryData[CategoryType.Mods] = {
    title: "LOC_UI_CONTENT_MGR_SUBTITLE",
    description: "LOC_UI_CONTENT_MGR_SUBTITLE_DESCRIPTION",
};


// Pick your Icon Style
const onLeu_DiploBannerStyleSettingsInit = (optionInfo) => {
	const currentSelection = Leu_RelationshipIcons.StyleSetting;
	if (!currentSelection) {
		optionInfo.selectedItemIndex = 0
	} else {
	optionInfo.selectedItemIndex = (currentSelection - 1);
	}
};

const onLeu_DiploBannerStyleSettingsUpdate = (optionInfo, value) => {
	const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
	Leu_RelationshipIcons.StyleSetting = selectedOption;
};

const LeuDiploStyles = [
            { setting: 1, label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_A", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_A_TOOLTIP" },
            { setting: 2, label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_B", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_B_TOOLTIP" },
            { setting: 3, label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_C", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_C_TOOLTIP" },
            { setting: 4, label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_D", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_D_TOOLTIP" }
        ];

Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.Mods, 
        // @ts-ignore
        group: 'LEU_DIPLO_RIBBON', 
        type: OptionType.Dropdown,
        id: "leu-diplo-style", 
        initListener: onLeu_DiploBannerStyleSettingsInit, 
        updateListener: onLeu_DiploBannerStyleSettingsUpdate, 
        label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_NAME", 
        description: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_DESCRIPTION",
		dropdownItems: LeuDiploStyles
    });
});

// To Smiley or not to Smiley
const onLeu_DiploBannerSmileySettingsInit = (optionInfo) => {
	const currentSelection = Leu_ExpressiveLeaders.AllowedExpressions;
	if (!currentSelection) {
		optionInfo.selectedItemIndex = 0
	} else {
	optionInfo.selectedItemIndex = (currentSelection - 1);
	};
};

const onLeu_DiploBannerSmileySettingsUpdate = (optionInfo, value) => {
	const selectedOption = (optionInfo.dropdownItems?.[value]).setting;
	Leu_ExpressiveLeaders.AllowedExpressions = selectedOption;
};

const LeuSmileyStyles = [
            { setting: 1, label: "LOC_MOD_LEU_DIPLO_RIBBON_LEADER_NO_EMOTE", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_LEADER_NO_EMOTE_TOOLTIP" },
            { setting: 2, label: "LOC_MOD_LEU_DIPLO_RIBBON_LEADER_WAR_EMOTE", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_LEADER_WAR_EMOTE_TOOLTIP" },
            { setting: 3, label: "LOC_MOD_LEU_DIPLO_RIBBON_LEADER_ALL_EMOTE", tooltip: "LOC_MOD_LEU_DIPLO_RIBBON_LEADER_ALL_EMOTE_TOOLTIP" }
        ];


Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.Mods, 
        // @ts-ignore
        group: 'LEU_DIPLO_RIBBON', 
        type: OptionType.Dropdown,
        id: "leu-diplo-smileys", 
        initListener: onLeu_DiploBannerSmileySettingsInit, 
        updateListener: onLeu_DiploBannerSmileySettingsUpdate, 
        label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_EMOTES_NAME", 
        description: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_EMOTES_DESCRIPTION",
		dropdownItems: LeuSmileyStyles
    });
});

// To Heart or not to Heart
const onLeu_DiploBannerHeartSettingsInit = (optionInfo) => {
	optionInfo.currentValue = Leu_HelpfulIcon.IsHearty
};

const onLeu_DiploBannerHeartSettingsUpdate = (optionInfo, value) => {
	Leu_HelpfulIcon.IsHearty = value;
};

Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.Mods, 
        // @ts-ignore
        group: 'LEU_DIPLO_RIBBON', 
        type: OptionType.Checkbox, 
        id: "leu-diplo-heart", 
        initListener: onLeu_DiploBannerHeartSettingsInit, 
        updateListener: onLeu_DiploBannerHeartSettingsUpdate, 
        label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_HEART_NAME", 
        description: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_ICONS_DESCRIPTION" 
    });
});

// Show me your (Ideology) Colors
const onLeu_DiploBannerIdeologySettingsInit = (optionInfo) => {
	optionInfo.currentValue = Leu_ColoredIdeologies.IsColored
};

const onLeu_DiploBannerIdeologySettingsUpdate = (optionInfo, value) => {
	Leu_ColoredIdeologies.IsColored = value;
};

Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.Mods, 
        // @ts-ignore
        group: 'LEU_DIPLO_RIBBON', 
        type: OptionType.Checkbox, 
        id: "leu-diplo-ideologies", 
        initListener: onLeu_DiploBannerIdeologySettingsInit, 
        updateListener: onLeu_DiploBannerIdeologySettingsUpdate, 
        label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_IDEOLOGY_NAME", 
        description: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_IDEOLOGY_COLORS_DESCRIPTION" 
    });
});


// Team Ideologies
const onLeu_DiploBannerTeamIdeologySettingsInit = (optionInfo) => {
	optionInfo.currentValue = Leu_TeamIdeologies.ShowChevron
};

const onLeu_DiploBannerTeamIdeologySettingsUpdate = (optionInfo, value) => {
	Leu_TeamIdeologies.ShowChevron = value;
};

Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.Mods, 
        // @ts-ignore
        group: 'LEU_DIPLO_RIBBON', 
        type: OptionType.Checkbox, 
        id: "leu-diplo-team-ideologies", 
        initListener: onLeu_DiploBannerTeamIdeologySettingsInit, 
        updateListener: onLeu_DiploBannerTeamIdeologySettingsUpdate, 
        label: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_TEAM_IDEOLOGY_NAME", 
        description: "LOC_MOD_LEU_DIPLO_RIBBON_OPTIONS_TEAM_IDEOLOGY_CHEVRON_DESCRIPTION" 
    });
});




