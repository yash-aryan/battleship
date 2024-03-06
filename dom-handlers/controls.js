'use strict';

const hideClass = 'hide';

export const allControls = (() => {
	function show() {
		getElem().classList.remove(hideClass);
	}

	function hide() {
		getElem().classList.add(hideClass);
	}

	function getElem() {
		return document.querySelector('.setup-controls');
	}

	return {
		show,
		hide,
	};
})();

export const rotateBtn = (() => {
	function getElem() {
		return document.querySelector('#rotate-btn');
	}

	function hide() {
		getElem().classList.add(hideClass);
	}

	return {
		getElem,
		hide,
	};
})();

export const confirmBtn = (() => {
	function getElem() {
		return document.querySelector('#confirm-btn');
	}

	function enable() {
		getElem().removeAttribute('disabled');
	}

	function disable() {
		getElem().setAttribute('disabled', '');
	}

	return {
		getElem,
		enable,
		disable,
	};
})();
