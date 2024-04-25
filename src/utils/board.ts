import {
  BoardState,
  Direction,
  DirectionAdjustment,
  DirectionKey,
  IBoardCell,
  NeighborCells,
  Pawn,
  PawnType,
  Player,
} from '@/types';

export const DirectionAdjustments: DirectionAdjustment = {
  N: [-1, 0],
  NE: [-1, 1],
  E: [0, 1],
  SE: [1, 1],
  S: [1, 0],
  SW: [1, -1],
  W: [0, -1],
  NW: [-1, -1],
};

export const isCoordinateOutOfBoundaries = (
  boardState: BoardState,
  row: number,
  col: number,
): boolean => {
  return row < 0 || row >= boardState.length || col < 0 || col >= boardState[0].length;
};

export const getAdjustedCoordinates = (
  currentRow: number,
  currentCol: number,
  direction: Direction,
): number[] => {
  return [currentRow + direction[0], currentCol + direction[1]];
};

export class BoardCell implements IBoardCell {
  neighbors: NeighborCells = {
    N: null,
    NE: null,
    E: null,
    SE: null,
    S: null,
    SW: null,
    W: null,
    NW: null,
  };
  pawn: Pawn | null = null;

  constructor() {}

  getNeighbor(directionKey: DirectionKey): BoardCell | null {
    return this.neighbors[directionKey];
  }

  setNeighbor(directionKey: DirectionKey, boardCell: BoardCell | null) {
    this.neighbors[directionKey] = boardCell;
  }

  init(boardState: BoardState, row: number, col: number) {
    Object.entries(DirectionAdjustments).forEach(([directionKey, directionAdjustment]) => {
      const [newRow, newCol] = getAdjustedCoordinates(row, col, directionAdjustment);
      this.setNeighbor(
        directionKey as DirectionKey,
        !isCoordinateOutOfBoundaries(boardState, newRow, newCol)
          ? boardState[newRow][newCol]
          : null,
      );
    });
  }
}

export const boardInitialState: BoardState = Array.from({ length: 6 }).map((_) =>
  Array.from({ length: 6 }).map((_) => new BoardCell()),
);

export const canBoop = (cell: BoardCell, directionKey: DirectionKey, currentPlayer: Player) => {
  const neighbor = cell.getNeighbor(directionKey);
  return Boolean(
    neighbor &&
      neighbor.pawn &&
      neighbor.pawn.player !== currentPlayer &&
      !neighbor?.getNeighbor(directionKey)?.pawn,
  );
};

export const canPromote = (cell: BoardCell, directionKey: DirectionKey, currentPlayer: Player) => {
  const neighbor = cell.getNeighbor(directionKey);
  const cellBehindNeighbor = neighbor?.getNeighbor(directionKey);
  return Boolean(
    neighbor &&
      neighbor.pawn?.player === currentPlayer &&
      neighbor.pawn?.type === PawnType.Kitten &&
      cellBehindNeighbor &&
      cellBehindNeighbor.pawn?.player === currentPlayer &&
      cellBehindNeighbor.pawn?.type === PawnType.Kitten,
  );
};

export const hasPlayerWon = (
  cell: BoardCell,
  directionKey: DirectionKey,
  currentPlayer: Player,
) => {
  const neighbor = cell.getNeighbor(directionKey);
  const cellBehindNeighbor = neighbor?.getNeighbor(directionKey);
  return Boolean(
    neighbor &&
      neighbor.pawn?.player === currentPlayer &&
      neighbor.pawn?.type === PawnType.Cat &&
      cellBehindNeighbor &&
      cellBehindNeighbor.pawn?.player === currentPlayer &&
      cellBehindNeighbor.pawn?.type === PawnType.Cat,
  );
};

export const Boop = (boardState: BoardState, targetPawnRow: number, targetPawnCol: number) => {};

export const PromoteKittens = (boardState: BoardState) => {};
