import { BoopResult, PawnType, Player } from '@/types';
import { GameState } from '@/utils';
import { FC, ReactNode, useState } from 'react';
import { Board, PawnCoordinatesSummary, PlayerSummary } from '..';
import { GameHistory } from '../GameHistory/GameHistory';
import { GameRules } from '../GameRules/GameRules';
import './BoardContainer.scss';

interface BoardContainerProps {
  gameState: GameState;
  onGameWonHandler: (winner: Player) => void;
  children?: ReactNode;
}

export const BoardContainer: FC<BoardContainerProps> = ({ gameState, onGameWonHandler }) => {
  const [currentPlayer, setCurrentPlayer] = useState(gameState.currentPlayer);
  const [selectedPawn, setSelectedPawn] = useState<PawnType | null>(null);

  const onPawnSelected = (player: Player, type: PawnType) => {
    if (player === currentPlayer) {
      setSelectedPawn(type);
    }
  };

  const onPawnPlaced = (row: number, col: number) => {
    if (selectedPawn) {
      let currentWinner: Player | null;
      setSelectedPawn(null);
      gameState.registerPawn(row, col, selectedPawn!);
      currentWinner = gameState.checkWinCondition(row, col);
      const boopScanResult = gameState.boopScan(row, col);
      gameState.promotionScan(row, col);
      if (boopScanResult) {
        boopScanResult.forEach((scan: BoopResult) => {
          if (scan.pawnBoopedDestinationCell) {
            const opponentWinner = gameState.checkWinCondition(
              scan.pawnBoopedDestinationCell[0],
              scan.pawnBoopedDestinationCell[1],
              scan.player,
            );
            gameState.promotionScan(
              scan.pawnBoopedDestinationCell[0],
              scan.pawnBoopedDestinationCell[1],
              scan.player,
            );
            if (opponentWinner && !currentWinner) currentWinner = opponentWinner;
          }
        });
      }

      if (!currentWinner) {
        gameState.switchPlayer();
        setCurrentPlayer(gameState.currentPlayer);
      } else {
        onGameWonHandler(currentWinner);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center w-full min-w-[600px]">
      <div className="mt-[60px] h-full flex flex-col w-full items-center md:w-[400px] md:block">
        <GameRules className="mb-5 w-[386px] md:w-full" />
        <PawnCoordinatesSummary
          gameState={gameState}
          className="hidden w-[386px] md:w-full md:block"
        />
      </div>
      <div className="mx-28 max-w-[386px] min-w-[386px]">
        <PlayerSummary
          player={Player.PlayerTwo}
          currentPlayer={currentPlayer}
          availablePawns={gameState.availablePawns}
          selectedPawn={selectedPawn}
          onPawnSelected={onPawnSelected}
          className="mb-3"
        />
        <Board key={selectedPawn} gameState={gameState} onPawnPlaced={onPawnPlaced} />
        <PlayerSummary
          player={Player.PlayerOne}
          currentPlayer={currentPlayer}
          availablePawns={gameState.availablePawns}
          onPawnSelected={onPawnSelected}
          selectedPawn={selectedPawn}
          className="mt-3"
        />
      </div>
      <div className="my-[30px] md:mt-[60px] h-full flex flex-col w-full items-center md:w-[400px] md:block">
        <GameHistory gameHistory={gameState.gameHistory} className="hidden md:w-full md:block" />
      </div>
    </div>
  );
};
