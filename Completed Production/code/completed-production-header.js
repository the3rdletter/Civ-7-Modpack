import { CompletedProductionManagerInstance } from '/completed-production/code/completed-production.js';
import { ComponentID } from '/core/ui/utilities/utilities-component-id.js';

class CompletedProductionHeader extends Component {
    constructor() {
        super(...arguments);
        this.cityID = null;
        this.container = document.createElement('div');
        this.producedText = document.createElement('div');
    }
    onInitialize() {
        super.onInitialize();
        this.Root.classList.add('flex', 'flex-col', 'm-1', 'w-128');
        this.cityID = UI.Player.getHeadSelectedCity();

        this.render();
    }
    onAttach() {
        this.refresh(); // refresh here so if we're reattaching we're up to date
        engine.on('CitySelectionChanged', this.onCitySelectionChanged, this);
    }
    onDetach() {
        engine.off('CitySelectionChanged', this.onCitySelectionChanged, this);
    }
    onCitySelectionChanged({ cityID }) {
        if (ComponentID.isMatch(this.cityID, cityID)) {
            return;
        }
        this.cityID = cityID;
        this.refresh();
    }
    refresh() {
        const lastItem = CompletedProductionManagerInstance.getLastProduced(this.cityID.id);
        const lastItemStr = lastItem == null ? Locale.compose('LOC_LAST_PRODUCED_ITEM', "Unknown") : Locale.compose('LOC_LAST_PRODUCED_ITEM', lastItem.productionName);
        this.producedText.setAttribute('data-l10n-id', lastItemStr);

        if (Cities.get(this.cityID).isTown || lastItem == null || lastItem.turn != Game.turn) {
            this.Root.classList.add('hidden');
        }
        else {
            this.Root.classList.remove('hidden');
        }
    }
    render() {
        this.container.className = 'completed-production-container flex flex-col m-1 w-128';
        this.producedText.className = 'font-title self-center text-xl';
        this.container.appendChild(this.producedText);
        this.Root.appendChild(this.container);
    }
};
Controls.define('completed-production', {
    createInstance: CompletedProductionHeader
});