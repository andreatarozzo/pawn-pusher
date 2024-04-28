import { Coordinate, PawnType, Player } from '@/types';
import { GameState } from '@/utils';
import { FC } from 'react';

interface DebugPanelProps {
  gameState: GameState;
}

export const DebugPanel: FC<DebugPanelProps> = ({ gameState }) => {
  return (
    <div className="absolute mt-10 left-10 w-fit text-left">
      <div className="mt-14">
        <div>Pawn Coordinates</div>
        <div className="flex items-center">
          <img
            alt={`blue kitten`}
            className="h-10 w-10 mt-2 cursor-pointer"
            src="src/assets/kitten-blue.png"
          />
          {gameState.pawnsCoordinates[Player.PlayerOne][PawnType.Kitten].map(
            (coordinate: Coordinate) => (
              <span className="not-first:ml-2">
                [ {coordinate[0]}-{coordinate[1]} ]
              </span>
            ),
          )}
        </div>
        <div className="flex items-center">
          <img
            alt={`blue kitten`}
            className="h-10 w-10 mt-2 cursor-pointer"
            src="src/assets/cat-blue.png"
          />
          {gameState.pawnsCoordinates[Player.PlayerOne][PawnType.Cat].map(
            (coordinate: Coordinate) => (
              <span className="not-first:ml-2">
                [ {coordinate[0]}-{coordinate[1]} ]
              </span>
            ),
          )}
        </div>
        <div className="flex items-center">
          <img
            alt={`blue kitten`}
            className="h-10 w-10 mt-2 cursor-pointer"
            src="src/assets/kitten-orange.png"
          />
          {gameState.pawnsCoordinates[Player.PlayerTwo][PawnType.Kitten].map(
            (coordinate: Coordinate) => (
              <span className="not-first:ml-2">
                [ {coordinate[0]}-{coordinate[1]} ]
              </span>
            ),
          )}
        </div>
        <div className="flex items-center">
          <img
            alt={`blue kitten`}
            className="h-10 w-10 mt-2 cursor-pointer"
            src="src/assets/cat-orange.png"
          />
          {gameState.pawnsCoordinates[Player.PlayerTwo][PawnType.Cat].map(
            (coordinate: Coordinate) => (
              <span className="not-first:ml-2">
                [ {coordinate[0]}-{coordinate[1]} ]
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
