/**
 * Return all the city states that are tributaries of the player
 * @param {Player} player
 */
export function getPlayerCityStatesSuzerain(player) {
    const cityStates = Players.getAlive().filter(otherPlayer => 
        otherPlayer.isMinor && 
        otherPlayer.Influence?.hasSuzerain &&
        otherPlayer.Influence.getSuzerain() === player.id
    );
    return cityStates;
}

/**
 * @param {Player} player
 * @param {ResolvedModifier} modifier
 */
export function getPlayerRelationshipsCountForModifier(player, modifier) {
    const allPlayers = Players.getAlive();
    let allies = 0;
    allPlayers.forEach(otherPlayer => {
        if (!otherPlayer.isMajor || otherPlayer.id == GameContext.localPlayerID) {
            return;
        }

        if (modifier.Arguments.UseAlliances?.Value === 'true' &&
            player.Diplomacy?.hasAllied(otherPlayer.id)) {
            allies++;
        }

        if (modifier.Arguments.RelationshipType?.Value) {
            const relationship = player.Diplomacy?.getRelationshipEnum(otherPlayer);
            const relationshipType = DiplomacyManager.getRelationshipTypeString(relationship);
            if (relationshipType == modifier.Arguments.RelationshipType.Value) {
                allies++;
            }
        }
    });
    return allies;
}

/**
 * @param {Player} player
 */
export function isPlayerAtWarWithOpposingIdeology(player) {
    const allPlayers = Players.getAlive();
    for (const otherPlayer of allPlayers) {
        if (!otherPlayer.isMajor || otherPlayer.id == GameContext.localPlayerID) {
            continue;
        }

        if (!player.Diplomacy?.isAtWarWith(otherPlayer.id)) {
            continue;
        }

        const playerIdeology = player.Diplomacy?.getIdeology();
        const otherPlayerIdeology = otherPlayer.Diplomacy?.getIdeology();
        if (playerIdeology == -1 || otherPlayerIdeology == -1) continue;
        
        // Same ideology
        if (playerIdeology == otherPlayerIdeology) continue;

        return true;
    }

    return false;
}

/**
 * @param {Player} player
 */
export function isPlayerAtPeaceWithMajors(player) {
    const allPlayers = Players.getAlive();
    for (const otherPlayer of allPlayers) {
        if (!otherPlayer.isMajor || otherPlayer.id == GameContext.localPlayerID) {
            continue;
        }

        if (player.Diplomacy?.isAtWarWith(otherPlayer.id)) {
            return false;
        }
    }

    return true;
}

/**
 * @param {Player} player
 * @param {ResolvedModifier} modifier
 */
export function getPlayerActiveTraditionsForModifier(player, modifier) {
    const activeTraditions = player.Culture.getActiveTraditions();
    
    // If you get weird values with `lf-policies-yields-debug`, it's normal:
    // All traditions are unlocked at the start of the game, but they don't count toward `civ` traditions
    // since we **reset to null the `TraitType**`.
    // console.warn("ActiveTraditions", JSON.stringify(activeTraditions.map(at => GameInfo.Traditions.lookup(at)?.Name)));

    // TODO this is bugged for Regis, since the tradition itself is a CivUnique
    let count = 0;
    for (const tradition of activeTraditions) {
        const traditionType = GameInfo.Traditions.lookup(tradition);
        if (!traditionType?.TraitType && modifier.Arguments.CivUnique?.Value === 'true') {
            continue;
        }
        count++; 
    }
    return count;
}

/**
 * @param {Player} player
 * @param {ResolvedModifier} modifier
 */
export function getPlayerCompletedMasteries(player, modifier) {
    /** @type {ProgressionResearchedNode[]} */
    let nodes = [];

    switch (modifier.Arguments.SystemType.Value) {
        case "SYSTEM_TECH": nodes = player.Techs.getResearched(); break;
        case "SYSTEM_CULTURE": nodes = player.Culture.getResearched(); break;
        default: throw new Error(`${modifier.Modifier.ModifierId}: getPlayerCompletedMasteries Unsupported SystemType: ${modifier.Arguments.SystemType.Value}`);
    }

    return nodes.filter(node => node.depth >= 2).length;
}

/**
 * @param {Player} player
 * @param {ResolvedModifier} modifier
 */
export function getPlayerOngoingDiplomacyActions(player, modifier) {
    let ongoingActions = Game.Diplomacy
        .getPlayerEvents(player.id)
        .filter(action => {
            const isValid = action.initialPlayer == player.id || (action.targetPlayer == player.id && action.revealed);
            if (!isValid) return false;

            if (modifier.Arguments.ActionGroupType?.Value) {
                const actionGroupType = GameInfo.DiplomacyActionGroups.lookup(action.actionGroup);
                if (!actionGroupType) return false;
                const actionGroupTypeName = actionGroupType.Name;
                if (actionGroupTypeName != modifier.Arguments.ActionGroupType.Value) return false;
            }

            return true;
        });

    return ongoingActions;
}