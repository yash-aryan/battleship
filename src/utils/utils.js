'use strict';

export function isInbounds(inputPos) {
	// Checks if pos coordinates is within the grid.
	if (inputPos[0] >= 0 && inputPos[0] < 10 && inputPos[1] >= 0 && inputPos[1] < 10) {
		return true;
	}
	return false;
}

export function getRandomInt(max) {
	// Returns random INT from 0 upto max.
	return Math.floor(Math.random() * max);
}
