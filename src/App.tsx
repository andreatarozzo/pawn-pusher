import { useState } from 'react';
import './App.scss';
import { BoardContainer } from './components';
import { BoardSize } from './types';
import { GameBoard, GameState } from './utils';

function App() {
  const [gameState] = useState(new GameState(new GameBoard(BoardSize.Rows, BoardSize.Cols)));

  return (
    <div className="w-full">
      <BoardContainer gameState={gameState} />
    </div>
  );
}

export default App;
