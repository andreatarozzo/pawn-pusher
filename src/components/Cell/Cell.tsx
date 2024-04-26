import { BoardCell } from '@/utils';
import { FC, ReactNode } from 'react';

interface BoardCellProps {
  children?: ReactNode;
  boardCell: BoardCell;
}

export const Cell: FC<BoardCellProps> = ({ boardCell }) => {
  return <div>{boardCell.value?.type}</div>;
};
