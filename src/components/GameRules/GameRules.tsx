import { PawnLimit, PawnType } from '@/types';
import { FC } from 'react';

interface GameRulesProps {
  className?: string;
}

export const GameRules: FC<GameRulesProps> = ({ className }) => {
  return (
    <div className={['w-96', className || ''].join(' ')}>
      <div className="mb-7">
        <strong>Game Rules</strong>
      </div>
      <div data-testid="game-rules-rules-container" className="text-xs">
        <p>
          Each Player starts with{' '}
          <strong>
            {PawnLimit.Kitten} {PawnType.Kitten}s
          </strong>{' '}
          and <strong>0 {PawnType.Cat}s</strong>.
        </p>
        <p className="mt-1">Click on the pawn image to select the pawn you want to play.</p>
        <p className="mt-1">
          A pawn placed nearby other opponent's pawns will boop them away by <strong>1 cell</strong>
          .
        </p>
        <p className="mt-1">
          <strong>{PawnType.Kitten}s</strong> can boop <strong>{PawnType.Kitten}s</strong> but not{' '}
          <strong>{PawnType.Cat}s</strong>.
        </p>
        <p className="mt-1">
          <strong>{PawnType.Cat}s</strong> can boop both <strong>{PawnType.Kitten}s</strong> and{' '}
          <strong>{PawnType.Cat}s</strong>.
        </p>
        <p className="mt-1">
          Pawns can be booped outside the board returning to the player's pawns pool.
        </p>
        <p className="mt-1">
          Placing <strong>3 {PawnType.Kitten}s</strong> in a row will remove them from the game and
          the player will be awarded with <strong>1 {PawnType.Cat}</strong>.
        </p>
        <p className="mt-1">
          The player who places <strong>3 {PawnType.Cat}s</strong> in a row win the game.
        </p>
      </div>
    </div>
  );
};
