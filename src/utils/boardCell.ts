import { DirectionKey, IBoardCell, NeighborCells, Pawn } from '@/types';
import { BaseBoard } from '.';

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

  constructor(row: number, col: number, pawn?: Pawn) {
    this.row = row;
    this.col = col;
    this.pawn = pawn || null;
  }

  /**
   * Returns the cell neighbor associated with the direction key provided
   * @param directionKey N | NE | E | SE | S | SW | W | NW
   * @returns
   */
  getNeighbor(directionKey: DirectionKey): BoardCell | null {
    return this.neighbors[directionKey];
  }

  /**
   * Set the cell neighbor
   * @param directionKey N | NE | E | SE | S | SW | W | NW
   * @param boardCell
   */
  setNeighbor(directionKey: DirectionKey, boardCell: BoardCell | null) {
    this.neighbors[directionKey] = boardCell;
  }

  /**
   * Returns an Object representing only the direction where the neighbors have a pawn value set
   * @returns
   */
  scanNeighbors(): Partial<NeighborCells> {
    return Object.entries(this.neighbors).reduce((result, [directionKey, neighbor]) => {
      if (neighbor && neighbor.pawn) {
        result[directionKey as DirectionKey] = neighbor;
      }

      return result;
    }, {} as Partial<NeighborCells>);
  }

  /**
   * Init the cell by setting the pointers to all neighbor cells
   * @param board
   */
  init(board: BaseBoard) {
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
