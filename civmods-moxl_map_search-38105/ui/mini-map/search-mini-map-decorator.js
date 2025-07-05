import LensManager from '/core/ui/lenses/lens-manager.js';

export class SearchMiniMapDecorator {
    constructor(val) {
        this.lensPanel = val;

        this.textboxValidateVirtualKeyboardListener = this.onTextboxValidateVirtualKeyboard.bind(this);
        this.textboxValueChangeListener = this.onSearchTextboxValueChange.bind(this);
    }


    // Decorator pattern thanks to RealityMeltdown and Craimasjien
    beforeAttach() {
        this.header = document.createElement("fxs-header");
        this.header.classList.add("mr-5", "text-accent-2", "font-title-lg");
        this.header.setAttribute("filigree-style", "none");
        this.header.setAttribute("truncate", "true");
        this.header.setAttribute("title", "Search");

        this.searchTextbox = document.createElement("fxs-textbox");
        this.searchTextbox.classList.add("flex-auto", "text-lg");
        var searchTerm = UI.getOption("user", "Interface", "search-lens-value");
        if (searchTerm == undefined) {
            searchTerm = "";
        }
        this.searchTextbox.setAttribute("value", searchTerm);

        this.searchTextbox.addEventListener("component-value-changed", this.textboxValueChangeListener);
        this.searchTextbox.addEventListener("fxs-textbox-validate-virtual-keyboard", this.textboxValidateVirtualKeyboardListener);


        this.container = document.createElement('fxs-spatial-slot');
        this.container.classList.add("flex", "flow-row", "flex-auto", "items-center", "pt-3", "pl-3", "pr-3");
        this.container.appendChild(this.header);
        this.container.appendChild(this.searchTextbox);
    }

    afterAttach() {
        this.lensPanel.createLensButton("Search", "mod-search-lens", "lens-group");
        this.lensPanel.lensRadioButtonContainer.insertAdjacentElement('afterend', this.container);
    }

    beforeDetach() {
    }

    afterDetach() {
    }

    onAttributeChanged(name, prev, next) { }

    onTextboxValidateVirtualKeyboard({ detail: { value } }) {
        this.Root.dispatchEvent(new FxsTextboxValidateVirtualKeyboard({ value }));
    }

    onSearchTextboxValueChange({ detail: { value } }) {
        UI.setOption("user", "Interface", "search-lens-value", value);
        this.refreshSearchLens();
    }

    refreshSearchLens() {
        var searchLensActive = LensManager.getActiveLens() === "mod-search-lens";
        if (searchLensActive) {
            this.lensPanel.onLensChange({detail: {isChecked: true, value: "fxs-default-lens" }});
            this.lensPanel.onLensChange({detail: {isChecked: true, value: "mod-search-lens" }});
        }
    }
}

Controls.decorate('lens-panel', (val) => new SearchMiniMapDecorator(val));