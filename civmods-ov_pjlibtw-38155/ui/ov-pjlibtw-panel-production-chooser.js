import { ProductionChooserScreen } from '/base-standard/ui/production-chooser/panel-production-chooser.js';
import { ovConvertToCity } from '/base-standard/ui/ov-pjlibtw-production-chooser-operations.js';
import DialogManager, { DialogBoxAction } from '/core/ui/dialog-box/manager-dialog-box.js';

const ovOnUpgradeToCityButton = () => {
    ProductionChooserScreen.prototype.onUpgradeToCityButton = () => {
        // initialize variables
        const cityNameCandidates = [];
        let newCityName = null;

        // this stupid circular definition can't be kosher, but i haven't found another way to make it work
        const cityID = UI.Player.getHeadSelectedCity();
        const cityName = Cities.get(cityID).name;
        const player = Players.get(cityID.owner);
        
        const gameCities = GameInfo.CityNames;
        const globalCityList = [];

        for (const cityIndex of gameCities) {
            globalCityList.push(cityIndex.CityName);
        }

        console.warn('pjlibtw selected player city is ' + cityName);

        // only proceed with possible renaming if city doesn't have name from current age
        if (!globalCityList.includes(cityName)) {
            // get list of player settlements
            let playerSettlements = player?.Cities?.getCityIds();
            const settlementList = []
            
            for (let i = 0; i < playerSettlements.length; i++) {
                const settlement = Cities.get(playerSettlements[i]);
                settlementList.push(settlement.name);
            }

            const playerCivType = GameInfo.Civilizations.lookup(player.civilizationType)?.CivilizationType;

            // get list of available city names for player civilization, excluding those with localization errors or that are already in use
            for (const cityIndex of gameCities) {
                if (cityIndex.CivilizationType != playerCivType || !Locale.keyExists(cityIndex.CityName) || settlementList.includes(cityIndex.CityName)) {
                    console.warn('pjlibtw ' + cityIndex.CityName + ' bad for some reason');
                    continue;
                }

                cityNameCandidates.push(cityIndex.CityName);
                console.warn('pjlibtw ' + cityIndex.CityName + ' makes the cut');
            }

            // randomly select one of the city names
            newCityName = cityNameCandidates[Math.floor(Math.random() * cityNameCandidates.length)];
        }

        DialogManager.createDialog_ConfirmCancel({
            body: "LOC_PROJECT_TOWN_UPGRADE_DIALOG_BODY",
            title: "LOC_PROJECT_TOWN_UPGRADE_DIALOG_TITLE",
            callback: (eAction) => {
                if (eAction == DialogBoxAction.Confirm) {
                    // custom ConvertToCity function that takes newCityName
                    const civAdj = GameInfo.Civilizations.lookup(player.civilizationType).Adjective;
                    const success = ovConvertToCity(cityID, newCityName, civAdj);
                    if (!success) {
                        // TODO: Show error message
                    }
                }
            }
        });
    }
}

engine.whenReady.then(ovOnUpgradeToCityButton);