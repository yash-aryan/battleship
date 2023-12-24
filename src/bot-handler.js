'use strict';

export const bot = (() => {
	const generatedPos = [];

	function generateShot() {
		if (generatedPos.length === 100) return null;

		let newPos = [getRandomInt(10), getRandomInt(10)];
		while (hasBeenGenerated(newPos)) {
			newPos = [getRandomInt(10), getRandomInt(10)];
		}
		generatedPos.push(newPos);
		return newPos;
	}

	function hasBeenGenerated(newPos) {
		return generatedPos.some(pos => pos[0] === newPos[0] && pos[1] === newPos[1]);
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function reset() {
		generatedPos.length = 0;
	}

	return {
		generateShot,
		reset,
	};
})();
