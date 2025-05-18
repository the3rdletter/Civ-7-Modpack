import { JSONStore } from './json-store.js'
import { OptionsStore } from './options-store.js'
import { ModOption, ModOptionInfo } from './types.js'
import {
    GameCoreOptionCategory,
    Options,
} from '/core/ui/options/model-options.js'
import { CategoryData, CategoryType } from '/core/ui/options/options-helpers.js'

import '/core/ui/options/options.js'

export function extendOptions({
    namespace,
    settingsKey,
}: {
    namespace?: string
    settingsKey?: string
}) {
    const proto = Object.getPrototypeOf(Options)

    if (proto.addModOption) return // already extended

    const dataStore = new JSONStore(namespace ?? 'default')
    const optionsStore = new OptionsStore(dataStore, settingsKey ?? 'settings')

    // @ts-ignore - Extend the enum at runtime
    CategoryType.Mods = 'mods'
    // @ts-ignore - Add data for new category
    CategoryData[CategoryType.Mods] = {
        title: 'LOC_MOD_CSL_MOD_OPTIONS_MENU_CATEGORY',
        description: 'LOC_UI_CONTENT_MGR_SUBTITLE_DESCRIPTION',
    }

    // commit options when user clicks save
    const commitOptions = proto.commitOptions
    proto.commitOptions = function (category?: GameCoreOptionCategory) {
        commitOptions.apply(this, [category])
        optionsStore?.commitOptions()
    }

    const resetOptionsToDefault = proto.resetOptionsToDefault
    proto.resetOptionsToDefault = function () {
        resetOptionsToDefault.apply(this)
        optionsStore?.resetToDefaults()
    }

    // user cancelled options changes, restore to previous values
    const restore = proto.restore
    proto.restore = function (category?: GameCoreOptionCategory) {
        restore.apply(this, [category])
        optionsStore?.restore()
    }

    proto.addModOption = function (modOption: ModOptionInfo) {
        const newOption = {
            ...modOption,
            initListener(optionInfo: ModOption) {
                optionInfo.currentValue = this.value
                this.updatedValue = this.value
            },
            updateListener(optionInfo: ModOption, value: any) {
                optionInfo.currentValue = value
                this.updatedValue = optionInfo.currentValue
            },
            _changeListeners: [],
            addChangeListener(callback: (value: any) => void) {
                this._changeListeners.push(callback)
            },
            removeChangeListener(callback: (value: any) => void) {
                this._changeListeners = this._changeListeners.filter(
                    (cb: (value: any) => void) => cb !== callback
                )
            },
            onChange(value: any) {
                this._changeListeners.forEach(
                    (callback: (value: any) => void) => callback(value)
                )
            },
        } as ModOption

        optionsStore?.addOption(newOption)
        this.addInitCallback(() => Options.addOption(newOption))

        return newOption
    }
}
