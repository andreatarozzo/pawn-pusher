import { FC, ReactNode } from 'react';
import './BoopBoard.scss';

interface BoardProps {
  children?: ReactNode;
}

export const Board: FC<BoardProps> = ({ children }) => {
  return <div>{children}</div>;
};
