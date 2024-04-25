import { describe, it, expect } from 'vitest';
import { generatePawn } from '.';
import { Pawn, PawnType, Player } from '@/types';

describe('generatePawn', () => {
  it('Should throw a TypeError if even one of the params is undefined', () => {
    let undefinedValue;
    const error = TypeError('player or type cannot be undefined');
    expect(() => generatePawn(undefinedValue!, undefinedValue!)).toThrow(error);
    expect(() => generatePawn(undefinedValue!, PawnType.Kitten)).toThrow(error);
    expect(() => generatePawn(Player.PlayerOne, undefinedValue!)).toThrow(error);
  });
  it('Should generate a valid pawn', () => {
    const pawn: Pawn = {
      player: Player.PlayerOne,
      type: PawnType.Cat,
    };
    expect(generatePawn(Player.PlayerOne, PawnType.Cat)).toStrictEqual(pawn);
  });
});
