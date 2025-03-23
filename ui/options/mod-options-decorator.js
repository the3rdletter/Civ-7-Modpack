import { CategoryData, CategoryType } from '/core/ui/options/options-helpers.js';

CategoryType["Mods"] = "mods";
CategoryData[CategoryType.Mods] = {
    title: "LOC_UI_CONTENT_MGR_SUBTITLE",
    description: "LOC_UI_CONTENT_MGR_SUBTITLE_DESCRIPTION",
};

// fix Options tab spacing
const MOD_OPTIONS_STYLE = document.createElement('style');
MOD_OPTIONS_STYLE.textContent = `
.option-frame .tab-bar__items .flex {
    justify-content: space-evenly;
    align-items: center;
}
.option-frame .tab-bar__items .flex-auto {
    flex: 1 0 auto;
    min-width: 0rem;
    margin-left: 0.4444444444rem;
    margin-right: 0.4444444444rem;
}`;
document.head.appendChild(MOD_OPTIONS_STYLE);

// Please, always use ModSettings to save and load settings in your mod.
// Right now if you try to use **multiple** keys in localStorage, it
// will break reading from localStorage for **every mod**. This is
// a workaround to avoid this issue, while keeping a namespace to give
// each mod its own settings.
export class ModSettingsSingleton {
    save(modID, data) {
        if (localStorage.length > 1) {
            console.warn(`ModSettings: erasing storage (${localStorage.length} items)`);
            localStorage.clear();
        }
        const modSettings = JSON.parse(localStorage.getItem("modSettings") || '{}');
        modSettings[modID] = data;
        localStorage.setItem("modSettings", JSON.stringify(modSettings));
        console.warn(`SAVE ${modID}=${JSON.stringify(data)}`);
    }
    load(modID) {
        try {
            const modSettings = localStorage.getItem("modSettings");
            if (!modSettings) return null;
            const data = modSettings && (JSON.parse(modSettings)[modID] ?? null);
            console.warn(`LOAD ${modID}=${JSON.stringify(data)}`);
            return data;
        }
        catch (e) {
            console.error(`ModSettings: error loading settings`);
            console.error(`${modID}: ${e}`);
        }
        return null;
    }
}
const ModSettings = new ModSettingsSingleton();
export { ModSettings as default };
