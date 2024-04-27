import { describe, it, expect, beforeEach } from 'vitest';
import { GameBoard, generatePawn } from '.';
import { BoardCell } from './boardCell';
import { BoardSize, DirectionKey, PawnType, Player } from '@/types';

describe('BoardCell', () => {
  describe('init', () => {
    let board: GameBoard;

    beforeEach(() => {
      board = new GameBoard(BoardSize.Rows, BoardSize.Cols);
    });

    it('Should be able to populate its neighbors property on init', () => {
      const row = 1;
      const col = 1;
      const cell: BoardCell = board.getCell(row, col)!;

      Object.keys(board.directionAdjustments).forEach((k) => {
        expect(cell.getNeighbor(k as DirectionKey)).toBeTruthy();
      });

      const northWestCornerRow = 0;
      const northWestCornerCol = 0;
      const northWestCornerCell: BoardCell = board.getCell(northWestCornerRow, northWestCornerCol)!;

      Object.keys(board.directionAdjustments).forEach((k) => {
        if (['W', 'NW', 'N', 'NE', 'SW'].includes(k)) {
          expect(northWestCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
        } else {
          expect(northWestCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
        }
      });

      const northEstCornerRow = 0;
      const northEstCornerCol = 5;
      const northEstCornerCell: BoardCell = board.getCell(northEstCornerRow, northEstCornerCol)!;

      Object.keys(board.directionAdjustments).forEach((k) => {
        if (['NW', 'N', 'NE', 'E', 'SE'].includes(k)) {
          expect(northEstCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
        } else {
          expect(northEstCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
        }
      });

      const southEastCornerRow = 5;
      const southEastCornerCol = 5;
      const southEastCornerCell: BoardCell = board.getCell(southEastCornerRow, southEastCornerCol)!;

      Object.keys(board.directionAdjustments).forEach((k) => {
        if (['NE', 'E', 'SE', 'S', 'SW'].includes(k)) {
          expect(southEastCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
        } else {
          expect(southEastCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
        }
      });

      const southWestCornerRow = 5;
      const southWestCornerCol = 0;
      const southWestCornerCell: BoardCell = board.getCell(southWestCornerRow, southWestCornerCol)!;

      Object.keys(board.directionAdjustments).forEach((k) => {
        if (['SE', 'S', 'SW', 'W', 'NW'].includes(k)) {
          expect(southWestCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
        } else {
          expect(southWestCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
        }
      });
    });
  });

  describe('getNeighbor', () => {
    let board: GameBoard;

    beforeEach(() => {
      board = new GameBoard(BoardSize.Rows, BoardSize.Cols);
    });

    it('Should be able to get a neighbor when provided with a valid direction key', () => {
      const row = 1;
      const col = 1;
      const cell: BoardCell = board.getCell(row, col)!;

      Object.keys(board.directionAdjustments).forEach((k) => {
        expect(cell.getNeighbor(k as DirectionKey)).toBeTruthy();
      });
    });
  });

  describe('setNeighbor', () => {
    it('Should be able to set a neighbor when provided with a valid direction key', () => {
      const cell: BoardCell = new BoardCell(1, 1);
      const otherCell: BoardCell = new BoardCell(0, 1);
      cell.setNeighbor('N', otherCell);
      expect(cell.getNeighbor('N')).toStrictEqual(otherCell);
    });
  });

  describe('scanNeighbors', () => {
    let board: GameBoard;

    beforeEach(() => {
      board = new GameBoard(BoardSize.Rows, BoardSize.Cols);
    });

    it('Should provide an empty object if no neighbor have a pawn value set', () => {
      const scanResult = board.state[0][0].scanNeighbors();

      expect(Object.keys(scanResult).length).toBe(0);
    });

    it('Should provide an object with includes only the neighbors with a pawn value set', () => {
      board.state[1][1].value = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.state[1][2].value = generatePawn(Player.PlayerTwo, PawnType.Kitten);
      board.state[0][0].value = generatePawn(Player.PlayerTwo, PawnType.Kitten);

      const scanResult = board.state[0][1].scanNeighbors();
      expect(Object.keys(scanResult)).toStrictEqual(['SE', 'S', 'W'] as DirectionKey[]);
      expect(scanResult.SE).toStrictEqual(board.state[1][2]);
      expect(scanResult.S).toStrictEqual(board.state[1][1]);
      expect(scanResult.W).toStrictEqual(board.state[0][0]);
    });
  });
});
