import { CanConvertToCity } from '/base-standard/ui/production-chooser/production-chooser-operations.js';
import DialogManager, { DialogBoxAction } from '/core/ui/dialog-box/manager-dialog-box.js';

export const ovConvertToCity = (townID, newCityName, civAdj) => {
    const result = CanConvertToCity(townID);
    if (result.Success) {
        Game.CityCommands.sendRequest(townID, CityCommandTypes.PURCHASE, { Directive: OrderTypes.ORDER_TOWN_UPGRADE });
        UI.sendAudioEvent("city-upgrade-confirm");
		
        // rename city?
        if (newCityName) {
            const bodyText = Locale.compose("LOC_PJLIBTW_RENAME_DIALOG", civAdj, Cities.get(townID).name, newCityName);

            DialogManager.createDialog_ConfirmCancel({
                body: bodyText,
                title: "LOC_PJLIBTW_RENAME_DIALOG_TITLE",
                callback: (eAction) => {
                    if (eAction == DialogBoxAction.Confirm) {
                        Game.CityCommands.sendRequest(townID, CityCommandTypes.NAME_CITY, {Name: newCityName});
                        UI.sendAudioEvent("city-upgrade-confirm");
                    }
                }
            });
    }
        return true;
    }
    return false;
};