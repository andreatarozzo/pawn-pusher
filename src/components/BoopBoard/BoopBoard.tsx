import { FC, ReactNode } from 'react';
import { BoardState } from '@/types';
import './BoopBoard.scss';

interface BoopBoardProps {
  children?: ReactNode;
}

const boardState: BoardState = [];

export const BoopBoard: FC<BoopBoardProps> = ({ children }) => {
  return <div>{children}</div>;
};
