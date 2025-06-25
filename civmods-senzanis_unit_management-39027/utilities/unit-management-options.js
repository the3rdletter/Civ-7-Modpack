import '/core/ui/options/options.js';  // make sure this loads first
import { CategoryType } from '/core/ui/options/options-helpers.js';
import { Options, OptionType } from '/core/ui/options/model-options.js';
import ModSettings from './mod-options-decorator.js';

export const panelState = new class {
    data = { value: "{}" };
    constructor() {
        const modSettings = ModSettings.load("SEN_UM_PanelState");
        this.data = {
            value: modSettings?.value ?? "{}",
        }
        console.warn(`DATA sen-unit-management=${JSON.stringify(this.data)}`);
    }
    save() {
        ModSettings.save("SEN_UM_PanelState", this.data);
    }
    get value() {
        return this.data.value;
    }
    set value(flag) {
        this.data.value = flag;
        this.save();
    }
};

export const UseSliderButton = new class {
    data = { option: false };
    constructor() {
        const modSettings = ModSettings.load("SEN_UM_UseSliderButton");
        this.data = {
            option: modSettings?.option ?? false,
        }
        console.warn(`DATA sen-unit-management=${JSON.stringify(this.data)}`);
    }
    save() {
        ModSettings.save("SEN_UM_UseSliderButton", this.data);
    }
    get option() {
        return this.data.option;
    }
    set option(flag) {
        this.data.option = !!flag;
        this.save();
    }
};

const onInitPanelState = (info) => {
    info.currentValue = panelState.value;
};
const onUpdatePanelState = (_info, flag) => {
    panelState.value = flag;
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        //group: "sen_mods",
        type: OptionType.Editor,
        id: "unit-management_panel-state",
        initListener: onInitPanelState,
        updateListener: onUpdatePanelState,
        //label: "LOC_SEN_UNIT_MANAGEMENT_MOD_NAME",            // loc key for label in the ui
        //description: "LOC_SEN_UNIT_MANAGEMENT_MOD_DESC", // loca key for hover text description
        isHidden: true,
    });
});

const onInitUseSliderButton = (info) => {
    info.currentValue = UseSliderButton.option;
};
const onUpdateUseSliderButton = (_info, flag) => {
    UseSliderButton.option = flag;
    // adjust the reference count depending on if the new selection matches the original value
    if (_info.currentValue != _info.originalValue) {
        Options.needReloadRefCount += 1;
    }
    else {
        if (Options.needReloadRefCount > 0) {
            Options.needReloadRefCount -= 1;
        }
    }
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        group: "SEN_UM_MOD",
        type: OptionType.Checkbox,
        id: "unit-management_use-slider-button",
        initListener: onInitUseSliderButton,
        updateListener: onUpdateUseSliderButton,
        label: "LOC_SEN_UNIT_MANAGEMENT_USE_SLIDER_BUTTON_NAME", 
        description: "LOC_SEN_UNIT_MANAGEMENT_USE_SLIDER_BUTTON_DESC", 
    });
});