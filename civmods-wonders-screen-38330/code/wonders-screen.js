import Panel from '/core/ui/panel-support.js';
import Databind from '/core/ui/utilities/utilities-core-databinding.js';
import { InputEngineEventName } from '/core/ui/input/input-support.js';
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import { WonderScreenModel } from '/wonders-screen/code/wonders-screen-model.js';

class ScreenWonders extends Panel {
    constructor() {
        super(...arguments);
        this.closeListener = this.close.bind(this);
        this.engineInputListener = this.onEngineInput.bind(this);
        this.onShowBuildableTownsChanged = (e) => {
            const showBuildableTowns = e.detail.value;
            this.Root.querySelectorAll(".isTown").forEach(wonderEntry => {
                wonderEntry.classList.toggle("hidden", !showBuildableTowns);
            });
            this.Root.querySelectorAll(".wonder-buildable-header.buildable-only-towns").forEach(wonderEntry => {
                wonderEntry.classList.toggle("hidden", !showBuildableTowns);
            });
            this.Root.querySelectorAll(".wonder-buildable-towns-header").forEach(wonderEntry => {
                wonderEntry.classList.toggle("hidden", showBuildableTowns);
            });
        };
    }
    onEngineInput(inputEvent) {
        if (inputEvent.detail.status != InputActionStatuses.FINISH) {
            return;
        }
        if (inputEvent.isCancelInput() || inputEvent.detail.name == 'sys-menu') {
            this.close();
            inputEvent.stopPropagation();
            inputEvent.preventDefault();
        }
    }

    onInitialize() {
        this.wonderList = MustGetElement('.wonder-list', this.Root);
        this.completedWonderList = MustGetElement('.completed-wonder-list', this.Root);

        // Checkboxes
        const showBuildableTowns = MustGetElement(".show-buildable-towns", this.Root);
        showBuildableTowns.setAttribute("selected", "false");
        showBuildableTowns.addEventListener('component-value-changed', this.onShowBuildableTownsChanged);
    }

    getBuildableInfoElement() {
        const buildableInfo = document.createElement('div');
        buildableInfo.classList.add('wonder-buildable-container', 'flex', 'flex-wrap', 'mx-0\.5', 'p-1');
        Databind.if(buildableInfo, `!{{entry.completed}}`);

        const unbuildableHeader = document.createElement('p');
        unbuildableHeader.classList.add('wonder-unbuildable-header', 'uppercase', 'text-xs', 'font-title');
        unbuildableHeader.textContent = Locale.compose('LOC_UI_WONDER_SCREEN_NOT_BUILDABLE');
        Databind.if(unbuildableHeader, `{{entry.buildableCities}}.length == 0 && !{{entry.isPlayerConstructing}}`);
        buildableInfo.appendChild(unbuildableHeader);

        // Under construction
        const constructionDiv = document.createElement('div');
        Databind.if(constructionDiv, `{{entry.constructingCities}}.length > 0`);

        const constructionHeader = document.createElement('p')
        constructionHeader.classList.add('wonder-construction-header', 'uppercase', 'text-xs', 'font-title', 'w-full');
        constructionHeader.textContent = Locale.compose('LOC_UI_WONDER_SCREEN_UNDER_CONSTRUCTION_IN');
        constructionDiv.appendChild(constructionHeader);

        const constructionContainerList = document.createElement('div');
        constructionContainerList.classList.add('wonder-construction-list', 'pointer-events-auto');

        const constructionCityInfo = document.createElement('div');
        Databind.for(constructionCityInfo, 'entry.constructingCities', 'constructingCity');
        {
            const constructingCity = document.createElement('p')
            constructingCity.classList.add('wonder-buildable-city-item', 'text-xs', 'mx-2', 'flex');
            Databind.locText(constructingCity, 'constructingCity');
            constructionCityInfo.appendChild(constructingCity);
        }
        constructionContainerList.appendChild(constructionCityInfo);
        constructionDiv.appendChild(constructionContainerList);
        buildableInfo.appendChild(constructionDiv);


        const buildableHeader = document.createElement('p')
        buildableHeader.classList.add('wonder-buildable-header', 'uppercase', 'text-xs', 'font-title', 'w-full');
        buildableHeader.textContent = Locale.compose('LOC_UI_WONDER_SCREEN_BUILDABLE_IN');
        Databind.if(buildableHeader, `{{entry.buildableCities}}.length > 0`);
        // class to hide this header if this is only buildable in towns (and default to hidden);
        Databind.classToggle(buildableHeader, 'buildable-only-towns', `{{entry.buildableOnlyInTowns}}`)
        Databind.classToggle(buildableHeader, "hidden", `{{entry.buildableOnlyInTowns}}`);
        buildableInfo.appendChild(buildableHeader);

        const buildableOnlyTownsHeader = document.createElement('p');
        buildableOnlyTownsHeader.classList.add('wonder-buildable-towns-header', 'uppercase', 'text-xs', 'font-title', 'w-full');
        buildableOnlyTownsHeader.textContent = Locale.compose('LOC_UI_WONDER_SCREEN_BUILDABLE_IN_TOWNS');
        Databind.if(buildableOnlyTownsHeader, `{{entry.buildableOnlyInTowns}}`);
        buildableInfo.appendChild(buildableOnlyTownsHeader);

        const buildableContainerList = document.createElement('div');
        buildableContainerList.classList.add('wonder-buildable-list', 'pointer-events-auto');

        const buildableCityInfo = document.createElement('div');
        Databind.for(buildableCityInfo, 'entry.buildableCities', 'buildableCity');
        {
            Databind.classToggle(buildableCityInfo, 'isTown', 'buildableCity.isTown');
            Databind.classToggle(buildableCityInfo, 'text-accent-4', 'buildableCity.isTown');

            Databind.classToggle(buildableCityInfo, 'hidden', `{{buildableCity.isTown}}`);

            const buildableCity = document.createElement('p');
            buildableCity.classList.add('wonder-buildable-city-item', 'text-xs', 'mx-2', 'flex');
            Databind.locText(buildableCity, 'buildableCity.displayString');
            buildableCityInfo.appendChild(buildableCity);
        }
        buildableContainerList.appendChild(buildableCityInfo);
        buildableInfo.appendChild(buildableContainerList);
        return buildableInfo;
    }

    getWonderContainer(completed) {
        const wonderOuterContainer = document.createElement('fxs-hslot');
        wonderOuterContainer.classList.add('wonder-outer', 'relative', 'flex', 'pointer-events-auto', 'mx-2', 'mb-4');
        Databind.for(wonderOuterContainer, 'g_WondersScreenModel.wonderData', 'entry');
        {
            Databind.if(wonderOuterContainer, `{{entry.completed}} == ${completed}`);
            if (!completed) {
                // Hide incomplete wonders from previous ages
                // TODO: Should we show incomplete wonders from previous ages in the 'complete' box greyed out?
                Databind.if(wonderOuterContainer, `!{{entry.previousAge}}`);
                Databind.classToggle(wonderOuterContainer, 'locked', "!{{entry.isUnlocked}}");
            }

            Databind.classToggle(wonderOuterContainer, 'completed', "entry.completed");
            Databind.classToggle(wonderOuterContainer, 'disabled', "entry.completed");
            Databind.classToggle(wonderOuterContainer, 'player-constructing', "entry.isPlayerConstructing");
            Databind.classToggle(wonderOuterContainer, 'other-constructing', "entry.isNonPlayerConstructing");
            Databind.classToggle(wonderOuterContainer, 'competing-constructing', "entry.isCompeting");
            Databind.classToggle(wonderOuterContainer, 'player-owned', "entry.playerOwned");
            Databind.classToggle(wonderOuterContainer, 'completed', "entry.completed");

            const wonderEntry = document.createElement('div');
            wonderEntry.classList.add('wonder-entry', 'group', 'relative', 'flex', 'flex-col');

            wonderEntry.setAttribute("data-audio-press-ref", "data-audio-select-press");
            Databind.attribute(wonderEntry, 'wonder-name', "entry.name");
            Databind.attribute(wonderEntry, 'wonder-description', "entry.description");
            Databind.attribute(wonderEntry, 'wonder-completed', "entry.completed");
            const wonderInnerContainer = document.createElement('div');
            wonderInnerContainer.classList.add('wonder-entry-internal', 'flex', 'flex-col', 'items-start', 'relative', 'grow', 'mx-0\.5', 'm-1', 'p-1');

            const wonderTopContainer = document.createElement('div');
            wonderTopContainer.classList.add('wonder-top-container', 'flex', 'items-center');

            const entryIcon = document.createElement("div");
            entryIcon.classList.value = "wonder-entry-icon size-16 bg-contain bg-no-repeat relative";
            Databind.attribute(entryIcon, 'wonder-icon', "entry.icon");
            entryIcon.setAttribute('data-bind-style-background-image-url', `{{entry.icon}}`);
            wonderTopContainer.appendChild(entryIcon);

            const entryTopHeader = document.createElement("div");
            entryTopHeader.classList.value = "wonder-entry-top-header";
            wonderTopContainer.appendChild(entryTopHeader);

            const entryName = document.createElement('p');
            entryName.classList.add('wonder-name-text', 'font-title', 'text-sm', 'uppercase', "pl-2", "pr-2", "pt-2", "text-secondary");
            Databind.locText(entryName, 'entry.name');
            entryTopHeader.appendChild(entryName);

            const entryOwningText = document.createElement('p');
            entryOwningText.classList.add('wonder-name-text', 'font-title', 'text-sm', "pl-2", "pr-2", "pt-2");
            Databind.locText(entryOwningText, 'entry.owningText');
            Databind.if(entryOwningText, "entry.completed");
            entryTopHeader.appendChild(entryOwningText);

            wonderInnerContainer.appendChild(wonderTopContainer);


            const entryDescription = document.createElement('p');
            entryDescription.classList.add('wonder-description-text', 'font-title', 'text-xs', 'mx-0\.5', 'm-1', 'p-1');
            Databind.locText(entryDescription, 'entry.description');
            wonderInnerContainer.appendChild(entryDescription);
            
            if (!completed)
            {
                const entryUnlocks = document.createElement('p');
                entryUnlocks.classList.add('wonder-unlocks', 'font-title', 'text-sm', 'pl-1');
                Databind.if(entryUnlocks, '!{{entry.isUnlocked}}');
                Databind.locText(entryUnlocks, 'entry.unlockString');
                wonderInnerContainer.appendChild(entryUnlocks);
            }

            const buildableInfo = this.getBuildableInfoElement();
            wonderInnerContainer.appendChild(buildableInfo);

            wonderEntry.appendChild(wonderInnerContainer);
            wonderOuterContainer.appendChild(wonderEntry);
        }
        return wonderOuterContainer;
    }

    onAttach() {
        super.onAttach();
        this.Root.addEventListener(InputEngineEventName, this.engineInputListener);


        const closeButton = MustGetElement("fxs-close-button", this.Root);
        closeButton.addEventListener('action-activate', this.closeListener);

        const wonderOuterContainer = this.getWonderContainer(false);
        const completedWonderOuterContainer = this.getWonderContainer(true);

        this.wonderList.appendChild(wonderOuterContainer);
        this.completedWonderList.appendChild(completedWonderOuterContainer);
        // Unsure how to update the model through the engine interface. Forcing an update directly with the class
        WonderScreenModel.getInstance().update();
        engine.synchronizeModels();
    }

    onDetach() {
        this.Root.removeEventListener(InputEngineEventName, this.engineInputListener);
        super.onDetach();
    }

    close() {
        super.close();
    }
}

Controls.define('screen-wonders', {
    createInstance: ScreenWonders,
    description: 'Wonder Screen.',
    styles: ['fs://game/base-standard/ui/resource-allocation/screen-wonders.css'],
    content: ['fs://game/base-standard/ui/resource-allocation/screen-wonders.html'],
    attributes: [],
    classNames: ["trigger-nav-help", "w-full", "h-full"]
});