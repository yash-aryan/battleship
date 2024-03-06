'use strict';

import './style.css';
import { BotFactory } from './bot-factory';
import { GameboardFactory } from './gameboard-factory';
import { oceanGrid, targetGrid } from '../dom-handlers/grids';
import { allControls, confirmBtn, rotateBtn } from '../dom-handlers/controls';
import { result } from '../dom-handlers/result';
window.res = result;
main();
function main() {
	const shipLengths = [5, 4, 3, 3, 2];
	let attacker = { name: 'Player', isHuman: true, ...GameboardFactory() },
		defender = { name: 'Bot Azur', isHuman: false, ...GameboardFactory() },
		botHandler = BotFactory();

	oceanGrid.create();
	confirmBtn.disable();
	setupShipsBot(defender, shipLengths);
	setupShipsManually(attacker, confirmBtn.enable);
	confirmBtn.getElem().addEventListener('click', startShootPhase);

	function startShootPhase() {
		allControls.hide();
		targetGrid.create();

		const gridNode = targetGrid.getElement();
		const clickedCells = [];
		let winner = null,
			loser = null,
			roundIsOngoing = false;

		gridNode.addEventListener('click', handleClicks);

		function handleClicks(event) {
			if (!targetGrid.isCell(event.target)) return;
			if (targetGrid.isCellMarked(event.target)) return;
			if (roundIsOngoing) return;

			roundIsOngoing = true;
			const cell = event.target;
			if (clickedCells.includes(cell)) return;
			clickedCells.push(cell);

			shootAt([+cell.dataset.posX, +cell.dataset.posY]);
			dispShotReport(cell, getLastShotReport(), true);
			checkForWinner();

			switchAttackers();

			botShootsAfter(1000);

			async function botShootsAfter(artificialDelay_ms = 0) {
				const botPos = await new Promise(res => {
					setTimeout(() => res(botHandler.generateShot()), artificialDelay_ms);
				});
				shootAt(botPos);
				const shotReport = getLastShotReport();
				notifyShotReportToBot(shotReport);
				dispShotReport(oceanGrid.getCell(botPos), shotReport, false);
				checkForWinner();
				switchAttackers();
				roundIsOngoing = false;
			}
		}

		function notifyShotReportToBot(shotReport) {
			switch (shotReport) {
				case 'miss':
					botHandler.notifyMiss();
					break;
				case 'hit':
					botHandler.notifyHit();
					break;
				case 'sunk':
					botHandler.notifyHitAndSunk();
					break;
			}
		}

		function shootAt(pos) {
			defender.receiveAttack(pos);
			if (isWinnerFound()) {
				winner = attacker;
				loser = defender;
			}
		}

		function isWinnerFound() {
			return defender.isAllShipSunk();
		}

		function getLastShotReport() {
			return defender.getLastShotReport();
		}

		function checkForWinner() {
			if (!isWinnerFound()) return;

			gridNode.removeEventListener('click', handleClicks);
			finishGame(winner, loser);
		}

		function switchAttackers() {
			const temp = attacker;
			attacker = defender;
			defender = temp;
		}
	}

	function finishGame(winner, loser) {
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
			winner.isHuman
		);

		result.getResetBtn().addEventListener('click', resetGame, { once: true });

		function resetGame() {
			// Resets all stored states for a new game.
			attacker = { name: 'Player', isHuman: true, ...GameboardFactory() };
			defender = { name: 'Bot Azur', isHuman: false, ...GameboardFactory() };
			botHandler = BotFactory();
			oceanGrid.reset();
			targetGrid.remove();
			setupShipsBot(defender, shipLengths);
			allControls.show();
			confirmBtn.disable();
			setupShipsManually(attacker, confirmBtn.enable);
			result.hide();
		}

		function getAccuracyRate(hits, total) {
			return Math.round((hits / total) * 100);
		}
	}
}

function dispShotReport(cell, shotReport, attackerIsHuman) {
	// Marks the grid cell of appropriate grid with appropriate shot report.
	const grid = attackerIsHuman ? targetGrid : oceanGrid;

	switch (shotReport) {
		case 'miss':
			grid.markMiss(cell);
			break;
		case 'hit':
			grid.markHit(cell);
			break;
		case 'sunk':
			grid.markHit(cell);
			break;
	}
}

function setupShipsBot(player, shipLengths) {
	// Generates new & random ship placements.
	const allShipPos = [];

	shipLengths.forEach((length, index) => {
		const botShipId = player.getAllShipIds()[index].id;
		const shipPos = generateShipPos(length, allShipPos);
		player.moveShip(botShipId, shipPos);
		allShipPos.push(...player.getAllOccupiedPos(botShipId));
	});

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
			return generated.filter(pos => isValidPos(pos) && !isPosOccupied(pos));
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

function setupShipsManually(player, callback) {
	// Lets user place all the ships one-by-one, and then allow confirmation.
	const gridNode = oceanGrid.getElement(),
		allShipIds = [...player.getAllShipIds()];
	let currShip = allShipIds.shift(),
		currShipId = currShip.id,
		currShipLength = currShip.length,
		isShipHorizontal = true;

	const currShipPos = [...getShipPos([3, 4], isShipHorizontal, currShipLength)];

	dispShipOverlay(currShipPos);
	gridNode.addEventListener('mouseover', handleHoverEvents);
	rotateBtn.getElem().addEventListener('click', rotateCurrShip);

	function handleHoverEvents(event) {
		// Shows overlay of where the current ship will get placed.
		if (!oceanGrid.isCell(event.target)) return;

		const head = [+event.target.dataset.posX, +event.target.dataset.posY];
		const cell = oceanGrid.getCell(head);
		currShipPos.length = 0;
		currShipPos.push(...getShipPos(head, isShipHorizontal, currShipLength));
		dispShipOverlay(currShipPos);
		cell.addEventListener('click', handleShipDropEvent, { once: true });
	}

	function rotateCurrShip() {
		isShipHorizontal = !isShipHorizontal;
	}

	function handleShipDropEvent() {
		// Places ship at the coordinates if ship is not out of bounds & not overlapping any existing ship.

		if (player.isPosOccupied(currShipPos[0])) return;
		if (currShipPos.length !== currShipLength) return;

		player.moveShip(currShipId, currShipPos);
		oceanGrid.markOccupied(currShipPos);

		if (allShipIds.length === 0) {
			gridNode.removeEventListener('mouseover', handleHoverEvents);
			rotateBtn.hide();
			callback();
		} else {
			currShip = allShipIds.shift();
			currShipId = currShip.id;
			currShipLength = currShip.length;
			dispShipOverlay(getShipPos([3, 4], true, currShipLength));
		}
	}

	function dispShipOverlay(shipPos) {
		oceanGrid.unhighlightAll();
		oceanGrid.highlightCells(shipPos);
	}

	function getShipPos(head, isHorizontal, length) {
		// Returns an array of coordinates in a certain direction.
		const posArr = [head];
		for (let i = 1; i < length; i++) {
			if (isHorizontal) posArr.push([head[0] + i, head[1]]);
			else posArr.push([head[0], head[1] + i]);
		}

		return posArr.filter(pos => isValidPos(pos));
	}
}

function isValidPos(inputPos) {
	if (inputPos[0] >= 0 && inputPos[0] < 10 && inputPos[1] >= 0 && inputPos[1] < 10) {
		return true;
	}
	return false;
}
