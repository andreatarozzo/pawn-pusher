import { GameAction, GameLog, PawnType, Player } from '@/types';
import { FC, useEffect, useRef } from 'react';
import './GameHistory.scss';

interface GameHistoryProps {
  gameHistory: GameLog[];
  className?: string;
}

interface LogProps {
  gameLog: GameLog;
}

const Log: FC<LogProps> = ({ gameLog }) => {
  switch (gameLog.action) {
    case GameAction.GameStart:
      return (
        <div>
          <span>
            Game started
            <strong
              className={[
                'mx-2',
                gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
              ].join(' ')}
            >
              Player {gameLog.player}
            </strong>
            takes the first move
          </span>
        </div>
      );
    case GameAction.CurrentPlayerChanged:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.player}</strong>
          </span>
          <span>turn started</span>
        </div>
      );
    case GameAction.PawnPlaced:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.player}</strong>
          </span>
          <span>
            has placed a<strong className="mx-2">{gameLog.pawnType}</strong>
          </span>
          <span>
            at
            <strong className="ml-2">{JSON.stringify(gameLog?.originCoordinates)}</strong>
          </span>
        </div>
      );
    case GameAction.PawnBumped:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.opponent === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.opponent}</strong>
          </span>
          <span>
            has bumped a
            <strong
              className={[
                'mx-2',
                gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
              ].join(' ')}
            >
              {gameLog.pawnType}
            </strong>
          </span>
          <span>
            from
            <strong className="mx-2">{JSON.stringify(gameLog?.originCoordinates)}</strong>
            to
            <strong className="mx-2">{JSON.stringify(gameLog?.destinationCoordinates)}</strong>
          </span>
        </div>
      );
    case GameAction.PawnBumpedOutOfBoundaries:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.opponent === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.opponent}</strong>
          </span>
          <span>
            has bumped a
            <strong
              className={[
                'mx-2',
                gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
              ].join(' ')}
            >
              {gameLog.pawnType}
            </strong>
            outside the {`board's`} boundaries
          </span>
        </div>
      );
    case GameAction.PawnsPromoted:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.player}</strong>
          </span>
          <span>
            has promoted the<strong className="ml-2">{PawnType.Kitten}s</strong>
          </span>
          <strong className="ml-2">
            at
            <span className="mx-2">{JSON.stringify(gameLog?.originCoordinates?.[0])}</span>
            <span className="mr-2">{JSON.stringify(gameLog?.originCoordinates?.[1])}</span>
            <span>{JSON.stringify(gameLog?.originCoordinates?.[2])}</span>
          </strong>
        </div>
      );
    case GameAction.PawnAwarded:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.player}</strong>
          </span>
          <span>
            has been awarded a<strong className="mx-2">{PawnType.Cat}</strong>pawn
          </span>
        </div>
      );
    case GameAction.PlayerWin:
      return (
        <div>
          <span
            className={[
              'font-bold mr-2',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            <strong>Player {gameLog.player}</strong>
          </span>
          <span>has won the game!</span>
        </div>
      );
  }
};

export const GameHistory: FC<GameHistoryProps> = ({ gameHistory, className }) => {
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.children[
        logsContainerRef.current.children.length - 1
      ].scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [gameHistory.length]);

  return (
    <div className={['w-1/4', className || ''].join(' ')}>
      <div className="font-bold">Game History</div>
      <div
        ref={logsContainerRef}
        className="mt-7 game-history text-xs overflow-y-auto overflow-x-hidden scrollbar scrollbar-thumb-scrollbar-background"
      >
        {gameHistory.map((gameLog: GameLog) => (
          <Log gameLog={gameLog} />
        ))}
      </div>
    </div>
  );
};
