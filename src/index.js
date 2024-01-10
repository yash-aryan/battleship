'use strict';

import './style.css';
import dom from './dom-handler';
import { bot } from './bot-handler';
import { GameboardFactory } from './gameboard-factory';

main();

function main() {
	const shipLengths = [5, 4, 3, 3, 2],
		confirmBtn = dom.confirmShipBtn.getElement();
	let attacker = { name: 'Player', isHuman: true, ...GameboardFactory() },
		defender = { name: 'Bot Azur', isHuman: false, ...GameboardFactory() };

	dom.createGrids();
	setupShipsBot(defender, shipLengths);
	setupShipsManually(attacker, dom.confirmShipBtn.enable);
	confirmBtn.addEventListener('click', startShootPhase);

	function startShootPhase() {
		const targetGrid = dom.targetGrid.getElement(),
			clickedCells = [];
		let winner = null,
			roundIsOngoing = false;

		dom.confirmShipBtn.hide();
		dom.rotateShipBtn.hide();
		targetGrid.addEventListener('click', handleClicks);

		function handleClicks(event) {
			if (!dom.targetGrid.isCell(event.target)) return;
			if (dom.targetGrid.isCellMarked(event.target)) return;
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
					setTimeout(() => res(bot.generateShot()), artificialDelay_ms);
				});
				shootAt(botPos);
				const shotReport = getLastShotReport();
				notifyShotReportToBot(shotReport);
				dispShotReport(dom.oceanGrid.getCell(botPos), shotReport, false);
				checkForWinner();
				switchAttackers();
				roundIsOngoing = false;
			}
		}

		function notifyShotReportToBot(shotReport) {
			switch (shotReport) {
				case 'miss':
					bot.notifyMiss();
					break;
				case 'hit':
					bot.notifyHit();
					break;
				case 'sunk':
					bot.notifyHitAndSunk();
					break;
			}
		}

		function shootAt(pos) {
			defender.receiveAttack(pos);
			if (isWinnerFound()) winner = attacker;
		}

		function isWinnerFound() {
			return defender.isAllShipSunk();
		}

		function getLastShotReport() {
			return defender.getLastShotReport();
		}

		function checkForWinner() {
			if (isWinnerFound()) {
				targetGrid.removeEventListener('click', handleClicks);
				finishGame(winner);
			}
		}

		function switchAttackers() {
			const temp = attacker;
			attacker = defender;
			defender = temp;
		}
	}
}

function dispShotReport(cell, shotReport, attackerIsHuman) {
	// Marks the grid cell of appropriate grid with appropriate shot report.
	const grid = attackerIsHuman ? dom.targetGrid : dom.oceanGrid;

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
	const allShipPos = [];

	shipLengths.forEach((length, index) => {
		const botShipID = player.getAllShipIDs()[index].id;
		const shipPos = generateShipPos(length, allShipPos);
		player.moveShip(botShipID, shipPos);
		allShipPos.push(...player.getAllOccupiedPos(botShipID));
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
	const oceanGrid = dom.oceanGrid.getElement(),
		rotateBtn = dom.rotateShipBtn.getElement(),
		allShipIDs = [...player.getAllShipIDs()],
		currentShipPos = [];
	let currentShip = allShipIDs.shift(),
		currentShipID = currentShip.id,
		currentShipLength = currentShip.length,
		isShipHorizontal = true;

	// Default pos & orientation.
	currentShipPos.push(...getShipPos([3, 4], true, currentShipLength));
	dispShipOverlay(currentShipPos);
	oceanGrid.addEventListener('mouseover', handleHoverEvents);
	rotateBtn.addEventListener('click', rotateCurrentShip);

	function handleHoverEvents(event) {
		// Shows overlay of where the current ship will get placed.
		if (!dom.oceanGrid.isCell(event.target)) return;

		const head = [+event.target.dataset.posX, +event.target.dataset.posY];
		const cell = dom.oceanGrid.getCell(head);
		currentShipPos.length = 0;
		currentShipPos.push(...getShipPos(head, isShipHorizontal, currentShipLength));
		dispShipOverlay(currentShipPos);
		cell.addEventListener('click', handleShipDropEvent, { once: true });
	}

	function rotateCurrentShip() {
		if (isShipHorizontal) isShipHorizontal = false;
		else isShipHorizontal = true;
	}

	function handleShipDropEvent() {
		// If ideal conditions are met, then places ship at the coordinates.
		if (
			player.isPosOccupied(currentShipPos[0]) ||
			currentShipPos.length !== currentShipLength
		) {
			return;
		}

		player.moveShip(currentShipID, currentShipPos);
		dom.oceanGrid.markOccupied(currentShipPos);

		if (allShipIDs.length === 0) {
			oceanGrid.removeEventListener('mouseover', handleHoverEvents);
			callback();
		} else {
			currentShip = allShipIDs.shift();
			currentShipID = currentShip.id;
			currentShipLength = currentShip.length;
			dispShipOverlay(getShipPos([3, 4], true, currentShipLength));
		}
	}

	function dispShipOverlay(shipPos) {
		dom.oceanGrid.unhighlightAll();
		dom.oceanGrid.highlightCells(shipPos);
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

function finishGame(winner) {
	console.log(`winner is ${winner.name}`);
}
