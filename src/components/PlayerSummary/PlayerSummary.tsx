import { AvailablePawns, PawnType, Player } from '@/types';
import { FC } from 'react';

interface PlayerSummaryProps {
  player: Player;
  availablePawns: AvailablePawns;
  currentPlayer: Player;
  selectedPawn: PawnType | null;
  onPawnSelected: (player: Player, type: PawnType) => void;
  className?: string;
}

interface PawnSelectionProps {
  player: Player;
  currentPlayer: Player;
  availablePawns: AvailablePawns;
  selectedPawn: PawnType | null;
  onPawnSelected: (player: Player, type: PawnType) => void;
}

export const PawnSelection: FC<PawnSelectionProps> = ({
  player,
  currentPlayer,
  availablePawns,
  selectedPawn,
  onPawnSelected,
}) => {
  const isPlayerCurrentPlayer = player === currentPlayer;
  const hasKittens = availablePawns[player][PawnType.Kitten] > 0;
  const hasCats = availablePawns[player][PawnType.Cat] > 0;
  return (
    <div className="flex">
      <div className="flex items-center justify-center">
        <span>{availablePawns[player][PawnType.Kitten]} X</span>
        <button
          onClick={() =>
            isPlayerCurrentPlayer && hasKittens ? onPawnSelected(player, PawnType.Kitten) : null
          }
        >
          <img
            alt={`${player === Player.PlayerOne ? 'blue' : 'orange'} kitten`}
            className={[
              'h-16 w-16 mt-2 cursor-pointer',
              isPlayerCurrentPlayer && !selectedPawn && hasKittens
                ? 'animate-bounce ease-in-out'
                : '',
            ].join(' ')}
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
            className={[
              'h-16 w-16 cursor-pointer',
              isPlayerCurrentPlayer && !selectedPawn && hasCats ? 'animate-bounce ease-in-out' : '',
            ].join(' ')}
            src={
              player === Player.PlayerOne ? 'src/assets/cat-blue.png' : 'src/assets/cat-orange.png'
            }
          />
        </button>
        <span>X {availablePawns[player][PawnType.Cat]}</span>
      </div>
    </div>
  );
};

export const PlayerSummary: FC<PlayerSummaryProps> = ({
  player,
  currentPlayer,
  availablePawns,
  selectedPawn,
  onPawnSelected,
  className,
}) => {
  return (
    <div className={[`flex items-center justify-between`, className || ''].join(' ')}>
      {player === Player.PlayerOne ? (
        <>
          Player {player}
          <PawnSelection
            player={player}
            currentPlayer={currentPlayer}
            availablePawns={availablePawns}
            selectedPawn={selectedPawn}
            onPawnSelected={onPawnSelected}
          />
        </>
      ) : (
        <>
          <PawnSelection
            player={player}
            currentPlayer={currentPlayer}
            availablePawns={availablePawns}
            selectedPawn={selectedPawn}
            onPawnSelected={onPawnSelected}
          />
          Player {player}
        </>
      )}
    </div>
  );
};
