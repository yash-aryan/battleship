'use strict';
import { oceanGrid } from './../dom-handlers/grids';
import { confirmBtn, dpad, rotateBtn } from './../dom-handlers/controls';
import { isInbounds } from './utils';

// Takes player gameboard object and lets them place all the ships manually one-by-one.

export default function setupShipsManually(player) {
	confirmBtn.disable();
	const [firstShip, ...remainingShips] = player.getAllShipIds();
	// Pre-selects first ship as current ship to be placed.
	const currShip = {
		id: firstShip.id,
		length: firstShip.length,
		isHorizontal: true,
		pos: getShipPos([3, 4], true, firstShip.length),
	};

	// Display the first pre-selected ship
	dispShipOverlay(currShip.pos);
	enableAllControls();

	return new Promise(resolve => {
		confirmBtn.getElement().addEventListener('click', confirmPlacement, { once: true });

		function confirmPlacement() {
			confirmBtn.disable();
			resolve(true);
		}
	});

	function handleDpadClick(e) {
		const btn = e.target;
		if (!dpad.isBtn(btn)) return;
		if (btn.dataset.input === 'mid') return handlePlacement();

		handleMovement(btn.dataset.input);
	}

	function handleKeyboard(e) {
		const key = e.key;
		if (key === ' ') return handleRotation();
		if (key === 'Enter') return handlePlacement();

		handleMovement(key);
	}

	function handleMovement(direction) {
		// Moves the ship in given direction.
		let copy = [...currShip.pos];

		switch (direction) {
			case 'ArrowUp':
			case 'up':
				copy = copy.map(pos => [pos[0], pos[1] + 1]);
				break;
			case 'ArrowLeft':
			case 'left':
				copy = copy.map(pos => [pos[0] - 1, pos[1]]);
				break;
			case 'ArrowRight':
			case 'right':
				copy = copy.map(pos => [pos[0] + 1, pos[1]]);
				break;
			case 'ArrowDown':
			case 'down':
				copy = copy.map(pos => [pos[0], pos[1] - 1]);
				break;

			default:
				return;
		}

		// Returns if any pos is out of bounds.
		if (!copy.every(pos => isInbounds(pos))) return;

		currShip.pos.length = 0;
		currShip.pos.push(...copy);
		dispShipOverlay(currShip.pos);
	}

	function handleRotation() {
		// Rotates the ship regardless of how the ship is oriented.
		let copy = [...currShip.pos];

		// Generates both +ve and -ve rotation outcome.
		const rotation1 = getShipPos(copy[0], !currShip.isHorizontal, copy.length, true);
		const rotation2 = getShipPos(copy[0], !currShip.isHorizontal, copy.length, false);

		// Gets the valid rotation outcome.
		copy = rotation1.every(pos => isInbounds(pos)) ? rotation1 : rotation2;

		currShip.isHorizontal = !currShip.isHorizontal;
		currShip.pos.length = 0;
		currShip.pos.push(...copy);
		dispShipOverlay(copy);
	}

	function handlePlacement() {
		if (currShip.pos.some(pos => player.isPosOccupied(pos))) return;

		player.moveShip(currShip.id, currShip.pos);
		oceanGrid.markOccupied(currShip.pos);

		if (remainingShips.length === 0) {
			disableAllControls();
			oceanGrid.unhighlightAll();
			for (const key in currShip) {
				currShip[key] = null;
			}
			confirmBtn.disable(false);
		} else {
			// Pre-selects next ship.
			const nextShip = remainingShips.shift();
			currShip.id = nextShip.id;
			currShip.length = nextShip.length;
			currShip.isHorizontal = true;
			currShip.pos.length = 0;
			currShip.pos.push(...getShipPos([3, 4], true, nextShip.length));
			dispShipOverlay(currShip.pos);
		}
	}

	function dispShipOverlay(shipPos) {
		// Displays ship pos on ocean-grid.
		const isValid = currShip.pos.every(pos => !player.isPosOccupied(pos));
		oceanGrid.unhighlightAll();
		oceanGrid.highlightCells(shipPos, isValid);
		dpad.disableMidBtn(!isValid);
	}

	function getShipPos(head, isHorizontal, length, dirPositive = true) {
		// Returns an array of coordinates of given length in the given direction.
		const posArr = [head];

		if (dirPositive) {
			for (let i = 1; i < length; i++) {
				if (isHorizontal) posArr.push([head[0] + i, head[1]]);
				else posArr.push([head[0], head[1] + i]);
			}
		} else {
			for (let i = 1; i < length; i++) {
				if (isHorizontal) posArr.push([head[0] - i, head[1]]);
				else posArr.push([head[0], head[1] - i]);
			}
		}

		return posArr;
	}

	function enableAllControls() {
		document.body.addEventListener('keydown', handleKeyboard);
		dpad.getElement().addEventListener('click', handleDpadClick);
		rotateBtn.getElement().addEventListener('click', handleRotation);
		dpad.disable(false);
		rotateBtn.disable(false);
	}

	function disableAllControls() {
		document.body.removeEventListener('keydown', handleKeyboard);
		dpad.getElement().removeEventListener('click', handleDpadClick);
		rotateBtn.getElement().removeEventListener('click', handleRotation);
		dpad.disable();
		rotateBtn.disable();
	}
}
