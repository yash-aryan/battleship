'use strict';

function createGrids() {
	const parents = document.querySelectorAll('.grid-containers');
	parents[0].children[0].insertAdjacentElement('afterend', getGrid('ocean-grid'));
	parents[1].children[0].insertAdjacentElement('afterend', getGrid('target-grid'));

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

const rotateShipBtn = (() => {
	function getElement() {
		return document.querySelector('#rotate-ship-btn');
	}

	function hide() {
		getElement().style.display = 'none';
	}

	return {
		getElement,
		hide,
	};
})();

const confirmShipBtn = (() => {
	function getElement() {
		return document.querySelector('#confirm-ship-btn');
	}

	function enable() {
		getElement().removeAttribute('disabled');
	}

	function disable() {
		getElement().setAttribute('disabled', '');
	}

	function hide() {
		getElement().style.display = 'none';
	}

	return {
		getElement,
		enable,
		disable,
		hide,
	};
})();

const oceanGrid = (() => {
	function getElement() {
		return document.querySelector('#ocean-grid');
	}

	function getCell(pos) {
		const grid = getElement();
		return grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
	}

	function isCell(node) {
		if (node.classList.contains('ocean-grid__cell')) return true;
		return false;
	}

	function highlightCells(posArr) {
		const grid = getElement();
		posArr.forEach(pos => {
			const cell = grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
			cell.classList.add('highlighted');
		});
	}

	function unhighlightAll() {
		getElement()
			.querySelectorAll('.highlighted')
			.forEach(cell => cell.classList.remove('highlighted'));
	}

	function markOccupied(posArr) {
		const grid = getElement();
		posArr.forEach(pos => {
			const cell = grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
			cell.classList.add('occupied');
		});
	}

	function markHit(cell) {
		cell.classList.add('hit');
	}

	function markMiss(cell) {
		cell.classList.add('miss');
	}

	return {
		getElement,
		getCell,
		isCell,
		highlightCells,
		unhighlightAll,
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

	function isCellMarked(node) {
		if (node.classList.contains('hit') || node.classList.contains('miss')) return true;
		return false;
	}

	function markHit(cell) {
		cell.classList.add('hit');
	}

	function markMiss(cell) {
		cell.classList.add('miss');
	}

	return {
		getElement,
		isCell,
		isCellMarked,
		markHit,
		markMiss,
	};
})();

export default { createGrids, rotateShipBtn, confirmShipBtn, oceanGrid, targetGrid };
