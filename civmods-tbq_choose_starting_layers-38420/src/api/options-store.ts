import { DataStore, ModOption } from './types.js'

export class OptionsStore {
    options: ModOption[] = []
    dataStore: DataStore
    settingsKey: string

    constructor(dataStore: DataStore, settingsKey = 'settings') {
        this.dataStore = dataStore
        this.settingsKey = settingsKey
    }

    addOption(option: ModOption) {
        this.#setDefaultIfMissing(option)
        option.value = this.load(option)
        this.options.push(option)
    }

    load(option: ModOption) {
        const settings = this.#readSettings()
        return settings ? settings[option.id] : option.defaultValue
    }

    commitOptions() {
        const oldSettings = this.#readSettings()
        let newSettings = {
            ...oldSettings,
        }

        const updatedOptions = this.options.filter(
            (option) => option.updatedValue !== option.value
        )

        this.options.forEach(
            (option) =>
                (newSettings = {
                    ...newSettings,
                    [option.id]: option.updatedValue,
                })
        )

        this.#writeSettings(newSettings)

        updatedOptions.forEach((option) => (option.value = option.updatedValue))
        updatedOptions.forEach((option) => option.onChange(option.value))
    }

    resetToDefaults() {
        const defaultSettings = this.#readSettings()
        let newSettings = {}
        this.options.forEach(
            (option) =>
                (newSettings = {
                    ...newSettings,
                    [option.id]: option.defaultValue,
                })
        )

        const updatedOptions = this.options.filter(
            (option) => option.value !== option.defaultValue
        )

        // leave other settings intact, but overwrite any loaded options with their defaults
        this.#writeSettings({
            ...defaultSettings,
            ...newSettings,
        })

        updatedOptions.forEach((option) => (option.value = option.defaultValue))
        updatedOptions.forEach((option) => option.onChange(option.value))
    }

    restore() {
        this.options.forEach((option) => (option.updatedValue = option.value))
    }

    clear() {
        this.dataStore.setItem(this.settingsKey, undefined)
    }

    #readSettings() {
        return this.dataStore.getItem(this.settingsKey) ?? {}
    }

    #writeSettings(settings: Record<string, any>) {
        this.dataStore.setItem(this.settingsKey, settings)
    }

    #setDefaultIfMissing(option: ModOption) {
        const existingSettings = this.#readSettings()
        const newSettings = {
            [option.id]: option.defaultValue,
        }

        // only write a default if the existing settings did not include the given option
        this.#writeSettings({
            ...newSettings,
            ...existingSettings,
        })
    }
}
