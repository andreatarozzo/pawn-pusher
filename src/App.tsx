import { useState } from 'react';
import './App.scss';
import { BoardContainer } from './components';
import { WinnerModal } from './components/WinnerModal/WinnerModal';
import { BoardSize, Player } from './types';
import { GameBoard, GameState } from './utils';

function App() {
  const [gameState, setGameState] = useState(
    new GameState(new GameBoard(BoardSize.Rows, BoardSize.Cols)),
  );
  const [winner, setWinner] = useState<Player | null>(null);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);

  const onGameWonHandler = (winner: Player) => {
    setWinner(winner);
    setWinnerModalOpen(true);
  };

  const onGameReset = () => {
    setWinnerModalOpen(false);
    setGameState(new GameState(new GameBoard(BoardSize.Rows, BoardSize.Cols)));
  };

  return (
    <div className="w-full p-10">
      <BoardContainer
        gameState={gameState}
        onGameWonHandler={(winner: Player) => onGameWonHandler(winner)}
      />
      <WinnerModal
        open={winnerModalOpen}
        onCLose={() => setWinnerModalOpen(false)}
        onGameReset={() => onGameReset()}
        winner={winner!}
      />
    </div>
  );
}

export default App;
