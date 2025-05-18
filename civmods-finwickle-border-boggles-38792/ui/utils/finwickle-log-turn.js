import borderTogglesOptions from '/finwickle-border-boggles/ui/options/finwickle-border-toggles-options.js'; // Finwickle: added for debugging

const logPrefix = "Border Toggles (Finwickle): ";

function finwickleLogTurn() {
	if (borderTogglesOptions.enabledDebug) {
		console.warn(logPrefix + "turn " + Game.turn + ", " + Game.getTurnDate());
	}
}

engine.on('LocalPlayerTurnBegin', finwickleLogTurn);