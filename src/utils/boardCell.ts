import { DirectionKey, IBoardCell, NeighborCells, Pawn } from '@/types';
import { Board } from './board';

export class BoardCell implements IBoardCell {
  readonly neighbors: NeighborCells = {
    N: null,
    NE: null,
    E: null,
    SE: null,
    S: null,
    SW: null,
    W: null,
    NW: null,
  };
  row: number;
  col: number;
  pawn: Pawn | null = null;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  getNeighbor(directionKey: DirectionKey): BoardCell | null {
    return this.neighbors[directionKey];
  }

  setNeighbor(directionKey: DirectionKey, boardCell: BoardCell | null) {
    this.neighbors[directionKey] = boardCell;
  }

  init(board: Board) {
    Object.entries(board.directionAdjustments).forEach(([directionKey, directionAdjustment]) => {
      const [newRow, newCol] = board.getAdjustedCoordinates(
        this.row,
        this.col,
        directionAdjustment,
      );
      this.setNeighbor(
        directionKey as DirectionKey,
        !board.isCoordinateOutOfBoundaries(newRow, newCol) ? board.getCell(newRow, newCol) : null,
      );
    });
  }
}
