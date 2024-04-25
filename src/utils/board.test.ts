import { describe, it, expect, beforeEach } from 'vitest';
import {
  BoardCell,
  DirectionAdjustments,
  canBoop,
  canPromote,
  getAdjustedCoordinates,
  hasPlayerWon,
  isCoordinateOutOfBoundaries,
} from '.';
import { BoardState, DirectionKey, Pawn, PawnType, Player } from '@/types';

const generatePawn = (player: Player, type: PawnType): Pawn => ({
  player,
  type,
});

describe('isCoordinateOutOfBoundaries', () => {
  let boardState: BoardState;

  beforeEach(() => {
    boardState = Array.from({ length: 6 }).map((_) =>
      Array.from({ length: 6 }).map((_) => new BoardCell()),
    );
  });

  it('Should return TRUE if the coordinates provided are out of bounds', () => {
    expect(isCoordinateOutOfBoundaries(boardState, 10, 30)).toBe(true);
  });

  it('Should return FALSE if the coordinates provided are out of bounds', () => {
    expect(isCoordinateOutOfBoundaries(boardState, 1, 2)).toBe(false);
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

describe('BoardCell', () => {
  let boardState: BoardState;

  beforeEach(() => {
    boardState = Array.from({ length: 6 }).map((_) =>
      Array.from({ length: 6 }).map((_) => new BoardCell()),
    );
  });

  it('Should be able to populate its neighbors property on init', () => {
    const row = 1;
    const col = 1;
    const cell: BoardCell = boardState[row][col];
    cell.init(boardState, row, col);

    Object.keys(DirectionAdjustments).forEach((k) => {
      expect(cell.getNeighbor(k as DirectionKey)).toBeTruthy();
    });

    const northWestCornerRow = 0;
    const northWestCornerCol = 0;
    const northWestCornerCell: BoardCell = boardState[northWestCornerRow][northWestCornerCol];
    northWestCornerCell.init(boardState, northWestCornerRow, northWestCornerCol);

    Object.keys(DirectionAdjustments).forEach((k) => {
      if (['W', 'NW', 'N', 'NE', 'SW'].includes(k)) {
        expect(northWestCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
      } else {
        expect(northWestCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
      }
    });

    const northEstCornerRow = 0;
    const northEstCornerCol = 5;
    const northEstCornerCell: BoardCell = boardState[northEstCornerRow][northEstCornerCol];
    northEstCornerCell.init(boardState, northEstCornerRow, northEstCornerCol);

    Object.keys(DirectionAdjustments).forEach((k) => {
      if (['NW', 'N', 'NE', 'E', 'SE'].includes(k)) {
        expect(northEstCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
      } else {
        expect(northEstCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
      }
    });

    const southEastCornerRow = 5;
    const southEastCornerCol = 5;
    const southEastCornerCell: BoardCell = boardState[southEastCornerRow][southEastCornerCol];
    southEastCornerCell.init(boardState, southEastCornerRow, southEastCornerCol);

    Object.keys(DirectionAdjustments).forEach((k) => {
      if (['NE', 'E', 'SE', 'S', 'SW'].includes(k)) {
        expect(southEastCornerCell.getNeighbor(k as DirectionKey)).toBeFalsy();
      } else {
        expect(southEastCornerCell.getNeighbor(k as DirectionKey)).toBeTruthy();
      }
    });

    const southWestCornerRow = 5;
    const southWestCornerCol = 0;
    const southWestCornerCell: BoardCell = boardState[southWestCornerRow][southWestCornerCol];
    southWestCornerCell.init(boardState, southWestCornerRow, southWestCornerCol);

    Object.keys(DirectionAdjustments).forEach((k) => {
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
    const cell: BoardCell = boardState[row][col];
    cell.init(boardState, row, col);

    Object.keys(DirectionAdjustments).forEach((k) => {
      expect(cell.getNeighbor(k as DirectionKey)).toBeTruthy();
    });
  });

  it('Should be able to set a neighbor when provided with a valid direction key', () => {
    const cell: BoardCell = new BoardCell();
    const otherCell: BoardCell = new BoardCell();
    cell.setNeighbor('N', otherCell);
    expect(cell.getNeighbor('N')).toStrictEqual(otherCell);
  });
});

describe('canBoop', () => {
  let boardState: BoardState;

  beforeEach(() => {
    boardState = Array.from({ length: 6 }).map((_) =>
      Array.from({ length: 6 }).map((_) => new BoardCell()),
    );
  });

  it('Should return FALSE when there are no other pawn around the target cell', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

    expect(canBoop(boardState[1][1], 'N', Player.PlayerOne)).toBe(false);
  });

  it('Should return FALSE when the adjacent pawn belong to the currentPlayer', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

    expect(canBoop(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return FALSE when the adjacent pawn has another pawn behind it in the same direction it would be booped', () => {
    boardState[0][1].init(boardState, 0, 1);
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[0][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[1][1].pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);
    boardState[2][1].pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);

    expect(canBoop(boardState[0][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return TRUE when the adjacent pawn belong to the opposite player and there is not another pawn behind it', () => {
    boardState[0][1].init(boardState, 0, 1);
    boardState[1][1].init(boardState, 1, 1);
    boardState[0][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[1][1].pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);

    expect(canBoop(boardState[0][1], 'S', Player.PlayerOne)).toBe(true);
  });
});

describe('canPromote', () => {
  let boardState: BoardState;

  beforeEach(() => {
    boardState = Array.from({ length: 6 }).map((_) =>
      Array.from({ length: 6 }).map((_) => new BoardCell()),
    );
  });

  it('Should return FALSE if there are no 3 Kitten pawns belonging to the same player in the same line', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

    expect(canPromote(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return FALSE if there are 3 Kitten pawns in a row but they do not belong to the same player', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[3][1].init(boardState, 3, 1);

    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[2][1].pawn = generatePawn(Player.PlayerTwo, PawnType.Kitten);
    boardState[3][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

    expect(canPromote(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return FALSE if there are 3 pawns belonging to the same player but the pawns are not all Kittens', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[3][1].init(boardState, 3, 1);

    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[3][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

    expect(canPromote(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return TRUE if there are 3 Kitten pawns belonging to the same player in the same line', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[3][1].init(boardState, 3, 1);

    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[3][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

    expect(canPromote(boardState[1][1], 'S', Player.PlayerOne)).toBe(true);
  });
});

describe('hasPlayerWon', () => {
  let boardState: BoardState;

  beforeEach(() => {
    boardState = Array.from({ length: 6 }).map((_) =>
      Array.from({ length: 6 }).map((_) => new BoardCell()),
    );
  });

  it('Should return FALSE if there are no 3 pawns belonging to the same player in the same line', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

    expect(hasPlayerWon(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return FALSE if there are 3 Cat pawns in a line but they do not belong to the same player', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[3][1].init(boardState, 3, 1);

    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
    boardState[2][1].pawn = generatePawn(Player.PlayerTwo, PawnType.Cat);
    boardState[3][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

    expect(hasPlayerWon(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return FALSE if there are 3 pawns of belonging to the same player but the pawns are not all Cats', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[3][1].init(boardState, 3, 1);

    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);
    boardState[3][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

    expect(hasPlayerWon(boardState[1][1], 'S', Player.PlayerOne)).toBe(false);
  });

  it('Should return TRUE if there are 3 Cat pawns belonging to the same player in the same line', () => {
    boardState[1][1].init(boardState, 1, 1);
    boardState[2][1].init(boardState, 2, 1);
    boardState[3][1].init(boardState, 3, 1);

    boardState[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
    boardState[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
    boardState[3][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

    expect(hasPlayerWon(boardState[1][1], 'S', Player.PlayerOne)).toBe(true);
  });
});
