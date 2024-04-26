import { FC, ReactNode } from 'react';
import './BoopBoard.scss';

interface BoardProps {
  children?: ReactNode;
}

export const BoopBoard: FC<BoardProps> = ({ children }) => {
  return <div>{children}</div>;
};
