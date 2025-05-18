import ContextManager from '/core/ui/context-manager/context-manager.js';

class WondersScreen_PanelSubsystemDockDecorator
{
    constructor(val) {
        this._panel = val;
    }

    beforeAttach() {
    }

    afterAttach() {
        this._panel.addButton({ tooltip: "LOC_UI_VIEW_WONDERS", modifierClass: 'wonders', callback: this.onOpenWonders.bind(this), class: "tut-wonders", audio: "wonders", focusedAudio: "data-audio-focus-small" });
    }

    beforeDetach() { }

    afterDetach() { }

    onOpenWonders() {
        ContextManager.push("screen-wonders", { singleton: true, createMouseGuard: true });
    }
}

Controls.decorate('panel-sub-system-dock', (val) => new WondersScreen_PanelSubsystemDockDecorator(val));