//import '/core/ui/options/options.js';
import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import ContextManager from '/core/ui/context-manager/context-manager.js';
import panelState from "../../utilities/unit-management-options.js";

export class Sen_ViewUnitMangement {
//------------------------------------------
    constructor(component) {
		this.component = component;
        this.unitManagementButton = null;
        this.InterfaceModeChangedListener = this.InterfaceModeChanged.bind(this);
        this.viewUnitsButton = null;
	}

	beforeAttach() {        
		//this.component.addButton({ tooltip: "LOC_SEN_UI_UNIT_MAN_VIEW_UNITS", modifierClass: 'viewunits', callback: this.onOpenUnits.bind(this), class: "tut-unlocks", audio: "unlocks", focusedAudio: "data-audio-focus-small" });
  //      this.viewUnitsButton = this.component.Root.querySelector('.ssb__button-icon.viewunits');
  //      this.viewUnitsButton.style.setProperty('background-image','url("fs://game/senzanis_unit_management/textures/view_units.png")');
        this.component.Root.listenForWindowEvent('interface-mode-changed', this.InterfaceModeChangedListener);
	}

	afterAttach() {
        ContextManager.push("screen-unit-management", { singleton: true, createMouseGuard: false });
	}

	beforeDetach() {
	}

	afterDetach() {
	}

    onOpenUnits() {
    }

	InterfaceModeChanged(prevMode, currentInterfaceMode) {
        if (InterfaceMode.getCurrent() == 'INTERFACEMODE_DEFAULT') {
            if (JSON.parse(panelState.value).version) {
                this.panelState = JSON.parse(panelState.value);
            }
            const unitManagementContainer = this.component.Root.querySelector('.unit-management_slider');
            if (!unitManagementContainer) {
                ContextManager.push("screen-unit-management", { singleton: true, createMouseGuard: false });
            }
        }
    }
}

Controls.decorate('panel-sub-system-dock', (component) => new Sen_ViewUnitMangement(component));