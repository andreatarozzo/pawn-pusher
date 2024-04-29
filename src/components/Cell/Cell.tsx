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
    >
      {boardCell.value ? (
        <img
          alt={`${boardCell.value.player === Player.PlayerOne ? 'blue' : 'orange'} kitten`}
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
