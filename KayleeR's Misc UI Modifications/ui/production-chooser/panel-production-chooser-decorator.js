/**
 * Small update to panel production chooser without overriding entire class per https://forums.civfanatics.com/threads/additive-ui-elements.695406/
 */

import { ProductionPanelCategory } from '/base-standard/ui/production-chooser/production-chooser-helpers.js';
import { ProductionChooserAccordionSection } from '/base-standard/ui/production-chooser/production-chooser-accordion.js';

const categoryLocalizationMap = {
    [ProductionPanelCategory.REPAIRS]: 'LOC_UI_PRODUCTION_REPAIRS',
    [ProductionPanelCategory.BUILDINGS]: 'LOC_UI_PRODUCTION_BUILDINGS',
    [ProductionPanelCategory.UNITS]: 'LOC_UI_PRODUCTION_UNITS',
    [ProductionPanelCategory.WONDERS]: 'LOC_UI_PRODUCTION_WONDERS',
    [ProductionPanelCategory.PROJECTS]: 'LOC_UI_PRODUCTION_PROJECTS'
};

export class KayleeR_PanelProductionChooserDecorator {
    constructor(val) {
        this.panel = val;
        this.panel.productionCategorySlots = Object.values(ProductionPanelCategory).reduce((acc, category) => {
            const id = `production-category-${category}`;
            acc[category] = new ProductionChooserAccordionSection(id, categoryLocalizationMap[category], true);
            return acc;
        }, {});
    }

    beforeAttach() {
    }

    afterAttach() {
        engine.on('ConstructibleChanged', this.panel.onConstructibleAddedToMap, this.panel);
    }

    beforeDetach() { }

    afterDetach() {
        engine.off('ConstructibleChanged', this.panel.onConstructibleAddedToMap, this.panel);
     }

    onAttributeChanged(name, prev, next) { }
}

Controls.decorate('panel-production-chooser', (val) => new KayleeR_PanelProductionChooserDecorator(val));