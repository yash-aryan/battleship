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
});
