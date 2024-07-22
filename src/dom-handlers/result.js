'use strict';

export const result = (() => {
	function show(winnerName, loserName, winnerAccuracy, loserAccuracy, isHumanWinner) {
		const modal = getElem(),
			titleNode = modal.querySelector('#js-res-title'),
			summaryNode = modal.querySelector('#js-res-summary'),
			p1NameAccuracyNode = modal.querySelector('#js-res-p1name'),
			p1AccuracyRateNode = modal.querySelector('#js-res-p1acc'),
			p2NameAccuracyNode = modal.querySelector('#js-res-p2name'),
			p2AccuracyRateNode = modal.querySelector('#js-res-p2acc');

		if (isHumanWinner) {
			titleNode.textContent = 'Brilliant!';
			summaryNode.textContent = `${winnerName} destroys ${loserName}!`;
		} else {
			titleNode.textContent = 'Unlucky!';
			summaryNode.textContent = `${winnerName} washes ${loserName}!`;
		}
		p1NameAccuracyNode.textContent = winnerName;
		p2NameAccuracyNode.textContent = loserName;
		p1AccuracyRateNode.textContent = `${winnerAccuracy}%`;
		p2AccuracyRateNode.textContent = `${loserAccuracy}%`;
		modal.showModal();
	}

	function hide() {
		getElem().close();
	}

	function getResetBtn() {
		return document.querySelector('#res-btn');
	}

	function getElem() {
		return document.querySelector('#js-res-modal');
	}

	return {
		show,
		hide,
		getResetBtn,
	};
})();
