'use strict';

import { bot } from '../src/bot-handler';

describe('generateShot()', () => {
	const shot = bot.generateShot();
	test('works', () => {
		expect(shot).toStrictEqual(expect.any(Array));
		expect(shot.length).toBe(2);
		expect(shot[0] >= 0 && shot[0] <= 9).toBe(true);
		expect(shot[1] >= 0 && shot[1] <= 9).toBe(true);
	});
    
	test('generates unique shots only', () => {
		for (let i = 1; i < 100; i++) {
			const newShot = bot.generateShot();
			if (newShot[0] === shot[0]) expect(newShot[1]).not.toBe(shot[1]);
			else if (newShot[1] === shot[1]) expect(newShot[0]).not.toBe(shot[0]);
		}
	});
});
