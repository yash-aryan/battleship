'use strict';

function createGrids() {
	const parents = document.querySelectorAll('.grid-containers');
	parents[0].append(getGrid('ocean-grid'));
	parents[1].append(getGrid('target-grid'));

	function getGrid(gridID) {
		const gridContainer = document.createElement('div');
		let posX = 0,
			posY = 9;
		gridContainer.id = gridID;

		for (let i = 0; i < 100; i++) {
			if (posX > 9) {
				posX = 0;
				--posY;
			}
			const gridCell = document.createElement('div');
			gridCell.classList.add(`${gridID}__cell`);
			gridCell.dataset.posX = posX;
			gridCell.dataset.posY = posY;
			gridContainer.append(gridCell);
			++posX;
		}
		return gridContainer;
	}
}

const oceanGrid = (() => {
	function getCell(pos) {
		const grid = getElement();
		return grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
	}

	function markOccupied(posArr) {
		const grid = getElement();
		posArr.forEach(pos => {
			const cell = grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
			cell.style.backgroundColor = 'lightblue';
		});
	}

	function markHit(cell) {
		cell.style.backgroundColor = 'red';
	}

	function markMiss(cell) {
		cell.style.backgroundColor = '#a0a0a0';
	}

	function getElement() {
		return document.querySelector('#ocean-grid');
	}

	return {
		getCell,
		markOccupied,
		markHit,
		markMiss,
	};
})();

const targetGrid = (() => {
	function getElement() {
		return document.querySelector('#target-grid');
	}

	function isCell(node) {
		if (node.classList.contains('target-grid__cell')) return true;
		return false;
	}

	function markHit(cell) {
		cell.style.backgroundColor = 'red';
	}

	function markMiss(cell) {
		cell.style.backgroundColor = '#a0a0a0';
	}

	return {
		getElement,
		isCell,
		markHit,
		markMiss,
	};
})();

export default { createGrids, oceanGrid, targetGrid };
