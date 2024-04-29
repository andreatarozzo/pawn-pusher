import { Player } from '@/types';
import { BoardCell } from '@/utils';
import { FC, ReactNode } from 'react';

interface BoardCellProps {
  children?: ReactNode;
  boardCell: BoardCell;
  onCellClick: (boardCell: BoardCell) => void;
}

export const Cell: FC<BoardCellProps> = ({ boardCell, onCellClick }) => {
  return (
    <button
      onClick={() => onCellClick(boardCell)}
      className="h-16 w-16 content-center not-first:border-l cursor-pointer"
      data-testid={`board-cell-${boardCell.row}-${boardCell.col}`}
    >
      {boardCell.value ? (
        <img
          alt={`player ${boardCell.value.player} ${boardCell.value.player === Player.PlayerOne ? 'blue' : 'orange'} ${boardCell.value.type}`}
          className="h-16 w-16 mt-2"
          src={
            boardCell.value.player === Player.PlayerOne
              ? `/${boardCell.value.type.toLocaleLowerCase()}-blue.png`
              : `/${boardCell.value.type.toLocaleLowerCase()}-orange.png`
          }
        />
      ) : null}
    </button>
  );
};
