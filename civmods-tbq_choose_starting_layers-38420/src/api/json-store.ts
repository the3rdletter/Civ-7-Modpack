type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue }

export class JSONStore {
    static #LOCAL_STORAGE_KEY = 'modSettings'
    namespace: string

    constructor(namespace = 'default') {
        this.namespace = namespace
    }

    setItem(key: string, value: JSONValue) {
        if (localStorage.length > 1) {
            console.warn(
                `Invalid localStorage: Found (${localStorage.length} keys, only 1 allowed)`
            )
            const invalidKeys = (Object.keys(localStorage) ?? []).filter(
                (key) => key !== JSONStore.#LOCAL_STORAGE_KEY
            )
            if (invalidKeys.length > 0)
                console.warn('Invalid keys: ', JSON.stringify(invalidKeys))
            console.warn(
                `Mods should only write data to "${JSONStore.#LOCAL_STORAGE_KEY}"`
            )
            console.warn(
                'Clearing all localStorage data to allow continued usage'
            )

            localStorage.clear()
        }

        const store = this.#readStore()
        const namespaceStore = store[this.namespace] ?? {}
        const updated = {
            ...store,
            [this.namespace]: {
                ...namespaceStore,
                [key]: value,
            },
        }
        this.#writeStore(updated)
    }

    getItem(key: string): JSONValue | undefined {
        const store = this.#readStore()
        const namespaceStore = store[this.namespace] ?? {}
        return namespaceStore[key]
    }

    clear() {
        const store = this.#readStore()
        delete store[this.namespace]
        this.#writeStore(store)
    }

    #readStore(): { [namespace: string]: { [key: string]: JSONValue } } {
        return JSON.parse(localStorage.getItem(JSONStore.#LOCAL_STORAGE_KEY))
    }

    #writeStore(store: { [namespace: string]: { [key: string]: JSONValue } }) {
        localStorage.setItem(
            JSONStore.#LOCAL_STORAGE_KEY,
            JSON.stringify(store)
        )
    }
}
