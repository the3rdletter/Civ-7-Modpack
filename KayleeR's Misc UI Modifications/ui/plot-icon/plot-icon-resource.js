/**
 * @file Resource Plot Icon
 * @copyright 2021-2024, Firaxis Games
 * @description Icon to show the resource on this plot
 */
import { FxsIcon } from '/core/ui/components/fxs-icon.js';
class PlotIconResource extends FxsIcon {
    constructor() {
        super(...arguments);
        this.location = { x: -1, y: -1 };
    }
    onInitialize() {
        super.onInitialize();
        this.Root.classList.add("size-10", "bg-contain", "bg-no-repeat", "-translate-y-1\\/2");
        this.location = {
            x: parseInt(this.Root.getAttribute('x') ?? '-1'),
            y: parseInt(this.Root.getAttribute('y') ?? '-1'),
        };

        if (Game.age == Game.getHash("AGE_EXPLORATION")) {
            // Treasure Resource Check
            const resource = GameplayMap.getResourceType(this.location.x, this.location.y);
            if (resource) {
                const resourceDef = GameInfo.Resources.lookup(resource);
                if (resourceDef && resourceDef.ResourceClassType == "RESOURCECLASS_TREASURE") {
                    this.Root.classList.add("treasure-resource-plot");
                }
            }
        }

        const resourceType = this.Root.getAttribute("resource");
        if (resourceType) {
            const revealedState = GameplayMap.getRevealedState(GameContext.localPlayerID, this.location.x, this.location.y);
            this.Root.setAttribute("data-icon-id", resourceType);
            this.Root.setAttribute("data-icon-context", (revealedState == RevealedStates.REVEALED) ? "RESOURCE_FOW" : "RESOURCE");
        }
        else {
            console.error(`Cannot make resource icon. No resource attribute defined. ${this.location.x}, ${this.location.y}`);
            return;
        }
    }
}
Controls.define('plot-icon-resource', {
    createInstance: PlotIconResource,
    description: 'Resource Plot Icon',
    styles: ["fs://game/base-standard/ui/plot-icon/plot-icon-resource.css"],
    classNames: ['resource-icon-img']
});

//# sourceMappingURL=file:///base-standard/ui/plot-icon/plot-icon-resource.js.map
