'use strict';
import { getRandomInt, isInbounds } from './utils';

// Takes player gameboard object and generates a random ship placement each time.

export default function setupShipsAuto(player) {
	const allShipPos = [];

	[5, 4, 3, 3, 2].forEach((length, index) => {
		const playerShipId = player.getAllShipIds()[index].id;
		const shipPos = generateShipPos(length, allShipPos);
		player.moveShip(playerShipId, shipPos);
		allShipPos.push(...player.getAllOccupiedPos(playerShipId));
	});

	return new Promise(resolve => resolve(true));

	function generateShipPos(shipLength, allOccupiedPos) {
		const shipPos = [],
			isHorizontal = !!getRandomInt(2);

		do {
			const head = getNewHead();
			shipPos.length = 0;
			shipPos.push(...generatePosAll(head));
			// Loop until ship pos is filled with only valid and unique pos.
		} while (shipPos.length !== shipLength);

		return shipPos;

		function getNewHead() {
			let newPos = [getRandomInt(10), getRandomInt(10)];
			while (isPosOccupied(newPos)) {
				// Loops until unique pos is found.
				newPos = [getRandomInt(10), getRandomInt(10)];
			}
			return newPos;
		}

		function generatePosAll(head) {
			// Generates valid coordinates based on head pos & direction.
			const generated = [head];
			for (let i = 1; i < shipLength; i++) {
				if (isHorizontal) {
					const newPos = [head[0] + i, head[1]];
					generated.push(newPos);
				} else {
					const newPos = [head[0], head[1] + i];
					generated.push(newPos);
				}
			}
			return generated.filter(pos => isInbounds(pos) && !isPosOccupied(pos));
		}

		function isPosOccupied(inputPos) {
			return allOccupiedPos.some(pos => {
				return inputPos[0] === pos[0] && inputPos[1] === pos[1];
			});
		}
	}
}
