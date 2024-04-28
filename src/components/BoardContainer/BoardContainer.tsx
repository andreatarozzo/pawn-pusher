import { BoopResult, PawnType, Player } from '@/types';
import { GameState } from '@/utils';
import { FC, ReactNode, useState } from 'react';
import { Board, DebugPanel, PlayerSummary } from '..';

interface BoardContainerProps {
  gameState: GameState;
  children?: ReactNode;
}

export const BoardContainer: FC<BoardContainerProps> = ({ gameState }) => {
  const [currentPlayer, setCurrentPlayer] = useState(gameState.currentPlayer);
  const [selectedPawn, setSelectedPawn] = useState<PawnType | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  console.log('currentPlayer', currentPlayer);
  const onPawnSelected = (player: Player, type: PawnType) => {
    if (player === currentPlayer) {
      console.log('player: ', player, ' selected pawn: ', type);
      setSelectedPawn(type);
    }
  };

  const onPawnPlaced = (row: number, col: number) => {
    if (selectedPawn) {
      setSelectedPawn(null);
      gameState.registerPawn(row, col, selectedPawn!);
      gameState.checkWinCondition(row, col);
      const boopScanResult = gameState.boopScan(row, col);
      gameState.promotionScan(row, col);
      if (boopScanResult) {
        boopScanResult.forEach((scan: BoopResult) => {
          if (scan.pawnBoopedDestinationCell) {
            const winner = gameState.checkWinCondition(
              scan.pawnBoopedDestinationCell[0],
              scan.pawnBoopedDestinationCell[1],
              scan.player,
            );
            gameState.promotionScan(
              scan.pawnBoopedDestinationCell[0],
              scan.pawnBoopedDestinationCell[1],
              scan.player,
            );
            if (winner) setWinner(winner);
          }
        });
      }
      gameState.switchPlayer();
      setCurrentPlayer(gameState.currentPlayer);
    }
  };

  return (
    <div>
      <DebugPanel gameState={gameState} selectedPawn={selectedPawn} />
      <PlayerSummary
        player={Player.PlayerTwo}
        currentPlayer={currentPlayer}
        availablePawns={gameState.availablePawns}
        selectedPawn={selectedPawn}
        onPawnSelected={onPawnSelected}
        className="mb-5"
      />
      <Board key={selectedPawn} gameState={gameState} onPawnPlaced={onPawnPlaced} />
      <PlayerSummary
        player={Player.PlayerOne}
        currentPlayer={currentPlayer}
        availablePawns={gameState.availablePawns}
        onPawnSelected={onPawnSelected}
        selectedPawn={selectedPawn}
        className="mt-5"
      />
    </div>
  );
};
