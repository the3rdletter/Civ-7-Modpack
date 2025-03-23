/*
* Decorate the production panel with the last produced item https://forums.civfanatics.com/threads/additive-ui-elements.695406/
*/

class CompletedProduction_PanelProductionChooserDecorator {
    constructor(val) {
        this.panel = val;
        console.log(`completed-production: CompletedProduction_PanelProductionChooserDecorator decorated loaded.`);
    }

    beforeAttach() {
    }

    afterAttach() {
        console.log(`completed-production: CompletedProduction_PanelProductionChooserDecorator decorated attached.`);
        this.panel.productionPurchaseContainer.insertAdjacentHTML('beforebegin', `<completed-production></completed-production>`);
    }

    beforeDetach() { }

    afterDetach() { }

    onAttributeChanged(name, prev, next) { }
}

Controls.decorate('panel-production-chooser', (val) => new CompletedProduction_PanelProductionChooserDecorator(val));