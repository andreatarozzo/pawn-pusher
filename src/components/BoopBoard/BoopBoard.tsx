import { FC, ReactNode } from 'react';
import { BoardState } from '@/types';
import './BoopBoard.scss';
import { boardInitialState } from '@/utils';

interface BoopBoardProps {
  children?: ReactNode;
}

const boardState: BoardState = JSON.parse(JSON.stringify(boardInitialState));

/*

Game rules:

GRID: 6*6

Paws types:
  Kitten
  Cat

Turns:
  1 player after the other
  1 action per turn

Boop:
  A pawn placed on the board will "boop" everything around within a radius of 1 cell
  in every direction.
  A Kitten can boop only Kittens while a Cat can boop both Kittens and Cats.
  If a pawn is pushed outside the board because of a boop it is removed from the board.
  If a pawn has another pawn behind it in the same direction which it will be get a boop
  it won't get the boop.


Game rules:
  A player places a Kitten/Cat on the board

  Once a pawn is placed it "boop" everything around within a radius of 1 cell.

  IF the pawn placed is a KITTEN:

    A Kitten can boop only other kittens

  IF the pawn placed is a CAT:

    A Cat can boop both Kittens and Cats
  
  WHEN 3 Kittens are in the same line (N,S,E,W,NE,SE,NW,SW)
    the 3 Kittens will be removed from the board and the player will be awarded a Cat.

Winning condition:

  To win the game the player must put 3 Cat in the same line (N,S,E,W,NE,SE,NW,SW)

*/

export const BoopBoard: FC<BoopBoardProps> = ({ children }) => {
  return <div>{children}</div>;
};
