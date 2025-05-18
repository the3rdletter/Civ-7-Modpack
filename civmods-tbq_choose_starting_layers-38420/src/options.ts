import { extendOptions } from './api/extend-options.js'
import { ExtendedCategoryType, ExtendedOptions } from './api/types.js'
import { OptionType } from '/core/ui/options/model-options.js'

extendOptions({ namespace: 'tbq-csl' })
const MOD_OPTIONS_GROUP = 'choose_starting_layers'

export const showHexGridsOption = ExtendedOptions.addModOption({
    id: 'show-hexgrids',
    category: ExtendedCategoryType.Mods,
    group: MOD_OPTIONS_GROUP,
    type: OptionType.Checkbox,
    defaultValue: true,
    label: 'LOC_MOD_CSL_SHOW_HEXGRID_ON_LOAD_OPTION',
    description: 'LOC_MOD_CSL_SHOW_HEXGRID_ON_LOAD_OPTION_DESC',
})

export const showYieldsOption = ExtendedOptions.addModOption({
    id: 'show-yields',
    category: ExtendedCategoryType.Mods,
    group: MOD_OPTIONS_GROUP,
    type: OptionType.Checkbox,
    defaultValue: false,
    label: 'LOC_MOD_CSL_SHOW_YIELDS_ON_LOAD_OPTION',
    description: 'LOC_MOD_CSL_SHOW_YIELDS_ON_LOAD_OPTION_DESC',
})
