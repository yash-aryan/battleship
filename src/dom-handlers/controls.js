'use strict';

const hideClass = 'hide';

export const allControls = (() => {
	function show() {
		getElement().classList.remove(hideClass);
	}
	function hide() {
		getElement().classList.add(hideClass);
	}
	function getElement() {
		return document.querySelector('.setup-controls');
	}
	return {
		show,
		hide,
	};
})();

export const rotateBtn = (() => {
	function getElement() {
		return document.querySelector('#rotate-btn');
	}
	function enable() {
		getElement().removeAttribute('disabled');
	}
	function disable() {
		getElement().setAttribute('disabled', '');
	}
	return {
		getElement,
		enable,
		disable,
	};
})();

export const confirmBtn = (() => {
	function getElement() {
		return document.querySelector('#confirm-btn');
	}
	function enable() {
		getElement().removeAttribute('disabled');
	}
	function disable() {
		getElement().setAttribute('disabled', '');
	}
	return {
		getElement,
		enable,
		disable,
	};
})();

export const dpad = (() => {
	function getElement() {
		return document.querySelector('.d-pad');
	}
	function isBtn(node) {
		return node.classList.contains('d-pad__btn');
	}
	function enable() {
		getElement()
			.querySelectorAll('.d-pad__btn')
			.forEach(btn => btn.removeAttribute('disabled'));
	}
	function disable() {
		getElement()
			.querySelectorAll('.d-pad__btn')
			.forEach(btn => btn.setAttribute('disabled', ''));
	}

	return {
		getElement,
		isBtn,
		enable,
		disable,
	};
})();
