//Original ModSettingsManager setup grabbed from the great Leonardfactory

/**
 * Please, always use ModSettingsManager to save and read settings in your mod.
 * Right now if you try to use **multiple** keys in localStorage, it will break reading
 * from localStorage for **every mod**. This is a workaround to avoid this issue, while
 * keeing a namespace to give each mod its own settings.
 */
const ModSettingsManager = {
    save(key, data) {
        if (localStorage.length > 1) {
            console.warn("[ModSettingsManager] erasing previous storage..", localStorage.length);
            localStorage.clear();
        }  
        const modSettings = JSON.parse(localStorage.getItem("modSettings") || '{}');
        modSettings[key] = data;
        localStorage.setItem("modSettings", JSON.stringify(modSettings));
    },
    read(key) {
        const modSettings = localStorage.getItem("modSettings");
        try {
            if (modSettings) {
                const data = JSON.parse(modSettings || '{}')[key];
                if (data) {
                    return data;
                }
            }
            return null;
        }
        catch (e) {
            console.error(`[ModSettingsManager][${key}] Error loading settings`, e);
        }
        return null;
    }
}

//Diplo Banner Icon Style Settings
export const Leu_RelationshipIcons = new class {
    _data = {
        StyleSetting: 1
    };

    constructor() {
        const modSettings = ModSettingsManager.read("Leu_RelationshipIcons");
        if (modSettings) {
            this._data = modSettings;
        }
    }

    save() {
        console.warn("[Leu_RelationshipIcons] saving..", JSON.stringify(this._data));
        ModSettingsManager.save("Leu_RelationshipIcons", this._data);
    }

    get StyleSetting() {
        return this._data.StyleSetting;
    }

    set StyleSetting(value) {
        this._data.StyleSetting = value;
        this.save();
    }
}

//Expressive Leader Icons Settings
export const Leu_ExpressiveLeaders = new class {
    _data = {
        AllowedExpressions: 1
    };

    constructor() {
        const modSettings = ModSettingsManager.read("Leu_ExpressiveLeaders");
        if (modSettings) {
            this._data = modSettings;
        }
    }

    save() {
        console.warn("[Leu_ExpressiveLeaders] saving..", JSON.stringify(this._data));
        ModSettingsManager.save("Leu_ExpressiveLeaders", this._data);
    }

    get AllowedExpressions() {
        return this._data.AllowedExpressions;
    }

    set AllowedExpressions(value) {
        this._data.AllowedExpressions = value;
        this.save();
    }
}

//Heart Icon Settings
export const Leu_HelpfulIcon = new class {
    _data = {
        IsHearty: false
    };

    constructor() {
        const modSettings = ModSettingsManager.read("Leu_HelpfulIcon");
        if (modSettings) {
            this._data = modSettings;
        }
    }

    save() {
        console.warn("[Leu_HelpfulIcon] saving..", JSON.stringify(this._data));
        ModSettingsManager.save("Leu_HelpfulIcon", this._data);
    }

    get IsHearty() {
        return this._data.IsHearty;
    }

    set IsHearty(value) {
        this._data.IsHearty = value;
        this.save();
    }
}

