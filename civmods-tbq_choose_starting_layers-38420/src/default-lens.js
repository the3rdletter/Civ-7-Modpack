/**
 * @file default-lens
 * @copyright 2022-2023, Firaxis Games
 * @description Default lens most often active during gameplay
 */
import { showHexGridsOption, showYieldsOption } from './options.js'
import LensManager from '/core/ui/lenses/lens-manager.js'

class DefaultLens {
    constructor() {
        const activeLayers = [
            'fxs-resource-layer',
            'fxs-culture-borders-layer',
            'fxs-operation-target-layer',
        ]

        const allowedLayers = ['fxs-appeal-layer']

        ;(showHexGridsOption.value ? activeLayers : allowedLayers).push(
            'fxs-hexgrid-layer'
        )
        ;(showYieldsOption.value ? activeLayers : allowedLayers).push(
            'fxs-yields-layer'
        )

        this.activeLayers = new Set(activeLayers)
        this.allowedLayers = new Set(allowedLayers)
    }
}
LensManager.registerLens('fxs-default-lens', new DefaultLens())

//# sourceMappingURL=file:///base-standard/ui/lenses/lens/default-lens.js.map
