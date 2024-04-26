import { Board, BoardCell } from '@/utils';

export enum BoardSize {
  Rows = 6,
  Cols = 6,
}

export const PawnLimit = Object.freeze({
  Kitten: 8,
  Cat: 8,
});

export type DirectionKey = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type Direction = [-1, 0] | [-1, 1] | [0, 1] | [1, 1] | [1, 0] | [1, -1] | [0, -1] | [-1, -1];
export type Coordinate = [number, number];

export interface IBaseBoard {
  state: BoardState;
  readonly directionsList: DirectionKey[];
  readonly directionAdjustments: DirectionAdjustment;
  isCoordinateOutOfBoundaries: (row: number, col: number) => boolean;
  getAdjustedCoordinates: (
    currentRow: number,
    currentCol: number,
    direction: Direction,
  ) => number[];
  getCell: (row: number, col: number) => BoardCell | null;
}

export interface IBoard {
  canPawnBoop: (
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ) => boolean;
  canPawnsBePromoted: (
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ) => boolean;
  hasPlayerWon: (
    pawnRow: number,
    pawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ) => boolean;
  boopPawn: (
    newPawnRow: number,
    newPawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ) => BoopResult | null;
  promoteKittens: (
    newPawnRow: number,
    newPawnCol: number,
    directionKey: DirectionKey,
    currentPlayer: Player,
  ) => Coordinate[] | null;
}

export interface IBoardCell {
  value: Pawn | null;

  getNeighbor: (directionKey: DirectionKey) => BoardCell | null;
  setNeighbor: (directionKey: DirectionKey, boardCell: BoardCell | null) => void;
  scanNeighbors: () => Partial<NeighborCells>;
}

export interface IGameState {
  gameBoard: Board;
  currentPlayer: Player;
  winner: Player | null;
  readonly pawnsCoordinates: PawnLocations;
  readonly availablePawns: AvailablePawns;
  switchPlayer: () => Player;
  getAvailablePawns: (type: PawnType, player?: Player) => number;
  addPawnToAvailablePlayerPawns: (
    type: PawnType,
    incrementValue?: number | null,
    player?: Player,
  ) => void;
  removePawnFromAvailablePlayerPawns: (
    type: PawnType,
    decrementValue?: number | null,
    player?: Player,
  ) => void;
  registerPawn: (row: number, col: number, type: PawnType, player?: Player) => boolean;
  checkWinCondition: (pawnRow: number, pawnCol: number, player?: Player) => Player | null;
  boopScan: (pawnRow: number, pawnCol: number, player?: Player) => BoopResult[] | null;
  promotionScan: (pawnRow: number, pawnCol: number, player?: Player) => Coordinate[] | null;
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

export type AvailablePawns = {
  [key in Player]: {
    [key in PawnType]: number;
  };
};

export type PawnLocations = {
  [key in Player]: Coordinate[];
};

export type BoopResult = {
  type: PawnType;
  pawnBoopedOriginCell: Coordinate;
  pawnBoopedDestinationCell: Coordinate | null;
};
