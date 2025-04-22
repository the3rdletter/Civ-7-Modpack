const logPrefix = "Border Toggles (Finwickle): ";

function onLocalPlayerTurnBegin() {
	console.warn(logPrefix + "turn " + Game.turn + ", " + Game.getTurnDate());
}

engine.on('LocalPlayerTurnBegin', onLocalPlayerTurnBegin);