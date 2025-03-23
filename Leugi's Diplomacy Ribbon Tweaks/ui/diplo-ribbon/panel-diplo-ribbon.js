/**
 * @file panel-diplo-ribbon.ts
 * @copyright 2021-2024, Firaxis Games
 * @description Houses the players' portraits and stats and start of diplomatic interactions
 */
import { ActionActivateEventName } from '/core/ui/components/fxs-activatable.js';
import DiplomacyManager from '/base-standard/ui/diplomacy/diplomacy-manager.js';
import DiploRibbonData, { UpdateDiploRibbonEvent } from '/base-standard/ui/diplo-ribbon/model-diplo-ribbon.js';
import ContextManager from '/core/ui/context-manager/context-manager.js';
import { NavigateInputEventName } from '/core/ui/input/input-support.js';
import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
import Panel from '/core/ui/panel-support.js';
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import { Audio } from '/core/ui/audio-base/audio-support.js';
export class PanelDiploRibbon extends Panel {
    constructor(root) {
        super(root);
        this.numLeadersToShow = 5;
        this.interfaceModeChangedListener = this.onInterfaceModeChanged.bind(this);
        this.attributePointsUpdatedListener = this.onAttributePointsUpdated.bind(this);
        this.navigateInputListener = this.onNavigateInput.bind(this);
        this.yieldsItemListener = this.onShowPlayerYieldReport.bind(this);
        this.leadersLeftListener = this.scrollLeadersLeft.bind(this);
        this.leadersRightListener = this.scrollLeadersRight.bind(this);
        this.windowResizeListener = this.onWindowResize.bind(this);
        this.refreshDataListener = this.onModelUpdate.bind(this);
        this.mainContainer = null;
        this.topContainer = null;
        this.civFlagFlexboxPartOne = null;
        this.diploContainer = null;
        this.attributeButton = null;
        this.diploRibbons = [];
        this.firstLeaderIndex = 0;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS")) {
            this.animateInType = this.animateOutType = 3 /* AnchorType.RelativeToTop */;
        }
        else {
            this.animateInType = this.animateOutType = 4 /* AnchorType.RelativeToTopRight */;
        }
    }
    onInitialize() {
        this.topContainer = document.createElement("fxs-vslot");
        this.topContainer.classList.value = 'justify-end';
        this.diploContainer = document.createElement('div');
        this.diploContainer.classList.add('diplo-ribbon__ribbon-container');
        this.mainContainer = document.createElement("fxs-hslot");
        {
            this.mainContainer.classList.add('flex', 'flex-row', 'flex-nowrap');
        }
        this.diploContainer.appendChild(this.mainContainer);
        this.topContainer.appendChild(this.diploContainer);
        this.Root.appendChild(this.topContainer);
        this.toggleNavHelpContainer = document.createElement("div");
        this.toggleNavHelpContainer.classList.add("absolute", "top-0", "-left-10");
        const toggleNavHelpBackground = document.createElement("div");
        toggleNavHelpBackground.classList.add("img-questext", "bg-bottom", "bg-cover", "bg-no-repeat", "w-4", "h-9");
        this.toggleNavHelpContainer.appendChild(toggleNavHelpBackground);
        const toggleNavHelp = document.createElement("fxs-nav-help");
        toggleNavHelp.classList.add("w-8", "relative", "top-4", "-left-6");
        toggleNavHelp.setAttribute("action-key", "inline-toggle-diplo");
        toggleNavHelp.setAttribute("decoration-mode", "border");
        this.toggleNavHelpContainer.appendChild(toggleNavHelp);
        this.toggleNavHelpContainer.setAttribute("data-bind-class-toggle", "hidden:!{{g_NavTray.isTrayRequired}};fxs-nav-help:{{g_NavTray.isTrayRequired}}");
        this.Root.appendChild(this.toggleNavHelpContainer);
        this.firstLeaderIndex = UI.getDiploRibbonIndex();
    }
    onAttach() {
        super.onAttach();
        window.addEventListener("resize", this.windowResizeListener);
        //TODO: Need a better way to doing this, becomes more and more fragile/hard to read as more things are added that could effect this
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_PEACE_DEAL") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
            return;
        }
        else if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS")) {
            this.Root.classList.add("diplomacy-dialog-ribbon");
        }
        else if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
                return;
            }
            else {
                if (DiplomacyManager.selectedPlayerID == GameContext.localPlayerID) {
                    this.Root.classList.add("local-player-diplomacy-hub-ribbon");
                }
                else {
                    this.Root.classList.add("other-player-diplomacy-hub-ribbon");
                }
            }
        }
        this.Root.addEventListener(NavigateInputEventName, this.navigateInputListener);
        engine.on('AttributePointsChanged', this.attributePointsUpdatedListener);
        engine.on('AttributeNodeCompleted', this.attributePointsUpdatedListener);
        window.addEventListener('interface-mode-changed', this.interfaceModeChangedListener);
        waitForLayout(() => {
            if (this.Root.isConnected) {
                this.populateFlags();
                DiploRibbonData.eventNotificationRefresh.on(this.refreshDataListener);
            }
        });
    }
    onDetach() {
        UI.setDiploRibbonIndex(this.firstLeaderIndex);
        window.removeEventListener("resize", this.windowResizeListener);
        this.Root.removeEventListener(NavigateInputEventName, this.navigateInputListener);
        engine.off('AttributePointsChanged', this.attributePointsUpdatedListener);
        engine.off('AttributeNodeCompleted', this.attributePointsUpdatedListener);
        window.removeEventListener('interface-mode-changed', this.interfaceModeChangedListener);
        DiploRibbonData.eventNotificationRefresh.off(this.refreshDataListener);
        super.onDetach();
    }
    onWindowResize() {
        // window.innerWidth/innerHeight aren't the new values for 2 frames after the resize fires
        waitForLayout(() => { this.populateFlags(); });
    }
    populateFlags() {
        if (InterfaceMode.getCurrent() == "INTERFACEMODE_DIPLOMACY_PROJECT_REACTION" || InterfaceMode.getCurrent() == "INTERFACEMODE_DIPLOMACY_DIALOG" || InterfaceMode.getCurrent() == "INTERFACEMODE_CALL_TO_ARMS") {
            this.Root.classList.remove("right-24");
        }
        else {
            this.Root.classList.add("right-24");
        }
        if (!this.mainContainer) {
            console.error("panel-diplo-ribbon: Unable to find mainContainer to attach flags to!");
            return;
        }
        while (this.mainContainer.hasChildNodes()) {
            this.mainContainer.removeChild(this.mainContainer.lastChild);
        }
        //==========================
        // NAVIGATION HELP - Previous Leader (Diplo Dialog | Diplo Hub + Gamepad)
        //==========================
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            const navHelpLeft = document.createElement("fxs-nav-help");
            navHelpLeft.setAttribute("action-key", "inline-nav-shell-previous");
            this.mainContainer.appendChild(navHelpLeft);
            // in diplo hub, show 6 leaders for 1920+ wide, 5 for 1600+ wide, and 3 for everything below that
            if (window.innerWidth >= 1919) {
                this.numLeadersToShow = 6;
            }
            else if (window.innerWidth >= 1599) {
                this.numLeadersToShow = 5;
            }
            else {
                this.numLeadersToShow = 3;
            }
        }
        else { // on the main game screen always max out at 8 leaders
            this.numLeadersToShow = 8;
        }
        // Check which array of player data we want to use
        let targetArray = null;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
            targetArray = DiploRibbonData.diploStatementPlayerData;
        }
        else {
            targetArray = DiploRibbonData.playerData;
        }
        const numShown = Math.min(targetArray.length, this.numLeadersToShow);
        this.diploRibbons = [];
        // in diplomacy hub, start off showing whichever leader we selected to get in here
        let inHub = false;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            inHub = true;
            for (let index = 0; index < targetArray.length; index++) {
                if (targetArray[index].id == DiplomacyManager.selectedPlayerID) {
                    const selectedIndex = index;
                    if (targetArray.length >= this.numLeadersToShow) {
                        if (selectedIndex < (this.numLeadersToShow - 1)) {
                            this.firstLeaderIndex = 0;
                        }
                        else {
                            this.firstLeaderIndex = selectedIndex - (this.numLeadersToShow - 1);
                        }
                    }
                    break;
                }
            }
        }
        if (this.diploContainer) {
            this.diploContainer.classList.toggle("diplo-ribbon__ribbon-container-small", numShown >= 7 && window.innerWidth < 1919);
            this.diploContainer.classList.toggle("diplo-ribbon__ribbon-container-hub", inHub);
        }
        let scrollIndex = 0;
        // if we have enough leaders visible to scroll, set up the left arrow
        if (targetArray.length > this.numLeadersToShow) {
            const leftArrowBG = document.createElement("div");
            leftArrowBG.classList.add("diplo-ribbon__arrow-bg", "w-12", "h-14", "relative", "align-center", "self-start");
            const leftArrow = document.createElement("fxs-activatable");
            leftArrow.classList.add("diplo-ribbon-left-arrow", "absolute", "inset-0", "align-center", "bg-no-repeat", "bg-cover", "w-12", "h-14", "self-start");
            if (this.firstLeaderIndex > 0) {
                leftArrow.classList.add('img-arrow');
            }
            else {
                leftArrow.classList.add('img-arrow-disabled');
                leftArrow.setAttribute("disabled", "true");
            }
            leftArrow.addEventListener(ActionActivateEventName, this.leadersLeftListener);
            leftArrowBG.appendChild(leftArrow);
            this.mainContainer.appendChild(leftArrowBG);
            scrollIndex = this.firstLeaderIndex;
        }
        for (let cardIndex = 0; cardIndex < targetArray.length; cardIndex++) {
            const player = targetArray[cardIndex];
            const civFlagContainer = document.createElement("div");
            civFlagContainer.classList.add("diplo-ribbon-outer", "flex", "flex-row");
            if (player.playerColors) {
                civFlagContainer.setAttribute("style", player.playerColors);
            }
            civFlagContainer.setAttribute("data-player-id", player.id.toString());
            civFlagContainer.setAttribute("data-ribbon-index", cardIndex.toString());
            //civFlagContainer.classList.toggle("primary-color-is-lighter", player.isPrimaryLighter);
            civFlagContainer.classList.toggle("show-on-hover", !DiploRibbonData.alwaysShowYields);
            civFlagContainer.classList.toggle("local-player", player.id == GameContext.localPlayerID);
            civFlagContainer.classList.toggle("hidden", cardIndex < scrollIndex || cardIndex >= (scrollIndex + numShown));
            civFlagContainer.classList.toggle("diplo-ribbon__outer_small", !inHub);
            civFlagContainer.addEventListener("mouseenter", (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.displayRibbonDetails(event.target);
            });
            civFlagContainer.addEventListener("mouseleave", (event) => {
                event.stopPropagation();
                event.preventDefault();
                this.hideRibbonDetails(event.target);
            });
            this.diploRibbons[cardIndex] = civFlagContainer;
            const civFlagContent = document.createElement('div');
            civFlagContent.classList.add('diplo-ribbon_content-container');
            //==========================
            // MAIN BG
            //==========================
            const diploMainBGContainer = document.createElement('div');
            diploMainBGContainer.classList.value = "diplo-ribbon__bg-container absolute w-24 h-full top-4 pointer-events-none";
            civFlagContent.appendChild(diploMainBGContainer);
            const diploMainBG = document.createElement('div');
            diploMainBG.classList.value = 'diplo-ribbon__bg absolute inset-0';
            diploMainBGContainer.appendChild(diploMainBG);
            //==========================
            // Tokens
            //==========================
            const diploTokens = document.createElement('div');
            diploTokens.classList.add('diplo-ribbon__tokens');
            this.civFlagFlexboxPartOne = diploTokens;
            civFlagContent.appendChild(diploTokens);
            const civLeaderTopBG = document.createElement('div');
            civLeaderTopBG.classList.value = 'diplo-ribbon__upper-bg absolute top-0 w-16 h-36 flex flex-col items-center pointer-events-none';
			civLeaderTopBG.style.transform = `translateY(2px)`;
			if (player.id === GameContext.localPlayerID) {
				civLeaderTopBG.style.transform = `translateX(1px)`;
			}
            civLeaderTopBG.innerHTML = `
				<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png')"></div>
				<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png')"></div>
				<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more)"></div>
				<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.1rem"></div>
			`;
            if (player.isAtWar) {
			civLeaderTopBG.innerHTML = `
				<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png')"></div>
				<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png')"></div>
				<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more)"></div>
				<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
			`;	
			}
			this.civFlagFlexboxPartOne.appendChild(civLeaderTopBG);
            const civLeader = document.createElement('fxs-activatable');
            civLeader.classList.add('diplo-ribbon__portrait');
            civLeader.setAttribute("data-tut-highlight", "founderHighlight");
            civLeader.setAttribute("data-audio-group-ref", "audio-panel-diplo-ribbon");
            civLeader.setAttribute("data-audio-focus-ref", "none");
            civLeader.setAttribute("data-player-id", player.id.toString());
			const civLeaderHexBGShadow = document.createElement('div');
            civLeaderHexBGShadow.classList.value = 'diplo-ribbon__portrait-hex-bg-shadow bg-contain bg-center bg-no-repeat inset-0 absolute';
            civLeader.appendChild(civLeaderHexBGShadow);
            const civLeaderHexBG = document.createElement('div');
            civLeaderHexBG.classList.value = 'diplo-ribbon__portrait-hex-bg bg-contain bg-center bg-no-repeat inset-0 absolute';
            civLeader.appendChild(civLeaderHexBG);
            const civLeaderHexBGFrame = document.createElement('div');
            civLeaderHexBGFrame.classList.value = 'diplo-ribbon__portrait-hex-bg-frame bg-contain bg-center bg-no-repeat inset-0 absolute';
            civLeader.appendChild(civLeaderHexBGFrame);
            const civLeaderHitbox = document.createElement('div');
            civLeaderHitbox.classList.add('diplo-ribbon__portrait-hitbox');
            civLeaderHitbox.setAttribute("data-tooltip-content", player.name);
            civLeader.appendChild(civLeaderHitbox);
            const portrait = document.createElement("fxs-icon");
            portrait.classList.value = "diplo-ribbon__portrait-image absolute size-26 -left-2\\.5";
            portrait.setAttribute("data-icon-id", player.leaderType);
            portrait.setAttribute("data-icon-context", player.portraitContext);
            portrait.classList.toggle("turn-active", player.isTurnActive);
            portrait.classList.toggle("-scale-x-100", player.id != GameContext.localPlayerID);
            civLeader.appendChild(portrait);
            const relationContainer = document.createElement('div');
            relationContainer.classList.add('diplo-ribbon__relation-container');
            const relationshipIcon = document.createElement("div");
            relationshipIcon.classList.value = "relationship-icon relative bg-contain bg-center bg-no-repeat pointer-events-auto self-center w-18 h-9";
            relationshipIcon.classList.toggle("hidden", player.relationshipIcon == '');
            relationshipIcon.style.backgroundImage = `url('${player.relationshipIcon}')`;
            relationshipIcon.setAttribute("data-player-id", player.id.toString());
            relationshipIcon.setAttribute('data-tooltip-style', "relationship");
			relationshipIcon.style.transform = `translateX(-0.25px) translateY(-1px)`;
            relationContainer.appendChild(relationshipIcon);
            const sanctionEnvoyCount = document.createElement("div");
            sanctionEnvoyCount.classList.value = "diplo-ribbon__sanction-envoy-count relative pointer-events-auto self-center flex justify-center items-center font-base text-2xs mt-1\\.25 -ml-px w-11 h-3\\.5";
            sanctionEnvoyCount.classList.toggle("hidden", player.numSanctionEnvoys <= 0 || player.isAtWar);
            sanctionEnvoyCount.setAttribute("data-player-id", player.id.toString());
            sanctionEnvoyCount.setAttribute("data-l10n-id", player.numSanctionEnvoys.toString());
            sanctionEnvoyCount.setAttribute('data-tooltip-style', "sanction");
            relationContainer.appendChild(sanctionEnvoyCount);
            const warSupport = document.createElement("div");
            warSupport.classList.value = "diplo-ribbon__war-support-count relative bg-contain bg-center bg-no-repeat pointer-events-auto self-center w-12 h-5 flex justify-center items-center font-base text-2xs mt-1\\.25 -ml-px w-12 h-6\\.5";
			warSupport.classList.toggle("hidden", !player.isAtWar || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG"));
			warSupport.style.backgroundColor = "rgba(255, 255, 255, 0)";
			warSupport.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield.png')";
			warSupport.style.transform = `translateX(1px) translateY(-5px)`;
			if (player.warSupport > 0) {
				warSupport.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Positive.png')";
			}
			if (player.warSupport > 9) {
				warSupport.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Positive_Long.png')";
			}
			if (player.warSupport < 0) {
				warSupport.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Negative.png')";
			}
			if (player.warSupport < -9) {
				warSupport.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Negative_Long.png')";
			}
			//warSupport.classList.toggle("positive", player.warSupport > 0);
            //warSupport.classList.toggle("negative", player.warSupport < 0);
            warSupport.setAttribute("data-player-id", player.id.toString());
            warSupport.setAttribute("data-l10n-id", player.warSupport.toString());
            warSupport.setAttribute('data-tooltip-style', "relationship");
            relationContainer.appendChild(warSupport);
            civLeader.appendChild(relationContainer);
            civLeader.addEventListener('focus', (event) => {
                this.mainContainer.classList.add("cards-focused");
                this.displayRibbonDetails(event.target);
            });
            civLeader.addEventListener('blur', (event) => {
                this.mainContainer.classList.remove("cards-focused");
                this.hideRibbonDetails(event.target);
            });
            civLeader.setAttribute("data-player-id", player.id.toString());
            civLeader.classList.toggle("can-click-leader-icon", player.canClick);
            civLeader.classList.toggle("selected", player.selected);
            civLeader.classList.toggle("local-player", player.id == GameContext.localPlayerID);
            civLeader.classList.toggle("turn-active", player.isTurnActive);
            civLeader.addEventListener("action-activate", (event) => {
                event.stopPropagation();
                event.preventDefault();
                const target = event.target;
                if (target.classList.contains("can-click-leader-icon")) {
                    const targetID = target.getAttribute("data-player-id");
                    if (targetID) {
                        const targetIDInt = Number.parseInt(targetID);
                        if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
                            console.error("panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during action-activate callback.");
                            return;
                        }
                        //Check if we have a player met notification for this player
                        const notificationIDs = Game.Notifications.getIdsForPlayer(GameContext.localPlayerID);
                        if (notificationIDs) {
                            let hasFirstMeet = false;
                            for (const notificationID of notificationIDs) {
                                const notification = Game.Notifications.find(notificationID);
                                if (notification && Game.Notifications.getTypeName(notification.Type) == "NOTIFICATION_PLAYER_MET" && notification.Player == targetIDInt) {
                                    Game.Notifications.activate(notificationID);
                                    hasFirstMeet = true;
                                    return;
                                }
                            }
                            if (hasFirstMeet) {
                                return;
                            }
                        }
                        DiplomacyManager.raiseDiplomacyHub(targetIDInt);
                        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
                            window.dispatchEvent(new UpdateDiploRibbonEvent());
                        }
                    }
                    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
                        if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
                            return;
                        }
                        else {
                            if (DiplomacyManager.selectedPlayerID == GameContext.localPlayerID) {
                                this.Root.classList.add("local-player-diplomacy-hub-ribbon");
                                this.Root.classList.remove("other-player-diplomacy-hub-ribbon");
                            }
                            else {
                                this.Root.classList.add("other-player-diplomacy-hub-ribbon");
                                this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
                            }
                        }
                    }
                }
            });
            this.civFlagFlexboxPartOne.appendChild(civLeader);
            const civFlagYieldFlex = document.createElement("div");
            civFlagYieldFlex.classList.value = "diplo-ribbon__yields flow-column items-stretch relative px-1 mt-14";
            for (let yieldIndex = 0; yieldIndex < player.displayItems.length; yieldIndex++) {
                const y = player.displayItems[yieldIndex];
                const yieldItem = document.createElement("fxs-activatable");
                yieldItem.classList.add("yield-item", "font-title-base", "flow-row", "items-center", "pointer-events-auto");
                yieldItem.classList.toggle('tint-bg', yieldIndex % 2 == 0);
                yieldItem.classList.toggle('last', yieldIndex == player.displayItems.length - 1);
                yieldItem.classList.add(`yield-colors--${y.type}`);
                yieldItem.setAttribute("data-tooltip-content", y.label);
                yieldItem.addEventListener('action-activate', this.yieldsItemListener);
                const yieldLabel = document.createElement("div");
                yieldLabel.classList.add("flow-column", "flex-auto", "justify-center", "yield-label");
                yieldLabel.innerHTML = y.img;
                yieldItem.appendChild(yieldLabel);
                const yieldValue = document.createElement("div");
                yieldValue.classList.add("yield-value");
                yieldValue.setAttribute("data-l10n-id", y.value.toString());
                yieldValue.setAttribute("data-tooltip-content", y.details);
                yieldItem.classList.add(`text-yield-${y.type}`);
                yieldItem.appendChild(yieldValue);
                civFlagYieldFlex.appendChild(yieldItem);
            }
            civFlagContent.appendChild(civFlagYieldFlex);
            if (DiploRibbonData.ribbonDisplayTypes.length > 0) {
                const diploBottomSpacer = document.createElement('div');
                diploBottomSpacer.classList.add('diplo-ribbon__bottom-spacer');
                civFlagContent.appendChild(diploBottomSpacer);
            }
            civFlagContainer.appendChild(civFlagContent);
            this.mainContainer.appendChild(civFlagContainer);
        }
        // if we have enough leaders to scroll, add the right arrow now
        if (targetArray.length > this.numLeadersToShow) {
            const rightArrowBG = document.createElement("div");
            rightArrowBG.classList.add("diplo-ribbon__arrow-bg", "w-12", "h-14", "relative", "align-center", "self-start");
            const rightArrow = document.createElement("fxs-activatable");
            rightArrow.classList.add("diplo-ribbon-right-arrow", "absolute", "inset-0", "align-center", "bg-no-repeat", "bg-cover", "w-12", "h-14", "self-start", "-scale-x-100");
            if (this.firstLeaderIndex < (targetArray.length - this.numLeadersToShow)) {
                rightArrow.classList.add('img-arrow');
            }
            else {
                rightArrow.classList.add('img-arrow-disabled');
                rightArrow.setAttribute("disabled", "true");
            }
            rightArrow.classList.toggle('cursor-not-allowed', this.firstLeaderIndex >= (targetArray.length - this.numLeadersToShow));
            rightArrow.classList.toggle('cursor-pointer', this.firstLeaderIndex < (targetArray.length - this.numLeadersToShow));
            rightArrow.addEventListener(ActionActivateEventName, this.leadersRightListener);
            rightArrowBG.appendChild(rightArrow);
            this.mainContainer.appendChild(rightArrowBG);
        }
        //==========================
        // NAVIGATION HELP - Next Leader (Diplo Dialog | Diplo Hub + Gamepad)
        //==========================
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            const navHelpRight = document.createElement("fxs-nav-help");
            navHelpRight.setAttribute("action-key", "inline-nav-shell-next");
            this.mainContainer.appendChild(navHelpRight);
        }
        this.attachAttributeButton();
    }
    onModelUpdate() {
        let targetArray = null;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
            targetArray = DiploRibbonData.diploStatementPlayerData;
        }
        else {
            targetArray = DiploRibbonData.playerData;
        }
        // If there's a mismatch (player added/removed) do a full rebuild
        if (targetArray.length != this.diploRibbons.length) {
            this.populateFlags();
            return;
        }
        // set the portrait array
        const availablePortraits = [];
        const leaderPortraits = this.Root.getElementsByClassName("diplo-ribbon__portrait");
        for (let numportraits = 0; numportraits < leaderPortraits.length; numportraits++) {
            if (leaderPortraits[numportraits].hasAttribute("data-player-id")) {
                availablePortraits.push({ key: leaderPortraits[numportraits].getAttribute("data-player-id"), value: leaderPortraits[numportraits] });
            }
        }
        // set the flag container array
        const availableFlags = [];
        const flags = this.Root.getElementsByClassName("diplo-ribbon-outer");
        for (let numflags = 0; numflags < flags.length; numflags++) {
            if (flags[numflags].hasAttribute("data-player-id")) {
                availableFlags.push({ key: flags[numflags].getAttribute("data-player-id"), value: flags[numflags] });
            }
        }
        // set the war support array
        const availableWarSupport = [];
        const warSupport = this.Root.getElementsByClassName("diplo-ribbon__war-support-count");
        for (let numsupport = 0; numsupport < flags.length; numsupport++) {
            if (warSupport[numsupport].hasAttribute("data-player-id")) {
                availableWarSupport.push({ key: warSupport[numsupport].getAttribute("data-player-id"), value: warSupport[numsupport] });
            }
        }
        // set the sanction envoy array
        const availableSanction = [];
        const sanctionEnvoy = this.Root.getElementsByClassName("diplo-ribbon__sanction-envoy-count");
        for (let numenvoy = 0; numenvoy < flags.length; numenvoy++) {
            if (sanctionEnvoy[numenvoy].hasAttribute("data-player-id")) {
                availableSanction.push({ key: sanctionEnvoy[numenvoy].getAttribute("data-player-id"), value: sanctionEnvoy[numenvoy] });
            }
        }
        // set the relationship icon array
        const availableRelationshipIcons = [];
        const relationshipIcon = this.Root.getElementsByClassName("relationship-icon");
        for (let numicons = 0; numicons < flags.length; numicons++) {
            if (relationshipIcon[numicons].hasAttribute("data-player-id")) {
                availableRelationshipIcons.push({ key: relationshipIcon[numicons].getAttribute("data-player-id"), value: relationshipIcon[numicons] });
            }
        }
        let scrollIndex = 0;
        // if we have enough leaders visible to scroll, set up the left arrow
        if (targetArray.length > this.numLeadersToShow) {
            scrollIndex = this.firstLeaderIndex;
        }
        const numShown = Math.min(targetArray.length, this.numLeadersToShow);
        let inHub = false;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            inHub = true;
        }
        for (let cardIndex = 0; cardIndex < targetArray.length; cardIndex++) {
            const player = targetArray[cardIndex];
            this.diploRibbons[cardIndex].classList.toggle("show-on-hover", !DiploRibbonData.alwaysShowYields);
            const portrait = MustGetElement(".diplo-ribbon__portrait-image", this.diploRibbons[cardIndex]);
            portrait.classList.toggle("turn-active", player.isTurnActive);
            portrait.setAttribute("data-icon-id", player.leaderType);
            portrait.setAttribute("data-icon-context", player.portraitContext);
            const relationshipIcon = MustGetElement(".relationship-icon", this.diploRibbons[cardIndex]);
            relationshipIcon.classList.toggle("hidden", player.relationshipIcon == '');
            relationshipIcon.style.backgroundImage = `url('${player.relationshipIcon}')`;
            const sanctionEnvoyCount = MustGetElement(".diplo-ribbon__sanction-envoy-count", this.diploRibbons[cardIndex]);
            sanctionEnvoyCount.classList.toggle("hidden", player.numSanctionEnvoys <= 0 || player.isAtWar);
            sanctionEnvoyCount.setAttribute("data-l10n-id", player.numSanctionEnvoys.toString());
            const warSupport = MustGetElement(".diplo-ribbon__war-support-count", this.diploRibbons[cardIndex]);
            warSupport.classList.toggle("hidden", !player.isAtWar);
            warSupport.classList.toggle("positive", player.warSupport > 0);
            warSupport.classList.toggle("negative", player.warSupport < 0);
            for (let numflags = 0; numflags < availablePortraits.length; numflags++) {
                if (availablePortraits[numflags].key == targetArray[cardIndex].id.toString()) {
                    const currentPortait = availablePortraits[numflags];
                    currentPortait.value.classList.toggle("can-click-leader-icon", targetArray[cardIndex].canClick);
                    currentPortait.value.classList.toggle("selected", targetArray[cardIndex].selected);
                    currentPortait.value.classList.toggle("local-player", targetArray[cardIndex].id == GameContext.localPlayerID);
                    currentPortait.value.classList.toggle("turn-active", player.isTurnActive);
                    const currentFlag = availableFlags[numflags];
                    currentFlag.value.classList.toggle("can-click-leader-icon", targetArray[cardIndex].canClick);
                    currentFlag.value.classList.toggle("primary-color-is-lighter", targetArray[cardIndex].isPrimaryLighter);
                    currentFlag.value.classList.toggle("show-on-hover", !DiploRibbonData.alwaysShowYields);
                    currentFlag.value.classList.toggle("local-player", targetArray[cardIndex].id == GameContext.localPlayerID);
                    currentFlag.value.classList.toggle("hidden", cardIndex < scrollIndex || cardIndex >= (scrollIndex + numShown));
                    currentFlag.value.classList.toggle("diplo-ribbon__outer_small", !inHub);
                    const currentWarSupport = availableWarSupport[numflags];
                    currentWarSupport.value.classList.toggle("hidden", !targetArray[cardIndex].isAtWar);
					if (targetArray[cardIndex].warSupport === 0) {
						currentWarSupport.value.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield.png')";
					}
					if (targetArray[cardIndex].warSupport > 0) {
						currentWarSupport.value.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Positive.png')";
					}
					if (targetArray[cardIndex].warSupport > 9) {
						currentWarSupport.value.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Positive_Long.png')";
					}
					if (targetArray[cardIndex].warSupport < 0) {
						currentWarSupport.value.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Negative.png')";
					}
					if (targetArray[cardIndex].warSupport < -9) {
						currentWarSupport.value.style.backgroundImage = "url('fs://game/leugi-diploribbon-tweaks/Icons/leu_WarSupportShield_Negative_Long.png')";
					}
		
					//currentWarSupport.value.classList.toggle("positive", targetArray[cardIndex].warSupport > 0);
                    //currentWarSupport.value.classList.toggle("negative", targetArray[cardIndex].warSupport < 0);
                    currentWarSupport.value.setAttribute("data-l10n-id", targetArray[cardIndex].warSupport.toString());
                    const currentSanction = availableSanction[numflags];
                    currentSanction.value.classList.value = "diplo-ribbon__sanction-envoy-count relative pointer-events-auto self-center flex justify-center items-center font-base text-2xs mt-1\\.25 -ml-px w-11 h-3\\.5";
                    currentSanction.value.classList.toggle("hidden", targetArray[cardIndex].numSanctionEnvoys <= 0 || targetArray[cardIndex].isAtWar);
                    currentSanction.value.setAttribute("data-l10n-id", targetArray[cardIndex].numSanctionEnvoys.toString());
                    const currentRelationshipIcon = availableRelationshipIcons[numflags];
                    currentRelationshipIcon.value.classList.toggle("hidden", !targetArray[cardIndex].isAtWar);
                    currentRelationshipIcon.value.classList.toggle("hidden", targetArray[cardIndex].relationshipIcon == '');
                    currentRelationshipIcon.value.setAttribute("data-bg-image", `url('${targetArray[cardIndex].relationshipIcon}')`);
                }
            }
            const civFlagYieldFlex = MustGetElement(".diplo-ribbon__yields", this.diploRibbons[cardIndex]);
            for (let yieldIndex = 0; yieldIndex < player.displayItems.length; yieldIndex++) {
                const y = player.displayItems[yieldIndex];
                const yieldItem = civFlagYieldFlex.children[yieldIndex];
                if (!yieldItem) {
                    console.error(`panel-diplo-ribbon: onModelUpdate() - could not find child for civFlagYieldFlex at index ${yieldIndex}.`);
                    console.error(`    civFlagYieldFlex has ${civFlagYieldFlex.children.length} children, while ${Locale.compose(player.civName)} has ${player.displayItems.length} display items.`);
                    continue;
                }
                yieldItem.setAttribute("data-tooltip-content", y.label);
                const yieldValue = MustGetElement(".yield-value", yieldItem);
                yieldValue.setAttribute("data-l10n-id", y.value.toString());
                yieldValue.setAttribute("data-tooltip-content", y.details);
            }
        }
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
                this.Root.classList.add("other-player-diplomacy-hub-ribbon");
                this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
            }
            else {
                this.Root.classList.toggle('local-player-diplomacy-hub-ribbon', DiplomacyManager.selectedPlayerID == GameContext.localPlayerID);
                this.Root.classList.toggle('other-player-diplomacy-hub-ribbon', DiplomacyManager.selectedPlayerID != GameContext.localPlayerID);
            }
        }
    }
    scrollLeadersLeft() {
        if (this.firstLeaderIndex > 0) {
            this.firstLeaderIndex--;
            this.refreshRibbonVis();
        }
    }
    scrollLeadersRight() {
        let targetArray = null;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
            targetArray = DiploRibbonData.diploStatementPlayerData;
        }
        else {
            targetArray = DiploRibbonData.playerData;
        }
        if (this.firstLeaderIndex < (targetArray.length - this.numLeadersToShow)) {
            this.firstLeaderIndex++;
            this.refreshRibbonVis();
        }
    }
    refreshRibbonVis() {
        const leftArrow = MustGetElement(".diplo-ribbon-left-arrow", this.mainContainer);
        const rightArrow = MustGetElement(".diplo-ribbon-right-arrow", this.mainContainer);
        let targetArray = null;
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
            targetArray = DiploRibbonData.diploStatementPlayerData;
        }
        else {
            targetArray = DiploRibbonData.playerData;
        }
        for (let index = 0; index < targetArray.length; index++) {
            this.diploRibbons[index].classList.toggle("hidden", index < this.firstLeaderIndex || index >= (this.firstLeaderIndex + this.numLeadersToShow));
        }
        leftArrow.classList.toggle('img-arrow', this.firstLeaderIndex > 0);
        leftArrow.classList.toggle('img-arrow-disabled', this.firstLeaderIndex == 0);
        if (this.firstLeaderIndex > 0) {
            leftArrow.removeAttribute("disabled");
        }
        else {
            leftArrow.setAttribute("disabled", "true");
        }
        rightArrow.classList.toggle('img-arrow', this.firstLeaderIndex < (targetArray.length - this.numLeadersToShow));
        rightArrow.classList.toggle('img-arrow-disabled', this.firstLeaderIndex >= (targetArray.length - this.numLeadersToShow));
        if (this.firstLeaderIndex < (targetArray.length - this.numLeadersToShow)) {
            rightArrow.removeAttribute("disabled");
        }
        else {
            rightArrow.setAttribute("disabled", "true");
        }
    }
    displayRibbonDetails(target) {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
            return;
        }
        const targetID = target.getAttribute("data-player-id");
        if (targetID == null) {
            console.error("panel-diplo-ribbon: Attempting to hover a leader portrait without a 'data-player-id' attribute!");
            return;
        }
        const targetIDInt = Number.parseInt(targetID);
        if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
            console.error("panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during hover callback.");
            return;
        }
        if (targetIDInt != GameContext.localPlayerID) {
            Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
            return;
        }
        if (!target.parentElement?.parentElement) {
            console.error("panel-diplo-ribbon: No valid parent element while attempting to hover a portrait!");
            return;
        }
        const civFlagContainers = this.Root.querySelectorAll(".diplo-ribbon-outer");
        for (const civFlagContainer of civFlagContainers) {
            civFlagContainer.classList.add("hover-all");
        }
        Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
    }
    hideRibbonDetails(target) {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
            return;
        }
        const targetID = target.getAttribute("data-player-id");
        if (targetID == null) {
            console.error("panel-diplo-ribbon: Attempting to un-hover a leader portrait without a 'data-player-id' attribute!");
            return;
        }
        const targetIDInt = Number.parseInt(targetID);
        if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
            console.error("panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during mouseleave callback.");
            return;
        }
        if (targetIDInt != GameContext.localPlayerID) {
            return;
        }
        if (!target.parentElement?.parentElement) {
            console.error("panel-diplo-ribbon: No valid parent element while attempting to un-hover a portrait!");
            return;
        }
        const civFlagContainers = this.Root.querySelectorAll(".diplo-ribbon-outer");
        for (const civFlagContainer of civFlagContainers) {
            civFlagContainer.classList.remove("hover-all");
        }
    }
    onNavigateInput(inputEvent) {
        if (inputEvent.detail.status != InputActionStatuses.FINISH || ContextManager.getCurrentTarget()) {
            return;
        }
        if (inputEvent.detail.name == 'nav-shell-next' || inputEvent.detail.name == 'nav-shell-previous') {
            inputEvent.stopPropagation();
            inputEvent.preventDefault();
            // Check which array of player data we want to use
            let targetArray = null;
            if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
                targetArray = DiploRibbonData.diploStatementPlayerData;
            }
            else {
                targetArray = DiploRibbonData.playerData;
            }
            // get leaderId based on next or previous sibling data-player-id
            const selectedCard = this.mainContainer?.querySelector(".selected")?.parentElement?.parentElement?.parentElement;
            if (!selectedCard) {
                console.error("diplo-ribbon: Couldn't find selected ribbon");
                return;
            }
            const currentIndex = selectedCard.getAttribute("data-ribbon-index");
            if (!currentIndex) {
                console.error("diplo-ribbon: Couldn't find data-ribbon-index on selected ribbon");
                return;
            }
            const currentLeaderIdx = Number.parseInt(currentIndex);
            let selectedIndex = 0;
            if (inputEvent.detail.name == 'nav-shell-previous') {
                if (currentLeaderIdx > 0) {
                    selectedIndex = currentLeaderIdx - 1;
                }
                else {
                    return;
                }
            }
            else {
                if (currentLeaderIdx < (targetArray.length - 1)) {
                    selectedIndex = currentLeaderIdx + 1;
                }
                else {
                    return;
                }
            }
            const nextLeaderId = targetArray[selectedIndex].id;
            DiplomacyManager.raiseDiplomacyHub(nextLeaderId);
            for (let index = 0; index < this.diploRibbons.length; index++) {
                const diploRibbon = this.diploRibbons[index];
                const civLeader = MustGetElement(".diplo-ribbon__portrait", diploRibbon);
                const idString = diploRibbon.getAttribute("data-player-id");
                const thisId = Number.parseInt(idString ? idString : "");
                civLeader.classList.toggle("selected", thisId == nextLeaderId);
            }
            if (this.diploRibbons.length >= this.numLeadersToShow) {
                if (selectedIndex < (this.numLeadersToShow - 1)) {
                    this.firstLeaderIndex = 0;
                }
                else {
                    this.firstLeaderIndex = selectedIndex - (this.numLeadersToShow - 1);
                }
                this.refreshRibbonVis();
            }
            if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
                if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
                    return;
                }
                else {
                    if (DiplomacyManager.selectedPlayerID == GameContext.localPlayerID) {
                        this.Root.classList.add("local-player-diplomacy-hub-ribbon");
                        this.Root.classList.remove("other-player-diplomacy-hub-ribbon");
                    }
                    else {
                        this.Root.classList.add("other-player-diplomacy-hub-ribbon");
                        this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
                    }
                }
            }
            window.dispatchEvent(new UpdateDiploRibbonEvent());
        }
    }
    onShowPlayerYieldReport() {
        ContextManager.push("player-yields-report-screen", { singleton: true, createMouseGuard: true });
    }
    attachAttributeButton() {
        waitUntilValue(() => { return this.Root.querySelector(".diplo-ribbon__portrait.local-player"); }).then(() => {
            const localPlayerPortrait = this.Root.querySelector(".diplo-ribbon__portrait.local-player");
            if (!localPlayerPortrait) {
                console.error("panel-diplo-ribbon: Unable to find diplo ribbon portrait for the local player");
                return;
            }
            this.attributeButton = document.createElement("fxs-activatable");
            this.attributeButton.classList.value = "diplo-ribbon__attribute-button -left-1 bottom-3 h-10 absolute flex items-center justify-center";
            const buttonNumber = document.createElement("div");
            buttonNumber.classList.value = "diplo-ribbon__attribute-button-number font-body text-sm mt-2 px-4";
            buttonNumber.innerHTML = '-1';
            this.attributeButton.appendChild(buttonNumber);
            //dummy div for placing the tutorial highlight.
            const tutorialHighlight = document.createElement("div");
            tutorialHighlight.classList.value = "diplo-ribbon__attribute-button-highlight absolute inset-0";
            tutorialHighlight.setAttribute("data-tut-highlight", "founderHighlight");
            this.attributeButton.appendChild(tutorialHighlight);
            this.attributeButton.addEventListener('action-activate', this.clickAttributeButton);
            localPlayerPortrait.appendChild(this.attributeButton);
            this.updateAttributeButton();
        });
    }
    updateAttributeButton() {
        if (!this.attributeButton) {
            console.error("panel-diplo-ribbon: Unable to find attribute button, skipping update of turn timers");
            return;
        }
        const localPlayer = Players.getEverAlive()[GameContext.localPlayerID];
        if (localPlayer == null) {
            return; // autoplaying
        }
        let attributePoints = 0;
        // Add attribute data
        if (localPlayer.Identity) {
            for (let attributeDef of GameInfo.Attributes) {
                attributePoints += localPlayer.Identity.getAvailableAttributePoints(attributeDef.AttributeType);
            }
        }
        if (attributePoints > 0 && !InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
            this.attributeButton.classList.remove("hidden");
        }
        else {
            this.attributeButton.classList.add("hidden");
            return;
        }
        const pointsNumberElement = MustGetElement(".diplo-ribbon__attribute-button-number", this.attributeButton);
        pointsNumberElement.innerHTML = attributePoints.toString();
    }
    onAttributePointsUpdated(data) {
        if (data && data.player && data.player != GameContext.localPlayerID) {
            //Not us, we don't need to update
            return;
        }
        this.updateAttributeButton();
    }
    clickAttributeButton() {
        ContextManager.push("screen-attribute-trees", { singleton: true, createMouseGuard: true });
    }
    onInterfaceModeChanged() {
        if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_PEACE_DEAL")) {
            this.Root.classList.add("hidden");
        }
        else if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
            this.Root.classList.add("diplomacy-dialog-ribbon");
            this.Root.classList.remove("other-player-diplomacy-hub-ribbon");
            this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
            this.populateFlags();
        }
        else {
            this.Root.classList.toggle("trigger-nav-help", InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG"));
            this.toggleNavHelpContainer.classList.toggle("invisible", InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG"));
            this.Root.classList.remove("hidden");
        }
    }
}
Controls.define('panel-diplo-ribbon', {
    createInstance: PanelDiploRibbon,
    description: "Houses the players' portraits and stats and start of diplomatic interactions",
    classNames: ['diplo-ribbon', 'relative', 'allowCameraMovement', 'trigger-nav-help', 'top-8', 'right-24', 'pointer-events-none'],
    styles: ['fs://game/base-standard/ui/diplo-ribbon/panel-diplo-ribbon.css'],
    images: ["hud_att_arrow", "hud_att_arrow_highlight"]
});

//# sourceMappingURL=file:///base-standard/ui/diplo-ribbon/panel-diplo-ribbon.js.map
