'use strict';

const hideClass = 'hide';

export const allControls = (() => {
	function hide(state = true) {
		const node = getElement();
		if (state) node.classList.add(hideClass);
		else node.classList.remove(hideClass);
	}
	function getElement() {
		return document.querySelector('.setup-controls');
	}
	return {
		hide,
	};
})();

export const rotateBtn = (() => {
	function getElement() {
		return document.querySelector('#rotate-btn');
	}
	function disable(state = true) {
		getElement().disabled = state;
	}
	return {
		getElement,
		disable,
	};
})();

export const confirmBtn = (() => {
	function getElement() {
		return document.querySelector('#confirm-btn');
	}
	function disable(state = true) {
		getElement().disabled = state;
	}
	return {
		getElement,
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
	function disableMidBtn(state = true) {
		document.querySelector('.d-pad__middle-btn').disabled = state;
	}
	function disable(state = true) {
		getElement().childNodes.forEach(btn => (btn.disabled = state));
	}

	return {
		getElement,
		isBtn,
		disable,
		disableMidBtn,
	};
})();
