'use strict';

import ShipFactory from './ship-factory';

export default function GameboardFactory() {
	const incomingShots = [],
		incomingHits = [],
		incomingMisses = [],
		allShips = [],
		allShipIds = [];
	let remainingShips;

	[5, 4, 3, 3, 2].forEach((input, index) => {
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
		return [...allShipIds];
	}

	function getShipAtPos(pos) {
		const shipId = allShips.findIndex(ship => ship.isHit(pos));
		const shipInfo = allShips[shipId].getInfo();
		return {
			...allShipIds[shipId],
			isHorizontal: shipInfo.isHorizontal,
			hitbox: shipInfo.hitbox,
		};
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

		if (!targetShip) {
			incomingMisses.push(pos);
			return 'miss';
		}
		targetShip.hit();
		incomingHits.push(pos);

		if (targetShip.isSunk()) {
			--remainingShips;
			return 'sunk';
		}
		return 'hit';
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
		getShipAtPos,
		getAllOccupiedPos,
		isPosOccupied,
		moveShip,
		receiveAttack,
		isAllShipSunk,
	};
}
