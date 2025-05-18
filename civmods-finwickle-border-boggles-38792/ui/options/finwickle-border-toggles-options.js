import '/core/ui/options/options.js';  // make sure this loads first
import { CategoryType } from '/core/ui/options/options-helpers.js';
import { Options, OptionType } from '/core/ui/options/model-options.js';
import ModSettings from '/finwickle-border-boggles/ui/options/mod-options-decorator.js';
import { BorderTogglesUtils } from '/finwickle-border-boggles/ui/utils/finwickle-border-toggles-utils.js';

const MOD_ID = "finwickle-border-toggles";

const borderTogglesOptions = new class {
    data = {
        enabledByDefault: false,
        enabledForTrade: false,
		enabledForMapTacks: true,
        enabledForReligion: false,
		enabledDebug: false
    };
    constructor() {
        const modSettings = ModSettings.load(MOD_ID);
        if (modSettings) this.data = modSettings;
    }
    save() {
        ModSettings.save(MOD_ID, this.data);
    }
    get enabledByDefault() {
        return this.data.enabledByDefault;
    }
    set enabledByDefault(flag) {
        this.data.enabledByDefault = !!flag;
        this.save();
    }
    get enabledForTrade() {
        return this.data.enabledForTrade;
    }
    set enabledForTrade(flag) {
        this.data.enabledForTrade = !!flag;
        this.save();
    }
    get enabledForMapTacks() {
        return this.data.enabledForMapTacks;
    }
    set enabledForMapTacks(flag) {
        this.data.enabledForMapTacks = !!flag;
        this.save();
    }
    get enabledForReligion() {
        return this.data.enabledForReligion;
    }
    set enabledForReligion(flag) {
        this.data.enabledForReligion = !!flag;
        this.save();
    }
    get enabledForReligion() {
        return this.data.enabledForReligion;
    }
    set enabledForReligion(flag) {
        this.data.enabledForReligion = !!flag;
        this.save();
    }
    get enabledDebug() {
        return this.data.enabledDebug;
    }
    set enabledDebug(flag) {
        this.data.enabledDebug = !!flag;
        this.save();
    }
};
const onInitEnabledByDefault = (info) => {
    info.currentValue = borderTogglesOptions.enabledByDefault;
};
const onUpdateEnabledByDefault = (_info, flag) => {
    borderTogglesOptions.enabledByDefault = flag;
	BorderTogglesUtils.toggleCityBorder('fxs-default-lens', flag);
	BorderTogglesUtils.toggleCityBorder('fxs-settler-lens', flag);
	BorderTogglesUtils.toggleCityBorder('fxs-continent-lens', flag);
	BorderTogglesUtils.toggleCityBorder('mod-discovery-lens', flag);
	BorderTogglesUtils.toggleCityBorder('mod-treasure-lens', flag);
	BorderTogglesUtils.toggleCityBorder('sn-wonder-lens', flag);
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        group: "finwickle_mods",
        type: OptionType.Checkbox,
        id: "finwickle-city-border-enabled-by-default",
        initListener: onInitEnabledByDefault,
        updateListener: onUpdateEnabledByDefault,
        label: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED",
        description: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_DESCRIPTION",
    });
});
const onInitEnabledForTrade = (info) => {
    info.currentValue = borderTogglesOptions.enabledForTrade;
};
const onUpdateEnabledForTrade = (_info, flag) => {
    borderTogglesOptions.enabledForTrade = flag;
	BorderTogglesUtils.toggleCityBorder('fxs-trade-lens', flag);
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        group: "finwickle_mods",
        type: OptionType.Checkbox,
        id: "finwickle-city-border-enabled-for-trade",
        initListener: onInitEnabledForTrade,
        updateListener: onUpdateEnabledForTrade,
        label: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_TRADE",
        description: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_TRADE_DESCRIPTION",
    });
});
const onInitEnabledForMapTacks = (info) => {
    info.currentValue = borderTogglesOptions.enabledForMapTacks;
};
const onUpdateEnabledForMapTacks = (_info, flag) => {
    borderTogglesOptions.enabledForMapTacks = flag;
	BorderTogglesUtils.toggleCityBorder('dmt-map-tack-lens', flag);
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        group: "finwickle_mods",
        type: OptionType.Checkbox,
        id: "finwickle-city-border-enabled-for-maptacks",
        initListener: onInitEnabledForMapTacks,
        updateListener: onUpdateEnabledForMapTacks,
        label: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_MAPTACKS",
        description: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_MAPTACKS_DESCRIPTION",
    });
});
const onInitEnabledForReligion = (info) => {
    info.currentValue = borderTogglesOptions.enabledForReligion;
};
const onUpdateEnabledForReligion = (_info, flag) => {
    borderTogglesOptions.enabledForReligion = flag;
	BorderTogglesUtils.toggleCityBorder('cmp-religion-lens', flag);
	BorderTogglesUtils.toggleCityBorder('aml-missionary-lens', flag);
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        group: "finwickle_mods",
        type: OptionType.Checkbox,
        id: "finwickle-city-border-enabled-for-religion",
        initListener: onInitEnabledForReligion,
        updateListener: onUpdateEnabledForReligion,
        label: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_RELIGION",
        description: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_RELIGION_DESCRIPTION",
    });
});

const onInitEnabledDebug = (info) => {
    info.currentValue = borderTogglesOptions.enabledDebug;
};
const onUpdateEnabledDebug = (_info, flag) => {
    borderTogglesOptions.enabledDebug = flag;
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        group: "finwickle_mods",
        type: OptionType.Checkbox,
        id: "finwickle-city-border-enabled-debug",
        initListener: onInitEnabledDebug,
        updateListener: onUpdateEnabledDebug,
        label: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_DEBUG",
        description: "LOC_OPTIONS_FINWICKLE_CITY_BORDER_ENABLED_DEBUG_DESCRIPTION",
    });
});

export { borderTogglesOptions as default };
