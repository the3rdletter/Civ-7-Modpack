/**
 * @file screen-extras.ts
 * @copyright 2024, Firaxis Games
 * @description Sub-menu showing additional items that aren't on the main menu.
 */
import ContextManager from '/core/ui/context-manager/context-manager.js';
import DialogManager, { DialogBoxAction } from '/core/ui/dialog-box/manager-dialog-box.js';
import FocusManager from '/core/ui/input/focus-manager.js';
import NavTray from '/core/ui/navigation-tray/model-navigation-tray.js';
import Panel from '/core/ui/panel-support.js';
import * as Animations from '/core/ui/utilities/animations.js'; // Not sure if this is needed but cancelAllChainedAnimations() was used in main-menu.js so importing it just in case
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import { NetworkUtilities } from '/core/ui/utilities/utilities-network.js'; // For Network checking
import ActionHandler, { ActiveDeviceTypeChangedEventName } from '/core/ui/input/action-handler.js';
import { giftboxButtonName } from '/core/ui/profile-header/profile-header.js'; // Needed for rewards screen
export class ScreenExtras extends Panel {
    constructor(root) {
        super(root);
        this.closeButtonListener = () => { this.close(); };
        this.engineInputListener = this.onEngineInput.bind(this);
        this.creditsListener = this.onCredits.bind(this);
        this.legalListener = this.onLegal.bind(this);
        this.additionalContentButtonListener = this.onAdditionalContentButtonPressed.bind(this);
        this.activeDeviceTypeListener = this.onActiveDeviceTypeChanged.bind(this);
        this.enableOpenSound = true;
        this.enableCloseSound = true;
        this.Root.setAttribute("data-audio-group-ref", "additional-content-audio");
    }
    ;
    onAttach() {
        super.onAttach();
        this.Root.addEventListener('engine-input', this.engineInputListener);
        this.title = MustGetElement(".additional-content-header", this.Root);
        const closeButton = MustGetElement('.additional-content-back-button', this.Root);
        closeButton.addEventListener('action-activate', this.closeButtonListener);
        if (ActionHandler.isGamepadActive) {
            closeButton.classList.add('hidden');
        }
        window.addEventListener(ActiveDeviceTypeChangedEventName, this.activeDeviceTypeListener, true);
        Telemetry.sendUIMenuAction({ Menu: TelemetryMenuType.AdditionalContent, MenuAction: TelemetryMenuActionType.Load });
        const modsButton = MustGetElement('.extras-item-mods', this.Root);
        if (UI.supportsDLC()) {
            modsButton.addEventListener("action-activate", this.additionalContentButtonListener);
        }
        else {
            modsButton.remove();
        }
        const storeButton = MustGetElement('.extras-item-store', this.Root);
        storeButton.addEventListener("action-activate", this.additionalContentButtonListener);
        const giftboxButton = MustGetElement('.extras-item-giftbox', this.Root);
        if (UI.supportsDLC() && Network.isFullAccountLinked()) {
            giftboxButton.classList.remove("hidden");
            giftboxButton.addEventListener("action-activate", this.additionalContentButtonListener);
        }
        const creditsButton = MustGetElement('.extras-item-credits', this.Root);
        creditsButton.addEventListener("action-activate", this.creditsListener);
        const legalButton = MustGetElement('.extras-item-legal', this.Root);
        legalButton.addEventListener("action-activate", this.legalListener);
        const graphicsBenchmarkButton = MustGetElement('.extras-item-benchmark-graphics', this.Root);
        const aiBenchmarkButton = MustGetElement('.extras-item-benchmark-ai', this.Root);
        if (UI.shouldDisplayBenchmarkingTools()) {
            graphicsBenchmarkButton.addEventListener("action-activate", this.onGraphicsBenchmark.bind(this));
            aiBenchmarkButton.addEventListener("action-activate", this.onAiBenchmark.bind(this));
        }
        else {
            graphicsBenchmarkButton.remove();
            aiBenchmarkButton.remove();
        }
        // Update the current version.
        this.buildInfo = document.createElement('div');
        this.buildInfo.role = "paragraph";
        this.buildInfo.classList.value = "main-menu-build-info absolute font-body-sm text-accent-2 hidden";
        this.buildInfo.innerHTML = Locale.compose('LOC_SHELL_BUILD_INFO', BuildInfo.version.display);
        this.Root.appendChild(this.buildInfo);
    }
    onDetach() {
        Telemetry.sendUIMenuAction({ Menu: TelemetryMenuType.AdditionalContent, MenuAction: TelemetryMenuActionType.Exit });
        this.Root.removeEventListener('engine-input', this.engineInputListener);
        window.removeEventListener(ActiveDeviceTypeChangedEventName, this.activeDeviceTypeListener, true);
        super.onDetach();
    }
    generateOpenCallbacks(callbacks) {
        callbacks['screen-credits'] = this.onCredits;
    }
    onReceiveFocus() {
        super.onReceiveFocus();
        const extraMenu = MustGetElement(".extras-menu", this.Root);
        FocusManager.setFocus(extraMenu);
        NavTray.clear();
        NavTray.addOrUpdateGenericBack();
    }
    onLoseFocus() {
        NavTray.clear();
        super.onLoseFocus();
    }
    close() {
        ContextManager.popUntil("main-menu");
    }
    onEngineInput(inputEvent) {
        if (inputEvent.detail.status != InputActionStatuses.FINISH) {
            return;
        }
        if (inputEvent.detail.name == 'cancel' || inputEvent.detail.name == 'sys-menu' || inputEvent.detail.name == 'keyboard-escape') {
            this.close();
            inputEvent.stopPropagation();
            inputEvent.preventDefault();
        }
    }
    onActiveDeviceTypeChanged(event) {
        const closeButton = MustGetElement('.additional-content-back-button', this.Root);
        closeButton.classList.toggle('hidden', event.detail?.gamepadActive);
    }
    onAdditionalContentButtonPressed(event) {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }
        const buttonID = event.target.getAttribute('button-id');
        if (!buttonID) {
            return;
        }
        switch (buttonID) {
            case 'mods':
                this.title.setAttribute("title", "LOC_UI_CONTENT_MGR_TITLE");
                const slotGroup = MustGetElement('.additional-content-slot-group', this.Root);
                const screenModContent = MustGetElement('.mods-content', this.Root);
                slotGroup.setAttribute('selected-slot', buttonID);
                FocusManager.setFocus(screenModContent);
                break;
            case 'store':
                const isUserInput = true;
                const result = Network.triggerNetworkCheck(isUserInput);
                if (result.wasErrorDisplayedOnFirstParty) {
                    return;
                }
                if (result.networkResult == NetworkResult.NETWORKRESULT_NO_NETWORK) {
                    DialogManager.createDialog_Confirm({ body: Locale.compose("LOC_UI_CONNECTION_FAILED"), title: Locale.compose("LOC_UI_OFFLINE_ACCOUNT_TITLE") });
                    return;
                }
                ContextManager.popUntil("main-menu");
                Animations.cancelAllChainedAnimations();
                ContextManager.push("screen-store-launcher", { singleton: true, createMouseGuard: true });
                break;
            case 'giftbox':
                this.showRewardsScreen();
                break;
        }
    }
    showRewardsScreen() { // Copied from same function in main-menu.js
        if (Online.UserProfile.getRewardsAutoPopupEnabledConfiguration()) {
            let flags = { isChildAccount: Network.isChildAccount(), isPermittedChild: Network.isChildOnlinePermissionsGranted(), ignoreChildPermissions: false };
            let popupProperties = { singleton: true, createMouseGuard: true };
            var blockReason = Network.getBlockedAccessReason(flags.isChildAccount, flags.isPermittedChild, flags.ignoreChildPermissions);
            if ((blockReason == "" || blockReason == Locale.compose("LOC_UI_LINK_ACCOUNT_REQUIRED"))) {
                if (this.Root.getAttribute("disabled") != "true" && ContextManager.getCurrentTarget() == this.Root && !Network.isWaitingForPrimaryAccountSelection()) {
                    FocusManager.setFocus(this.slot);
                    ContextManager.push(giftboxButtonName, popupProperties);
                }
            }
        }
        this.bShowRewardsScreen = false;
    }
    onCredits() {
        ContextManager.popUntil("main-menu");
        ContextManager.push("screen-credits", { singleton: true, createMouseGuard: false });
        Telemetry.sendUIMenuAction({ Menu: TelemetryMenuType.AdditionalContent, MenuAction: TelemetryMenuActionType.Select, Item: "Credits" });
    }
    onLegal() {
        ContextManager.popUntil("main-menu");
        ContextManager.push("screen-mp-legal", { singleton: true, createMouseGuard: true, panelOptions: { viewOnly: true } });
        Telemetry.sendUIMenuAction({ Menu: TelemetryMenuType.AdditionalContent, MenuAction: TelemetryMenuActionType.Select, Item: "Legal" });
    }
    onGraphicsBenchmark() {
        Benchmark.Game.setDebugUiVisiblity(false);
        Benchmark.Automation.start(GameBenchmarkType.GRAPHICS);
    }
    onAiBenchmark() {
        Benchmark.Game.setDebugUiVisiblity(false);
        Benchmark.Automation.start(GameBenchmarkType.AI);
    }
}
Controls.define('screen-extras', {
    createInstance: ScreenExtras,
    description: 'Extras screen.',
    classNames: ['screen-extras', 'w-full', 'h-full', 'flex', 'items-center', 'justify-center'],
    styles: ['fs://game/core/ui/shell/extras/screen-extras.css'],
    content: ['fs://game/core/ui/shell/extras/screen-extras.html'],
    opens: [
        'screen-credits'
    ],
    attributes: [],
});

//# sourceMappingURL=file:///core/ui/shell/extras/screen-extras.js.map
