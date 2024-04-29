import { GameAction, GameLog, PawnType, Player } from '@/types';
import { FC, useEffect, useRef } from 'react';

interface GameHistoryProps {
  gameHistory: GameLog[];
  className?: string;
}

interface LogProps {
  gameLog: GameLog;
}

const Log: FC<LogProps> = ({ gameLog }) => {
  // TODO: These elements need for sure some reworking. Their structure and styling is meh
  switch (gameLog.action) {
    case GameAction.GameStart:
      return (
        <div>
          Game started{' '}
          <strong
            className={[
              'mx-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.player}
          </strong>{' '}
          choose your pawn
        </div>
      );
    case GameAction.CurrentPlayerChanged:
      return (
        <div>
          <strong
            className={[
              'mr-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.player}
          </strong>{' '}
          choose your pawn
        </div>
      );
    case GameAction.PawnPlaced:
      return (
        <div>
          <strong
            className={[
              'mr-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.player}
          </strong>{' '}
          has placed a <strong className="mx-1">{gameLog.pawnType}</strong> at{' '}
          <strong className="ml-1">{JSON.stringify(gameLog?.originCoordinates)}</strong>
        </div>
      );
    case GameAction.PawnBumped:
      return (
        <div>
          <strong
            className={[
              'mr-1',
              gameLog.opponent === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.opponent}
          </strong>{' '}
          has bumped a{' '}
          <strong
            className={[
              'mx-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            {gameLog.pawnType}
          </strong>{' '}
          from <strong className="mx-1">{JSON.stringify(gameLog?.originCoordinates)}</strong> to{' '}
          <strong className="mx-1">{JSON.stringify(gameLog?.destinationCoordinates)}</strong>
        </div>
      );
    case GameAction.PawnBumpedOutOfBoundaries:
      return (
        <div>
          <strong
            className={[
              'mr-1',
              gameLog.opponent === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.opponent}
          </strong>{' '}
          has bumped a{' '}
          <strong
            className={[
              'mx-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            {gameLog.pawnType}
          </strong>{' '}
          outside the {`board's`} boundaries
        </div>
      );
    case GameAction.PawnsPromoted:
      return (
        <div>
          <strong
            className={[
              'mr-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.player}
          </strong>{' '}
          has promoted the <strong className="ml-2">{PawnType.Kitten}s</strong>{' '}
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
          <strong
            className={[
              'mr-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.player}
          </strong>{' '}
          has been awarded a <strong className="mx-1">{PawnType.Cat}</strong> pawn
        </div>
      );
    case GameAction.PlayerWin:
      return (
        <div>
          <strong
            className={[
              'mr-1',
              gameLog.player === Player.PlayerOne ? 'text-player-one' : 'text-player-two',
            ].join(' ')}
          >
            Player {gameLog.player}
          </strong>{' '}
          has won the game!
        </div>
      );
  }
};

[];

export const GameHistory: FC<GameHistoryProps> = ({ gameHistory, className }) => {
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      logsContainerRef.current &&
      logsContainerRef.current.children.length > 0 &&
      gameHistory.length > 0
    ) {
      logsContainerRef.current.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [gameHistory.length]);

  return (
    <div className={className || ''}>
      <div className="font-bold">Game History</div>
      <div
        ref={logsContainerRef}
        data-testid="game-history-logs-container"
        className="mt-7 h-[390px] text-xs overflow-y-auto overflow-x-hidden scrollbar scrollbar-thumb-scrollbar-background"
      >
        {gameHistory.map((gameLog: GameLog) => (
          <Log key={`${gameLog.action}-${gameLog.gameTurn}`} gameLog={gameLog} />
        ))}
      </div>
    </div>
  );
};
