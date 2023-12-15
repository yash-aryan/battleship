'use strict';

import { ShipFactory } from './ship-factory';

export function GameboardFactory(shipInputs = [5, 4, 3, 3, 2]) {
	const incomingShots = [],
		incomingHits = [],
		incomingMisses = [],
		allShips = [],
		allShipIDs = [];
	let remainingShips;

	shipInputs.forEach((input, index) => {
		const ship = ShipFactory(input);
		allShipIDs.push({ id: index, length: ship.getInfo().length });
		allShips.push(ship);
	});
	remainingShips = allShips.length;

	function getInfo() {
		return {
			allShipIDs,
			remainingShips,
			hits: incomingHits,
			misses: incomingMisses,
		};
	}

	function getShipByID(id) {
		const ship = allShips[id];
		return (() => ({
			length: ship.getInfo().length,
			isHorizontal: ship.getInfo().isHorizontal,
			hitCount: ship.getInfo().hitCount,
			hitbox: ship.getInfo().hitbox,
			isOccupied: ship.isOccupied,
		}))(ship);
	}

	function canShipMoveTo(id, pos) {
		if (isOutOfBounds(pos) || isOccupiedByOtherShip(id, pos)) {
			return false;
		}
		return true;
	}

	function moveShipTo(id, posArr) {
		if (canShipMoveTo(id, posArr)) allShips[id].setPos(posArr);
	}

	function receiveAttackAt(pos) {
		if (isRepeatShot(pos)) return;

		incomingShots.push(pos);
		const targetShip = getTargetShip(pos);
		if (!targetShip) {
			incomingMisses.push(pos);
			return;
		}

		targetShip.hit();
		incomingHits.push(pos);
		if (targetShip.isSunk()) --remainingShips;
	}

	function isAllShipSunk() {
		if (remainingShips === 0) return true;
		return false;
	}

	// Private Functions
	function getTargetShip(targetPos) {
		return allShips.find(ship => ship.isHit(targetPos));
	}

	function isOutOfBounds(targetPos) {
		return targetPos.some(n => n < 0 || n > 9);
	}

	function isOccupiedByOtherShip(id, targetPos) {
		return allShips.some((ship, index) => {
			if (index !== id) return ship.isOccupied(targetPos);
		});
	}

	function isRepeatShot(pos) {
		return incomingShots.some(n => n[0] === pos[0] && n[1] === pos[1]);
	}

	return {
		getInfo,
		getShipByID,
		canShipMoveTo,
		moveShipTo,
		receiveAttackAt,
		isAllShipSunk,
	};
}
