import { describe, it, expect } from 'vitest';
import {
  DirectionAdjustments,
  boardInitialState,
  generateCoordinatesAdjustments,
  getAdjustedCoordinates,
  isCoordinateOutOfBoundaries,
  updatePawnCoordinates,
} from '.';
import { Pawn, PawnType } from '@/types';

describe('isCoordinateOutOfBoundaries', () => {
  it('Should return TRUE if the coordinates provided are out of bounds', () => {
    expect(isCoordinateOutOfBoundaries(boardInitialState, 10, 30)).toBe(true);
  });

  it('Should return FALSE if the coordinates provided are out of bounds', () => {
    expect(isCoordinateOutOfBoundaries(boardInitialState, 1, 2)).toBe(false);
  });
});

describe('getTargetPawnNewCoordinates', () => {
  it('Should return a new coordinate in the N axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.N)).toStrictEqual([0, 1]);
  });

  it('Should return a new coordinate in the NE axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.NE)).toStrictEqual([0, 2]);
  });

  it('Should return a new coordinate in the E axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.E)).toStrictEqual([1, 2]);
  });

  it('Should return a new coordinate in the SE axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.SE)).toStrictEqual([2, 2]);
  });

  it('Should return a new coordinate in the S axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.S)).toStrictEqual([2, 1]);
  });

  it('Should return a new coordinate in the SW axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.SW)).toStrictEqual([2, 0]);
  });

  it('Should return a new coordinate in the W axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.W)).toStrictEqual([1, 0]);
  });

  it('Should return a new coordinate in the NW axis', () => {
    expect(getAdjustedCoordinates(1, 1, DirectionAdjustments.NW)).toStrictEqual([0, 0]);
  });
});

describe('updatePawnCoordinates', () => {
  it('Should update the coordinates as expected', () => {
    const pawn: Pawn = {
      type: PawnType.Cat,
      player: 0,
    };
    boardInitialState[1][1] = pawn;
    const result = updatePawnCoordinates(boardInitialState, pawn, 1, 1, 2, 2);
    expect(result[1][1]).toBe(null);
    expect(result[2][2]).toStrictEqual(pawn);
    expect(result[2][2] === boardInitialState[1][1]).toBe(true);
  });
});

describe('generateCoordinatesAdjustments', () => {
  it('Should generate the right set of coordinates', () => {
    expect(generateCoordinatesAdjustments(boardInitialState, 1, 1)).toStrictEqual(
      Object.values(DirectionAdjustments),
    );
  });

  it('Should not provide coordinates out of boundaries', () => {
    expect(generateCoordinatesAdjustments(boardInitialState, 0, 0)).toStrictEqual([
      DirectionAdjustments.E,
      DirectionAdjustments.SE,
      DirectionAdjustments.S,
    ]);

    expect(generateCoordinatesAdjustments(boardInitialState, 0, 5)).toStrictEqual([
      DirectionAdjustments.S,
      DirectionAdjustments.SW,
      DirectionAdjustments.W,
    ]);

    expect(generateCoordinatesAdjustments(boardInitialState, 5, 5)).toStrictEqual([
      DirectionAdjustments.N,
      DirectionAdjustments.W,
      DirectionAdjustments.NW,
    ]);

    expect(generateCoordinatesAdjustments(boardInitialState, 5, 0)).toStrictEqual([
      DirectionAdjustments.N,
      DirectionAdjustments.NE,
      DirectionAdjustments.E,
    ]);
  });
});
