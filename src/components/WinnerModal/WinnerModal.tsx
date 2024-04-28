import { Player } from '@/types';
import { FC } from 'react';

interface WinnerModalProps {
  open: boolean;
  winner: Player;
  onCLose: () => void;
  onGameReset: () => void;
}

export const WinnerModal: FC<WinnerModalProps> = ({ open, winner, onCLose, onGameReset }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-black backdrop-blur-md z-10"></div>
      <div className="z-20 top-48 absolute w-full">
        <div className="top-1/3 w-[500px] border p-3 rounded-md bg-background my-0 mx-auto text-center">
          <span className="text-3xl">
            Congratulation{' '}
            <strong className={winner === Player.PlayerOne ? 'text-player-one' : 'text-player-two'}>
              Player {winner}{' '}
            </strong>
            you won!
          </span>
          <div className="flex justify-around mt-10 mb-1">
            <button className="border rounded-md p-2" onClick={() => onGameReset()}>
              Start another game
            </button>
            <button className="border rounded-md p-2" onClick={() => onCLose()}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
