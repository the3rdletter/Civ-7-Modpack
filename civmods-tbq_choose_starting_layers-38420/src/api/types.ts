import type { LiteralUnion } from 'type-fest'
import { Options, OptionType } from '/core/ui/options/model-options.js'
import {
    CategoryType,
    CheckboxInfo,
    DropdownInfo,
    EditorInfo,
    OptionCategoryGroup,
    SliderInfo,
    StepperInfo,
    SwitchInfo,
} from '/core/ui/options/options-helpers.js'

export const ExtendedCategoryType = CategoryType as typeof CategoryType & {
    readonly Mods: CategoryType
}

export interface ModOptionInfo {
    id: string
    category: typeof ExtendedCategoryType.Mods
    group: LiteralUnion<OptionCategoryGroup, string>
    type: OptionType
    defaultValue: any
    label: string
    description: string
}

export type ModOption = {
    value?: any
    updatedValue?: any
    defaultValue?: any
    onChange: (value: any) => void
    initListener: (optionInfo: ModOptionInfo) => void
    updateListener: (optionInfo: ModOptionInfo, value: any) => void
    _changeListeners: ((value: any) => void)[]
    addChangeListener: (callback: (value: any) => void) => void
    removeChangeListener: (callback: (value: any) => void) => void
    changeListeners?: ((value: any) => void)[]
    category: CategoryType
    group: LiteralUnion<OptionCategoryGroup, string>
} & (
    | (EditorInfo & { type: OptionType.Editor })
    | (CheckboxInfo & { type: OptionType.Checkbox })
    | (DropdownInfo & { type: OptionType.Dropdown })
    | (SliderInfo & { type: OptionType.Slider })
    | (StepperInfo & { type: OptionType.Stepper })
    | (SwitchInfo & { type: OptionType.Switch })
)

export interface DataStore {
    getItem: (key: string) => any
    setItem: (key: string, value: any) => void
}

export const ExtendedOptions = Options as typeof Options & {
    addModOption(config: ModOptionInfo): ModOption
}
