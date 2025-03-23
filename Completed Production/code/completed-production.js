export class CompletedProductionManager {
    constructor() {
        this.lastProductions = new Map();
        this.cityProductionCompletedListener = (data) => { this.onCityProductionCompleted(data) };
    }

    attachToGame() {
        console.log("completed-production: Attaching to game");
        engine.on('CityProductionCompleted', this.cityProductionCompletedListener);
    }

    getLastProduced(cityID) {
        if (!this.lastProductions.has(cityID)) {
            return null;
        }
        else {
            return this.lastProductions.get(cityID);
        }
    }

    onCityProductionCompleted(data) {
        if (data?.cityID?.owner == GameContext.localPlayerID && !data?.canceled) {
            var productionDef = null;
            switch (data?.productionKind) {
                case ProductionKind.UNIT:
                    productionDef = GameInfo.Units.lookup(data?.productionItem)
                    break;
                case ProductionKind.PROJECT:
                    productionDef = GameInfo.Projects.lookup(data?.productionItem);
                    break;
                case ProductionKind.CONSTRUCTIBLE:
                    productionDef = GameInfo.Constructibles.lookup(data?.productionItem);
                    break;
            }
            var obj = { productionItem: data?.productionItem, productionKind: data?.productionKind, productionName: productionDef.Name, turn: Game.turn };
            this.lastProductions.set(data?.cityID?.id, obj);
        }
    }
}

export const CompletedProductionManagerInstance = new CompletedProductionManager();

engine.whenReady.then(() => {
    CompletedProductionManagerInstance.attachToGame();
});