'use strict';

// MARK: ocean grid
export const oceanGrid = (() => {
	const gridId = 'ocean-grid';
	const containerId = 'grid-container--ocean';

	function create(title = '> Friendly Waters') {
		const section = createGrid(title);
		section.id = containerId;
		section.lastChild.id = gridId;
		document.querySelector('#grids').append(section);
	}
	function getElement() {
		return document.getElementById(gridId);
	}
	function getCell(pos) {
		const grid = getElement();
		return grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
	}
	function isCell(node) {
		if (node.classList.contains('grid__cell')) return true;
		return false;
	}
	function highlightCells(posArr, isValid) {
		const grid = getElement();
		posArr.forEach(pos => {
			const cell = grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
			const highlightClass = isValid ? 'grid__cell--valid' : 'grid__cell--invalid';
			cell.classList.add(highlightClass);
		});
	}
	function unhighlightAll() {
		getElement().childNodes.forEach(cell => {
			cell.classList.remove('grid__cell--valid');
			cell.classList.remove('grid__cell--invalid');
		});
	}
	function markOccupied(posArr) {
		const grid = getElement();
		posArr.forEach(pos => {
			const cell = grid.querySelector(`[data-pos-x="${pos[0]}"][data-pos-y="${pos[1]}"]`);
			cell.classList.add('grid__cell--occupied');
		});
	}
	function markHit(cell) {
		cell.classList.add('grid__cell--hit');
	}
	function markMiss(cell) {
		cell.classList.add('grid__cell--miss');
	}
	function adjust() {
		// Adjusts grid size.
		getElement().classList.add('adjusted');
	}
	function destroy() {
		document.getElementById(containerId).remove();
	}

	return {
		create,
		getElement,
		getCell,
		isCell,
		highlightCells,
		unhighlightAll,
		markOccupied,
		markHit,
		markMiss,
		adjust,
		destroy,
	};
})();

// MARK: target grid
export const targetGrid = (() => {
	const gridId = 'target-grid';
	const containerId = 'grid-container--target';

	function create(title = '> Enemy Waters') {
		const section = createGrid(title, 'button');
		section.id = containerId;
		section.lastChild.id = gridId;
		document.querySelector('#grids').append(section);
	}
	function getElement() {
		return document.getElementById(gridId);
	}
	function disable(state = true) {
		getElement().childNodes.forEach(cell => (cell.disabled = state));
	}
	function isCell(node) {
		if (node.classList.contains('grid__cell')) return true;
		return false;
	}
	function isCellMarked(node) {
		if (node.classList.contains('grid__cell--hit') || node.classList.contains('grid__cell--miss'))
			return true;
		return false;
	}
	function markHit(cell) {
		cell.classList.add('grid__cell--hit');
	}
	function markMiss(cell) {
		cell.classList.add('grid__cell--miss');
	}
	function destroy() {
		document.getElementById(containerId).remove();
	}

	return {
		create,
		getElement,
		disable,
		isCell,
		isCellMarked,
		markHit,
		markMiss,
		destroy,
	};
})();

// MARK: get grid
function createGrid(titleText, gridCellElement = 'div') {
	const gridNode = document.createElement('div');
	gridNode.classList.add('grid');
	let posX = 0;
	let posY = 9;

	for (let i = 0; i < 100; i++) {
		if (posX > 9) {
			posX = 0;
			--posY;
		}
		const gridCell = document.createElement(gridCellElement);
		gridCell.classList.add('grid__cell');
		gridCell.dataset.posX = posX;
		gridCell.dataset.posY = posY;
		gridNode.append(gridCell);
		++posX;
	}

	const titleNode = document.createElement('h2');
	titleNode.classList.add('grid__title', 'heading');
	titleNode.textContent = titleText;

	const section = document.createElement('section');
	section.classList.add('grid-container');
	section.append(titleNode, gridNode);
	return section;
}
