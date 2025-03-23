/**
 * @file Resource Plot Icon
 * @copyright 2021-2024, Firaxis Games
 * @description Icon to show the resource on this plot
 */
import { FxsIcon } from '/core/ui/components/fxs-icon.js';
class PlotIconDiscovery extends FxsIcon {
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
        this.Root.style.backgroundImage = `url(fs://game/ntf_discover_goody_hut)`;

        const revealedState = GameplayMap.getRevealedState(GameContext.localPlayerID, this.location.x, this.location.y);
        // this.Root.setAttribute("data-icon-id", resourceType);
        // this.Root.setAttribute("data-icon-context", (revealedState == RevealedStates.REVEALED) ? "RESOURCE_FOW" : "RESOURCE");
    }
}
Controls.define('plot-icon-discovery', {
    createInstance: PlotIconDiscovery,
    description: 'Discovery Plot Icon',
    styles: ["fs://game/base-standard/ui/plot-icon/plot-icon-discovery.css"],
    classNames: ['resource-icon-img']
});

//# sourceMappingURL=file:///base-standard/ui/plot-icon/plot-icon-resource.js.map
