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

export const dpad = (() => {
	function getBtnElem(type) {
		let identifier;
		switch (type) {
			case 'up':
				identifier = 'js-dpad-up';
				break;
			case 'left':
				identifier = 'js-dpad-left';
				break;
			case 'mid':
				identifier = 'js-dpad-mid';
				break;
			case 'right':
				identifier = 'js-dpad-right';
				break;
			case 'down':
				identifier = 'js-dpad-down';
				break;
		}

		return document.getElementById(identifier);
	}

	return {
		btnUp: getBtnElem('up'),
		btnLeft: getBtnElem('left'),
		btnMid: getBtnElem('mid'),
		btnRight: getBtnElem('right'),
		btnDown: getBtnElem('down'),
	};
})();
