'use strict';

export const result = (() => {
	function show(winnerName, loserName, winnerAccuracy, loserAccuracy, isHumanWinner) {
		const modal = getElement(),
			title = modal.querySelector('#result-title'),
			summary = modal.querySelector('#result-summary'),
			p1Name = modal.querySelector('.stats__p1-name'),
			p1Accuracy = modal.querySelector('#p1-accuracy'),
			p2Name = modal.querySelector('.stats__p2-name'),
			p2Accuracy = modal.querySelector('#p2-accuracy');

		if (isHumanWinner) {
			title.classList.add('win');
			title.textContent = '> Brilliant!';
			summary.textContent = `${winnerName} destroys ${loserName}!`;
		} else {
			title.classList.add('loss');
			title.textContent = '> Unlucky!';
			summary.textContent = `${winnerName} washes ${loserName}!`;
		}
		p1Name.textContent = winnerName;
		p2Name.textContent = loserName;
		p1Accuracy.textContent = `${winnerAccuracy}%`;
		p2Accuracy.textContent = `${loserAccuracy}%`;
		modal.showModal();
	}

	function hide() {
		getElement().close();
		const title = getElement().querySelector('#result-title');
		title.classList.remove('win', 'loss');
	}

	function getResetBtn() {
		return document.querySelector('#result-btn');
	}

	function getElement() {
		return document.querySelector('#result-modal');
	}

	return {
		show,
		hide,
		getResetBtn,
	};
})();
