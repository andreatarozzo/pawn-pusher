import { BoardCell, GameState } from '@/utils';
import { FC, ReactNode, useCallback } from 'react';
import { Cell } from '../Cell/Cell';

interface BoardProps {
  gameState: GameState;
  onPawnPlaced: (row: number, col: number) => void;
  children?: ReactNode;
}

export const Board: FC<BoardProps> = ({ gameState, onPawnPlaced }) => {
  const onCellClick = useCallback((boardCell: BoardCell) => {
    if (!boardCell.value) {
      onPawnPlaced(boardCell.row, boardCell.col);
    }
  }, []);

  return (
    <div className="shadow-md">
      {gameState.gameBoard.state.map((row: BoardCell[]) => (
        <div
          key={row[0].row}
          className="flex border-l border-r first:border-t last:border-b first:rounded-t-md last:rounded-b-md not-first:border-t"
        >
          {row.map((boardCell) => (
            <Cell
              key={`${boardCell.row}-${boardCell.col}`}
              boardCell={boardCell}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
