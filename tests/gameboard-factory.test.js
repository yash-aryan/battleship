'use strict';

import { GameboardFactory } from '../src/gameboard-factory';

describe('GameboardFactory()', () => {
	const gameboard = GameboardFactory();
	test('contains required properties', () => {
		expect(gameboard).toStrictEqual({
			getInfo: expect.any(Function),
			isPosOccupied: expect.any(Function),
			moveShip: expect.any(Function),
			receiveAttack: expect.any(Function),
			getLastShotReport: expect.any(Function),
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

describe('isPosOccupied()', () => {
	const gameboard = GameboardFactory([5, 4, 3]);
	const ship1ID = gameboard.getInfo().allShipIDs[0].id;
	const ship2ID = gameboard.getInfo().allShipIDs[1].id;
	const ship3ID = gameboard.getInfo().allShipIDs[2].id;
	gameboard.moveShip(ship1ID, [
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3],
		[0, 4],
	]);
	gameboard.moveShip(ship2ID, [
		[8, 6],
		[8, 5],
		[8, 4],
		[8, 3],
	]);
	gameboard.moveShip(ship3ID, [
		[3, 0],
		[4, 0],
		[5, 0],
	]);
	test('works', () => {
		expect(gameboard.isPosOccupied([8, 4])).toBe(true);
		expect(gameboard.isPosOccupied([0, 2])).toBe(true);
		expect(gameboard.isPosOccupied([1, 2])).toBe(true);
		expect(gameboard.isPosOccupied([4, 0])).toBe(true);
		expect(gameboard.isPosOccupied([4, 4])).toBe(false);
	});
});

describe('getLastShotReport()', () => {
	const gameboard = GameboardFactory([5, 4, 3]);
	const ship1ID = gameboard.getInfo().allShipIDs[0].id;
	const ship2ID = gameboard.getInfo().allShipIDs[1].id;
	const ship3ID = gameboard.getInfo().allShipIDs[2].id;
	gameboard.moveShip(ship1ID, [
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3],
		[0, 4],
	]);
	gameboard.moveShip(ship2ID, [
		[8, 6],
		[8, 5],
		[8, 4],
		[8, 3],
	]);
	gameboard.moveShip(ship3ID, [
		[3, 0],
		[4, 0],
		[5, 0],
	]);
	test('works', () => {
		gameboard.receiveAttack([1, 2]);
		expect(gameboard.getLastShotReport()).toBe('miss');
		gameboard.receiveAttack([3, 0]);
		expect(gameboard.getLastShotReport()).toBe('hit');
		gameboard.receiveAttack([4, 0]);
		gameboard.receiveAttack([5, 0]);
		expect(gameboard.getLastShotReport()).toBe('sunk');
	});
});

describe('isAllShipSunk()', () => {
	const gameboard = GameboardFactory([2, 2]);
	const ship1ID = gameboard.getInfo().allShipIDs[0].id;
	const ship2ID = gameboard.getInfo().allShipIDs[1].id;
	gameboard.moveShip(ship1ID, [
		[4, 5],
		[5, 5],
	]);
	gameboard.moveShip(ship2ID, [
		[0, 0],
		[1, 0],
	]);

	test('works', () => {
		gameboard.receiveAttack([0, 0]);
		gameboard.receiveAttack([1, 0]);
		expect(gameboard.isAllShipSunk()).toBe(false);
		gameboard.receiveAttack([4, 5]);
		gameboard.receiveAttack([5, 5]);
		expect(gameboard.isAllShipSunk()).toBe(true);
	});
});
