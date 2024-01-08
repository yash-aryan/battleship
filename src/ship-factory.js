'use strict';

export function ShipFactory(length) {
	let hitCount = 0,
		isHorizontal = null;
	const hitbox = [],
		padding = [];

	function getInfo() {
		return { length, isHorizontal, hitCount, hitbox, padding };
	}

	function hit() {
		if (hitCount < length) hitCount++;
	}

	function isSunk() {
		if (hitCount === length) return true;
		else return false;
	}

	function setPos(posArr) {
		if (posArr.length !== length) return;

		posArr.sort();
		hitbox.length = 0;
		hitbox.push(...posArr);
		setOrientation();
		setPadding();
	}

	function isHit(targetPos) {
		return hitbox.some(pos => pos[0] === targetPos[0] && pos[1] === targetPos[1]);
	}

	function isOccupied(targetPos) {
		return getAllCoords().some(pos => pos[0] === targetPos[0] && pos[1] === targetPos[1]);
	}

	// Private Functions
	function getAllCoords() {
		return hitbox.concat(padding);
	}

	function setPadding() {
		const point1 = hitbox[0],
			point2 = hitbox[length - 1],
			extendedHitbox = [];

		padding.length = 0;

		if (isHorizontal) {
			padding.push([point1[0] - 1, point1[1]], [point2[0] + 1, point2[1]]);
			extendedHitbox.push([point1[0] - 1, point1[1]], [point2[0] + 1, point2[1]], ...hitbox);
			extendedHitbox.forEach(pos => {
				padding.push([pos[0], pos[1] - 1]);
				padding.push([pos[0], pos[1] + 1]);
			});
		} else {
			padding.push([point1[0], point1[1] - 1], [point2[0], point2[1] + 1]);
			extendedHitbox.push([point1[0], point1[1] - 1], [point2[0], point2[1] + 1], ...hitbox);
			extendedHitbox.forEach(pos => {
				padding.push([pos[0] - 1, pos[1]]);
				padding.push([pos[0] + 1, pos[1]]);
			});
		}
	}

	function setOrientation() {
		const point1 = hitbox[0],
			point2 = hitbox[length - 1];

		if (point1[1] === point2[1]) isHorizontal = true;
		else isHorizontal = false;
	}

	return {
		getInfo,
		hit,
		isSunk,
		setPos,
		isHit,
		isOccupied,
	};
}
