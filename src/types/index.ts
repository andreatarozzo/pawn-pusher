export type Pawn = {
  type: PawnType;
  player: number;
};

export enum PawnType {
  Kitten = 'Kitten',
  Cat = 'Cat',
}

export type BoardState = Array<Array<Pawn | null>>;

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

export type Direction =
  | [-1, 0]
  | [-1, 1]
  | [0, 1]
  | [1, 1]
  | [1, 0]
  | [1, -1]
  | [0, -1]
  | [-1, -1];
