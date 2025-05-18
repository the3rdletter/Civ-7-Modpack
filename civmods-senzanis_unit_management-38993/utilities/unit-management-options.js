import '/core/ui/options/options.js';  // make sure this loads first
import { CategoryType } from '/core/ui/options/options-helpers.js';
import { Options, OptionType } from '/core/ui/options/model-options.js';
import ModSettings from './mod-options-decorator.js';

const MOD_ID = "sen-unit-management";

const DEFAULT_OPTIONS = {
    value: "{}",
};
const panelState = new class {
    data = { ...DEFAULT_OPTIONS };
    constructor() {
        const modSettings = ModSettings.load(MOD_ID);
        this.data = {
            value: modSettings?.value ?? DEFAULT_OPTIONS.value,
        }
        console.warn(`DATA sen-unit-management=${JSON.stringify(this.data)}`);
    }
    save() {
        ModSettings.save(MOD_ID, this.data);
    }
    get value() {
        return this.data.value;
    }
    set value(flag) {
        this.data.value = flag;
        this.save();
    }
};
const onInitValue = (info) => {
    info.currentValue = panelState.value;
};
const onUpdateValue = (_info, flag) => {
    panelState.value = flag;
};
Options.addInitCallback(() => {
    Options.addOption({
        category: CategoryType.Mods,
        // @ts-ignore
        //group: "sen_mods",
        type: OptionType.Editor,
        id: "unit-management_panel-state",
        initListener: onInitValue,
        updateListener: onUpdateValue,
        //label: "LOC_SEN_UNIT_MANAGEMENT_MOD_NAME",            // loc key for label in the ui
        //description: "LOC_SEN_UNIT_MANAGEMENT_MOD_DESC", // loca key for hover text description
        isHidden: true,
    });
});
export { panelState as default };