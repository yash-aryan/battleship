'use strict';

import { ShipFactory } from './ship-factory';

export function GameboardFactory(shipInputs = [5, 4, 3, 3, 2]) {
	const incomingShots = [],
		incomingHits = [],
		incomingMisses = [],
		allShips = [],
		allShipIds = [];
	let remainingShips,
		lastShotReport = null;

	shipInputs.forEach((input, index) => {
		const ship = ShipFactory(input);
		allShipIds.push({ id: index, length: ship.getInfo().length });
		allShips.push(ship);
	});
	remainingShips = allShips.length;

	function getInfo() {
		return {
			remainingShips,
			hitsTaken: incomingHits,
			avoided: incomingMisses,
		};
	}

	function getAllShipIds() {
		return allShipIds;
	}

	function moveShip(id, posArr) {
		allShips[id].setPos(posArr);
	}

	function getAllOccupiedPos(id) {
		const hitbox = allShips[id].getInfo().hitbox;
		const padding = allShips[id].getInfo().padding;
		return hitbox.concat(padding);
	}

	function isPosOccupied(targetPos) {
		return allShips.some(ship => ship.isOccupied(targetPos));
	}

	function receiveAttack(pos) {
		incomingShots.push(pos);
		const targetShip = getTargetShip(pos);

		if (targetShip) {
			targetShip.hit();
			incomingHits.push(pos);
			if (targetShip.isSunk()) {
				--remainingShips;
				lastShotReport = 'sunk';
			} else lastShotReport = 'hit';
		} else {
			incomingMisses.push(pos);
			lastShotReport = 'miss';
		}
	}

	function getLastShotReport() {
		return lastShotReport;
	}

	function isAllShipSunk() {
		if (remainingShips === 0) return true;
		return false;
	}

	// Private Functions
	function getTargetShip(targetPos) {
		return allShips.find(ship => ship.isHit(targetPos));
	}

	return {
		getInfo,
		getAllShipIds,
		getAllOccupiedPos,
		isPosOccupied,
		moveShip,
		receiveAttack,
		getLastShotReport,
		isAllShipSunk,
	};
}
