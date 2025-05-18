import Databind from '/core/ui/utilities/utilities-core-databinding.js';
import { TreeGridDirection, TreeSupport } from '/base-standard/ui/tree-grid/tree-support.js';

const eventHandlers = [];

const createButton = ({ isDisabled, onClick, getLabel }) => {
    const button = document.createElement('fxs-activatable');
    button.classList.value = "flex items-center font-body text-base mx-2 fxs-button__bg fxs-button__bg--base h-10 px-5";

    eventHandlers.push(() => {
        if(isDisabled()){
            button.classList.remove('fxs-button__bg--base');
            button.classList.add('fxs-button__bg--disabled');
        }
    });

    eventHandlers.push(() => {
        button.innerHTML = getLabel()
    });

    button.addEventListener('mouseenter', function () {
        button.classList.remove('fxs-button__bg--base');
        button.classList.add('fxs-button__bg--focus');
    });

    button.addEventListener('mouseleave', function () {
        button.classList.remove('fxs-button__bg--focus');
        button.classList.add('fxs-button__bg--base');
    });

    button.addEventListener('action-activate', function () {
        setTimeout(() => eventHandlers.forEach(handler => handler()), 50);
        if (isDisabled()) {
            return;
        }
        onClick();
    });

    eventHandlers.forEach(handler => handler());

    return button;
}

const getAcquiredAttributePoints = (player) => {
    return player.Identity.getAvailableAttributePoints() + player.Identity.getSpentAttributePoints() + player.Identity.getWildcardPoints();
}

const goldCost = (player) => {
    const acquiredAttributePoints = getAcquiredAttributePoints(player);

    switch (Game.age) {
        case Game.getHash("AGE_ANTIQUITY"):
            return 900 + acquiredAttributePoints * 50;
        case Game.getHash("AGE_EXPLORATION"):
            return 1700 + acquiredAttributePoints * 75;
        case Game.getHash("AGE_MODERN"):
            return 2600 + acquiredAttributePoints * 100;
    }

    return 900;
};

const diplomacyCost = (player) => {
    const acquiredAttributePoints = getAcquiredAttributePoints(player);

    switch (Game.age) {
        case Game.getHash("AGE_ANTIQUITY"):
            return 900 + acquiredAttributePoints * 50;
        case Game.getHash("AGE_EXPLORATION"):
            return 1700 + acquiredAttributePoints * 75;
        case Game.getHash("AGE_MODERN"):
            return 2600 + acquiredAttributePoints * 100;
    }

    return 900;
};

setTimeout(() => {
    const ScreenIdentity = Controls.getDefinition('screen-attribute-trees').createInstance;

    ScreenIdentity.prototype.createPanelContent = function (container, index, id) {
        const attribute = `g_AttributeTrees.attributes[${index}]`;
        const wildcardElement = document.createElement('div');
        wildcardElement.classList.add("my-5", "font-body", "text-base");
        Databind.html(wildcardElement, `${attribute}.wildCardLabel`);

        const treeContent = document.createElement('div');
        treeContent.classList.add("flex", "flex-auto", "flex-col", "items-center", "w-full");
        treeContent.classList.toggle("mb-4", !TreeSupport.isSmallScreen());
        const treeDetails = document.createElement('div');
        treeDetails.classList.add("flex", "flex-auto", "w-full");
        const scrollable = TreeSupport.getGridElement(attribute, TreeGridDirection.VERTICAL, this.createCard.bind(this));
        if (TreeSupport.isSmallScreen()) {
            scrollable.setAttribute('handle-gamepad-pan', 'false');
        }
        const cardDetailContainer = document.createElement("div");
        cardDetailContainer.classList.add("screen-attribute__card-container", "ml-5", "mr-2", "pointer-events-none", "items-end", "w-96", "flex");
        cardDetailContainer.classList.toggle("flex", TreeSupport.isSmallScreen());
        cardDetailContainer.classList.toggle("hidden", !TreeSupport.isSmallScreen());
        cardDetailContainer.setAttribute('panel-id', id);
        treeDetails.append(scrollable, cardDetailContainer);
        treeContent.append(wildcardElement);

        const player = Players.get(GameContext.localPlayerID);
        if (player) {
            const buttonGold = createButton({
                isDisabled: () => {
                    return player.Treasury.goldBalance < goldCost(player);
                },
                onClick: () => {
                    player.Treasury.changeGoldBalance(-goldCost(player));
                    player.Identity.addWildcardAttributePoints(1);
                },
                getLabel: () => `<p>Buy 1</p><fxs-font-icon data-icon-id="ATTRIBUTE_WILDCARD" data-icon-context="icon"></fxs-font-icon><p>for ${goldCost(player)}</p><fxs-font-icon data-icon-id="YIELD_GOLD" data-icon-context="icon"></fxs-font-icon><p>Gold</p>`
            });

            const buttonDiplomacy = createButton({
                isDisabled: () => {
                    return player.DiplomacyTreasury.diplomacyBalance < diplomacyCost(player);
                },
                onClick: () => {
                    player.DiplomacyTreasury.changeDiplomacyBalance(-diplomacyCost(player));
                    player.Identity.addWildcardAttributePoints(1);
                },
                getLabel: () => `<p>Buy 1</p><fxs-font-icon data-icon-id="ATTRIBUTE_WILDCARD" data-icon-context="icon"></fxs-font-icon><p>for ${diplomacyCost(player)}</p><fxs-font-icon data-icon-id="YIELD_DIPLOMACY" data-icon-context="icon"></fxs-font-icon><p>Influence</p>`
            });

            const buttons = document.createElement('div')
            buttons.classList.value = "flex flex-row items-center gap-2";
            buttons.append(buttonGold, buttonDiplomacy);
            treeContent.append(buttons);
        }

        treeContent.append(treeDetails);

        this.panelContentElements.set(index, {
            root: treeContent,
            scrollable,
            cardDetailContainer
        });
        container.appendChild(treeContent);
    }
}, 100)
