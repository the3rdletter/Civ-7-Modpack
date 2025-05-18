// Mod options handling per https://forums.civfanatics.com/threads/configuring-mod-options-with-a-dedicated-mods-tab.696784/

import '/core/ui/options/options.js';  // make sure this loads first
import { CategoryType } from '/core/ui/options/options-helpers.js';
import { Options, OptionType } from '/core/ui/options/model-options.js';
import ModSettings from '/wonders-screen/code/mod-options-decorator.js';

const MOD_ID = "wonders-screen";

export var WondersModsBuildingInformationType;
(function (WondersModsBuildingInformationType) {
    WondersModsBuildingInformationType["ALL"] = "all";
    WondersModsBuildingInformationType["EXCLUDE_UNMET"] = "exclude_unmet";
    WondersModsBuildingInformationType["EXCLUDE_NON_VISIBLE"] = "exclude_non_visible";
})(WondersModsBuildingInformationType || (WondersModsBuildingInformationType = {}));

export const wondersScreenOptions = new class {
    data = {
        buildingInfo: WondersModsBuildingInformationType.EXCLUDE_NON_VISIBLE,
    };
    constructor() {
        this.changeListeners = [];

        const modSettings = ModSettings.load(MOD_ID);
        if (modSettings)
        {
            this.data = modSettings;
        }
    }
    save() {
        ModSettings.save(MOD_ID, this.data);
        this.changeListeners.forEach(listener => { listener.method?.call(listener?.scope) });
    }
    get BuildingInformationType() {
        return this.data.buildingInfo;
    }
    set BuildingInformationType(value)
    {
        this.data.buildingInfo = value;
        this.save();
    }
    addChangeListener(method, scope)
    {
        this.changeListeners.push({ method: method, scope: scope });
    }
};
const onInitBuildingInfo = (info) => {
    if (!info.dropdownItems)
        return;
    for (let i = 0; i < info.dropdownItems.length; i++) {
        const item = info.dropdownItems[i];
        if (item.value == wondersScreenOptions.BuildingInformationType) {
            info.selectedItemIndex = i;
            break;
        }
    }
}
const onUpdateBuildingInfo = (info, selectedIndex) => {
    const selectedItem = info.dropdownItems[selectedIndex];
    wondersScreenOptions.BuildingInformationType = selectedItem.value;
}

const buildingInfoOptions = [
    { label: 'LOC_OPTIONS_KAYLEER_WONDERS_BUILDING_INFO_ALL', value: WondersModsBuildingInformationType.ALL },
    { label: 'LOC_OPTIONS_KAYLEER_WONDERS_BUILDING_INFO_EXCLUDE_UNMET', value: WondersModsBuildingInformationType.EXCLUDE_UNMET },
    { label: 'LOC_OPTIONS_KAYLEER_WONDERS_BUILDING_INFO_EXCLUDE_NON_VISIBLE', value: WondersModsBuildingInformationType.EXCLUDE_NON_VISIBLE },
]

Options.addInitCallback(() => {
    Options.addOption({ 
        category: CategoryType.Mods, 
        // @ts-ignore
        group: 'kayleeR_wonder_mods',
        type: OptionType.Dropdown, 
        id: "kayleeR-wonder-mods-building-information-type", 
        initListener: onInitBuildingInfo,
        updateListener: onUpdateBuildingInfo, 
        label: "LOC_OPTIONS_KAYLEER_WONDERS_BUILDING_INFORMATION_TYPE", 
        description: "LOC_OPTIONS_KAYLEER_WONDERS_BUILDING_INFORMATION_TYPE_DESCRIPTION",
        dropdownItems: buildingInfoOptions
    });
});