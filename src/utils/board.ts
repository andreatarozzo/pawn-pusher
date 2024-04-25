import {
  BoardState,
  Direction,
  DirectionAdjustment,
  DirectionKey,
  PawnType,
  Player,
} from '@/types';
import { BoardCell } from '.';

export class Board {
  readonly state: BoardState;
  readonly directionAdjustments: DirectionAdjustment = {
    N: [-1, 0],
    NE: [-1, 1],
    E: [0, 1],
    SE: [1, 1],
    S: [1, 0],
    SW: [1, -1],
    W: [0, -1],
    NW: [-1, -1],
  };

  constructor(maxRows: number, maxCols: number) {
    this.state = Array.from({ length: maxRows }).map((_, row) =>
      Array.from({ length: maxCols }).map((_, col) => new BoardCell(row, col)),
    );

    this.state.forEach((row, rowIdx) =>
      row.forEach((_, colIdx) => this.getCell(rowIdx, colIdx)!.init(this)),
    );
  }

  isCoordinateOutOfBoundaries(row: number, col: number): boolean {
    return row < 0 || row >= this.state.length || col < 0 || col >= this.state[0].length;
  }

  getAdjustedCoordinates(currentRow: number, currentCol: number, direction: Direction): number[] {
    return [currentRow + direction[0], currentCol + direction[1]];
  }

  getCell(row: number, col: number): BoardCell | null {
    return !this.isCoordinateOutOfBoundaries(row, col) ? this.state[row][col] : null;
  }

  canPawnBoop(
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (!this.isCoordinateOutOfBoundaries(pawnCol, pawnCol)) return false;

    const neighbor = this.getCell(pawnRow, pawnCol)?.getNeighbor(directionKey);
    return Boolean(
      neighbor &&
        neighbor.pawn &&
        neighbor.pawn.player !== currentPlayer &&
        !neighbor?.getNeighbor(directionKey)?.pawn,
    );
  }

  canPawnsBePromoted(
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (!this.isCoordinateOutOfBoundaries(pawnCol, pawnCol)) return false;

    const neighbor = this.getCell(pawnRow, pawnCol)?.getNeighbor(directionKey);
    const cellBehindNeighbor = neighbor?.getNeighbor(directionKey);
    return Boolean(
      neighbor &&
        neighbor.pawn?.player === currentPlayer &&
        neighbor.pawn?.type === PawnType.Kitten &&
        cellBehindNeighbor &&
        cellBehindNeighbor.pawn?.player === currentPlayer &&
        cellBehindNeighbor.pawn?.type === PawnType.Kitten,
    );
  }

  hasPlayerWon(
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (!this.isCoordinateOutOfBoundaries(pawnCol, pawnCol)) return false;

    const neighbor = this.getCell(pawnRow, pawnCol)?.getNeighbor(directionKey);
    const cellBehindNeighbor = neighbor?.getNeighbor(directionKey);
    return Boolean(
      neighbor &&
        neighbor.pawn?.player === currentPlayer &&
        neighbor.pawn?.type === PawnType.Cat &&
        cellBehindNeighbor &&
        cellBehindNeighbor.pawn?.player === currentPlayer &&
        cellBehindNeighbor.pawn?.type === PawnType.Cat,
    );
  }
}

export const Boop = (boardState: BoardState, placedPawnRow: number, placedPawnCol: number) => {};

export const PromoteKittens = (boardState: BoardState) => {};
