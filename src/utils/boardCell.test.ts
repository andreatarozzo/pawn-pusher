import { describe, it, expect, beforeEach } from 'vitest';
import { Board } from '.';
import { BoardCell } from './boardCell';
import { DirectionKey } from '@/types';

describe('BoardCell', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board(6, 6);
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

  it('Should be able to get a neighbor when provided with a valid direction key', () => {
    const row = 1;
    const col = 1;
    const cell: BoardCell = board.getCell(row, col)!;

    Object.keys(board.directionAdjustments).forEach((k) => {
      expect(cell.getNeighbor(k as DirectionKey)).toBeTruthy();
    });
  });

  it('Should be able to set a neighbor when provided with a valid direction key', () => {
    const cell: BoardCell = new BoardCell(1, 1);
    const otherCell: BoardCell = new BoardCell(0, 1);
    cell.setNeighbor('N', otherCell);
    expect(cell.getNeighbor('N')).toStrictEqual(otherCell);
  });
});
