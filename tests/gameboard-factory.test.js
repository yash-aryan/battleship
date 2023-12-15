'use strict';

import { GameboardFactory } from '../src/gameboard-factory';

describe('GameboardFactory()', () => {
	const gameboard = GameboardFactory();
	test('contains required properties', () => {
		expect(gameboard).toMatchObject({
			getInfo: expect.any(Function),
			canShipMoveTo: expect.any(Function),
			moveShipTo: expect.any(Function),
			receiveAttackAt: expect.any(Function),
			isAllShipSunk: expect.any(Function),
		});
	});
});

describe('getInfo()', () => {
	const gameboard = GameboardFactory();
	test('works', () => {
		expect(gameboard.getInfo()).toMatchObject({
			allShipIDs: [
				{ id: 0, length: 5 },
				{ id: 1, length: 4 },
				{ id: 2, length: 3 },
				{ id: 3, length: 3 },
				{ id: 4, length: 2 },
			],
			remainingShips: 5,
			hits: [],
			misses: [],
		});
	});

	test('does not mutate', () => {
		for (const prop in gameboard.getInfo()) {
			gameboard.getInfo()[prop] = 'bad value';
			expect(gameboard.getInfo()[prop]).not.toBe('bad value');
		}
	});
});

describe('getShipByID', () => {
	const gameboard = GameboardFactory();
	const shipID = gameboard.getInfo().allShipIDs[0].id;
	test('works', () => {
		expect(gameboard.getShipByID(shipID)).toHaveProperty('length', 5);
		expect(gameboard.getShipByID(shipID)).toHaveProperty('isOccupied', expect.any(Function));
	});

	test('does to mutate', () => {
		for (const prop in gameboard.getShipByID(shipID)) {
			gameboard.getShipByID(shipID)[prop] = 'bad value';
			expect(gameboard.getShipByID(shipID)[prop]).not.toBe('bad value');
		}
	});
});

describe('canShipMoveTo', () => {
	const gameboard = GameboardFactory();
	const shipID = gameboard.getInfo().allShipIDs[0].id;
	test('works', () => {
		expect(gameboard.canShipMoveTo(shipID, [0, 0])).toBe(true);
		expect(
			gameboard.canShipMoveTo(shipID, [
				[0, 0],
				[1, 0],
				[2, 0],
				[3, 0],
				[4, 0],
			])
		).toBe(true);
		expect(gameboard.canShipMoveTo(shipID, [0, 10])).toBe(false);
		expect(gameboard.canShipMoveTo(shipID, [-1, 3])).toBe(false);
	});
});

describe('moveShipTo', () => {
	const gameboard = GameboardFactory();
	const shipID = gameboard.getInfo().allShipIDs[0].id;
	test('works', () => {
		gameboard.moveShipTo(shipID, [
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 0],
			[4, 0],
		]);
		expect(gameboard.getShipByID(shipID).isOccupied([0, 0])).toBe(true);
		expect(gameboard.getShipByID(shipID).isOccupied([4, 0])).toBe(true);
	});
});

describe('receiveAttack', () => {
	const gameboard = GameboardFactory();
	const shipID = gameboard.getInfo().allShipIDs[4].id;
	const posArr = [
		[4, 5],
		[4, 4],
	];
	gameboard.moveShipTo(shipID, posArr);
	test('works', () => {
		gameboard.receiveAttackAt([4, 5]);
		const ship = gameboard.getShipByID(shipID);
		expect(ship.hitCount).toBe(1);
	});
});

describe('isAllShipSunk', () => {
	const gameboard = GameboardFactory([2, 2]);
	const ship1ID = gameboard.getInfo().allShipIDs[0].id;
	const ship2ID = gameboard.getInfo().allShipIDs[1].id;
	gameboard.moveShipTo(ship1ID, [
		[4, 5],
		[5, 5],
	]);
	gameboard.moveShipTo(ship2ID, [
		[0, 0],
		[1, 0],
	]);

	test('works', () => {
		gameboard.receiveAttackAt([0, 0]);
		gameboard.receiveAttackAt([1, 0]);
		expect(gameboard.isAllShipSunk()).toBe(false);
		gameboard.receiveAttackAt([4, 5]);
		gameboard.receiveAttackAt([5, 5]);
		expect(gameboard.isAllShipSunk()).toBe(true);
	});
});
