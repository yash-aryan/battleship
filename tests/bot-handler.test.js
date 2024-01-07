'use strict';

import { bot } from '../src/bot-handler';

describe('bot', () => {
	test('works', () => {
		expect(bot).toStrictEqual({
			generatePlacement: expect.any(Function),
			generateShot: expect.any(Function),
			notifyMiss: expect.any(Function),
			notifyHit: expect.any(Function),
			notifyHitAndSunk: expect.any(Function),
			resetFull: expect.any(Function),
		});
	});
});

describe('generateShot()', () => {
	test('works', () => {
		const shot = bot.generateShot();
		expect(shot).toStrictEqual(expect.any(Array));
		expect(shot.length).toBe(2);
		expect(shot[0] >= 0 && shot[0] <= 9).toBe(true);
		expect(shot[1] >= 0 && shot[1] <= 9).toBe(true);
		bot.notifyMiss();
	});

	test('returns unique pos each time', () => {
		const initialShot = bot.generateShot();
		bot.notifyMiss();
		const nextShot = bot.generateShot();
		expect(nextShot).not.toStrictEqual(initialShot);
		bot.notifyMiss();
	});
});
