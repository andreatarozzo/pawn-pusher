import { BoardState, Direction, DirectionAdjustment, Pawn } from '@/types';

export const boardInitialState: BoardState = Array(6).fill(Array(6).fill(null));

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
  const maxRows = boardState.length;
  const maxCols = boardState[0].length;
  return row < 0 || row >= maxRows || col < 0 || col >= maxCols;
};

export const getAdjustedCoordinates = (
  currentRow: number,
  currentCol: number,
  direction: Direction,
): number[] => {
  return [currentRow + direction[0], currentCol + direction[1]];
};

export const updatePawnCoordinates = (
  boardState: BoardState,
  pawn: Pawn,
  currentRow: number,
  currentCol: number,
  newRow: number,
  newCol: number,
) => {
  const tempBoard = JSON.parse(JSON.stringify(boardState));
  tempBoard[newRow][newCol] = pawn;
  tempBoard[currentRow][currentCol] = null;
  return tempBoard;
};

export const generateCoordinatesAdjustments = (
  boardState: BoardState,
  currentRow: number,
  currentCol: number,
) => {
  return Object.values(DirectionAdjustments).reduce((result, current) => {
    const newCoordinate = getAdjustedCoordinates(currentRow, currentCol, current);
    if (!isCoordinateOutOfBoundaries(boardState, newCoordinate[0], newCoordinate[1])) {
      result.push(current);
    }
    return result;
  }, [] as any);
};

export const scanBoard = (
  boardState: BoardState,
  currentRow: number,
  currentCol: number,
) => {};

export const Boop = (
  boardState: BoardState,
  targetPawnRow: number,
  targetPawnCol: number,
) => {};
