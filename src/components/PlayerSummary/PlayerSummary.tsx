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
        <strong className="mr-2">{availablePawns[player][PawnType.Kitten]} X</strong>
        <button
          onClick={() =>
            isPlayerCurrentPlayer && hasKittens ? onPawnSelected(player, PawnType.Kitten) : null
          }
        >
          <img
            alt={`${player === Player.PlayerOne ? 'blue' : 'orange'} kitten`}
            className={[
              ' h-12 w-12 mt-2 cursor-pointer',
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
              'h-12 w-12 cursor-pointer',
              isPlayerCurrentPlayer && !selectedPawn && hasCats ? 'animate-bounce ease-in-out' : '',
            ].join(' ')}
            src={
              player === Player.PlayerOne ? 'src/assets/cat-blue.png' : 'src/assets/cat-orange.png'
            }
          />
        </button>
        <strong className="ml-2">X {availablePawns[player][PawnType.Cat]}</strong>
      </div>
    </div>
  );
};

interface PawnSelectedProps {
  player: Player;
  selectedPawn: PawnType;
  className?: string;
}

const PawnSelected: FC<PawnSelectedProps> = ({ player, selectedPawn, className }) => {
  return (
    <div className={['flex items-center justify-center', className || ''].join(' ')}>
      Pawn selected
      <img
        alt={`selected ${player === Player.PlayerOne ? 'blue' : 'orange'} ${selectedPawn}`}
        className="h-8 w-8 ml-2 cursor-pointer"
        src={`src/assets/${selectedPawn}-${player === Player.PlayerOne ? 'blue' : 'orange'}.png`}
      />
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
    <div className={className || ''}>
      {player === Player.PlayerOne ? (
        <>
          <div className="flex items-center justify-between">
            <strong className="text-player-one">Player {player}</strong>
            <PawnSelection
              player={player}
              currentPlayer={currentPlayer}
              availablePawns={availablePawns}
              selectedPawn={selectedPawn}
              onPawnSelected={onPawnSelected}
            />
          </div>
          <div className="h-8 w-full flex justify-end mt-3">
            {selectedPawn && currentPlayer === Player.PlayerOne && (
              <PawnSelected player={currentPlayer} selectedPawn={selectedPawn} />
            )}
          </div>
        </>
      ) : (
        <>
          <div className="h-8 w-full flex justify-start mb-3">
            {selectedPawn && currentPlayer === Player.PlayerTwo && (
              <PawnSelected player={currentPlayer} selectedPawn={selectedPawn} />
            )}
          </div>
          <div className="flex items-center justify-between">
            <PawnSelection
              player={player}
              currentPlayer={currentPlayer}
              availablePawns={availablePawns}
              selectedPawn={selectedPawn}
              onPawnSelected={onPawnSelected}
            />
            <strong className="text-player-two">Player {player}</strong>
          </div>
        </>
      )}
    </div>
  );
};
