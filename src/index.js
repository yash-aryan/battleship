'use strict';
import './style.css';
import GameboardFactory from './factories/gameboard-factory';
import setupShipsManually from './utils/manual-setup';
import { oceanGrid, targetGrid } from './dom-handlers/grids';
import { allControls } from './dom-handlers/controls';
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
	const [botModule, autoSetupModule] = await Promise.all([
		import('./factories/bot-factory'),
		import('./utils/automatic-setup'),
	]);
	const botHandler = botModule.default();
	const setupShipsAuto = autoSetupModule.default;
	await Promise.all([setupShipsAuto(bot), setupShipsManually(human)]);
	oceanGrid.adjust();
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

		targetGrid.disable(false); // re-enable for next human input
	}

	async function attackHuman() {
		const coords = await new Promise(resolve => {
			// Generates coordinates after 1000ms.
			setTimeout(() => resolve(botHandler.generateShot()), 1000);
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
		oceanGrid.destroy();
		targetGrid.destroy();
		allControls.hide(false);
		result.hide();
		startGame();
	}

	function getAccuracyRate(hits, total) {
		return Math.round((hits / total) * 100);
	}
}
