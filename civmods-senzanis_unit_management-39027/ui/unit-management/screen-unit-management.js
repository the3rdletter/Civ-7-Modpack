import Panel from '/core/ui/panel-support.js';
import UnitManagement from './model-unit-management.js';
import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import ContextManager from '/core/ui/context-manager/context-manager.js';

import { InputEngineEventName } from '/core/ui/input/input-support.js';
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import { panelState, UseSliderButton } from "../../utilities/unit-management-options.js";

const militaryHeaders = '<div class="unit-management_military-unit-header flex flex-row flex-nowrap items-center pointer-events-none">' +
    '<div class="unit-management_unit-name-header flex justify-left grow w-60"><fxs-header filigree-style="none" class="text-secondary pl-20" title="LOC_SEN_UI_UNIT_MAN_UNIT_NAME"></fxs-header></div>' +
    '<div class="unit-management_unit-health-header flex justify-center w-16 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_HEALTH_HEADER"><img src="fs://game/prod_generic.png" class="unit-management_unit-health-header-icon size-7" /></div>' +
    '<div class="unit-management_unit-activity-header flex justify-center w-20 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_CURRENT_COMMAND"><img src="fs://game/senzanis_unit_management/textures/command_star.png" class="unit-management_unit-health-header-icon size-7" /></div>' +
    '<div class="unit-management_promote-upgrade-header flex justify-center w-20 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_UPGRADE_PROMOTE">' +
    '<img src="fs://game/senzanis_unit_management/textures/promote.png" class="unit-management_promote-header-icon size-7" />/<img src="fs://game/senzanis_unit_management/textures/upgrade.png" class="unit-management_upgrade-header-icon size-6" />' +
    '</div>' +
    '</div>';

const religiousHeaders = '<div class="unit-management_religious-unit-header flex flex-row flex-nowrap items-center pointer-events-none">' +
    '<div class="unit-management_unit-name-header flex justify-left grow w-60"><fxs-header filigree-style="none" class="text-secondary pl-14" title="LOC_SEN_UI_UNIT_MAN_UNIT_NAME"></fxs-header></div>' +
    '<div class="unit-management_unit-health-header flex justify-center w-16 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_HEALTH_HEADER"><img src="fs://game/prod_generic.png" class="unit-management_unit-health-header-icon size-7" /></div>' +
    '<div class="unit-management_unit-activity-header flex justify-center w-20 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_CURRENT_COMMAND"><img src="fs://game/senzanis_unit_management/textures/command_star.png" class="unit-management_unit-health-header-icon size-7" /></div>' +
    '<div class="unit-management_charges-remaining-header flex justify-center w-20 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_SPREADS_TOOLTIP">' +
    '<img src="fs://game/senzanis_unit_management/textures/spreadreligion.png" class="unit-management_spread-religion-header-icon size-6" />' +
    '</div>' +
    '</div>';

const civilianHeaders = '<div class="unit-management_civilian-unit-header flex flex-row flex-nowrap items-center pointer-events-none">' +
    '<div class="unit-management_unit-name-header flex justify-left grow w-60"><fxs-header filigree-style="none" class="text-secondary pl-14" title="LOC_SEN_UI_UNIT_MAN_UNIT_NAME"></fxs-header></div>' +
    '<div class="unit-management_unit-health-header flex justify-center w-16 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_HEALTH_HEADER"><img src="fs://game/prod_generic.png" class="unit-management_unit-health-header-icon size-7" /></div>' +
    '<div class="unit-management_unit-activity-header flex justify-center w-20 pointer-events-auto" data-tooltip-content="LOC_SEN_UI_UNIT_MAN_CURRENT_COMMAND"><img src="fs://game/senzanis_unit_management/textures/command_star.png" class="unit-management_unit-health-header-icon size-7" /></div>' +
    '</div>';

const PanelState = {
    version: "1.2.0",
    openToggles: [],
    militaryToggles: [
        { name: "LandUnits", open: true },
        { name: "AirUnits", open: false },
        { name: "NavalUnits", open: false }
    ],
    scrollbarLocations: [
        { name: "Military", element: ".unit-management_military-scrollable", location: 0 },
        { name: "Religious", element: ".unit-management_religious-scrollable", location: 0 },
        { name: "Civilian", element: ".unit-management_civilian-scrollable", location: 0 }
    ],
    selectedWindow: [],
    selectedUnit: -1,
    open: true,
    sliderOpen: true
};

class ScreenUnitManagement extends Panel {
    constructor() {
        super(...arguments);
        this.engineInputListener = this.onEngineInput.bind(this);
        this.onSliderPanelButtonClickedListener = this.onSliderPanelButtonClicked.bind(this);
        this.onUnitManagementTabSelectedListener = this.onUnitManagementTabSelected.bind(this);
        this.InterfaceModeChangedListener = this.InterfaceModeChanged.bind(this);
        this.currentWindow;
        this.closeListener = this.close.bind(this);
        this.closeButtonClickedListener = this.closeButtonClicked.bind(this);
        this.currentUnit = [];
        this.currentPackedUnit = [];
        this.MEDIUM_HEALTH_THRESHHOLD = .75;
        this.LOW_HEALTH_THRESHHOLD = .5;
        this.panelState = PanelState;
    }

    onInitialize() {
        super.onInitialize();
        const playerObject = Players.get(GameContext.localPlayerID);
        if (!playerObject) {
            console.error('screen-unit-management: onInitialize: Failed to get local player!');
            return;
        }

        this.sliderPanelButtonContainer = MustGetElement('.unit-management_button-container', this.Root);
        this.sliderPanelButton = MustGetElement('.unit-management_slider-panel-button', this.Root);
        this.sliderPanelButtonImage = MustGetElement('.unit-management_slider-panel-button-image', this.Root);
        this.sliderPanel = MustGetElement('.unit-management_slider-panel', this.Root);
        this.sliderPanelFrame = MustGetElement('.unit-management_main-frame', this.Root);
        this.militaryWindow = MustGetElement('.unit-management_military', this.Root);
        this.religiousWindow = MustGetElement('.unit-management_religious', this.Root);
        this.civilianWindow = MustGetElement('.unit-management_civilian', this.Root);
        this.closeButton = MustGetElement('.close-button', this.Root);
        this.tabsContainer = MustGetElement('fxs-tab-bar', this.Root);
        this.landToggle = MustGetElement('.military-header-land-toggle', this.Root);
        this.airToggle = MustGetElement('.military-header-air-toggle', this.Root);
        this.navalToggle = MustGetElement('.military-header-naval-toggle', this.Root);
        this.landUnitWrapper = MustGetElement('.military-land-unit-container', this.Root);
        this.airUnitWrapper = MustGetElement('.military-air-unit-container', this.Root);
        this.navalUnitWrapper = MustGetElement('.military-naval-unit-container', this.Root);
        this.religiousUnitWrapper = MustGetElement('.religious-unit-container', this.Root);
        this.civilianUnitWrapper = MustGetElement('.civilian-unit-container', this.Root);
        this.Root.classList.add('screen-unit-management', 'absolute', 'pl-5', 'top-20', 'pb-8', 'z-0', 'flex');
        this.Root.setAttribute('data-tooltip-anchor', 'right');

        if (JSON.parse(panelState.value).version && JSON.parse(panelState.value).version == PanelState.version) {
            this.panelState = JSON.parse(panelState.value);
        }
    }

    onAttach() {
        super.onAttach();
        engine.on('UnitAddedToMap', this.onUnitAddedRemoved, this);
        engine.on('UnitRemovedFromMap', this.onUnitAddedRemoved, this);
        engine.on('UnitSelectionChanged', this.onUnitSelectionChanged, this);
        engine.on('UnitExperienceChanged', this.onUnitExperienceChanged, this);
        engine.on('UnitOperationSegmentComplete', this.onUnitOperationSegmentComplete, this);
        engine.on('UnitOperationDeactivated', this.onUnitOperationDeactivated, this);
        engine.on('UnitOperationsCleared', this.onUnitOperationUpdated, this);
        engine.on('UnitOperationAdded', this.onUnitOperationUpdated, this);
        //engine.on('UnitFormationChanged', this.onUnitFormationChanged, this);
        engine.on('LocalPlayerTurnBegin', this.onLocalPlayerTurnBegin, this);
        engine.on('LocalPlayerTurnEnd', this.onLocalPlayerTurnEnd, this);

        //this.Root.listenForEngineEvent('InteractUnitDataUpdated', this.onInteractUnitDataUpdated, this);
        window.addEventListener('interface-mode-changed', this.InterfaceModeChangedListener);
        this.Root.addEventListener(InputEngineEventName, this.engineInputListener);
        this.closeButton.addEventListener('click', this.closeButtonClickedListener);
        this.closeButton.addEventListener('action-activate', this.closeListener);
        this.sliderPanelButton.addEventListener('action-activate', this.onSliderPanelButtonClickedListener);
        this.tabsContainer.addEventListener('tab-selected', this.onUnitManagementTabSelectedListener);
        this.tabsContainer.setAttribute('tab-items', JSON.stringify(this.getUnitManagementTabItems()));
        this.landToggle.addEventListener('action-activate', () => { this.collapseMilitarySection(this.landToggle, this.landUnitWrapper, 'LandUnits'); });
        this.airToggle.addEventListener('action-activate', () => { this.collapseMilitarySection(this.airToggle, this.airUnitWrapper, 'AirUnits'); });
        this.navalToggle.addEventListener('action-activate', () => { this.collapseMilitarySection(this.navalToggle, this.navalUnitWrapper, 'NavalUnits'); });
        // engine.synchronizeModels();
        this.panelState.open = true;
        if (!UseSliderButton.option) {
            this.sliderPanelButtonContainer.classList.add('hidden');
            this.sliderPanelFrame.classList.add('ml-8');
        } else {
            this.closeButton.style.display = 'none';
        }
        this.populatePlayerUnits();
        this.resetPanelState();
    }

    onDetach() {
        this.savePanelState();
        this.Root.removeEventListener(InputEngineEventName, this.engineInputListener);
        this.closeButton.removeEventListener('click', this.closeButtonClickedListener);
        this.closeButton.removeEventListener('action-activate', this.closeListener);
        this.sliderPanelButton.removeEventListener('action-activate', this.onSliderPanelButtonClickedListener);
        this.tabsContainer.removeEventListener('tab-selected', this.onUnitManagementTabSelectedListener);
        this.landToggle.removeEventListener('action-activate', () => { this.collapseMilitarySection(this.landToggle, this.landUnitWrapper); });
        this.airToggle.removeEventListener('action-activate', () => { this.collapseMilitarySection(this.airToggle, this.airUnitWrapper); });
        this.navalToggle.removeEventListener('action-activate', () => { this.collapseMilitarySection(this.navalToggle, this.navalUnitWrapper); });
        engine.off('UnitAddedToMap', this.onUnitAddedRemoved, this);
        engine.off('UnitRemovedFromMap', this.onUnitAddedRemoved, this);
        engine.off('UnitSelectionChanged', this.onUnitSelectionChanged, this);
        engine.off('UnitExperienceChanged', this.onUnitExperienceChanged, this);
        engine.off('UnitOperationSegmentComplete', this.onUnitOperationSegmentComplete, this);
        engine.off('UnitOperationDeactivated', this.onUnitOperationDeactivated, this);
        engine.off('UnitOperationsCleared', this.onUnitOperationUpdated, this);
        engine.off('UnitOperationAdded', this.onUnitOperationUpdated, this);
        //engine.off('UnitFormationChanged', this.onUnitFormationChanged, this);
        engine.off('LocalPlayerTurnBegin', this.onLocalPlayerTurnBegin, this);
        engine.off('LocalPlayerTurnEnd', this.onLocalPlayerTurnEnd, this);
        window.removeEventListener('interface-mode-changed', this.InterfaceModeChangedListener);
        super.onDetach();
    }

    closeButtonClicked() {
        this.panelState.open = false;
        this.Root.remove();
    }

    close() {
        super.close();
    }

    getUnitManagementTabItems() {
        const militaryTab = {
            label: 'LOC_SEN_UI_UNIT_MAN_MILITARY_TAB',
            id: 'unit-management-military',
            className: ('unit-management_military-tab', 'px-1', 'mx-1')
        };
        const religiousTab = {
            label: 'LOC_SEN_UI_UNIT_MAN_RELIGIOUS_TAB',
            id: 'unit-management-religious',
            className: ('unit-management_religious-tab', 'px-1', 'mx-1')
        };
        const civilianTab = {
            label: 'LOC_SEN_UI_UNIT_MAN_CIVILIAN_TAB',
            id: 'unit-management-civilian',
            className: ('unit-management_civilian-tab', 'px-1', 'mx-1')
        };

        if (Game.age == Database.makeHash("AGE_EXPLORATION")){
            return [militaryTab, religiousTab, civilianTab];
        }

        return [militaryTab, civilianTab];
    }

    onLocalPlayerTurnBegin() {
        //console.warn('--------------------------------------------------- onLocalPlayerTurnBegin ---------------------------------------------------');
        this.captureScrollbarLocations();
        this.populatePlayerUnits();
        this.resetPanelState();

        engine.on('UnitAddedToMap', this.onUnitAddedRemoved, this);
        engine.on('UnitRemovedFromMap', this.onUnitAddedRemoved, this);
        engine.on('UnitSelectionChanged', this.onUnitSelectionChanged, this);
        engine.on('UnitExperienceChanged', this.onUnitExperienceChanged, this);
        engine.on('UnitOperationSegmentComplete', this.onUnitOperationSegmentComplete, this);
        engine.on('UnitOperationDeactivated', this.onUnitOperationDeactivated, this);
        engine.on('UnitOperationsCleared', this.onUnitOperationUpdated, this);
        engine.on('UnitOperationAdded', this.onUnitOperationUpdated, this);
        //engine.on('UnitFormationChanged', this.onUnitFormationChanged, this);
        
        window.addEventListener('interface-mode-changed', this.InterfaceModeChangedListener);
    }

    onLocalPlayerTurnEnd() {
        //console.warn('--------------------------------------------------- onLocalPlayerTurnEnd ---------------------------------------------------');
        engine.off('UnitAddedToMap', this.onUnitAddedRemoved, this);
        engine.off('UnitRemovedFromMap', this.onUnitAddedRemoved, this);
        engine.off('UnitSelectionChanged', this.onUnitSelectionChanged, this);
        engine.off('UnitExperienceChanged', this.onUnitExperienceChanged, this);
        engine.off('UnitOperationSegmentComplete', this.onUnitOperationSegmentComplete, this);
        engine.off('UnitOperationDeactivated', this.onUnitOperationDeactivated, this);
        engine.off('UnitOperationsCleared', this.onUnitOperationUpdated, this);
        engine.off('UnitOperationAdded', this.onUnitOperationUpdated, this);
        //engine.off('UnitFormationChanged', this.onUnitFormationChanged, this);
        window.removeEventListener('interface-mode-changed', this.InterfaceModeChangedListener);
    }

    //onUnitFormationChanged(data) {
    //    console.warn('--------------------------------------------------- UnitFormationChanged ---------------------------------------------------');
        
    //}

    onUnitAddedRemoved(data) {
        //console.warn('--------------------------------------------------- onUnitAddedRemoved ---------------------------------------------------');
        if (data.unit.owner == GameContext.localPlayerID) {
            this.captureScrollbarLocations();
            this.populatePlayerUnits();
            this.resetPanelState();
        }
    }

    onUnitExperienceChanged(data) {
        //console.warn('--------------------------------------------------- onUnitExperienceChanged ---------------------------------------------------');
        this.captureScrollbarLocations();
        this.populatePlayerUnits();
        this.resetPanelState();
    }

    //onInteractUnitDataUpdated() {
    //    this.captureScrollbarLocations();
    //    this.populatePlayerUnits();
    //    this.resetPanelState();
    //}

    onUnitSelectionChanged(data) {
        //console.warn('--------------------------------------------------- onUnitSelectionChanged ---------------------------------------------------');
        if (data.unit.owner == GameContext.localPlayerID) {
            if (data.selected) {
                if (this.panelState.selectedUnit > 0 && this.panelState.selectedUnit != data.unit.id) {
                    const lastSelectedUnit = this.Root.querySelector(`.unitId-${this.panelState.selectedUnit}`);
                    if (lastSelectedUnit) {
                        lastSelectedUnit.classList.remove('selectedUnitHighlight');
                    }
                }

                const selectedUnit = MustGetElement(`.unitId-${data.unit.id}`, this.Root);
                selectedUnit.classList.add('selectedUnitHighlight');
                this.panelState.selectedUnit = data.unit.id;
            } else {
                const lastSelectedUnit = this.Root.querySelector(`.unitId-${this.panelState.selectedUnit}`);
                if (lastSelectedUnit) {
                    lastSelectedUnit.classList.remove('selectedUnitHighlight');
                    //this.panelState.selectedUnit = -1;
                }
            }
        }
    }

    onUnitOperationDeactivated({ unit, data1 }) {
        //console.warn('--------------------------------------------------- onUnitOperationDeactivated ---------------------------------------------------');
        if (unit.owner == GameContext.localPlayerID) {
            this.captureScrollbarLocations();
            this.populatePlayerUnits();
            this.resetPanelState();
        }
    }

    onUnitOperationSegmentComplete({ unit, data1 }) {
        //console.warn('--------------------------------------------------- onUnitOperationSegmentComplete ---------------------------------------------------');
        if (unit.owner == GameContext.localPlayerID) {
            this.captureScrollbarLocations();
            this.populatePlayerUnits();
            this.resetPanelState();
        }
    }

    onUnitOperationUpdated({ unit }) {
        //console.warn('--------------------------------------------------- onUnitOperationUpdated ---------------------------------------------------');
        if (unit.owner == GameContext.localPlayerID) {
            this.captureScrollbarLocations();
            this.populatePlayerUnits();
            this.resetPanelState();
        }
    }

    onEngineInput(inputEvent) {
        if (inputEvent.detail.status != InputActionStatuses.FINISH) {
            return;
        }
        if (inputEvent.detail.name == 'sys-menu') {
            this.closeSliderPanel();
        }
    }

    onSliderPanelButtonClicked() {
        if (this.panelState.sliderOpen) {
            this.closeSliderPanel();
        } else {
            this.openSliderPanel();
        }
    }

    closeSliderPanel() {
        this.sliderPanelFrame.classList.add('hidden');
        this.panelState.sliderOpen = false;
        this.sliderPanelButtonImage.setAttribute('src', 'fs://game/senzanis_unit_management/textures/chevron_open.png');
    }

    openSliderPanel() {
        this.sliderPanelFrame.classList.remove('hidden');
        this.panelState.sliderOpen = true;
        this.sliderPanelButtonImage.setAttribute('src', 'fs://game/senzanis_unit_management/textures/chevron_close.png');
    }

    onUnitManagementTabSelected(e) {
        switch (e.detail.selectedItem.id) {
            case 'unit-management-military':
                this.goToNewWindow(this.militaryWindow);
                break;
            case 'unit-management-religious':
                this.goToNewWindow(this.religiousWindow);
                break;
            case 'unit-management-civilian':
                this.goToNewWindow(this.civilianWindow);
                break;
            default:
                e.detail.selectedItem;
                break;
        }
        this.panelState.selectedWindow = this.tabsContainer.getAttribute('selected-tab-index');
    }

    goToNewWindow(window) {
        if (this.currentWindow) {
            this.currentWindow.classList.add('hidden');
        }
        this.currentWindow = window;
        this.currentWindow.classList.remove('hidden');
    }

    populatePlayerUnits() {
        this.populateMilitary();
        this.populateReligious();
        this.populateCivilian();
    }

    
    populateMilitary() {
        this.landUnitWrapper.innerHTML = militaryHeaders;
        this.airUnitWrapper.innerHTML = militaryHeaders;
        this.navalUnitWrapper.innerHTML = militaryHeaders;

        var landUnitCount = 0;
        var airUnitCount = 0;
        var navalUnitCount = 0

        const curAge = Game.age;
        if (curAge == Database.makeHash('AGE_MODERN')) {
            const airUnitTab = MustGetElement('.unit-management_military-air-header', this.Root);
            airUnitTab.classList.remove('hidden');
        }

        //populate all of the commanders and their armies
        const playerUnits = UnitManagement.getPlayerUnits().filter(val => val.coreClass.includes('CORE_CLASS_MILITARY'));
        playerUnits.forEach((playerUnit) => {
            this.currentUnit = playerUnit;

            // Commander Plus Minus for Packed Units
            const commanderPlusMinusContainer = document.createElement('div');
            commanderPlusMinusContainer.classList.add('unit-management_commander-plus-minus-container', 'w-6', 'pl-2', 'pt-2', 'pointer-events-none');
            const commanderUnitWrapper = document.createElement('div');
            commanderUnitWrapper.classList.add('unit-management_commander-unit-wrapper', `packedFor-${playerUnit.id.id}`, 'hidden', 'grow', 'ml-14', 'pointer-events-none');
            if (playerUnit.packedUnits.length > 0) {
                const commanderToggle = document.createElement('fxs-minus-plus');
                commanderToggle.classList.add(`toggleId-${playerUnit.id.id}`);
                commanderToggle.setAttribute('type', 'plus');
                commanderToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');
                commanderToggle.setAttribute('tabindex', '-1');
                commanderToggle.addEventListener('action-activate', () => { this.collapseCommanderUnits(commanderToggle, commanderUnitWrapper, playerUnit.id.id); });
                commanderPlusMinusContainer.appendChild(commanderToggle);

                for (const packedUnit of playerUnit.packedUnits) {
                    this.currentPackedUnit = packedUnit;
                    const packedItem = this.buildPackedUnitItem();
                    commanderUnitWrapper.appendChild(packedItem);
                }
            }

            // Commander Icon
            const commanderIconContainer = document.createElement('div');
            commanderIconContainer.classList.add('unit-management_commander-icon-container', 'px-2', 'pointer-events-none');
            const commanderIcon = document.createElement('fxs-icon');
            commanderIcon.classList.add('unit-management_commander-icon', 'size-10', 'bg-no-repeat', 'bg-center', 'bg-cover');
            commanderIcon.setAttribute('data-icon-id', playerUnit.type);
            commanderIconContainer.appendChild(commanderIcon);

            //Commander Name and Level
            const commanderNameContainer = document.createElement('div');
            commanderNameContainer.classList.add('unit-management_commander-name-container', 'flex', 'flex-nowrap', 'items-center', 'grow', 'pointer-events-none');
            const commanderName = document.createElement('div');
            commanderName.classList.add('unit-management_commander-name', 'flex', 'text-xs', 'pointer-events-auto');
            commanderName.innerHTML = playerUnit.name;
            commanderNameContainer.appendChild(commanderName);
            if (playerUnit.experience.canEarn) {
                const commanderLevel = document.createElement('span');
                commanderLevel.classList.add('unit-management_commander-level', 'font-body', 'normal-case', 'ml-2', 'mr-4', 'badge', 'pointer-events-auto');
                commanderLevel.textContent = `${Locale.stylize(`${playerUnit.experience.level}`)}`;
                commanderLevel.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_EXP_TOOLTIP') + ` ${playerUnit.experience.currentExpPoints}` + '/' + `${playerUnit.experience.expPointsToLevel}`);
                commanderNameContainer.appendChild(commanderLevel);
            }

            // Commander Health
            const commanderHealthContainer = document.createElement('div');
            commanderHealthContainer.classList.add('unit-management_commander-health-container', 'flex', 'flex-nowrap', 'items-center','w-16', 'text-xs', 'pointer-events-none');
            const commanderProgressBarContainer = this.getUnitHealth();
            if (commanderProgressBarContainer) {
                commanderHealthContainer.appendChild(commanderProgressBarContainer);
            }

            // Commander Activity (sleep, sentry, heal, fortify)
            const commanderActivityContainer = document.createElement('div');
            commanderActivityContainer.classList.add('unit-management_commander-activity-container', 'flex', 'justify-center', 'w-20');
            const commanderActivityIcon = this.getUnitActivity();
            commanderActivityContainer.appendChild(commanderActivityIcon);

            // Commander Promote or Upgrade Available
            const commanderPromoteUpgradeContainer = document.createElement('div');
            commanderPromoteUpgradeContainer.classList.add('unit-management_commander-promote-upgrade-container', 'flex', 'justify-center', 'w-20');
            const promoteCommanderIcon = document.createElement('img');
            promoteCommanderIcon.classList.add('unit-management_promote-commander-icon', 'size-6');
            if (playerUnit.experience.promotionAvailable) {
                if (playerUnit.experience.canEarn) {
                    promoteCommanderIcon.setAttribute('src', 'blp:Action_Promote.png');
                } else {
                    promoteCommanderIcon.setAttribute('src', 'blp:Action_Upgrade.png');
                }
            }
            //promoteCommanderIcon.classList.toggle('inactive', !playerUnit.experience.promotionAvailable);
            commanderPromoteUpgradeContainer.appendChild(promoteCommanderIcon);

            var realmContainer = this.landUnitWrapper;
            switch (playerUnit.movementRealm) {
                case 'Air':
                    realmContainer = this.airUnitWrapper;
                    airUnitCount = airUnitCount + 1;
                    break;
                case 'Land':
                    realmContainer = this.landUnitWrapper;
                    landUnitCount = landUnitCount + 1;
                    break;
                case 'Naval':
                    realmContainer = this.navalUnitWrapper;
                    navalUnitCount = navalUnitCount + 1;
                    break;
                default:
            }

            const unitLinkContainer = document.createElement('fxs-activatable');
            unitLinkContainer.classList.add('unit-management_unit-link-container', 'flex', 'flex-row', 'flex-nowrap', 'grow', 'items-center', 'pointer-events-auto');
            unitLinkContainer.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_GO_TO_UNIT'));
            unitLinkContainer.setAttribute('data-audio-group-ref', 'interact-unit');
            unitLinkContainer.setAttribute('data-audio-focus', 'unit-info-hovered');
            unitLinkContainer.setAttribute('data-audio-activate', 'unit-action-activated');
            unitLinkContainer.addEventListener('click', () => {
                UI.Player.lookAtID(playerUnit.id);
                UI.Player.selectUnit(playerUnit.id);
            });

            unitLinkContainer.appendChild(commanderIconContainer);
            unitLinkContainer.appendChild(commanderNameContainer);
            unitLinkContainer.appendChild(commanderHealthContainer);
            unitLinkContainer.appendChild(commanderActivityContainer);
            unitLinkContainer.appendChild(commanderPromoteUpgradeContainer);

            const commanderUnitItem = document.createElement('div');
            commanderUnitItem.classList.add('unit-management_commander-unit-item', `unitId-${playerUnit.id.id}`, 'flex', 'flex-row', 'flex-nowrap', 'pointer-events-none');

            commanderUnitItem.appendChild(commanderPlusMinusContainer);
            commanderUnitItem.appendChild(unitLinkContainer);

            realmContainer.appendChild(commanderUnitItem);
            if (playerUnit.packedUnits.length > 0) {
                realmContainer.appendChild(commanderUnitWrapper);
            }
        });

        const airUnitTab = MustGetElement('.unit-management_military-air-header', this.Root);
        const landUnitTab = MustGetElement('.unit-management_military-land-header', this.Root);
        const navalUnitTab = MustGetElement('.unit-management_military-naval-header', this.Root);
        const noUnitText = MustGetElement('.unit-management_no-military-units', this.Root);


        if (airUnitCount == 0) {
            airUnitTab.classList.add('hidden');
            this.airUnitWrapper.innerHTML = '';
        } else {
            airUnitTab.classList.remove('hidden');
        }
        if (landUnitCount == 0) {
            landUnitTab.classList.add('hidden');
            this.landUnitWrapper.innerHTML = '';
        } else {
            landUnitTab.classList.remove('hidden');
        }
        if (navalUnitCount == 0) {
            navalUnitTab.classList.add('hidden');
            this.navalUnitWrapper.innerHTML = '';
        } else {
            navalUnitTab.classList.remove('hidden');
        }
        if (navalUnitCount + landUnitCount + airUnitCount == 0) {
            noUnitText.classList.remove('hidden');
        } else {
            noUnitText.classList.add('hidden');
        }
    }

    populateReligious() {
        this.religiousUnitWrapper.innerHTML = religiousHeaders;

        //populate the religious units
        const playerReligiousUnits = UnitManagement.getPlayerUnits().filter(val => val.coreClass.includes('CORE_CLASS_RELIGIOUS'));
        playerReligiousUnits.forEach((playerUnit) => {
            this.currentUnit = playerUnit;

            // Unit Icon
            const unitIconContainer = document.createElement('div');
            unitIconContainer.classList.add('unit-management_religious-unit-icon-container', 'px-2', 'pointer-events-none');
            const unitIcon = document.createElement('fxs-icon');
            unitIcon.classList.add('unit-management_religious-unit-icon', 'size-10', 'bg-no-repeat', 'bg-center', 'bg-cover');
            unitIcon.setAttribute('data-icon-id', playerUnit.type);
            unitIconContainer.appendChild(unitIcon);

            //Unit Name
            const unitNameContainer = document.createElement('div');
            unitNameContainer.classList.add('unit-management_religious-unit-name-container', 'flex', 'flex-nowrap', 'items-center', 'grow', 'pointer-events-none');
            const unitName = document.createElement('div');
            unitName.classList.add('unit-management_religious-unit-name', 'flex', 'text-xs', 'pointer-events-auto');
            unitName.innerHTML = playerUnit.name;
            unitNameContainer.appendChild(unitName);
            if (playerUnit.experience.canEarn) {
                const unitLevel = document.createElement('span');
                unitLevel.classList.add('unit-management_religious-unit-level', 'font-body', 'normal-case', 'ml-2', 'mr-4', 'badge', 'pointer-events-auto');
                unitLevel.textContent = `${Locale.stylize(`${playerUnit.experience.level}`)}`;
                unitLevel.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_EXP_TOOLTIP') + ` ${playerUnit.experience.currentExpPoints}` + '/' + `${playerUnit.experience.expPointsToLevel}`);
                unitNameContainer.appendChild(unitLevel);
            }

            // Unit Health
            const unitHealthContainer = document.createElement('div');
            unitHealthContainer.classList.add('unit-management_religious-unit-health-container', 'text-xs', 'pointer-events-none');
            const unitProgressBarContainer = this.getUnitHealth();
            if (unitProgressBarContainer) {
                unitHealthContainer.appendChild(unitProgressBarContainer);
            }

            // Unit Activity (sleep, sentry, heal, fortify)
            const unitActivityContainer = document.createElement('div');
            unitActivityContainer.classList.add('unit-management_religious-unit-activity-container', 'flex', 'justify-center', 'w-20');
            const unitActivityIcon = this.getUnitActivity();
            unitActivityContainer.appendChild(unitActivityIcon);

            // Unit Charges Available
            const unitChargesContainer = document.createElement('div');
            unitChargesContainer.classList.add('unit-management_religious-unit-charges-container', 'flex', 'justify-center', 'w-20');
            const chargesBadge = document.createElement('span');
            chargesBadge.classList.add('unit-management_religious-charges', 'font-body', 'normal-case', 'ml-2', 'mr-4', 'badge', 'pointer-events-auto');
            chargesBadge.textContent = `${Locale.stylize(`${playerUnit.spreadCharges}`)}`;
            unitChargesContainer.appendChild(chargesBadge);

            const unitLinkContainer = document.createElement('fxs-activatable');
            unitLinkContainer.classList.add('unit-management_unit-link-container', 'flex', 'flex-row', 'flex-nowrap', 'grow', 'items-center', 'pointer-events-auto');
            unitLinkContainer.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_GO_TO_UNIT'));
            unitLinkContainer.setAttribute('data-audio-group-ref', 'interact-unit');
            unitLinkContainer.setAttribute('data-audio-focus', 'unit-info-hovered');
            unitLinkContainer.setAttribute('data-audio-activate', 'unit-action-activated');
            unitLinkContainer.addEventListener('click', () => {
                if (playerUnit.armyId.id == -1) {
                    UI.Player.lookAtID(playerUnit.id);
                    UI.Player.selectUnit(playerUnit.id);
                } else {
                    UI.Player.lookAtID(playerUnit.commanderId);
                    UI.Player.selectUnit(playerUnit.commanderId);
                }
            });

            unitLinkContainer.appendChild(unitIconContainer);
            unitLinkContainer.appendChild(unitNameContainer);
            unitLinkContainer.appendChild(unitHealthContainer);
            unitLinkContainer.appendChild(unitActivityContainer);
            unitLinkContainer.appendChild(unitChargesContainer);

            const religiousUnitItem = document.createElement('div');
            religiousUnitItem.classList.add('unit-management_religious-unit-item', `unitId-${playerUnit.id.id}`, 'flex', 'flex-row', 'flex-nowrap', 'items-center', 'pointer-events-none');

            religiousUnitItem.appendChild(unitLinkContainer);

            this.religiousUnitWrapper.appendChild(religiousUnitItem);
        });

        const noUnitText = MustGetElement('.unit-management_no-religious-units', this.Root);

        if (playerReligiousUnits.length == 0) {
            this.religiousUnitWrapper.innerHTML = '';
            noUnitText.classList.remove('hidden');
        } else {
            noUnitText.classList.add('hidden');
        }

    }

    populateCivilian() {
        this.civilianUnitWrapper.innerHTML = civilianHeaders;

        //populate the civilian units
        const playerCivilianUnits = UnitManagement.getPlayerUnits().filter(val => val.coreClass.includes('CORE_CLASS_CIVILIAN'));
        playerCivilianUnits.forEach((playerUnit) => {
            this.currentUnit = playerUnit;

            // Unit Icon
            const unitIconContainer = document.createElement('div');
            unitIconContainer.classList.add('unit-management_civilian-unit-icon-container', 'px-2', 'pointer-events-none');
            const unitIcon = document.createElement('fxs-icon');
            unitIcon.classList.add('unit-management_civilian-unit-icon', 'size-10', 'bg-no-repeat', 'bg-center', 'bg-cover');
            unitIcon.setAttribute('data-icon-id', playerUnit.type);
            unitIconContainer.appendChild(unitIcon);

            //Unit Name
            const unitNameContainer = document.createElement('div');
            unitNameContainer.classList.add('unit-management_civilian-unit-name-container', 'flex', 'flex-nowrap', 'items-center', 'grow', 'pointer-events-none');
            const unitName = document.createElement('div');
            unitName.classList.add('unit-management_civilian-unit-name', 'flex', 'text-xs', 'pointer-events-auto');
            unitName.innerHTML = playerUnit.name;

            unitNameContainer.appendChild(unitName);
            if (playerUnit.experience.canEarn) {
                const unitLevel = document.createElement('span');
                unitLevel.classList.add('unit-management_civilian-unit-level', 'font-body', 'normal-case', 'ml-2', 'mr-4', 'badge', 'pointer-events-auto');
                unitLevel.textContent = `${Locale.stylize(`${playerUnit.experience.level}`)}`;
                unitLevel.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_EXP_TOOLTIP') + ` ${playerUnit.experience.currentExpPoints}` + '/' + `${playerUnit.experience.expPointsToLevel}`);
                unitNameContainer.appendChild(unitLevel);
            }

            // Unit Health
            const unitHealthContainer = document.createElement('div');
            unitHealthContainer.classList.add('unit-management_civilian-unit-health-container', 'text-xs', 'pointer-events-none');
            const unitProgressBarContainer = this.getUnitHealth();
            if (unitProgressBarContainer) {
                unitHealthContainer.appendChild(unitProgressBarContainer);
            }

            // Unit Activity (sleep, sentry, heal, fortify)
            const unitActivityContainer = document.createElement('div');
            unitActivityContainer.classList.add('unit-management_civilian-unit-activity-container', 'flex', 'justify-center', 'w-20');
            const unitActivityIcon = this.getUnitActivity();
            unitActivityContainer.appendChild(unitActivityIcon);

            const unitLinkContainer = document.createElement('fxs-activatable');
            unitLinkContainer.classList.add('unit-management_unit-link-container', 'flex', 'flex-row', 'flex-nowrap', 'grow', 'items-center', 'pointer-events-auto');
            unitLinkContainer.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_GO_TO_UNIT'));
            unitLinkContainer.setAttribute('data-audio-group-ref', 'interact-unit');
            unitLinkContainer.setAttribute('data-audio-focus', 'unit-info-hovered');
            unitLinkContainer.setAttribute('data-audio-activate', 'unit-action-activated');
            unitLinkContainer.addEventListener('click', () => {
                if (playerUnit.armyId.id == -1) {
                    UI.Player.lookAtID(playerUnit.id);
                    UI.Player.selectUnit(playerUnit.id);
                } else {
                    UI.Player.lookAtID(playerUnit.commanderId);
                    UI.Player.selectUnit(playerUnit.commanderId);
                }
            });

            unitLinkContainer.appendChild(unitIconContainer);
            unitLinkContainer.appendChild(unitNameContainer);
            unitLinkContainer.appendChild(unitHealthContainer);
            unitLinkContainer.appendChild(unitActivityContainer);

            const civilianUnitItem = document.createElement('div');
            civilianUnitItem.classList.add('unit-management_civilian-unit-item', `unitId-${playerUnit.id.id}`, 'flex', 'flex-row', 'flex-nowrap', 'items-center', 'pointer-events-none');

            civilianUnitItem.appendChild(unitLinkContainer);

            this.civilianUnitWrapper.appendChild(civilianUnitItem);
        });

        const noUnitText = MustGetElement('.unit-management_no-civilian-units', this.Root);

        if (playerCivilianUnits.length == 0) {
            this.civilianUnitWrapper.innerHTML = '';
            noUnitText.classList.remove('hidden');
        } else {
            noUnitText.classList.add('hidden');
        }

    }

    buildPackedUnitItem() {
        // Packed Unit Icon
        const packedIconContainer = document.createElement('div');
        packedIconContainer.classList.add('unit-management_packed-icon-container', 'pointer-events-none');
        const packedIcon = document.createElement('fxs-icon');
        packedIcon.classList.add('unit-management_packed-icon', 'size-10', 'bg-no-repeat', 'bg-center', 'bg-cover');
        packedIcon.setAttribute('data-icon-id', this.currentPackedUnit.type);
        packedIconContainer.appendChild(packedIcon);

        //Packed Unit Name and Level
        const packedNameContainer = document.createElement('div');
        packedNameContainer.classList.add('unit-management_packed-name-container', 'flex', 'text-xs', 'flex-nowrap', 'grow', 'pointer-events-none');
        const packedName = document.createElement('div');
        packedName.classList.add('unit-management_packed-name', 'flex', 'text-xs', 'pointer-events-auto');
        packedName.innerHTML = this.currentPackedUnit.name;

        packedNameContainer.appendChild(packedName);
        if (this.currentPackedUnit.experience.canEarn) {
            const packedLevel = document.createElement('span');
            packedLevel.classList.add('unit-management_packed-level', 'font-body', 'text-xs', 'normal-case', 'ml-2', 'mr-4', 'badge', 'pointer-events-auto');
            packedLevel.textContent = `${Locale.stylize(`${this.currentPackedUnit.experience.level}`)}`;
            packedLevel.setAttribute('data-tooltip-content', `${this.currentPackedUnit.experience.currentExpPoints}` + '/' + `${this.currentPackedUnit.experience.expPointsToLevel}`);
            packedNameContainer.appendChild(packedLevel);
        }

        // Packed Unit Health
        const packedHealthContainer = document.createElement('div');
        packedHealthContainer.classList.add('unit-management_packed-health-container', 'text-xs', 'pointer-events-none');
        const packedProgressBarContainer = this.getUnitHealth(true);
        if (packedProgressBarContainer) {
            packedHealthContainer.appendChild(packedProgressBarContainer);
        }

        // Packed Unit Activity
        const packedActivityContainer = document.createElement('div');
        packedActivityContainer.classList.add('unit-management_packed-activity-container', 'flex', 'justify-center', 'w-20');
        const packedActivityIcon = this.getUnitActivity(true);
        packedActivityContainer.appendChild(packedActivityIcon);
        if (this.currentPackedUnit.operationTurns > 0) {
            const turnTimer = document.createElement('span');
            turnTimer.classList.add('unit-management_packed-turn-timer', 'text-xs');
            turnTimer.innerHTML = ' : ' + `${this.currentPackedUnit.operationTurns}`;
            packedActivityContainer.appendChild(turnTimer);
        }

        // Packed Unit Promote or Upgrade Available
        const packedPromoteUpgradeContainer = document.createElement('div');
        packedPromoteUpgradeContainer.classList.add('unit-management_packed-promote-upgrade-container', 'flex', 'justify-center', 'w-20');
        const promotePackedIcon = document.createElement('img');
        promotePackedIcon.classList.add('unit-management_packed-promote-upgrade-icon', 'size-6');
        if (this.currentPackedUnit.experience.promotionAvailable) {
            if (this.currentPackedUnit.experience.canEarn) {
                promotePackedIcon.setAttribute('src', 'blp:Action_Promote.png');
            } else {
                promotePackedIcon.setAttribute('src', 'blp:Action_Upgrade.png'); 
            }
        }
        //promotePackedIcon.classList.toggle('inactive', !this.currentPackedUnit.experience.promotionAvailable);
        packedPromoteUpgradeContainer.appendChild(promotePackedIcon);

        const unitLinkContainer = document.createElement('fxs-activatable');
        unitLinkContainer.classList.add('unit-management_unit-link-container', 'flex', 'flex-row', 'flex-nowrap', 'grow', 'items-center', 'pointer-events-auto');
        unitLinkContainer.setAttribute('data-tooltip-content', Locale.compose('LOC_SEN_UI_UNIT_MAN_GO_TO_UNIT'));
        unitLinkContainer.setAttribute('data-audio-group-ref', 'interact-unit');
        unitLinkContainer.setAttribute('data-audio-focus', 'unit-info-hovered');
        unitLinkContainer.setAttribute('data-audio-activate', 'unit-action-activated');
        const packedCommanderid = this.currentPackedUnit.commanderId;
        const packedArmylocation = this.currentPackedUnit.armyLocation;
        unitLinkContainer.addEventListener('click', () => {
            if (this.currentPackedUnit.armyId.id == -1) {
                UI.Player.lookAtID(this.currentPackedUnit.id);
                UI.Player.selectUnit(this.currentPackedUnit.id);
            } else {
                UI.Player.lookAtID(packedCommanderid);
                UI.Player.selectUnit(packedCommanderid);
            }
        });

        unitLinkContainer.appendChild(packedIconContainer);
        unitLinkContainer.appendChild(packedNameContainer);
        unitLinkContainer.appendChild(packedHealthContainer);
        unitLinkContainer.appendChild(packedActivityContainer);
        unitLinkContainer.appendChild(packedPromoteUpgradeContainer);

        // Build Packed Unit
        const packedUnitItem = document.createElement('div');
        packedUnitItem.classList.add('unit-management_packed-unit-item', `unitId-${this.currentPackedUnit.id.id}`, 'flex', 'flex-row', 'flex-nowrap', 'grow', 'items-center', 'pointer-events-none');

        packedUnitItem.appendChild(unitLinkContainer);

        return packedUnitItem;
    }

    getUnitActivity(isPackedUnit) {
        var unit;
        if (isPackedUnit) {
            unit = this.currentPackedUnit;
        } else {
            unit = this.currentUnit;
        }

        const unitActivityIcon = document.createElement('img');
        unitActivityIcon.classList.add('unit-management_unit-activity-icon', 'size-6', 'pointer-events-auto');

        if (unit.hasPendingOperations) {
            if (unit.operationType && unit.operationType.Icon) {
                unitActivityIcon.setAttribute('src', `${unit.operationType.Icon}`);
            }
        } else {
            if (unit.activityId == UnitActivityTypes.SLEEP) {
                unitActivityIcon.setAttribute('src', 'blp:Action_Sleep.png');
            } else {
                if (unit.armyId.id != -1 && unit.coreClass != 'CORE_CLASS_MILITARY') {
                    unitActivityIcon.setAttribute('src', 'blp:Action_Pack.png');
                }
            }
        }

        return unitActivityIcon;
    }

    getUnitHealth(isPackedUnit) {
        var currentUnitHealth;
        if (isPackedUnit) {
            currentUnitHealth = this.currentPackedUnit.health;
        } else {
            currentUnitHealth = this.currentUnit.health;
        }

        const unitHealthBarContainer = document.createElement('div');
        unitHealthBarContainer.classList.add('unit-management_unit-health-bar-container', 'flex', 'flex-col', 'items-center', 'pointer-events-auto');
        const unitHealthBarBg = document.createElement('div');
        unitHealthBarBg.classList.add('unit-management_unit-health-bar-bg', 'flex', 'w-16', 'h-1');
        const unitHealthProgressBar = document.createElement('div');
        unitHealthProgressBar.classList.add('unit-management_unit-health-progress-bar');
        const unitHealthHitPoints = document.createElement('div');
        unitHealthHitPoints.classList.add('unit-management_unit-health-hit-points');

        unitHealthBarBg.appendChild(unitHealthProgressBar);
        unitHealthBarContainer.appendChild(unitHealthHitPoints);
        unitHealthBarContainer.appendChild(unitHealthBarBg);

        if (currentUnitHealth) {
            let normalizedHealthValue = (currentUnitHealth.maxDamage - currentUnitHealth.damage) / currentUnitHealth.maxDamage;
            unitHealthProgressBar.style.setProperty('--health-percentage', `${normalizedHealthValue * 100}%`);
            unitHealthHitPoints.innerHTML = `${(currentUnitHealth.maxDamage - currentUnitHealth.damage)}/${currentUnitHealth.maxDamage}`;
            if (currentUnitHealth.damage > 0) {
                if (normalizedHealthValue <= this.MEDIUM_HEALTH_THRESHHOLD && normalizedHealthValue >= this.LOW_HEALTH_THRESHHOLD) {
                    unitHealthProgressBar.classList.toggle('unit-management_med-health-bar', true);
                    unitHealthProgressBar.classList.toggle('unit-management_low-health-bar', false);
                    unitHealthBarBg.classList.toggle('unit-management_med-health-bar-bg', true);
                    unitHealthBarBg.classList.toggle('unit-management_low-health-bar-bg', false);
                }
                else if (normalizedHealthValue < this.LOW_HEALTH_THRESHHOLD) {
                    unitHealthProgressBar.classList.toggle('unit-management_med-health-bar', false);
                    unitHealthProgressBar.classList.toggle('unit-management_low-health-bar', true);
                    unitHealthBarBg.classList.toggle('unit-management_med-health-bar-bg', true);
                    unitHealthBarBg.classList.toggle('unit-management_low-health-bar-bg', false);
                }
            }
            else {
                unitHealthProgressBar.classList.toggle('unit-management_med-health-bar', false);
                unitHealthProgressBar.classList.toggle('unit-management_low-health-bar', false);
                unitHealthBarBg.classList.toggle('unit-management_med-health-bar-bg', true);
                unitHealthBarBg.classList.toggle('unit-management_low-health-bar-bg', false);
            }
        }

        return unitHealthBarContainer;
    }

    collapseMilitarySection(collapseButton, militarySection, toggle) {
        const type = collapseButton.getAttribute('type');
        if (type == 'minus') {
            collapseButton.setAttribute('type', 'plus');
            militarySection.classList.add('hidden');
            collapseButton.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-open');
            this.panelState.militaryToggles.find((toggleType) => toggleType.name === toggle).open = false;
        }
        else {
            collapseButton.setAttribute('type', 'minus');
            militarySection.classList.remove('hidden');
            collapseButton.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');
            this.panelState.militaryToggles.find((toggleType) => toggleType.name === toggle).open = true;
        }
    }

    collapseCommanderUnits(collapseButton, commanderSection, commanderId) {
        const type = collapseButton.getAttribute('type');
        if (type == 'minus') {
            collapseButton.setAttribute('type', 'plus');
            commanderSection.classList.add('hidden');
            collapseButton.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-open');

            const index = this.panelState.openToggles.indexOf(commanderId);
            if (index > -1) { 
                this.panelState.openToggles.splice(index, 1);
            }
        }
        else {
            collapseButton.setAttribute('type', 'minus');
            commanderSection.classList.remove('hidden');
            collapseButton.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');

            this.panelState.openToggles.push(commanderId);
        }
    }

    resetPanelState() {
        const rootElement = this.Root;

        // Window
        this.tabsContainer.setAttribute('selected-tab-index', this.panelState.selectedWindow);

        // Military Toggles
        if (this.panelState.militaryToggles && this.panelState.militaryToggles.find((toggleType) => toggleType.name === 'LandUnits').open == true) {
            this.landToggle.setAttribute('type', 'minus');
            this.landUnitWrapper.classList.remove('hidden');
            this.landToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');
        } else {
            this.landToggle.setAttribute('type', 'plus');
            this.landUnitWrapper.classList.add('hidden');
            this.landToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-open');
        }
        if (this.panelState.militaryToggles && this.panelState.militaryToggles.find((toggleType) => toggleType.name === 'AirUnits').open == true) {
            this.airToggle.setAttribute('type', 'minus');
            this.airUnitWrapper.classList.remove('hidden');
            this.airToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');
        } else {
            this.airToggle.setAttribute('type', 'plus');
            this.airUnitWrapper.classList.add('hidden');
            this.airToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-open');
        }
        if (this.panelState.militaryToggles && this.panelState.militaryToggles.find((toggleType) => toggleType.name === 'NavalUnits').open == true) {
            this.navalToggle.setAttribute('type', 'minus');
            this.navalUnitWrapper.classList.remove('hidden');
            this.navalToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');
        } else {
            this.navalToggle.setAttribute('type', 'plus');
            this.navalUnitWrapper.classList.add('hidden');
            this.navalToggle.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-open');
        }

        // Toggles
        this.panelState.openToggles.forEach((toggle, index) => {
            const collapseButton = rootElement.querySelector(`.toggleId-${toggle}`);
            if (collapseButton) {
                const commanderSection = MustGetElement(`.packedFor-${toggle}`, rootElement);
                collapseButton.setAttribute('type', 'minus');
                commanderSection.classList.remove('hidden');
                collapseButton.setAttribute('data-audio-activate-ref', 'data-audio-dropdown-close');
            } else {
                this.panelState.openToggles.splice(index, 1);
            }
        });

        // Scroll Locations
        this.panelState.scrollbarLocations.forEach((scrollbarLocation) => {
            const scrollElement = MustGetElement(scrollbarLocation.element, rootElement);
            scrollElement.scrollTop = scrollbarLocation.location;
        });

        // Selected Unit
        if (this.panelState.selectedUnit > 0) {
            const selectedUnit = this.Root.querySelector(`.unitId-${this.panelState.selectedUnit}`);
            if (selectedUnit) {
                selectedUnit.classList.add('selectedUnitHighlight');
            } else {
                this.panelState.selectedUnit = -1;
            }
        }

        // SliderPanel
        if (UseSliderButton.option) {
            if (this.panelState.sliderOpen) {
                this.openSliderPanel();
            } else {
                this.closeSliderPanel();
            }
        } else {
            this.openSliderPanel();
        }
    }

    captureScrollbarLocations() {
        const rootElement = this.Root;
        this.panelState.scrollbarLocations.forEach((scrollbarLocation, index) => {
            const scrollElement = MustGetElement(scrollbarLocation.element, rootElement);
            this.panelState.scrollbarLocations[index].location = scrollElement.firstElementChild.scrollTop;
        });
    }

    InterfaceModeChanged() {
        const currentInterfaceMode = InterfaceMode.getCurrent();
        if (currentInterfaceMode != 'INTERFACEMODE_DEFAULT' && GameInfo.InterfaceModes.lookup(currentInterfaceMode).ViewName != 'Unit') {
            this.savePanelState();
            this.Root.remove();
        }
    }

    savePanelState() {
        this.captureScrollbarLocations();
        panelState.value = JSON.stringify(this.panelState);
    }
}

Controls.define('screen-unit-management', {
    createInstance: ScreenUnitManagement,
    description: 'Unit Management screen.',
    styles: ['//game/senzanis_unit_management/ui/unit-management/screen-unit-management.css'],
    content: ['fs://game/senzanis_unit_management/ui/unit-management/screen-unit-management.html'],
    attributes: [],
    classNames: ['trigger-nav-help', 'w-full', 'h-full']
});

//# sourceMappingURL=file:///game/senzanis_unit_management/ui/unit-management/screen-unit-management.js.map
