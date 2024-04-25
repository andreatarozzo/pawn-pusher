import { describe, it, expect, beforeEach } from 'vitest';
import { Board, BoardCell, generatePawn } from '.';
import { PawnType, Player } from '@/types';

const maxRow = 6;
const maxCol = 6;

describe('Board', () => {
  describe('constructor', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(maxRow, maxCol);
    });

    it('Should initialize the board state correctly', () => {
      expect(board.state.length).toBe(maxRow);
      board.state.forEach((_, row) => {
        expect(board.state[row].length).toBe(maxCol);
      });

      Array.from({ length: maxRow }).forEach((_, row) =>
        Array.from({ length: maxCol }).forEach((_, col) => {
          expect(board.getCell(row, col)).toBeTruthy();
          expect(board.getCell(row, col) instanceof BoardCell).toBe(true);
          expect(board.getCell(row, col)?.row).toBe(row);
          expect(board.getCell(row, col)?.col).toBe(col);
        }),
      );
    });
  });

  describe('isCoordinateOutOfBoundaries', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(maxRow, maxCol);
    });

    it('Should return TRUE if the coordinates provided are out of bounds', () => {
      expect(board.isCoordinateOutOfBoundaries(10, 30)).toBe(true);
    });

    it('Should return FALSE if the coordinates provided are out of bounds', () => {
      expect(board.isCoordinateOutOfBoundaries(1, 2)).toBe(false);
    });
  });

  describe('getTargetPawnNewCoordinates', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(maxRow, maxCol);
    });

    it('Should return a new coordinate in the N axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.N)).toStrictEqual([
        0, 1,
      ]);
    });

    it('Should return a new coordinate in the NE axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.NE)).toStrictEqual([
        0, 2,
      ]);
    });

    it('Should return a new coordinate in the E axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.E)).toStrictEqual([
        1, 2,
      ]);
    });

    it('Should return a new coordinate in the SE axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.SE)).toStrictEqual([
        2, 2,
      ]);
    });

    it('Should return a new coordinate in the S axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.S)).toStrictEqual([
        2, 1,
      ]);
    });

    it('Should return a new coordinate in the SW axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.SW)).toStrictEqual([
        2, 0,
      ]);
    });

    it('Should return a new coordinate in the W axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.W)).toStrictEqual([
        1, 0,
      ]);
    });

    it('Should return a new coordinate in the NW axis', () => {
      expect(board.getAdjustedCoordinates(1, 1, board.directionAdjustments.NW)).toStrictEqual([
        0, 0,
      ]);
    });
  });

  describe('canPawnBoop', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(maxRow, maxCol);
    });

    it('Should return FALSE the coordinates provided are out of the board boundaries', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnBoop(maxRow + 1, maxCol + 1, 'N', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE when there are no other pawn around the target cell', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnBoop(1, 1, 'N', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE when the adjacent pawn belong to the currentPlayer', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnBoop(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE when the adjacent pawn has another pawn behind it in the same direction it would be booped', () => {
      board.getCell(0, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);

      expect(board.canPawnBoop(0, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return TRUE when the adjacent pawn belong to the opposite player and there is not another pawn behind it', () => {
      board.getCell(0, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);

      expect(board.canPawnBoop(0, 1, 'S', Player.PlayerOne)).toBe(true);
    });
  });

  describe('canPawnsBePromoted', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(maxRow, maxCol);
    });

    it('Should return FALSE the coordinates provided are out of the board boundaries', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnsBePromoted(maxRow + 1, maxCol + 1, 'N', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE if there are no 3 Kitten pawns belonging to the same player in the same line', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnsBePromoted(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE if there are 3 Kitten pawns in a row but they do not belong to the same player', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);
      board.getCell(3, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnsBePromoted(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE if there are 3 pawns belonging to the same player but the pawns are not all Kittens', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(3, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

      expect(board.canPawnsBePromoted(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return TRUE if there are 3 Kitten pawns belonging to the same player in the same line', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(3, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.canPawnsBePromoted(1, 1, 'S', Player.PlayerOne)).toBe(true);
    });
  });

  describe('hasPlayerWon', () => {
    let board: Board;

    beforeEach(() => {
      board = new Board(maxRow, maxCol);
    });

    it('Should return FALSE the coordinates provided are out of the board boundaries', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      expect(board.hasPlayerWon(maxRow + 1, maxCol + 1, 'N', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE if there are no 3 pawns belonging to the same player in the same line', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

      expect(board.hasPlayerWon(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE if there are 3 Cat pawns in a line but they do not belong to the same player', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerTwo, PawnType.Cat);
      board.getCell(3, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

      expect(board.hasPlayerWon(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return FALSE if there are 3 pawns of belonging to the same player but the pawns are not all Cats', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
      board.getCell(3, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

      expect(board.hasPlayerWon(1, 1, 'S', Player.PlayerOne)).toBe(false);
    });

    it('Should return TRUE if there are 3 Cat pawns belonging to the same player in the same line', () => {
      board.getCell(1, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.getCell(2, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.getCell(3, 1)!.pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

      expect(board.hasPlayerWon(1, 1, 'S', Player.PlayerOne)).toBe(true);
    });
  });
});
