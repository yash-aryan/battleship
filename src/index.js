'use strict';
import './style.css';
import GameboardFactory from './factories/gameboard-factory';
import { oceanGrid, targetGrid } from './dom-handlers/grids';
import { allControls, confirmBtn, dpad, rotateBtn } from './dom-handlers/controls';
import { result } from './dom-handlers/result';

// MARK: start game
startGame();
async function startGame() {
	const player1 = { name: 'Player', ...GameboardFactory() };
	const player2 = { name: 'Bot Azur', ...GameboardFactory() };

	oceanGrid.create();

	playAgainstBot(player1, player2);
}

// MARK: vs bot logic
async function playAgainstBot(human, bot) {
	const botModule = await import('./factories/bot-factory');
	const botHandler = botModule.default();
	await Promise.all([setupShipsBot(bot), setupShipsManually(human)]);
	allControls.hide();
	targetGrid.create();

	await attackHuman(); // bot moves first

	targetGrid.getElement().addEventListener('click', allowPlayerAttack);

	async function allowPlayerAttack(event) {
		const cell = event.target;
		if (!targetGrid.isCell(cell) || targetGrid.isCellMarked(cell)) {
			return;
		}

		targetGrid.disable(); // prevent additional clicks
		const outcome = bot.receiveAttack([+cell.dataset.posX, +cell.dataset.posY]);

		if (outcome === 'miss') targetGrid.markMiss(cell);
		else targetGrid.markHit(cell);

		if (bot.isAllShipSunk()) {
			targetGrid.disable();
			return finishGame(human, bot, true);
		}

		await attackHuman();

		if (human.isAllShipSunk()) {
			targetGrid.disable();
			return finishGame(bot, human, false);
		}

		targetGrid.enable();
	}

	async function attackHuman() {
		const coords = await new Promise(resolve => {
			// Generates coordinates after 1000ms.
			setTimeout(() => resolve(botHandler.generateShot()), 0);
		});
		const outcome = human.receiveAttack(coords);

		switch (outcome) {
			case 'miss':
				botHandler.notifyMiss();
				oceanGrid.markMiss(oceanGrid.getCell(coords));
				break;
			case 'hit':
				botHandler.notifyHit();
				oceanGrid.markHit(oceanGrid.getCell(coords));
				break;
			case 'sunk':
				botHandler.notifyHitAndSunk();
				oceanGrid.markHit(oceanGrid.getCell(coords));
				break;
		}
	}
}

// MARK: finish game
function finishGame(winner, loser, didHumanWin) {
	// Sends match results to dom-handler to display it on result screen.
	// Player can also choose to reset game, and play again.
	const hitCountWinner = loser.getInfo().hitsTaken.length,
		hitCountLoser = winner.getInfo().hitsTaken.length,
		allShotsWinner = hitCountWinner + loser.getInfo().avoided.length,
		allShotsLoser = hitCountLoser + winner.getInfo().avoided.length;

	result.show(
		winner.name,
		loser.name,
		getAccuracyRate(hitCountWinner, allShotsWinner),
		getAccuracyRate(hitCountLoser, allShotsLoser),
		didHumanWin
	);

	result.getResetBtn().addEventListener('click', resetGame, { once: true });

	function resetGame() {
		// Resets state to defaullt.
		oceanGrid.remove();
		targetGrid.remove();
		allControls.show();
		result.hide();
		startGame();
	}

	function getAccuracyRate(hits, total) {
		return Math.round((hits / total) * 100);
	}
}

// MARK: bot ship setup
async function setupShipsBot(bot) {
	// Generates new & random ship placements.
	const allShipPos = [];

	[5, 4, 3, 3, 2].forEach((length, index) => {
		const botShipId = bot.getAllShipIds()[index].id;
		const shipPos = generateShipPos(length, allShipPos);
		bot.moveShip(botShipId, shipPos);
		allShipPos.push(...bot.getAllOccupiedPos(botShipId));
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

		function getRandomInt(max) {
			// Returns random INT from 0 upto max.
			return Math.floor(Math.random() * max);
		}
	}
}

// MARK: manual ship setup
function setupShipsManually(player) {
	// Lets user place all the ships one-by-one.

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
			confirmBtn.enable();
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
		const isOccupiedAlready = currShip.pos.some(pos => player.isPosOccupied(pos));
		oceanGrid.unhighlightAll();
		oceanGrid.highlightCells(shipPos, !isOccupiedAlready);
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
		dpad.enable();
		rotateBtn.enable();
	}

	function disableAllControls() {
		document.body.removeEventListener('keydown', handleKeyboard);
		dpad.getElement().removeEventListener('click', handleDpadClick);
		rotateBtn.getElement().removeEventListener('click', handleRotation);
		dpad.disable();
		rotateBtn.disable();
	}
}

function isInbounds(inputPos) {
	// Checks if pos coordinates is within the grid.
	if (inputPos[0] >= 0 && inputPos[0] < 10 && inputPos[1] >= 0 && inputPos[1] < 10) {
		return true;
	}
	return false;
}
