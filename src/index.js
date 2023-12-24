'use strict';

import './style.css';
import dom from './dom-handler';
import { bot } from './bot-handler';
import { GameboardFactory } from './gameboard-factory';

dom.createGrids();
main();

function main() {
	const player1 = { name: 'Player', isHuman: true },
		player2 = { name: 'Bot Azur', isHuman: false },
		clickedCells = [],
		targetGrid = dom.targetGrid.getElement();
	let attacker = player1,
		defender = player2,
		winner = null;

	createPlayers();
	placeBothShips();

	targetGrid.addEventListener('click', handleClicks);

	function createPlayers(shipInputs) {
		Object.assign(player1, GameboardFactory(shipInputs));
		Object.assign(player2, GameboardFactory(shipInputs));
	}

	function handleClicks(event) {
		if (!dom.targetGrid.isCell(event.target)) return;
		const cell = event.target;
		if (clickedCells.includes(cell)) return;
		clickedCells.push(cell);

		shootAt([+cell.dataset.posX, +cell.dataset.posY]);
		dispShotReport(cell, getLastShotReport(), true);
		checkForWinner();

		switchAttackers();

		botShootsAfter(1000);

		async function botShootsAfter(delay) {
			const botPos = await new Promise(res => setTimeout(res(bot.generateShot()), delay));
			shootAt(botPos);
			dispShotReport(dom.oceanGrid.getCell(botPos), getLastShotReport(), false);
			checkForWinner();
			switchAttackers();
		}
	}

	function shootAt(pos) {
		defender.receiveAttackAt(pos);
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

	function placeBothShips() {
		const allShipPosArr = [
			[
				[0, 0],
				[1, 0],
				[2, 0],
				[3, 0],
				[4, 0],
			],
			[
				[8, 1],
				[8, 2],
				[8, 3],
				[8, 4],
			],
			[
				[0, 9],
				[0, 8],
				[0, 7],
			],
			[
				[3, 7],
				[3, 6],
				[3, 5],
			],
			[
				[6, 8],
				[7, 8],
			],
		];

		allShipPosArr.forEach((posArr, index) => {
			const p1ShipID = attacker.getInfo().allShipIDs[index].id;
			const p2ShipID = defender.getInfo().allShipIDs[index].id;
			attacker.moveShipTo(p1ShipID, posArr);
			defender.moveShipTo(p2ShipID, posArr);
			dom.oceanGrid.markOccupied(posArr);
		});
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

function finishGame(winner) {
	console.log(`winner is ${winner.name}`);
}
