import { PawnType, Player } from '@/types';
import { GameState } from '@/utils';
import { FC } from 'react';

interface DebugPanelProps {
  gameState: GameState;
  selectedPawn: PawnType | null;
}

export const DebugPanel: FC<DebugPanelProps> = ({ gameState, selectedPawn }) => {
  return (
    <div className="absolute bottom-0 left-5 w-fit text-left flex items-center">
      <div className="mr-5">Current Player: {gameState.currentPlayer}</div>
      <div className="flex items-center">
        Selected Pawn:
        {selectedPawn && (
          <img
            alt={`currently selected ${gameState.currentPlayer === Player.PlayerOne ? 'blue' : 'orange'} kitten`}
            className="h-16 w-16 mt-2 cursor-pointer"
            src={
              gameState.currentPlayer === Player.PlayerOne
                ? `src/assets/${selectedPawn.toLowerCase()}-blue.png`
                : `src/assets/${selectedPawn.toLowerCase()}-orange.png`
            }
          />
        )}
      </div>
    </div>
  );
};
