//import '/core/ui/options/options.js';
import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import { ContextManagerEvents } from '/core/ui/context-manager/context-manager.js';
import { panelState, UseSliderButton } from "../../utilities/unit-management-options.js";

export class Sen_SubSystemDockDecorator {
    constructor(component) {
		this.component = component;
        this.unitManagementButton = null;
        this.InterfaceModeChangedListener = this.InterfaceModeChanged.bind(this);
        this.contextManagerOnOpenListener = this.contextManagerOnOpen.bind(this);
        this.contextManagerOnCloseListener = this.contextManagerOnClose.bind(this);
        this.viewUnitsButton = null;
	}

	beforeAttach() {        
        if (!UseSliderButton.option) {
		    this.component.addButton({ tooltip: "LOC_SEN_UI_UNIT_MAN_VIEW_UNITS", modifierClass: 'viewunits', callback: this.onOpenUnits.bind(this), class: "tut-unlocks", audio: "unlocks", focusedAudio: "data-audio-focus-small" });
            this.viewUnitsButton = this.component.Root.querySelector('.ssb__button-icon.viewunits');
            this.viewUnitsButton.style.setProperty('background-image', 'url("fs://game/senzanis_unit_management/textures/view_units.png")');
        }
        this.component.Root.listenForWindowEvent('interface-mode-changed', this.InterfaceModeChangedListener);
        this.component.Root.listenForEngineEvent('OnContextManagerOpen', this.contextManagerOnOpenListener);
        this.component.Root.listenForEngineEvent('OnContextManagerClose', this.contextManagerOnCloseListener);
	}

    afterAttach() {
        if (UseSliderButton.option) {
            this.openUnitManagementPanel();
        }
	}

	beforeDetach() {
	}

	afterDetach() {
	}

    onOpenUnits() {
        if (!UseSliderButton.option) {
            this.openUnitManagementPanel();
        }
    }

    openUnitManagementPanel() {
        const unitManagementContainer = document.getElementsByClassName('unit-management_slider');
        if (unitManagementContainer.length == 0) {
            const umPanel = document.createElement("screen-unit-management");
            const targetParent = document.querySelector('.fxs-popups');
            targetParent.appendChild(umPanel);
        }
    }


    contextManagerOnOpen(detail) {
        const elements = document.getElementsByTagName("screen-unit-management");
        if (elements.length > 0) {
            elements[0].remove();
        }
    }

    contextManagerOnClose(detail) {
        if (JSON.parse(panelState.value).version) {
            this.panelState = JSON.parse(panelState.value);
        }
        const unitManagementContainer = document.getElementsByClassName('unit-management_slider');
        if (unitManagementContainer.length == 0 && this.panelState.open) {
            const umPanel = document.createElement("screen-unit-management");
            const targetParent = document.querySelector('.fxs-popups');
            targetParent.appendChild(umPanel);
        }
    }

    InterfaceModeChanged() {
        const currentInterfaceMode = InterfaceMode.getCurrent();
        if (currentInterfaceMode == 'INTERFACEMODE_DEFAULT') {
            if (JSON.parse(panelState.value).version) {
                this.panelState = JSON.parse(panelState.value);
            }
            const unitManagementContainer = document.getElementsByClassName('unit-management_slider');
            if (unitManagementContainer.length == 0 && this.panelState.open) {
                const umPanel = document.createElement("screen-unit-management");
                const targetParent = document.querySelector('.fxs-popups');
                targetParent.appendChild(umPanel);
            }
        }
    }
}

Controls.decorate('panel-sub-system-dock', (component) => new Sen_SubSystemDockDecorator(component));