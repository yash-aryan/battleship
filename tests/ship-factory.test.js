'use strict';

import { ShipFactory } from '../src/ship-factory';

describe('ShipFactory()', () => {
	test('contains required properties', () => {
		expect(ShipFactory(5)).toMatchObject({
			getInfo: expect.any(Function),
			hit: expect.any(Function),
			isSunk: expect.any(Function),
			setPos: expect.any(Function),
			isHit: expect.any(Function),
			isOccupied: expect.any(Function),
		});
	});
});

describe('getInfo()', () => {
	const ship = ShipFactory(5);
	test('contains required properties', () => {
		expect(ship.getInfo()).toMatchObject({
			length: 5,
			hitCount: 0,
			isHorizontal: null,
			hitbox: [],
			padding: [],
		});
	});
	test('does not mutate', () => {
		for (const prop in ship.getInfo()) {
			ship.getInfo()[prop] = 'bad value';
			expect(ship.getInfo()[prop]).not.toBe('bad value');
		}
	});
});

describe('hit()', () => {
	test('works', () => {
		const ship = ShipFactory(5);
		ship.hit();
		expect(ship.getInfo().hitCount).toBe(1);
		ship.hit();
		expect(ship.getInfo().hitCount).toBe(2);
	});
	test('does not increase beyond length', () => {
		const ship = ShipFactory(2);
		ship.hit();
		ship.hit();
		ship.hit();
		ship.hit();
		expect(ship.getInfo().hitCount).toBe(2);
	});
});

describe('isSunk()', () => {
	test('works', () => {
		const ship = ShipFactory(2);
		ship.hit();
		expect(ship.isSunk()).toBe(false);
		ship.hit();
		expect(ship.isSunk()).toBe(true);
	});
});

describe('setPos()', () => {
	const ship = ShipFactory(3);
	test('works with pos[0, 0] horizontally', () => {
		const posArr = [
			[0, 0],
			[1, 0],
			[2, 0],
		];
		ship.setPos(posArr);
		expect(ship.getInfo().hitbox.length).toBe(posArr.length);
		expect(ship.getInfo().hitbox.sort()).toStrictEqual(posArr.sort());
	});
	test('works with pos[9, 9] horizontally', () => {
		const posArr = [
			[9, 9],
			[8, 9],
			[7, 9],
		];
		ship.setPos(posArr);
		expect(ship.getInfo().hitbox.length).toBe(posArr.length);
		expect(ship.getInfo().hitbox.sort()).toStrictEqual(posArr.sort());
	});
	test('works with pos[0, 0] vertically', () => {
		const posArr = [
			[0, 0],
			[0, 1],
			[0, 2],
		];
		ship.setPos(posArr);
		expect(ship.getInfo().hitbox.length).toBe(posArr.length);
		expect(ship.getInfo().hitbox.sort()).toStrictEqual(posArr.sort());
	});

	test('works with pos[9, 9] vertically', () => {
		const posArr = [
			[9, 9],
			[9, 8],
			[9, 7],
		];
		ship.setPos(posArr);
		expect(ship.getInfo().hitbox.length).toBe(posArr.length);
		expect(ship.getInfo().hitbox.sort()).toStrictEqual(posArr.sort());
	});
});

describe('isHit()', () => {
	const ship = ShipFactory(5);
	const posArr = [
		[2, 9],
		[3, 9],
		[4, 9],
		[5, 9],
		[6, 9],
	];
	ship.setPos(posArr);
	test('works', () => {
		posArr.forEach(pos => expect(ship.isHit(pos)).toBe(true));
		expect(ship.isHit([7, 9])).toBe(false);
		expect(ship.isHit([2, 8])).toBe(false);
	});
});

describe('getInfo().isHorizontal', () => {
	const ship = ShipFactory(2);
	test('works', () => {
		ship.setPos([
			[4, 4],
			[5, 4],
		]);
		expect(ship.getInfo().isHorizontal).toBe(true);
		ship.setPos([
			[8, 9],
			[8, 8],
		]);
		expect(ship.getInfo().isHorizontal).toBe(false);
	});
});

describe('isOccupied()', () => {
	const ship = ShipFactory(2);
	const posArr = [
		[4, 4],
		[5, 4],
	];
	const occupiedArr = [
		[3, 5],
		[4, 5],
		[5, 5],
		[6, 5],
		[3, 4],
		[4, 4],
		[5, 4],
		[6, 4],
		[3, 3],
		[4, 3],
		[5, 3],
		[6, 3],
	];
	ship.setPos(posArr);
	test('works', () => {
		occupiedArr.forEach(pos => expect(ship.isOccupied(pos)).toBe(true));
		expect(ship.isOccupied([2, 4])).toBe(false);
		expect(ship.isOccupied([7, 4])).toBe(false);
		expect(ship.isOccupied([4, 6])).toBe(false);
		expect(ship.isOccupied([4, 2])).toBe(false);
	});
});
