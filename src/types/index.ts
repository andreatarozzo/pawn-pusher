import { BoardCell } from '@/utils';

export enum BoardSize {
  X = 6,
  Y = 6,
}

export type BoardState = Array<Array<BoardCell>>;

export enum Player {
  PlayerOne = 1,
  PlayerTwo = 2,
}

export type Pawn = {
  type: PawnType;
  player: number;
};

export enum PawnType {
  Kitten = 'Kitten',
  Cat = 'Cat',
}

export type DirectionKey = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type Direction = [-1, 0] | [-1, 1] | [0, 1] | [1, 1] | [1, 0] | [1, -1] | [0, -1] | [-1, -1];
export type Coordinate = [number, number];

export type DirectionAdjustment = {
  N: [-1, 0];
  NE: [-1, 1];
  E: [0, 1];
  SE: [1, 1];
  S: [1, 0];
  SW: [1, -1];
  W: [0, -1];
  NW: [-1, -1];
};

export type NeighborCellsCoordinates = {
  N: Coordinate;
  NE: Coordinate;
  E: Coordinate;
  SE: Coordinate;
  S: Coordinate;
  SW: Coordinate;
  W: Coordinate;
  NW: Coordinate;
};

export type AdjacentCellsScanResult = {
  currentPlayerPawnLocations: Coordinate[];
  otherPlayerPawnLocations: Coordinate[];
};

export type NeighborCells = {
  [key in DirectionKey]: BoardCell | null;
};

export interface IBoardCell {
  pawn: Pawn | null;

  getNeighbor: (directionKey: DirectionKey) => BoardCell | null;
  setNeighbor: (directionKey: DirectionKey, boardCell: BoardCell | null) => void;
}
