/**
 * @file action-handler.ts
 * @copyright 2020-2023, Firaxis Games
 * @description Input point for inputs gestures raised as 'actions'; includes all gamepad input.
 */
import ContextManager from '/core/ui/context-manager/context-manager.js';
import Cursor from '/core/ui/input/cursor.js';
import DebugInput from '/core/ui/input/debug-input-handler.js';
import { AnalogInput, InputEngineEvent, InputEngineEventName, NavigateInputEvent, NavigateInputEventName } from '/core/ui/input/input-support.js';
import { InterfaceMode } from '/core/ui/interface-modes/interface-modes.js';
export const ActiveDeviceTypeChangedEventName = 'active-device-type-changed';
export class ActiveDeviceTypeChangedEvent extends CustomEvent {
    constructor(deviceType, gamepadActive) {
        super(ActiveDeviceTypeChangedEventName, { bubbles: false, detail: { deviceType, gamepadActive } });
    }
}
/**
 * MoveSoftCursorEvent is triggered when the soft cursor is moved
 */
export class MoveSoftCursorEvent extends CustomEvent {
    constructor(status, x, y) {
        super('move-soft-cursor', { detail: { status, x, y } });
    }
}
class ActionHandlerSingleton {
    constructor() {
        // ------------------ MODIFIED BY NASU ------------------ START ------------------
        this.hasBeenDragged = false;
        // ------------------ MODIFIED BY NASU ------------------ END ------------------
        this._deviceType = InputDeviceType.Mouse;
        this._deviceLayout = InputDeviceLayout.Unknown;
        // Keep track of the last move direction from nav-move so we can send a FINISH event
        this.lastMoveNavDirection = InputNavigationAction.NONE;
        this._allowFilters = false;
        this.inputFilters = [];
        this.isCursorShowing = false;
        engine.on('InputAction', (actionName, status, x, y) => { this.onEngineInput(actionName, status, x, y); });
        this.deviceType = Input.getActiveDeviceType();
        engine.on('input-source-changed', (deviceType, deviceLayout) => { this.onDeviceTypeChanged(deviceType, deviceLayout); });
    }
    /**
     * Singleton accessor
     */
    static getInstance() {
        if (!ActionHandlerSingleton.Instance) {
            ActionHandlerSingleton.Instance = new ActionHandlerSingleton();
        }
        return ActionHandlerSingleton.Instance;
    }
    /**
     * Try to handle the input in soft cursor mode
     * @param name The action name
     * @param status The status of the input
     * @param x x coordinate
     * @param y y coordinate
     * @returns true if the input was handled false otherwise
     */
    handleSoftCursorInput(name, status, x, y) {
        switch (name) {
            case 'nav-move':
                window.dispatchEvent(new MoveSoftCursorEvent(status, x, y));
                return true;
            case 'plot-move':
                window.dispatchEvent(new MoveSoftCursorEvent(status, x, y));
                return true;
            case 'accept':
                if (status == InputActionStatuses.START) {
                    Input.virtualMouseLeft(true, Cursor.position.x, Cursor.position.y);
                }
                else if (status == InputActionStatuses.FINISH) {
                    Input.virtualMouseLeft(false, Cursor.position.x, Cursor.position.y);
                }
                return true;
            case 'shell-action-1':
                if (status == InputActionStatuses.START) {
                    Input.virtualMouseRight(true, Cursor.position.x, Cursor.position.y);
                }
                else if (status == InputActionStatuses.FINISH) {
                    Input.virtualMouseRight(false, Cursor.position.x, Cursor.position.y);
                }
                return true;
        }
        return false;
    }
    /**
     * Handle the input for tuner action
     * @param name The action name
     * @param status The status of the input
     * @returns true if the tuner did not use the input (same as the cancel status)
     */
    handleTunerAction(name, status) {
        if (status == InputActionStatuses.FINISH) {
            if (name == 'accept' || name == 'mousebutton-left') {
                return DebugInput.sendTunerActionA();
            }
            else if (name == 'cancel' || name == 'mousebutton-right') {
                return DebugInput.sendTunerActionB();
            }
        }
        return true;
    }
    /**
     * Handle the filter logic for inputs
     * @param name The action name
     * @param status The status of the input
     * @returns true if the input is allowed to pass
     */
    handleInputFilters(name, status) {
        if (status != InputActionStatuses.FINISH) {
            return true;
        }
        // if there are no filters allow all input to pass
        if (this.inputFilters.length <= 0) {
            return true;
        }
        const filter = this.inputFilters.find(filter => filter.inputName == name);
        // filter found -> don't allow the input to pass
        if (filter) {
            return false;
        }
        return true;
    }
    /**
     * Handle an input event that has come from the game engine.
     * Separates event into general input "action" event or a navigation based event.
     * Order of handling starts at specific element and cascades to broader scopes until false returned.
     * 	1. Send to ContextManager (which first try the focused item)
     * 	2. Send to global (window)
     *
     * @param name The "action" name of the event as defined by the engine's Input library (typically in the XML.)
     * @param status Status of the input type.
     * @param x coordinate if relevant.
     * @param y coordinate if relevant
     */
    onEngineInput(name, status, x, y) {
        if (Cursor.softCursorEnabled && this.handleSoftCursorInput(name, status, x, y)) {
            // Soft cursor handled the input so leave
            return;
        }
        // if the tuner handled the input, don't continue
        if (!this.handleTunerAction(name, status)) {
            return;
        }
        // Creates the approriate event type based on the engine input.
        // Navigation events may ping-pong around the system a bit more based on slot navigation rules.
        const isNavigation = (name.substr(0, 4) == "nav-");
        const isTouch = (name.substr(0, 6) == "touch-");
        const isMouse = (name.substr(0, 12) == "mousebutton-" || (name.substr(0, 11) == "mousewheel-"));
        // ------------------ MODIFIED BY NASU ------------------ START ------------------
        if (name === "mousebutton-left") {
            switch (status) {
                case InputActionStatuses.FINISH: {
                    const gameWidth = window.innerWidth;
                    const gameHeight = window.innerHeight;
                    const desktopWidth = window.screen.width;
                    const desktopHeight = window.screen.height;
                    let finalX = x;
                    let finalY = y;
                    if (gameWidth !== desktopWidth || gameHeight !== desktopHeight) {
                        const scaleX = gameWidth / desktopWidth;
                        const scaleY = gameHeight / desktopHeight;
                        finalX= Math.round(x * scaleX);
                        finalY = Math.round(y * scaleY);
                    }
                    let clickedElement = document.elementFromPoint(finalX, finalY);
                        if (this.hasBeenDragged) {
                            this.hasBeenDragged = false;
                            return;
                        }
                        if (clickedElement?.tagName === "HTML") {
                            let selectedUnit = UI.Player.getHeadSelectedUnit();
                            if (selectedUnit && InterfaceMode.getCurrent() == "INTERFACEMODE_UNIT_SELECTED") {
                                InterfaceMode.switchTo("INTERFACEMODE_DEFAULT");
                            }
                        }
                    this.hasBeenDragged = false;
                    break;
                }
                case InputActionStatuses.DRAG: {
                    this.hasBeenDragged = true;
                    return;
                }
                case InputActionStatuses.UPDATE: {
                    if (!this.hasBeenDragged) {
                        return;
                    }
                    break;
                }
                case InputActionStatuses.START: {
                    this.hasBeenDragged = false;
                    break;
                }
            }
        }
        // ------------------ MODIFIED BY NASU ------------------ END ------------------
        if (isNavigation) {
            let navigationDirection = null;
            const hypheonLocation = name.indexOf("nav-");
            const directionName = name.substr(hypheonLocation + 4, name.length - 1).toLowerCase();
            switch (directionName) {
                case "up":
                    navigationDirection = InputNavigationAction.UP;
                    break;
                case "down":
                    navigationDirection = InputNavigationAction.DOWN;
                    break;
                case "left":
                    navigationDirection = InputNavigationAction.LEFT;
                    break;
                case "right":
                    navigationDirection = InputNavigationAction.RIGHT;
                    break;
                case "next":
                    navigationDirection = InputNavigationAction.NEXT;
                    break;
                case "previous":
                    navigationDirection = InputNavigationAction.PREVIOUS;
                    break;
                case "shell-next":
                    navigationDirection = InputNavigationAction.SHELL_NEXT;
                    break;
                case "shell-previous":
                    navigationDirection = InputNavigationAction.SHELL_PREVIOUS;
                    break;
                case "move":
                    // Convert analog to cardinal direction.
                    const length = Math.hypot(x, y);
                    if (length > AnalogInput.deadzoneThreshold) {
                        const angle = Math.atan2(y, x) + Math.PI;
                        const fourthPI = Math.PI / 4;
                        if (angle >= fourthPI && angle < (fourthPI * 3)) {
                            navigationDirection = InputNavigationAction.DOWN;
                        }
                        else if (angle >= (fourthPI * 3) && angle < (fourthPI * 5)) {
                            navigationDirection = InputNavigationAction.RIGHT;
                        }
                        else if (angle >= (fourthPI * 5) && angle < (fourthPI * 7)) {
                            navigationDirection = InputNavigationAction.UP;
                        }
                        else {
                            navigationDirection = InputNavigationAction.LEFT;
                        }
                    }
                    // Since the FINISH event for nav-move might not have a length use the last direction we captured here 
                    if (status == InputActionStatuses.FINISH && this.lastMoveNavDirection != InputNavigationAction.NONE && navigationDirection == null) {
                        navigationDirection = this.lastMoveNavDirection;
                    }
                    else if (navigationDirection) {
                        this.lastMoveNavDirection = navigationDirection;
                    }
                    break;
            }
            // If input is switching device, change name to something that should not be handled (and none out the nav-direction.) Ignore if we are in soft cursor mode as it will change isGamepadActive when moving the cursor
            const inputName = (this.isGamepadActive || Cursor.softCursorEnabled) ? name : "refocus";
            navigationDirection = (this.isGamepadActive && navigationDirection != null) ? navigationDirection : InputNavigationAction.NONE;
            const navigationEvent = new NavigateInputEvent(NavigateInputEventName, { bubbles: true, cancelable: true, detail: { name: inputName, status: status, x: x, y: y, navigation: navigationDirection } });
            if (navigationDirection != null) { // May be moving but not past deadzone.			
                ContextManager.handleNavigation(navigationEvent);
            }
        }
        else {
            // External systems can block input (e.g. Tutorial)
            if (this.allowFilters && !this.handleInputFilters(name, status)) {
                return;
            }
            const inputEvent = new InputEngineEvent(name, status, x, y, isTouch, isMouse);
            let live = ContextManager.handleInput(inputEvent);
            if (live) {
                window.dispatchEvent(inputEvent); // One last crack at event; should anything be listening to this?
            }
        }
    }
    /**
     * Checks if an input event is for a navigation-based action.
     * @param inputEvent An input event.
     * @returns true if the input event is used for navigating input focus (e.g., switching between menu items)
     */
    isNavigationInput(inputEvent) {
        if (inputEvent.type != InputEngineEventName) {
            console.warn("Attempt to inspect a non-input event to see if it was a navigation input.");
            return false;
        }
        const name = inputEvent.detail.name;
        if (name == undefined || name == "") {
            return false;
        }
        return (name.substr(0, 4) == "nav-"); // Any input starting with "nav-" is considered navigation.
    }
    onDeviceTypeChanged(deviceType, deviceLayout) {
        let deviceChanged = false;
        if (!Cursor.softCursorEnabled) {
            if (this.deviceType != deviceType) {
                this.deviceType = deviceType;
                deviceChanged = true;
            }
        }
        if (this.deviceLayout != deviceLayout) {
            this.deviceLayout = deviceLayout;
            deviceChanged = true;
        }
        if (deviceChanged) {
            window.dispatchEvent(new ActiveDeviceTypeChangedEvent(this._deviceType, this.isGamepadActive));
        }
    }
    get isGamepadActive() {
        return this._deviceType == InputDeviceType.Controller;
    }
    get deviceLayout() {
        return this._deviceLayout;
    }
    get deviceType() {
        return this._deviceType;
    }
    set deviceType(inputDeviceType) {
        this._deviceType = inputDeviceType;
        if (this._deviceType != InputDeviceType.Keyboard && this._deviceType != InputDeviceType.Mouse) {
            if (this.isCursorShowing) {
                console.warn("Attempt to hide cursor when it's already hidden!");
                return;
            }
            this.isCursorShowing = true;
            UI.hideCursor();
        }
        else {
            if (!this.isCursorShowing) {
                console.warn("Attempt to show cursor when it's already shown!");
                return;
            }
            this.isCursorShowing = false;
            UI.showCursor();
        }
    }
    set deviceLayout(inputDeviceLayout) {
        this._deviceLayout = inputDeviceLayout;
    }
    get allowFilters() {
        return this._allowFilters;
    }
    set allowFilters(newValue) {
        if (this._allowFilters != newValue) {
            this._allowFilters = newValue;
        }
    }
    removeAllInputFilters() {
        this.inputFilters = [];
    }
    addInputFilter(inputFilter) {
        const existingEntryIndex = this.inputFilters.findIndex(entry => entry.inputName == inputFilter.inputName);
        // if a filter exists in the current filters replace it with the new one
        if (existingEntryIndex != -1) {
            this.inputFilters.splice(existingEntryIndex, 1, inputFilter);
            return;
        }
        this.inputFilters.push(inputFilter);
    }
    /**
     * Removes a given filter by name
     * @param inputFilter the filter to remove
     * @param replace optional, if true replaces the previous filter with the removed one.
     */
    removeInputFilter(inputFilter) {
        const existingEntryIndex = this.inputFilters.findIndex(entry => entry.inputName == inputFilter.inputName);
        if (existingEntryIndex == -1) {
            console.error("action-handler: removeInputFilter(): Trying to remove a non existing input filter");
            return;
        }
        this.inputFilters.splice(existingEntryIndex, 1);
    }
}
const ActionHandler = ActionHandlerSingleton.getInstance();
export { ActionHandler as default };

//# sourceMappingURL=file:///core/ui/input/action-handler.js.map
