import {
  BoardState,
  Direction,
  DirectionAdjustment,
  DirectionKey,
  IBaseBoard,
  IBoard,
  PawnType,
  Player,
} from '@/types';
import { BoardCell } from '.';

export class BaseBoard implements IBaseBoard {
  state: BoardState;
  readonly directionsList = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as DirectionKey[];
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

  constructor(maxRows: number, maxCols: number, boardState?: BoardState) {
    if (!boardState) {
      this.state = Array.from({ length: maxRows }).map((_, row) =>
        Array.from({ length: maxCols }).map((_, col) => new BoardCell(row, col)),
      );

      this.state.forEach((row, rowIdx) =>
        row.forEach((_, colIdx) => this.getCell(rowIdx, colIdx)!.init(this)),
      );
    } else {
      this.state = boardState;
    }
  }

  /**
   * Check if the provided coordinates fall off the current game board
   * @param row
   * @param col
   * @returns
   */
  isCoordinateOutOfBoundaries(row: number, col: number): boolean {
    return row < 0 || row >= this.state.length || col < 0 || col >= this.state[0].length;
  }

  /**
   * Given a starting set of coordinates and a direction
   * (coordinate modifier i.e [-1, 1] -> Start row + (-1), Start col + (1))
   * return a new set of coordinates 1 cell away in the provided direction
   * @param currentRow
   * @param currentCol
   * @param direction
   * @returns
   */
  getAdjustedCoordinates(currentRow: number, currentCol: number, direction: Direction): number[] {
    return [currentRow + direction[0], currentCol + direction[1]];
  }

  /**
   * Returns the content of the cell at the provided coordinates
   * @param row
   * @param col
   * @returns
   */
  getCell(row: number, col: number): BoardCell | null {
    return !this.isCoordinateOutOfBoundaries(row, col) ? this.state[row][col] : null;
  }
}

export class Board extends BaseBoard implements IBoard {
  constructor(maxRows: number, maxCols: number) {
    super(maxRows, maxCols);
  }

  /**
   * Checks if the pawn at the given coordinates can boop the neighbor pawn located at the direction provided.
   * @param pawnRow
   * @param pawnCol
   * @param directionKey N | NE | E | SE | S | SW | W | NW
   * @param currentPlayer
   * @returns
   */
  canPawnBoop(
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    const neighbor = this.getCell(pawnRow, pawnCol)?.getNeighbor(directionKey);
    return Boolean(
      neighbor &&
        neighbor.pawn &&
        neighbor.pawn.player !== currentPlayer &&
        (!neighbor?.getNeighbor(directionKey) || !neighbor.getNeighbor(directionKey)?.pawn),
    );
  }

  /**
   * Checks if the pawn at the given coordinates can be promoted along the direction key provided
   * Starting the computation at the row and col provided and moving forward at the direction passed as param.
   * @param pawnRow
   * @param pawnCol
   * @param directionKey N | NE | E | SE | S | SW | W | NW
   * @param currentPlayer
   * @returns
   */
  canPawnsBePromoted(
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (this.isCoordinateOutOfBoundaries(pawnCol, pawnCol)) return false;
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

  /**
   * Checks if a player has won the game.
   * Starting the computation at the row and col provided and moving forward at the direction passed as param.
   * @param pawnRow
   * @param pawnCol
   * @param directionKey N | NE | E | SE | S | SW | W | NW
   * @param currentPlayer
   * @returns
   */
  hasPlayerWon(
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (this.isCoordinateOutOfBoundaries(pawnCol, pawnCol)) return false;

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

  /**
   * Updates the board state by booing the player's opponent pawn.
   * Returns true if the boop was successful.
   * False if the condition for a boop were not met.
   * Starting the computation at the row and col provided and moving forward at the direction passed as param.
   * @param newPawnRow
   * @param newPawnCol
   * @param directionKey N | NE | E | SE | S | SW | W | NW
   * @param currentPlayer
   * @returns
   */
  boopPawn(
    newPawnRow: number,
    newPawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (this.canPawnBoop(newPawnRow, newPawnCol, directionKey, currentPlayer)) {
      const neighbor = this.getCell(newPawnRow, newPawnCol)!.getNeighbor(directionKey);
      const cellBehindNeighbor = neighbor?.getNeighbor(directionKey);

      // Check if booped pawn will fall off board;
      if (cellBehindNeighbor) {
        this.state[cellBehindNeighbor.row!][cellBehindNeighbor.col!].pawn = JSON.parse(
          JSON.stringify(neighbor?.pawn!),
        );
      }

      this.state[neighbor?.row!][neighbor?.col!].pawn = null;
      return true;
    }
    return false;
  }

  /**
   * Updates the board state by removing the pawn that can be promoted.
   * Returns true if the pawns were removed.
   * False if the condition for promotion were not met.
   * Starting the computation at the row and col provided and moving forward at the direction passed as param.
   * @param newPawnRow
   * @param newPawnCol
   * @param directionKey
   * @param currentPlayer
   * @returns
   */
  promoteKittens(
    newPawnRow: number,
    newPawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ): boolean {
    if (this.canPawnsBePromoted(newPawnRow, newPawnCol, directionKey, currentPlayer)) {
      const newPawn = this.getCell(newPawnRow, newPawnCol);
      const neighbor = newPawn!.getNeighbor(directionKey);
      const cellBehindNeighbor = neighbor?.getNeighbor(directionKey);

      this.state[newPawn?.row!][newPawn?.col!].pawn = null;
      this.state[neighbor?.row!][neighbor?.col!].pawn = null;
      this.state[cellBehindNeighbor?.row!][cellBehindNeighbor?.col!].pawn = null;
      return true;
    }
    return false;
  }
}
