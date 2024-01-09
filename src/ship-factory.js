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
		// Pushes valid padded positions 1 cell around the hitbox to `padding`.
		const allPadding = [],
			extendedHitbox = [];
		extendedHitbox.push(...getParallelPaddings());
		allPadding.push(...extendedHitbox); // To pad both ends of the hitbox.
		pushPerpendiculars(extendedHitbox); // To pad the 4 corners around the hitbox.
		pushPerpendiculars(hitbox); // To pad perpendicular both sides of the hitbox.
		padding.length = 0;
		// Push only the valid positions to final padding.
		padding.push(
			...allPadding.filter(pos => pos[0] >= 0 && pos[0] < 10 && pos[1] >= 0 && pos[1] < 10)
		);

		function getParallelPaddings() {
			// Returns 2 paddings parallel to the ship hitbox.
			let lowEndPoint = [10, 10],
				highEndPoint = [-1, -1],
				paddedPos1,
				paddedPos2;

			hitbox.forEach(pos => {
				// Finds & Sets the low & high endpoints of the hitbox.
				let coord;
				if (isHorizontal) coord = 0;
				else coord = 1;

				if (pos[coord] < lowEndPoint[coord]) lowEndPoint = pos;
				else if (pos[coord] > highEndPoint[coord]) highEndPoint = pos;
			});

			// Generates padding based on endpoints.
			if (isHorizontal) {
				paddedPos1 = [lowEndPoint[0] - 1, lowEndPoint[1]];
				paddedPos2 = [highEndPoint[0] + 1, highEndPoint[1]];
			} else {
				paddedPos1 = [lowEndPoint[0], lowEndPoint[1] - 1];
				paddedPos2 = [highEndPoint[0], highEndPoint[1] + 1];
			}

			return [paddedPos1, paddedPos2];
		}

		function pushPerpendiculars(inputArr) {
			let paddedPos1, paddedPos2;
			inputArr.forEach(pos => {
				// Push all pos & newly created perpendicular pos to allPadding.
				if (isHorizontal) {
					paddedPos1 = [pos[0], pos[1] - 1];
					paddedPos2 = [pos[0], pos[1] + 1];
				} else {
					paddedPos1 = [pos[0] - 1, pos[1]];
					paddedPos2 = [pos[0] + 1, pos[1]];
				}
				allPadding.push(paddedPos1, paddedPos2);
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
