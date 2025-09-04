import FocusManager, { A as Audio } from '../../../core/ui/input/focus-manager.js';
import { a as ActionActivateEventName, A as ActionActivateEvent } from '../../../core/ui/components/fxs-activatable.chunk.js';
import ContextManager from '../../../core/ui/context-manager/context-manager.js';
import ActionHandler, { ActiveDeviceTypeChangedEventName } from '../../../core/ui/input/action-handler.js';
import { a as NavigateInputEventName, b as InputEngineEventName } from '../../../core/ui/input/input-support.chunk.js';
import { InterfaceMode } from '../../../core/ui/interface-modes/interface-modes.js';
import { P as Panel, A as AnchorType } from '../../../core/ui/panel-support.chunk.js';
import { MustGetElement } from '../../../core/ui/utilities/utilities-dom.chunk.js';
import { L as Layout } from '../../../core/ui/utilities/utilities-layout.chunk.js';
import { m as multiplayerTeamColors } from '../../../core/ui/utilities/utilities-network-constants.chunk.js';
import { D as DiploRibbonData, U as UpdateDiploRibbonEvent, a as RibbonStatsToggleStatus } from './model-diplo-ribbon.chunk.js';
import { RaiseDiplomacyEvent } from '../diplomacy/diplomacy-events.js';
import DiplomacyManager from '../diplomacy/diplomacy-manager.js';
import '../../../core/ui/framework.chunk.js';
import '../../../core/ui/context-manager/display-queue-manager.js';
import '../../../core/ui/dialog-box/manager-dialog-box.chunk.js';
import '../../../core/ui/context-manager/display-handler.chunk.js';
import '../../../core/ui/input/cursor.js';
import '../../../core/ui/views/view-manager.chunk.js';
import '../../../core/ui/utilities/utilities-color.chunk.js';
import '../../../core/ui/graph-layout/utils.chunk.js';
import '../../../core/ui/utilities/utilities-image.chunk.js';
import '../../../core/ui/utilities/utilities-component-id.chunk.js';
import '../victory-progress/model-victory-progress.chunk.js';
import '../cinematic/cinematic-manager.chunk.js';
import '../endgame/screen-endgame.js';
import '../../../core/ui/navigation-tray/model-navigation-tray.chunk.js';
import '../../../core/ui/utilities/utilities-update-gate.chunk.js';
import '../../../core/ui/tooltips/tooltip-manager.js';
import '../../../core/ui/input/plot-cursor.js';
import '../end-results/end-results.js';
import '../endgame/model-endgame.js';
import '../victory-manager/victory-manager.chunk.js';
import '../world-input/world-input.js';
import '../../../core/ui/utilities/utilities-network.js';
import '../../../core/ui/shell/mp-legal/mp-legal.js';
import '../../../core/ui/events/shell-events.chunk.js';
import '../../../core/ui/utilities/utilities-liveops.js';
import '../interface-modes/support-unit-map-decoration.chunk.js';
import '../utilities/utilities-overlay.chunk.js';

//LOOGIE ADDON
import { Leu_ColoredIdeologies, Leu_TeamIdeologies } from 'fs://game/leugi-diploribbon-tweaks/core/settings.js';
//LOOGIE ADDON

const styles = "fs://game/base-standard/ui/diplo-ribbon/panel-diplo-ribbon.css";

class DiploFakeContext extends Panel {
}
Controls.define("panel-diplo-ribbon-fake", {
  createInstance: DiploFakeContext,
  description: "Placeholder for edit mode of diplo ribbon."
});
class PanelDiploRibbon extends Panel {
  numLeadersToShow = 5;
  panArrows = false;
  // Necessary to use arrows to pan shown leader ribbons?
  activeDeviceTypeListener = this.onActiveDeviceTypeChanged.bind(this);
  interfaceModeChangedListener = this.onInterfaceModeChanged.bind(this);
  inputContextChangedListener = this.onInputContextChanged.bind(this);
  userOptionChangedListener = this.onUserOptionChanged.bind(this);
  attributePointsUpdatedListener = this.onAttributePointsUpdated.bind(this);
  engineInputListener = this.onEngineInput.bind(this);
  navigateInputListener = this.onNavigateInput.bind(this);
  yieldsItemListener = this.onShowPlayerYieldReport.bind(this);
  leadersLeftListener = this.scrollLeadersLeft.bind(this);
  leadersRightListener = this.scrollLeadersRight.bind(this);
  windowResizeListener = this.onWindowResize.bind(this);
  refreshDataListener = this.onModelUpdate.bind(this);
  bannerUpdateListener = this.onUpdateBanners.bind(this);
  civFlagEngineInputListener = this.onCivFlagEngineInput.bind(this);
  engineCaptureAllInputListener = this.onEngineCaptureAllInput.bind(this);
  mainContainer = document.createElement("fxs-hslot");
  toggleNavHelp = document.createElement("fxs-nav-help");
  navHelpLeft = document.createElement("fxs-nav-help");
  navHelpRight = document.createElement("fxs-nav-help");
  isHoverAll = false;
  topContainer = null;
  civFlagFlexboxPartOne = null;
  toggleNavHelpContainer;
  diploContainer = null;
  attributeButton = null;
  diploRibbons = [];
  firstLeaderIndex = 0;
  constructor(root) {
    super(root);
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS")) {
      this.animateInType = this.animateOutType = AnchorType.RelativeToTop;
    } else {
      this.animateInType = this.animateOutType = AnchorType.RelativeToTopRight;
    }
  }
  onInitialize() {
    this.topContainer = document.createElement("fxs-vslot");
    this.topContainer.classList.value = "justify-end";
    this.diploContainer = document.createElement("div");
    this.diploContainer.classList.add("diplo-ribbon__ribbon-container");
    this.mainContainer.classList.add("diplo-ribbon-nav-target");
    this.diploContainer.appendChild(this.mainContainer);
    this.topContainer.appendChild(this.diploContainer);
    this.Root.appendChild(this.topContainer);
    this.toggleNavHelpContainer = document.createElement("div");
    this.toggleNavHelpContainer.classList.add(
      "absolute",
      "top-0",
      "left-0",
      "ml-1",
      "diplo-ribbon-toggle__nav-help"
    );
    this.Root.appendChild(this.toggleNavHelpContainer);
    this.firstLeaderIndex = UI.getDiploRibbonIndex();
  }
  onAttach() {
    super.onAttach();
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_PEACE_DEAL") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
      return;
    } else if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS")) {
      this.Root.classList.add("diplomacy-dialog-ribbon");
    } else if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
      if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
        return;
      } else {
        if (DiplomacyManager.selectedPlayerID == GameContext.localPlayerID) {
          this.Root.classList.add("local-player-diplomacy-hub-ribbon");
        } else {
          this.Root.classList.add("other-player-diplomacy-hub-ribbon");
        }
      }
    }
    window.addEventListener(ActiveDeviceTypeChangedEventName, this.activeDeviceTypeListener);
    window.addEventListener("engine-input", this.engineCaptureAllInputListener, true);
    window.addEventListener("interface-mode-changed", this.interfaceModeChangedListener);
    window.addEventListener("resize", this.windowResizeListener);
    window.addEventListener("update-diplo-ribbon", this.bannerUpdateListener);
    engine.on("AttributePointsChanged", this.attributePointsUpdatedListener);
    engine.on("AttributeNodeCompleted", this.attributePointsUpdatedListener);
    engine.on("InputContextChanged", this.inputContextChangedListener);
    engine.on("UI_OptionsChanged", this.userOptionChangedListener);
    waitForLayout(() => {
      if (this.Root.isConnected) {
        this.populateFlags();
        DiploRibbonData.eventNotificationRefresh.on(this.refreshDataListener);
        this.realizeNavHelp();
      }
    });
  }
  onDetach() {
    UI.setDiploRibbonIndex(this.firstLeaderIndex);
    window.removeEventListener("update-diplo-ribbon", this.bannerUpdateListener);
    window.removeEventListener("resize", this.windowResizeListener);
    window.removeEventListener("interface-mode-changed", this.interfaceModeChangedListener);
    window.removeEventListener("engine-input", this.engineCaptureAllInputListener, true);
    window.removeEventListener(ActiveDeviceTypeChangedEventName, this.activeDeviceTypeListener);
    engine.off("UI_OptionsChanged", this.userOptionChangedListener);
    engine.off("AttributePointsChanged", this.attributePointsUpdatedListener);
    engine.off("AttributeNodeCompleted", this.attributePointsUpdatedListener);
    engine.off("InputContextChanged", this.inputContextChangedListener);
    DiploRibbonData.eventNotificationRefresh.off(this.refreshDataListener);
    super.onDetach();
  }
  /**
   * Is the diplomacy ribbon in a state where it can take focus from a gamepad?
   * @returns
   */
  canTakeGamepadFocus() {
    let isFocusable = ActionHandler.isGamepadActive;
    if (isFocusable) {
      const alwaysShow = DiploRibbonData.areRibbonYieldsStuckOnScreen;
      if (alwaysShow && !this.panArrows) {
        isFocusable = false;
      }
    }
    return isFocusable;
  }
  realizeNavHelp() {
    const isShowing = this.canTakeGamepadFocus();
    if (isShowing) {
      this.toggleNavHelpContainer.classList.remove("hidden");
    } else {
      this.toggleNavHelpContainer.classList.add("hidden");
    }
  }
  onActiveDeviceTypeChanged(event) {
    if ([InputDeviceType.Controller, InputDeviceType.Hybrid].includes(event.detail.deviceType)) {
      this.realizeNavHelp();
    }
  }
  onWindowResize() {
    waitForLayout(() => {
      this.populateFlags();
    });
  }
  populateFlags() {
    const isMobileViewExperience = UI.getViewExperience() == UIViewExperience.Mobile;
    if (InterfaceMode.getCurrent() == "INTERFACEMODE_DIPLOMACY_PROJECT_REACTION" || InterfaceMode.getCurrent() == "INTERFACEMODE_DIPLOMACY_DIALOG" || InterfaceMode.getCurrent() == "INTERFACEMODE_CALL_TO_ARMS") {
      this.Root.classList.remove("right-24");
    } else {
      this.Root.classList.add("right-24");
    }
    if (!this.mainContainer) {
      console.error("panel-diplo-ribbon: Unable to find mainContainer to attach flags to!");
      return;
    }
    while (this.mainContainer.hasChildNodes()) {
      this.mainContainer.removeChild(this.mainContainer.lastChild);
    }
    while (this.toggleNavHelpContainer.hasChildNodes()) {
      this.toggleNavHelpContainer.removeChild(this.toggleNavHelpContainer.firstChild);
    }
    const isDiplomacyHub = InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB");
	//LOOGIE ADDON more Icons
    this.numLeadersToShow = isDiplomacyHub ? 6 : 8;
    if (window.innerWidth >= Layout.pixelsToScreenPixels(1919) && !isMobileViewExperience) {
      this.numLeadersToShow = isDiplomacyHub ? 6 : 12;
    } else if (window.innerWidth >= Layout.pixelsToScreenPixels(1599) && !isMobileViewExperience) {
      this.numLeadersToShow = isDiplomacyHub ? 5 : 6;
    } else {
      this.numLeadersToShow = isDiplomacyHub ? 3 : 5;
    }
    this.navHelpLeft.classList.add("h-14");
    if (!isDiplomacyHub) {
      this.navHelpLeft.setAttribute("action-key", "inline-nav-previous");
      this.navHelpLeft.classList.add("opacity-0");
      this.toggleNavHelp.classList.add("w-8", "relative", "top-3", "-left-6");
      this.toggleNavHelp.setAttribute("action-key", "inline-toggle-diplo");
      this.toggleNavHelp.setAttribute("decoration-mode", "border");
      this.toggleNavHelpContainer.appendChild(this.toggleNavHelp);
    } else {
      this.navHelpLeft.setAttribute("action-key", "inline-nav-shell-previous");
    }
    this.mainContainer.appendChild(this.navHelpLeft);
    let targetArray = null;
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
      targetArray = DiploRibbonData.diploStatementPlayerData;
    } else {
      targetArray = DiploRibbonData.playerData;
    }
    const numShown = Math.min(targetArray.length, this.numLeadersToShow);
    this.diploRibbons = [];
    if (isDiplomacyHub) {
      for (let index = 0; index < targetArray.length; index++) {
        if (targetArray[index].id == DiplomacyManager.selectedPlayerID) {
          const selectedIndex = index;
          if (targetArray.length >= this.numLeadersToShow) {
            if (selectedIndex < this.numLeadersToShow - 1) {
              this.firstLeaderIndex = 0;
            } else {
              this.firstLeaderIndex = selectedIndex - (this.numLeadersToShow - 1);
            }
          }
          break;
        }
      }
    }
    const isSmall = numShown >= 7 && window.innerWidth < Layout.pixelsToScreenPixels(1919);
    if (this.diploContainer) {
      this.diploContainer.classList.toggle("diplo-ribbon__ribbon-container-small", isSmall);
      this.diploContainer.classList.toggle("diplo-ribbon__ribbon-container-hub", isDiplomacyHub);
    }
    let scrollIndex = 0;
    this.panArrows = false;
    this.firstLeaderIndex = Math.min(this.firstLeaderIndex, targetArray.length - numShown);
    if (targetArray.length > this.numLeadersToShow) {
      this.panArrows = true;
      const leftArrowBG = document.createElement("div");
      leftArrowBG.classList.add(
        "diplo-ribbon__arrow-bg",
        "w-12",
        "h-14",
        "relative",
        "align-center",
        "self-start",
        "mt-4"
      );
      const leftArrow = document.createElement("fxs-activatable");
      leftArrow.classList.add(
        "diplo-ribbon-left-arrow",
        "absolute",
        "inset-0",
        "align-center",
        "bg-no-repeat",
        "bg-cover",
        "w-12",
        "h-14",
        "self-start"
      );
      if (this.firstLeaderIndex > 0) {
        leftArrow.classList.add("img-arrow2");
      } else {
        leftArrow.classList.add("img-arrow2-disabled");
        leftArrow.setAttribute("disabled", "true");
      }
      leftArrow.addEventListener(ActionActivateEventName, this.leadersLeftListener);
      leftArrowBG.appendChild(leftArrow);
      this.mainContainer.appendChild(leftArrowBG);
      scrollIndex = this.firstLeaderIndex;
    }
    this.toggleNavHelpContainer.classList.toggle("left-44", isSmall);
    if (this.panArrows) {
      this.toggleNavHelpContainer.classList.toggle("left-16", !isSmall);
    } else {
      this.toggleNavHelpContainer.classList.toggle("left-4", !isSmall);
      if (DiploRibbonData.areRibbonYieldsStuckOnScreen) {
        this.toggleNavHelpContainer.classList.add("hidden");
      }
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
      civFlagContainer.classList.toggle("show-on-hover", !DiploRibbonData.areRibbonYieldsStuckOnScreen);
      civFlagContainer.classList.toggle("local-player", player.id == GameContext.localPlayerID);
      civFlagContainer.classList.toggle("hidden", cardIndex < scrollIndex || cardIndex >= scrollIndex + numShown);
      civFlagContainer.classList.toggle("diplo-ribbon__outer_small", !isDiplomacyHub);
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
      civFlagContainer.addEventListener("engine-input", this.civFlagEngineInputListener);
      this.diploRibbons[cardIndex] = civFlagContainer;
      const civFlagContent = document.createElement("div");
      civFlagContent.classList.add("diplo-ribbon_content-container");
      const diploMainBGContainer = document.createElement("div");
      diploMainBGContainer.classList.value = "diplo-ribbon__bg-container absolute w-24 h-full top-4 pointer-events-auto group";
      civFlagContent.appendChild(diploMainBGContainer);
      const diploMainBG = document.createElement("div");
      diploMainBG.classList.value = "diplo-ribbon__bg absolute inset-0";
      diploMainBGContainer.appendChild(diploMainBG);
      const bgHighlight = document.createElement("div");
      bgHighlight.classList.value = "diplo-ribbon__bg-highlight absolute inset-0";
      diploMainBGContainer.appendChild(bgHighlight);
      const diploTokens = document.createElement("div");
      diploTokens.classList.add("diplo-ribbon__tokens");
      this.civFlagFlexboxPartOne = diploTokens;
      civFlagContent.appendChild(diploTokens);
      const civLeaderTopBG = document.createElement("div");
      const playerConfig = Configuration.getPlayer(player.id);
      //LOOGIE ADDON
	  civLeaderTopBG.classList.value = 'diplo-ribbon__upper-bg absolute top-3 w-16 h-36 flex flex-col items-center pointer-events-none';
	  civLeaderTopBG.setAttribute("ideology-already-added", "none");
			civLeaderTopBG.style.transform = `translateY(2px)`;
			if (player.id === GameContext.localPlayerID) {
				civLeaderTopBG.style.transform = `translateX(1px); translateY (2px)`;
			}
            civLeaderTopBG.innerHTML = `
				<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
				<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
				<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
				<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.1rem"></div>
			`;
            if (player.isAtWar) {
			civLeaderTopBG.innerHTML = `
				<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
				<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
				<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
				<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
			`;	
			}
	  //LOOGIE ADDON
	  if (Configuration.getGame().isNetworkMultiplayer && Game.Diplomacy.hasTeammate(player.id)) {

		civLeaderTopBG.innerHTML = `
				<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
				<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
				<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
				<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
					<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_team.png'); fxs-background-image-tint: ${multiplayerTeamColors[playerConfig.team + 1]}"></div>
					<div class="diplo-ribbon__team-text relative font-body-base text-white top-3" style="font-size: 0.75rem">${(playerConfig.team + 1).toString()}</div>
				`;
      } else {
		if (Leu_TeamIdeologies.ShowChevron == true) {
			 if (player.religionIdeology) {
				 
				
				if (player.religionIdeology.type == "IDEOLOGY_DEMOCRACY") {
					civLeaderTopBG.setAttribute("ideology-already-added", "democracy");
					civLeaderTopBG.innerHTML = `
					<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
					<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
					<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
					<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
						<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_ideology_lib.png'); fxs-background-image-tint:'#ffffff' "></div>						
					`;
				}
				if (player.religionIdeology.type == "IDEOLOGY_COMMUNISM") {
					civLeaderTopBG.setAttribute("ideology-already-added", "communism");
					civLeaderTopBG.innerHTML = `
					<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
					<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
					<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
					<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
						<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_ideology_comm.png'); fxs-background-image-tint:'#ffffff' "></div>						
					`;
				}
				if (player.religionIdeology.type == "IDEOLOGY_FASCISM") {
					civLeaderTopBG.setAttribute("ideology-already-added", "fascism");
					civLeaderTopBG.innerHTML = `
					<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
					<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
					<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
					<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
						<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_ideology_fasc.png'); fxs-background-image-tint:'#ffffff' "></div>						
					`;
				}
			}
		}
	  }
	  //LOOGIE ADDON
      this.civFlagFlexboxPartOne.appendChild(civLeaderTopBG);
      const civLeader = document.createElement("fxs-activatable");
      civLeader.classList.add("diplo-ribbon__portrait");
      civLeader.setAttribute("data-tut-highlight", "founderHighlight");
      civLeader.setAttribute("data-audio-group-ref", "audio-panel-diplo-ribbon");
      civLeader.setAttribute("data-audio-focus-ref", "none");
      civLeader.setAttribute("data-player-id", player.id.toString());
      const civLeaderHexBGShadow = document.createElement("div");
      civLeaderHexBGShadow.classList.value = "diplo-ribbon__portrait-hex-bg-shadow bg-contain bg-center bg-no-repeat inset-0 absolute";
      civLeader.appendChild(civLeaderHexBGShadow);
      const civLeaderHexBG = document.createElement("div");
      civLeaderHexBG.classList.value = "diplo-ribbon__portrait-hex-bg bg-contain bg-center bg-no-repeat inset-0 absolute";
      civLeader.appendChild(civLeaderHexBG);
      const civLeaderHexBGFrame = document.createElement("div");
      civLeaderHexBGFrame.classList.value = "diplo-ribbon__portrait-hex-bg-frame bg-contain bg-center bg-no-repeat inset-0 absolute";
      civLeader.appendChild(civLeaderHexBGFrame);
      const civLeaderHitbox = document.createElement("div");
      civLeaderHitbox.classList.add("diplo-ribbon__portrait-hitbox");
      civLeaderHitbox.setAttribute("data-tooltip-content", player.name);
      civLeader.appendChild(civLeaderHitbox);
      const portrait = document.createElement("fxs-icon");
      portrait.classList.value = "diplo-ribbon__portrait-image absolute size-26 -left-2\\.5";
      portrait.setAttribute("data-icon-id", player.leaderType);
      portrait.setAttribute("data-icon-context", player.portraitContext);
      portrait.classList.toggle("turn-active", player.isTurnActive);
      portrait.classList.toggle("-scale-x-100", player.id != GameContext.localPlayerID);
      civLeader.appendChild(portrait);
      const relationContainer = document.createElement("div");
      relationContainer.classList.add("diplo-ribbon__relation-container");
      const relationshipIcon = document.createElement("fxs-activatable");
      relationshipIcon.classList.value = "relationship-icon relative bg-contain bg-center bg-no-repeat pointer-events-auto self-center w-18 h-9";
      relationshipIcon.classList.toggle("hidden", player.relationshipIcon == "");
      relationshipIcon.style.backgroundImage = `url('${player.relationshipIcon}')`;
      relationshipIcon.setAttribute("data-player-id", player.id.toString());
      if (!isMobileViewExperience) {
        relationshipIcon.setAttribute("data-tooltip-style", "relationship");
      }
      relationContainer.appendChild(relationshipIcon);
      relationshipIcon.addEventListener("action-activate", (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          const playerID = target.getAttribute("data-player-id");
          if (!playerID) {
            return;
          }
          const playerIDInt = Number.parseInt(playerID);
          if (isNaN(playerIDInt) || playerIDInt == PlayerIds.NO_PLAYER) {
            console.error(
              "panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + playerID + ") during action-activate callback."
            );
            return;
          }
          DiploRibbonData.sectionSelected = {
            playerId: playerIDInt,
            section: "relationship"
          };
        }
        civLeader.dispatchEvent(new ActionActivateEvent(event.detail.x, event.detail.y));
      });
      const warSupport = document.createElement("div");
		// LOOGIE ADDON
            warSupport.classList.value = "diplo-ribbon__war-support-count relative bg-contain bg-center bg-no-repeat pointer-events-auto self-center top-1 w-12 h-5 flex justify-center items-center font-base text-2xs mt-1\\.25 -ml-px w-12 h-6\\.5";
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
		// LOOGIE ADDON
	  relationContainer.appendChild(warSupport);
      civLeader.appendChild(relationContainer);
      civLeader.addEventListener("focus", (event) => {
        this.mainContainer.classList.add("cards-focused");
        this.displayRibbonDetails(event.target);
      });
      civLeader.addEventListener("blur", (event) => {
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
              console.error(
                "panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during action-activate callback."
              );
              return;
            }
            const notificationIDs = Game.Notifications.getIdsForPlayer(
              GameContext.localPlayerID
            );
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
            window.dispatchEvent(new RaiseDiplomacyEvent(targetIDInt));
            if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
              window.dispatchEvent(new UpdateDiploRibbonEvent());
            }
          }
          if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
            if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
              return;
            } else {
              if (DiplomacyManager.selectedPlayerID == GameContext.localPlayerID) {
                this.Root.classList.add("local-player-diplomacy-hub-ribbon");
                this.Root.classList.remove("other-player-diplomacy-hub-ribbon");
              } else {
                this.Root.classList.add("other-player-diplomacy-hub-ribbon");
                this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
              }
            }
          }
        }
      });
      this.civFlagFlexboxPartOne.appendChild(civLeader);
      const civFlagYieldFlex = document.createElement("div");
	  //there was also a change here LOOGIE
      civFlagYieldFlex.classList.value = "diplo-ribbon__yields top-6 flow-column items-stretch relative px-1 mt-14 mb-5";
      for (let yieldIndex = 0; yieldIndex < player.displayItems.length; yieldIndex++) {
        const yieldData = player.displayItems[yieldIndex];
        const yieldItem = document.createElement("fxs-activatable");
        yieldItem.classList.add("yield-item", "flow-row", "items-center", "pointer-events-auto");
        yieldItem.classList.toggle("font-title-sm", isMobileViewExperience);
        yieldItem.classList.toggle("font-title-base", !isMobileViewExperience);
        yieldItem.classList.toggle("tint-bg", yieldIndex % 2 == 0);
        yieldItem.classList.toggle("last", yieldIndex == player.displayItems.length - 1);
        yieldItem.classList.add(`yield-colors--${yieldData.type}`);
        yieldItem.setAttribute("data-tooltip-content", yieldData.label);
        yieldItem.addEventListener("action-activate", this.yieldsItemListener);
        const yieldLabel = document.createElement("div");
        yieldLabel.classList.add("flow-column", "flex-auto", "justify-center", "yield-label");
        yieldLabel.innerHTML = yieldData.img;
        yieldItem.appendChild(yieldLabel);
        const yieldValue = document.createElement("div");
        yieldValue.classList.add("yield-value");
        yieldValue.setAttribute("data-l10n-id", yieldData.value.toString());
        yieldValue.setAttribute("data-tooltip-content", yieldData.details);
        yieldItem.classList.add(`text-yield-${yieldData.type}`);
        yieldItem.classList.add(`group-hover: opactiy-50`);
        yieldItem.appendChild(yieldValue);
        civFlagYieldFlex.appendChild(yieldItem);
      }
      civFlagContent.appendChild(civFlagYieldFlex);
      // LOOGIE ADDON; adding the little frame to Religions and Ideologies
      const religionSection = document.createElement("div");
	  religionSection.classList.add(
        "diplo-ribbon__religionICON",
        "bg-cover",
		"bg-center",
        "bg-no-repeat",
        "bg-contain",
        "relative",
		"top-1",
        "size-9",
        "pointer-events-auto"
      );
      civFlagContent.appendChild(religionSection);
	  if (player.religionIdeology) {
        religionSection.style.backgroundImage = `url('${'fs://game/leugi-diploribbon-tweaks/Icons/leu_religiologycontainer.png'}')`;
		
      }
	  const religionSectionBG = document.createElement("div");
	  if ( Game.age == Game.getHash("AGE_EXPLORATION") ) {
		religionSectionBG.classList.add(
			"diplo-ribbon__religion",
			"bg-cover",
			"bg-center",
			"bg-no-repeat",
			"absolute",
			"top-1",
			"self-center",
			"size-6",
			"pointer-events-auto"
		);
	  } else {
		religionSectionBG.classList.add(
			"diplo-ribbon__religion",
			"bg-cover",
			"bg-center",
			"bg-no-repeat",
			"absolute",
			"top-1",
			"self-center",
			"size-7",
			"pointer-events-auto"
		);  
	  }
      religionSection.appendChild(religionSectionBG);
	  if (player.religionIdeology) {
        religionSectionBG.style.backgroundImage = `url('${player.religionIdeology.icon}')`;
		// IdeologyColor
		if (Leu_ColoredIdeologies.IsColored == true) {
		const localPlayer = Players.get(GameContext.localPlayerID);
		if (!localPlayer) {
			console.error(
				`model-diplo-ribbon: Failed to retrieve PlayerLibrary for Player ${GameContext.localPlayerID}`
			);
		}
		if (localPlayer.id == player.id) {
		religionSectionBG.style.fxsBackgroundImageTint =  "#6bbf52" /* SameReligionIdeology */;
		} else if (localPlayer.Culture) {
			const ideology = GameInfo.Ideologies.lookup(localPlayer.Culture.getChosenIdeology());
			if (ideology?.IdeologyType && ideology.IdeologyType != player.religionIdeology.type) {
				religionSectionBG.style.fxsBackgroundImageTint =  "#b75068" /* RivalReligionIdeology */;
			} else {
				religionSectionBG.style.fxsBackgroundImageTint =  "#6bbf52" /* SameReligionIdeology */;
			
		}
		} 
		if ( Game.age == Game.getHash("AGE_EXPLORATION") ) {
			religionSectionBG.style.fxsBackgroundImageTint =  "#ffffff" /* General Religion Color */;
		}
		// IdeologyColor
	}
	    religionSectionBG.setAttribute("data-tooltip-content", player.religionIdeology.name);
      }
	  // LOOGIE ADDON; adding the little frame to Religions and Ideologies
      civFlagContainer.appendChild(civFlagContent);
      this.mainContainer.appendChild(civFlagContainer);
    }
    if (targetArray.length > this.numLeadersToShow) {
      const rightArrowBG = document.createElement("div");
      rightArrowBG.classList.add(
        "diplo-ribbon__arrow-bg",
        "w-12",
        "h-14",
        "relative",
        "align-center",
        "self-start",
        "mt-4"
      );
      rightArrowBG.classList.toggle("diplo-ribbon__arrow-bg-right", !isDiplomacyHub);
      rightArrowBG.classList.toggle("diplo-hub-ribbon__arrow-bg-right", isDiplomacyHub);
      const rightArrow = document.createElement("fxs-activatable");
      rightArrow.classList.add(
        "diplo-ribbon-right-arrow",
        "absolute",
        "inset-0",
        "align-center",
        "bg-no-repeat",
        "bg-cover",
        "w-12",
        "h-14",
        "self-start",
        "-scale-x-100"
      );
      if (this.firstLeaderIndex < targetArray.length - this.numLeadersToShow) {
        rightArrow.classList.add("img-arrow2");
      } else {
        rightArrow.classList.add("img-arrow2-disabled");
        rightArrow.setAttribute("disabled", "true");
      }
      rightArrow.classList.toggle(
        "cursor-not-allowed",
        this.firstLeaderIndex >= targetArray.length - this.numLeadersToShow
      );
      rightArrow.classList.toggle(
        "cursor-pointer",
        this.firstLeaderIndex < targetArray.length - this.numLeadersToShow
      );
      rightArrow.addEventListener(ActionActivateEventName, this.leadersRightListener);
      rightArrowBG.appendChild(rightArrow);
      this.mainContainer.appendChild(rightArrowBG);
    }
    this.navHelpRight = document.createElement("fxs-nav-help");
    this.navHelpRight.classList.add("h-16", "diplo-hub-ribbon-right-arrow__nav-help");
    if (!isDiplomacyHub) {
      this.navHelpRight.classList.add("opacity-0", "diplo-ribbon-right-arrow__nav-help");
      this.navHelpRight.setAttribute("action-key", "inline-nav-next");
    } else {
      this.navHelpRight.setAttribute("action-key", "inline-nav-shell-next");
    }
    this.mainContainer.appendChild(this.navHelpRight);
    if (isDiplomacyHub) {
      this.Root.addEventListener(NavigateInputEventName, this.navigateInputListener);
    } else {
      this.Root.removeEventListener(NavigateInputEventName, this.navigateInputListener);
    }
    this.attachAttributeButton();
  }
  onModelUpdate() {
    let targetArray = null;
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
      targetArray = DiploRibbonData.diploStatementPlayerData;
    } else {
      targetArray = DiploRibbonData.playerData;
    }
    if (targetArray.length != this.diploRibbons.length) {
      this.populateFlags();
      return;
    }
    const availablePortraits = [];
    const leaderPortraits = this.Root.getElementsByClassName("diplo-ribbon__portrait");
    for (let numportraits = 0; numportraits < leaderPortraits.length; numportraits++) {
      if (leaderPortraits[numportraits].hasAttribute("data-player-id")) {
        availablePortraits.push({
          key: leaderPortraits[numportraits].getAttribute("data-player-id"),
          value: leaderPortraits[numportraits]
        });
      }
    }
    const availableFlags = [];
    const flags = this.Root.getElementsByClassName("diplo-ribbon-outer");
    for (let numflags = 0; numflags < flags.length; numflags++) {
      if (flags[numflags].hasAttribute("data-player-id")) {
        availableFlags.push({ key: flags[numflags].getAttribute("data-player-id"), value: flags[numflags] });
      }
    }
    const availableWarSupport = [];
    const warSupport = this.Root.getElementsByClassName(
      "diplo-ribbon__war-support-count"
    );
    for (let numsupport = 0; numsupport < flags.length; numsupport++) {
      if (warSupport[numsupport].hasAttribute("data-player-id")) {
        availableWarSupport.push({
          key: warSupport[numsupport].getAttribute("data-player-id"),
          value: warSupport[numsupport]
        });
      }
    }
    const availableRelationshipIcons = [];
    const relationshipIcon = this.Root.getElementsByClassName("relationship-icon");
    for (let numicons = 0; numicons < flags.length; numicons++) {
      if (relationshipIcon[numicons].hasAttribute("data-player-id")) {
        availableRelationshipIcons.push({
          key: relationshipIcon[numicons].getAttribute("data-player-id"),
          value: relationshipIcon[numicons]
        });
      }
    }
    let scrollIndex = 0;
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
      this.diploRibbons[cardIndex].classList.toggle(
        "show-on-hover",
        !DiploRibbonData.areRibbonYieldsStuckOnScreen
      );
      const portrait = MustGetElement(".diplo-ribbon__portrait-image", this.diploRibbons[cardIndex]);
      portrait.classList.toggle("turn-active", player.isTurnActive);
      portrait.setAttribute("data-icon-id", player.leaderType);
      portrait.setAttribute("data-icon-context", player.portraitContext);
      const relationshipIcon2 = MustGetElement(".relationship-icon", this.diploRibbons[cardIndex]);
      relationshipIcon2.classList.toggle("hidden", player.relationshipIcon == "");
      relationshipIcon2.style.backgroundImage = `url('${player.relationshipIcon}')`;
      const warSupport2 = MustGetElement(".diplo-ribbon__war-support-count", this.diploRibbons[cardIndex]);
      warSupport2.classList.toggle("hidden", !player.isAtWar);
      warSupport2.classList.toggle("positive", player.warSupport > 0);
      warSupport2.classList.toggle("negative", player.warSupport < 0);

	  //LOOGIE ADDON
	  const civbanner = MustGetElement(".diplo-ribbon__upper-bg", this.diploRibbons[cardIndex]);
	   if (Leu_TeamIdeologies.ShowChevron == true) {
			 if (player.religionIdeology) {
				 const isAdded = civbanner.getAttribute("ideology-already-added");
				 if (isAdded == "none") {
				 
				if (player.religionIdeology.type == "IDEOLOGY_DEMOCRACY") {
					civbanner.setAttribute("ideology-already-added", "democracy");
				 
					civbanner.innerHTML = `
					<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
					<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
					<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
					<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
						<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_ideology_lib.png'); fxs-background-image-tint:'#ffffff' "></div>						
					`;
				}
				if (player.religionIdeology.type == "IDEOLOGY_COMMUNISM") {
					civbanner.setAttribute("ideology-already-added", "communism");
					
					civbanner.innerHTML = `
					<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
					<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
					<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
					<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
						<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_ideology_comm.png'); fxs-background-image-tint:'#ffffff' "></div>						
					`;
				}
				if (player.religionIdeology.type == "IDEOLOGY_FASCISM") {
					civbanner.setAttribute("ideology-already-added", "fascism");
					
					civbanner.innerHTML = `
					<div class="diplo-ribbon__front-banner absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner.png'); fxs-border-image-tint: var(--player-color-primary); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem"></div>
					<div class="diplo-ribbon__front-banner-shadow absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_highlights.png'); border-image-slice: 7 4 9 2 fill;	border-image-width: 0.3888888889rem 0.2222222222rem 0.5rem 0.1111111111rem; opacity: 1"></div>
					<div class="diplo-ribbon__front-banner-overlay absolute inset-0" style="border-image-source: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_shadow.png'); fxs-border-image-tint: var(--player-color-primary-more); border-image-slice: 14 11 16 9 fill; border-image-width: 0.7777777778rem 0.6111111111rem 0.8888888889rem 0.5rem; opacity: 0.75"></div>
					<div class="diplo-ribbon__symbol bg-contain bg-center bg-no-repeat relative mt-16 w-11 h-11" style="background-image: url('${player.civSymbol}'); top: 0.2rem"></div>
						<div class="diplo-ribbon__team-overlay bg-cob bg-center bg-no-repeat relative" style="background-image: url('fs://game/leugi-diploribbon-tweaks/game/leugi_hud_frontbanner_ideology_fasc.png'); fxs-background-image-tint:'#ffffff' "></div>						
					`;
				}
				
				}
			}
		}
	  
	  //LOOGIE ADDON

	  if (player.religionIdeology) {
        const religionSection = MustGetElement(".diplo-ribbon__religionICON", this.diploRibbons[cardIndex]);
		// LOOGIE ADDON
		religionSection.style.backgroundImage = `url('${'fs://game/leugi-diploribbon-tweaks/Icons/leu_religiologycontainer.png'}')`;
		const religionSectionBG = MustGetElement(".diplo-ribbon__religion", this.diploRibbons[cardIndex]);
		religionSectionBG.style.backgroundImage = `url('${player.religionIdeology.icon}')`;
        religionSectionBG.setAttribute("data-tooltip-content", player.religionIdeology.name);
		
		// IdeologyColor
		if (Leu_ColoredIdeologies.IsColored == true) {
			const localPlayer = Players.get(GameContext.localPlayerID);
			if (!localPlayer) {
				console.error(
					`model-diplo-ribbon: Failed to retrieve PlayerLibrary for Player ${GameContext.localPlayerID}`
				);
			}
			if (localPlayer.id == player.id) {
				religionSectionBG.style.fxsBackgroundImageTint =  "#6bbf52" /* SameReligionIdeology */;
			} else if (localPlayer.Culture) {
				const ideology = GameInfo.Ideologies.lookup(localPlayer.Culture.getChosenIdeology());
				if (ideology?.IdeologyType && ideology.IdeologyType != player.religionIdeology.type) {
					religionSectionBG.style.fxsBackgroundImageTint =  "#b75068" /* RivalReligionIdeology */;
				} else {
				religionSectionBG.style.fxsBackgroundImageTint =  "#6bbf52" /* SameReligionIdeology */;
				}
			} 
			if ( Game.age == Game.getHash("AGE_EXPLORATION") ) {
				religionSectionBG.style.fxsBackgroundImageTint =  "#ffffff" /* General Religion Color */;
			}
		}
		// IdeologyColor
		
		
		// LOOGIE ADDON
      }
      for (let numflags = 0; numflags < availablePortraits.length; numflags++) {
        if (availablePortraits[numflags].key == targetArray[cardIndex].id.toString()) {
          const currentPortait = availablePortraits[numflags];
          currentPortait.value.classList.toggle("can-click-leader-icon", targetArray[cardIndex].canClick);
          currentPortait.value.classList.toggle("selected", targetArray[cardIndex].selected);
          currentPortait.value.classList.toggle(
            "local-player",
            targetArray[cardIndex].id == GameContext.localPlayerID
          );
          currentPortait.value.classList.toggle("turn-active", player.isTurnActive);
          const currentFlag = availableFlags[numflags];
          currentFlag.value.classList.toggle("can-click-leader-icon", targetArray[cardIndex].canClick);
          //currentFlag.value.classList.toggle(
          // "primary-color-is-lighter",
          //  targetArray[cardIndex].isPrimaryLighter
          //);
          currentFlag.value.classList.toggle("show-on-hover", !DiploRibbonData.areRibbonYieldsStuckOnScreen);
          currentFlag.value.classList.toggle(
            "local-player",
            targetArray[cardIndex].id == GameContext.localPlayerID
          );
          currentFlag.value.classList.toggle(
            "hidden",
            cardIndex < scrollIndex || cardIndex >= scrollIndex + numShown
          );
          currentFlag.value.classList.toggle("diplo-ribbon__outer_small", !inHub);
         // LOOGIE ADDON
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
		
					
		// LOOGIE ADDON
		currentWarSupport.value.setAttribute("data-l10n-id", targetArray[cardIndex].warSupport.toString());
          const currentRelationshipIcon = availableRelationshipIcons[numflags];
          currentRelationshipIcon.value.classList.toggle("hidden", !targetArray[cardIndex].isAtWar);
          currentRelationshipIcon.value.classList.toggle(
            "hidden",
            targetArray[cardIndex].relationshipIcon == ""
          );
          currentRelationshipIcon.value.setAttribute(
            "data-bg-image",
            `url('${targetArray[cardIndex].relationshipIcon}')`
          );
        }
      }
      const civFlagYieldFlex = MustGetElement(".diplo-ribbon__yields", this.diploRibbons[cardIndex]);
      for (let yieldIndex = 0; yieldIndex < player.displayItems.length; yieldIndex++) {
        const y = player.displayItems[yieldIndex];
        const yieldItem = civFlagYieldFlex.children[yieldIndex];
        if (!yieldItem) {
          console.error(
            `panel-diplo-ribbon: onModelUpdate() - could not find child for civFlagYieldFlex at index ${yieldIndex}.`
          );
          console.error(
            `    civFlagYieldFlex has ${civFlagYieldFlex.children.length} children, while ${Locale.compose(player.civName)} has ${player.displayItems.length} display items.`
          );
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
      } else {
        this.Root.classList.toggle(
          "local-player-diplomacy-hub-ribbon",
          DiplomacyManager.selectedPlayerID == GameContext.localPlayerID
        );
        this.Root.classList.toggle(
          "other-player-diplomacy-hub-ribbon",
          DiplomacyManager.selectedPlayerID != GameContext.localPlayerID
        );
      }
    }
  }
  /**
   * TODO: Move this check as a method off of the Diplomacy Manager so it can return true for any variety of modes.
   * @returns If showing the ribbon as part of the diplomacy mdoe.
   */
  isInDiplomacyMode() {
    return InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS");
  }
  /**
   * Update the banners.
   * This may occur for a variety of events such as being toggled, scrolled, etc...
   */
  onUpdateBanners(_event) {
    if (DiploRibbonData.userDiploRibbonsToggled) {
      const isDiplomacyHub = this.isInDiplomacyMode();
      if (!isDiplomacyHub) {
        Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
        if (DiploRibbonData.areRibbonYieldsStuckOnScreen && !this.panArrows) {
          return;
        }
        Input.setActiveContext(InputContext.Dual);
        FocusManager.setFocus(this.mainContainer);
        this.mainContainer.addEventListener(NavigateInputEventName, this.navigateInputListener);
        this.Root.addEventListener(InputEngineEventName, this.engineInputListener);
        ContextManager.push("panel-diplo-ribbon-fake");
        this.toggleNavHelp.setAttribute("action-key", "inline-nav-up");
        if (this.panArrows) {
          this.navHelpLeft.classList.remove("opacity-0");
          this.navHelpRight.classList.remove("opacity-0");
        }
      }
    } else {
      Audio.playSound("data-audio-unfocus", "audio-panel-diplo-ribbon");
    }
    if (!DiploRibbonData.userDiploRibbonsToggled && !FocusManager.isWorldFocused()) {
      const curTarget = ContextManager.getCurrentTarget();
      if (!curTarget || curTarget && curTarget.localName != "PANEL-DIPLO-RIBBON-FAKE") {
        return;
      }
      Input.setActiveContext(InputContext.World);
      FocusManager.SetWorldFocused();
      this.mainContainer.removeEventListener(NavigateInputEventName, this.navigateInputListener);
      this.Root.removeEventListener(InputEngineEventName, this.engineInputListener);
      ContextManager.pop("panel-diplo-ribbon-fake");
      this.toggleNavHelp.setAttribute("action-key", "inline-toggle-diplo");
      this.navHelpLeft.classList.add("opacity-0");
      this.navHelpRight.classList.add("opacity-0");
    }
    const radialDock = document.getElementsByClassName("panel-radial-dock");
    if (radialDock && radialDock[0]) {
      if (DiploRibbonData.userDiploRibbonsToggled) radialDock[0].classList.add("hidden");
      else radialDock[0].classList.remove("hidden");
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
    } else {
      targetArray = DiploRibbonData.playerData;
    }
    if (this.firstLeaderIndex < targetArray.length - this.numLeadersToShow) {
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
    } else {
      targetArray = DiploRibbonData.playerData;
    }
    for (let index = 0; index < targetArray.length; index++) {
      this.diploRibbons[index].classList.toggle(
        "hidden",
        index < this.firstLeaderIndex || index >= this.firstLeaderIndex + this.numLeadersToShow
      );
    }
    leftArrow.classList.toggle("img-arrow2", this.firstLeaderIndex > 0);
    leftArrow.classList.toggle("img-arrow2-disabled", this.firstLeaderIndex == 0);
    if (this.navHelpLeft) {
      this.navHelpLeft.classList.toggle("opacity-0", this.firstLeaderIndex == 0);
    }
    if (this.firstLeaderIndex > 0) {
      leftArrow.removeAttribute("disabled");
    } else {
      leftArrow.setAttribute("disabled", "true");
    }
    rightArrow.classList.toggle("img-arrow2", this.firstLeaderIndex < targetArray.length - this.numLeadersToShow);
    rightArrow.classList.toggle(
      "img-arrow2-disabled",
      this.firstLeaderIndex >= targetArray.length - this.numLeadersToShow
    );
    if (this.navHelpRight) {
      this.navHelpRight.classList.toggle(
        "opacity-0",
        this.firstLeaderIndex >= targetArray.length - this.numLeadersToShow
      );
    }
    if (this.firstLeaderIndex < targetArray.length - this.numLeadersToShow) {
      rightArrow.removeAttribute("disabled");
    } else {
      rightArrow.setAttribute("disabled", "true");
    }
  }
  displayRibbonDetails(target) {
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
      return;
    }
    const targetID = target.getAttribute("data-player-id");
    if (targetID == null) {
      console.error(
        "panel-diplo-ribbon: Attempting to hover a leader portrait without a 'data-player-id' attribute!"
      );
      return;
    }
    const targetIDInt = Number.parseInt(targetID);
    if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
      console.error(
        "panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during hover callback."
      );
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
    this.isHoverAll = true;
    Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
  }
  hideRibbonDetails(target) {
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
      return;
    }
    const targetID = target.getAttribute("data-player-id");
    if (targetID == null) {
      console.error(
        "panel-diplo-ribbon: Attempting to un-hover a leader portrait without a 'data-player-id' attribute!"
      );
      return;
    }
    const targetIDInt = Number.parseInt(targetID);
    if (isNaN(targetIDInt) || targetIDInt == PlayerIds.NO_PLAYER) {
      console.error(
        "panel-diplo-ribbon: invalid playerID parsed from data-player-id attribute (" + targetID + ") during mouseleave callback."
      );
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
    this.isHoverAll = false;
  }
  onEngineCaptureAllInput(inputEvent) {
    if (!this.handleEngineCaptureAllInput(inputEvent)) {
      inputEvent.stopPropagation();
      inputEvent.preventDefault();
    }
  }
  handleEngineCaptureAllInput(inputEvent) {
    switch (inputEvent.detail.name) {
      case "touch-complete":
        if (this.isHoverAll) {
          const civFlagContainers = this.Root.querySelectorAll(".diplo-ribbon-outer");
          civFlagContainers.forEach((civFlagContainer) => civFlagContainer.classList.remove("hover-all"));
          this.isHoverAll = false;
        }
        return true;
    }
    return true;
  }
  onCivFlagEngineInput(inputEvent) {
    if (!this.handleCivFlagEngineInput(inputEvent)) {
      inputEvent.stopPropagation();
      inputEvent.preventDefault();
    }
  }
  handleCivFlagEngineInput(inputEvent) {
    switch (inputEvent.detail.name) {
      case "touch-press":
        if (!this.isHoverAll) {
          const civFlagContainers = this.Root.querySelectorAll(".diplo-ribbon-outer");
          civFlagContainers.forEach((civFlagContainer) => civFlagContainer.classList.add("hover-all"));
          Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
          this.isHoverAll = true;
        }
        return false;
    }
    return true;
  }
  onEngineInput(inputEvent) {
    if (inputEvent.detail.status != InputActionStatuses.FINISH) {
      return;
    }
    switch (inputEvent.detail.name) {
      case "cancel":
        DiploRibbonData.userDiploRibbonsToggled = DiploRibbonData.userDiploRibbonsToggled == RibbonStatsToggleStatus.RibbonStatsShowing ? RibbonStatsToggleStatus.RibbonStatsHidden : RibbonStatsToggleStatus.RibbonStatsShowing;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
        inputEvent.stopPropagation();
        inputEvent.preventDefault();
        break;
      case "sys-menu":
      // pause
      case "shell-action-5":
        DiploRibbonData.userDiploRibbonsToggled = DiploRibbonData.userDiploRibbonsToggled == RibbonStatsToggleStatus.RibbonStatsShowing ? RibbonStatsToggleStatus.RibbonStatsHidden : RibbonStatsToggleStatus.RibbonStatsShowing;
        window.dispatchEvent(new UpdateDiploRibbonEvent());
        break;
    }
  }
  onNavigateInput(inputEvent) {
    if (inputEvent.detail.name == "nav-left" || inputEvent.detail.name == "nav-right" || inputEvent.detail.name == "nav-move") {
      inputEvent.stopPropagation();
      inputEvent.preventDefault();
      return;
    }
    if (inputEvent.detail.status != InputActionStatuses.FINISH) {
      return;
    }
    let isDiploMode = true;
    const curTarget = ContextManager.getCurrentTarget();
    if (curTarget && curTarget.localName == "PANEL-DIPLO-RIBBON-FAKE") {
      isDiploMode = false;
    }
    if (!isDiploMode && inputEvent.detail.name == "nav-up") {
      DiploRibbonData.userDiploRibbonsToggled = DiploRibbonData.userDiploRibbonsToggled == RibbonStatsToggleStatus.RibbonStatsShowing ? RibbonStatsToggleStatus.RibbonStatsHidden : RibbonStatsToggleStatus.RibbonStatsShowing;
      window.dispatchEvent(new UpdateDiploRibbonEvent());
      Audio.playSound("data-audio-focus", "audio-panel-diplo-ribbon");
      return;
    }
    inputEvent.stopPropagation();
    inputEvent.preventDefault();
    if (inputEvent.detail.name == "nav-next" || inputEvent.detail.name == "nav-previous") {
      if (InterfaceMode.isInDefaultMode()) {
        switch (inputEvent.detail.name) {
          case "nav-next":
            this.scrollLeadersRight();
            break;
          case "nav-previous":
            this.scrollLeadersLeft();
            break;
        }
      }
    }
    if (!isDiploMode) {
      return;
    }
    let targetArray = null;
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_CALL_TO_ARMS") || InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_PROJECT_REACTION")) {
      targetArray = DiploRibbonData.diploStatementPlayerData;
    } else {
      targetArray = DiploRibbonData.playerData;
    }
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
    let scrollingRight = false;
    if (inputEvent.detail.name == "nav-shell-previous") {
      if (currentLeaderIdx > 0) {
        selectedIndex = currentLeaderIdx - 1;
      } else {
        return;
      }
    } else {
      if (currentLeaderIdx < targetArray.length - 1) {
        scrollingRight = true;
        selectedIndex = currentLeaderIdx + 1;
      } else {
        return;
      }
    }
    let nextLeader = targetArray[selectedIndex];
    if (!nextLeader.canClick) {
      if (scrollingRight) {
        for (let i = selectedIndex; i < targetArray.length - 1; i++) {
          const leader = targetArray[i];
          if (leader.canClick) {
            nextLeader = leader;
            break;
          }
        }
      } else {
        for (let i = selectedIndex; i >= 0; i--) {
          const leader = targetArray[i];
          if (leader.canClick) {
            nextLeader = leader;
            break;
          }
        }
      }
    }
    const nextLeaderId = nextLeader.id;
    window.dispatchEvent(new RaiseDiplomacyEvent(nextLeaderId));
    for (let index = 0; index < this.diploRibbons.length; index++) {
      const diploRibbon = this.diploRibbons[index];
      const civLeader = MustGetElement(".diplo-ribbon__portrait", diploRibbon);
      const idString = diploRibbon.getAttribute("data-player-id");
      const thisId = Number.parseInt(idString ? idString : "");
      civLeader.classList.toggle("selected", thisId == nextLeaderId);
    }
    if (this.diploRibbons.length >= this.numLeadersToShow) {
      if (selectedIndex < this.numLeadersToShow - 1) {
        this.firstLeaderIndex = 0;
      } else {
        this.firstLeaderIndex = selectedIndex - (this.numLeadersToShow - 1);
      }
      this.refreshRibbonVis();
    }
    if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_HUB")) {
      if (Players.get(DiplomacyManager.selectedPlayerID)?.isIndependent) {
        return;
      } else {
        if (DiplomacyManager.selectedPlayerID == GameContext.localPlayerID) {
          this.Root.classList.add("local-player-diplomacy-hub-ribbon");
          this.Root.classList.remove("other-player-diplomacy-hub-ribbon");
        } else {
          this.Root.classList.add("other-player-diplomacy-hub-ribbon");
          this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
        }
      }
    }
    window.dispatchEvent(new UpdateDiploRibbonEvent());
  }
  onShowPlayerYieldReport() {
    ContextManager.push("player-yields-report-screen", { singleton: true, createMouseGuard: true });
  }
  attachAttributeButton() {
    waitUntilValue(() => {
      return this.Root.querySelector(".diplo-ribbon__portrait.local-player");
    }).then(() => {
      const localPlayerPortrait = this.Root.querySelector(
        ".diplo-ribbon__portrait.local-player"
      );
      if (!localPlayerPortrait) {
        console.error("panel-diplo-ribbon: Unable to find diplo ribbon portrait for the local player");
        return;
      }
      this.attributeButton = document.createElement("fxs-activatable");
      this.attributeButton.classList.value = "diplo-ribbon__attribute-button -left-1 bottom-3 h-10 absolute flex items-center justify-center";
      const buttonNumber = document.createElement("div");
      buttonNumber.classList.value = "diplo-ribbon__attribute-button-number font-body text-sm mt-2 px-4";
      buttonNumber.innerHTML = "-1";
      this.attributeButton.appendChild(buttonNumber);
      const tutorialHighlight = document.createElement("div");
      tutorialHighlight.classList.value = "diplo-ribbon__attribute-button-highlight absolute inset-0";
      tutorialHighlight.setAttribute("data-tut-highlight", "founderHighlight");
      this.attributeButton.appendChild(tutorialHighlight);
      this.attributeButton.addEventListener("action-activate", this.clickAttributeButton);
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
      return;
    }
    let attributePoints = 0;
    if (localPlayer.Identity) {
      for (const attributeDef of GameInfo.Attributes) {
        attributePoints += localPlayer.Identity.getAvailableAttributePoints(attributeDef.AttributeType);
      }
    }
    if (attributePoints > 0 && !InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
      this.attributeButton.classList.remove("hidden");
    } else {
      this.attributeButton.classList.add("hidden");
      return;
    }
    const pointsNumberElement = MustGetElement(".diplo-ribbon__attribute-button-number", this.attributeButton);
    pointsNumberElement.innerHTML = attributePoints.toString();
  }
  onAttributePointsUpdated(data) {
    if (data && data.player && data.player != GameContext.localPlayerID) {
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
    } else if (InterfaceMode.isInInterfaceMode("INTERFACEMODE_DIPLOMACY_DIALOG")) {
      this.Root.classList.add("diplomacy-dialog-ribbon");
      this.Root.classList.remove("other-player-diplomacy-hub-ribbon");
      this.Root.classList.remove("local-player-diplomacy-hub-ribbon");
      this.populateFlags();
    } else {
      this.Root.classList.remove("hidden");
    }
  }
  onInputContextChanged() {
    const context = Input.getActiveContext();
    const curTarget = ContextManager.getCurrentTarget();
    if (!DiploRibbonData.userDiploRibbonsToggled) {
      if (curTarget && curTarget.localName != "PANEL-DIPLO-RIBBON-FAKE" || // or there's no target and we're not in World context
      !curTarget && context != InputContext.World) {
        if (this.toggleNavHelp) {
          this.toggleNavHelp.classList.add("opacity-0");
        }
        return;
      }
    }
    if (this.toggleNavHelp) {
      this.toggleNavHelp.classList.remove("opacity-0");
    }
  }
  /**
   * Player toggled options, this may have included always showing the ribbon so re-evaluate
   */
  onUserOptionChanged() {
	this.populateFlags();
    const frames = 2;
    delayByFrame(() => {
      this.realizeNavHelp();
    }, frames);
  }
}
Controls.define("panel-diplo-ribbon", {
  createInstance: PanelDiploRibbon,
  description: "Houses the players' portraits and stats and start of diplomatic interactions",
  classNames: [
    "diplo-ribbon",
    "relative",
    "allowCameraMovement",
    "top-8",
    "right-24",
    "pointer-events-none",
    "trigger-nav-help"
  ],
  styles: [styles],
  images: ["hud_att_arrow", "hud_att_arrow_highlight"]
});

export { PanelDiploRibbon };
//# sourceMappingURL=panel-diplo-ribbon.js.map
