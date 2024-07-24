'use strict';

import GameboardFactory from '../src/factories/gameboard-factory';

describe('GameboardFactory()', () => {
	const gameboard = GameboardFactory();
	test('contains required properties', () => {
		expect(gameboard).toStrictEqual({
			getInfo: expect.any(Function),
			getAllShipIds: expect.any(Function),
			getShipAtPos: expect.any(Function),
			getAllOccupiedPos: expect.any(Function),
			isPosOccupied: expect.any(Function),
			moveShip: expect.any(Function),
			receiveAttack: expect.any(Function),
			isAllShipSunk: expect.any(Function),
		});
	});
});

describe('getInfo()', () => {
	const gameboard = GameboardFactory();
	test('works', () => {
		expect(gameboard.getInfo()).toMatchObject({
			remainingShips: 5,
			hitsTaken: [],
			avoided: [],
		});
	});

	test('does not mutate', () => {
		for (const prop in gameboard.getInfo()) {
			gameboard.getInfo()[prop] = 'bad value';
			expect(gameboard.getInfo()[prop]).not.toBe('bad value');
		}
	});
});

describe('getAllShipIds()', () => {
	const gameboard = GameboardFactory();
	test('works', () => {
		expect(gameboard.getAllShipIds()).toStrictEqual([
			{ id: 0, length: 5 },
			{ id: 1, length: 4 },
			{ id: 2, length: 3 },
			{ id: 3, length: 3 },
			{ id: 4, length: 2 },
		]);
	});

	test('does not mutate', () => {
		gameboard.getAllShipIds().forEach((shipObj, index) => {
			shipObj = 'bad value';
			expect(gameboard.getAllShipIds()[index]).not.toBe('bad value');
		});
	});
});

describe('getShipAtPos()', () => {
	const gameboard = GameboardFactory();
	const shipId = gameboard.getAllShipIds()[4].id;
	const shipPos = [
		[4, 0],
		[5, 0],
	];
	gameboard.moveShip(shipId, shipPos);
	test('works', () => {
		expect(gameboard.getShipAtPos([5, 0])).toStrictEqual({
			id: 4,
			length: 2,
			isHorizontal: true,
			hitbox: shipPos,
		});
	});

	test('does not mutate', () => {
		const shipObj = gameboard.getShipAtPos([5, 0]);
		shipObj.length = 'bad value';
		expect(gameboard.getShipAtPos([5, 0]).length).not.toBe('bad value');
	});
});

describe('getAllOccupiedPos()', () => {
	const gameboard = GameboardFactory();
	const shipID = gameboard.getAllShipIds()[4].id;
	gameboard.moveShip(shipID, [
		[0, 0],
		[0, 1],
	]);
	test('works', () => {
		const expectedPos = [
			[0, 0],
			[0, 1],
			[1, 0],
			[1, 1],
			[0, 2],
			[1, 2],
		];
		expect(gameboard.getAllOccupiedPos(shipID).sort()).toStrictEqual(expectedPos.sort());
	});
});

describe('isPosOccupied()', () => {
	const gameboard = GameboardFactory();
	const ship1ID = gameboard.getAllShipIds()[0].id;
	const ship2ID = gameboard.getAllShipIds()[1].id;
	const ship3ID = gameboard.getAllShipIds()[2].id;
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

describe('receiveAttack()', () => {
	const gameboard = GameboardFactory();
	const shipID = gameboard.getAllShipIds()[2].id;
	gameboard.moveShip(shipID, [
		[3, 0],
		[4, 0],
		[5, 0],
	]);
	test('works', () => {
		expect(gameboard.receiveAttack([3, 1])).toBe('miss');
		expect(gameboard.receiveAttack([3, 0])).toBe('hit');
		expect(gameboard.receiveAttack([4, 0])).toBe('hit');
		expect(gameboard.receiveAttack([5, 0])).toBe('sunk');
	});
});

describe('isAllShipSunk()', () => {
	const gameboard = GameboardFactory();
	const allShipPos = [
		[
			[0, 9],
			[0, 8],
			[0, 7],
			[0, 6],
			[0, 5],
		],
		[
			[2, 9],
			[2, 8],
			[2, 7],
			[2, 6],
		],
		[
			[4, 9],
			[4, 8],
			[4, 7],
		],
		[
			[6, 9],
			[6, 8],
			[6, 7],
		],
		[
			[8, 9],
			[8, 8],
		],
	];
	allShipPos.forEach((shipPos, index) => {
		gameboard.moveShip(gameboard.getAllShipIds()[index].id, shipPos);
		if (index === 4) return;
		shipPos.forEach(pos => {
			gameboard.receiveAttack(pos);
		});
	});

	test('works', () => {
		expect(gameboard.isAllShipSunk()).toBe(false);
		gameboard.receiveAttack([8, 9]);
		expect(gameboard.isAllShipSunk()).toBe(false);
		gameboard.receiveAttack([8, 8]);
		expect(gameboard.isAllShipSunk()).toBe(true);
	});
});
