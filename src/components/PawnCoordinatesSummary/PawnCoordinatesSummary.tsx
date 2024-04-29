import { Coordinate, PawnType, Player } from '@/types';
import { GameState } from '@/utils';
import { FC } from 'react';

interface PawnCoordinatesSummaryProps {
  gameState: GameState;
  className?: string;
}

export const PawnCoordinatesSummary: FC<PawnCoordinatesSummaryProps> = ({
  gameState,
  className,
}) => {
  return (
    <div className={['w-96 w-1/4 text-sm', className || ''].join(' ')}>
      <div>
        <strong>Pawn Summary</strong>
      </div>
      <div className="flex items-center">
        <img alt={`blue kitten`} className="h-7 w-7 mt-2 cursor-pointer" src="/kitten-blue.png" />
        {gameState.pawnsCoordinates[Player.PlayerOne][PawnType.Kitten].map(
          (coordinate: Coordinate) => (
            <span className="not-first:ml-2">{JSON.stringify(coordinate)}</span>
          ),
        )}
      </div>
      <div className="flex items-center">
        <img alt={`blue cat`} className="h-7 w-7 mt-2 cursor-pointer" src="/cat-blue.png" />
        {gameState.pawnsCoordinates[Player.PlayerOne][PawnType.Cat].map(
          (coordinate: Coordinate) => (
            <span className="not-first:ml-2">{JSON.stringify(coordinate)}</span>
          ),
        )}
      </div>
      <div className="flex items-center">
        <img
          alt={`orange kitten`}
          className="h-7 w-7 mt-2 cursor-pointer"
          src="/kitten-orange.png"
        />
        {gameState.pawnsCoordinates[Player.PlayerTwo][PawnType.Kitten].map(
          (coordinate: Coordinate) => (
            <span className="not-first:ml-2">{JSON.stringify(coordinate)}</span>
          ),
        )}
      </div>
      <div className="flex items-center">
        <img alt={`orange cat`} className="h-7 w-7 mt-2 cursor-pointer" src="/cat-orange.png" />
        {gameState.pawnsCoordinates[Player.PlayerTwo][PawnType.Cat].map(
          (coordinate: Coordinate) => (
            <span className="not-first:ml-2">{JSON.stringify(coordinate)}</span>
          ),
        )}
      </div>
    </div>
  );
};
