import { AvailablePawns, PawnType, Player } from '@/types';
import { FC } from 'react';

interface PlayerSummaryProps {
  player: Player;
  availablePawns: AvailablePawns;
  currentPlayer: Player;
  onPawnSelected: (player: Player, type: PawnType) => void;
}

interface PawnSelectionProps {
  player: Player;
  currentPlayer: Player;
  availablePawns: AvailablePawns;
  onPawnSelected: (player: Player, type: PawnType) => void;
}

export const PawnSelection: FC<PawnSelectionProps> = ({
  player,
  currentPlayer,
  availablePawns,
  onPawnSelected,
}) => {
  return (
    <div className="flex">
      <div className="flex items-center justify-center">
        {availablePawns[player][PawnType.Kitten]} X
        <button
          onClick={() =>
            player === currentPlayer && availablePawns[player][PawnType.Kitten] > 0
              ? onPawnSelected(player, PawnType.Kitten)
              : null
          }
        >
          <img
            alt={`${player === Player.PlayerOne ? 'blue' : 'orange'} kitten`}
            className="h-16 w-16 mt-2 cursor-pointer"
            src={
              player === Player.PlayerOne
                ? 'src/assets/kitten-blue.png'
                : 'src/assets/kitten-orange.png'
            }
          />
        </button>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={() =>
            player === currentPlayer && availablePawns[player][PawnType.Cat] > 0
              ? onPawnSelected(player, PawnType.Cat)
              : null
          }
        >
          <img
            alt={`${player === Player.PlayerOne ? 'blue' : 'orange'} cat`}
            className="h-16 w-16 mt-0 cursor-pointer"
            src={
              player === Player.PlayerOne ? 'src/assets/cat-blue.png' : 'src/assets/cat-orange.png'
            }
          />
        </button>
        X {availablePawns[player][PawnType.Cat]}
      </div>
    </div>
  );
};

export const PlayerSummary: FC<PlayerSummaryProps> = ({
  player,
  currentPlayer,
  availablePawns,
  onPawnSelected,
}) => {
  return (
    <div className="flex items-center justify-between">
      {player === Player.PlayerOne ? (
        <>
          Player {player}
          <PawnSelection
            player={player}
            currentPlayer={currentPlayer}
            availablePawns={availablePawns}
            onPawnSelected={onPawnSelected}
          />
        </>
      ) : (
        <>
          <PawnSelection
            player={player}
            currentPlayer={currentPlayer}
            availablePawns={availablePawns}
            onPawnSelected={onPawnSelected}
          />
          Player {player}
        </>
      )}
    </div>
  );
};
