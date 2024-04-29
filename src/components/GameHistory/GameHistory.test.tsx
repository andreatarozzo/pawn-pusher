import { GameAction, GameLog, PawnType, Player } from '@/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameHistory } from './GameHistory';

const gameHistory: { [key in GameAction]: GameLog } = {
  [GameAction.GameStart]: {
    action: GameAction.GameStart,
    gameTurn: 1,
    player: 1,
    opponent: 2,
  },
  [GameAction.CurrentPlayerChanged]: {
    action: GameAction.CurrentPlayerChanged,
    player: 1,
    opponent: 2,
  },
  [GameAction.PlayerWin]: {
    action: GameAction.PlayerWin,
    player: 1,
    opponent: 2,
  },
  [GameAction.PawnPlaced]: {
    action: GameAction.PawnPlaced,
    player: 1,
    opponent: 2,
    pawnType: PawnType.Kitten,
    originCoordinates: [2, 1],
  },
  [GameAction.PawnBumped]: {
    action: GameAction.PawnBumped,
    player: 1,
    opponent: 2,
    pawnType: PawnType.Kitten,
    originCoordinates: [1, 3],
    destinationCoordinates: [1, 4],
  },
  [GameAction.PawnBumpedOutOfBoundaries]: {
    action: GameAction.PawnBumpedOutOfBoundaries,
    player: 1,
    opponent: 2,
    pawnType: PawnType.Kitten,
    originCoordinates: [0, 3],
  },
  [GameAction.PawnsPromoted]: {
    action: GameAction.PawnsPromoted,
    player: 1,
    opponent: 2,
    pawnType: PawnType.Kitten,
    originCoordinates: [
      [2, 0],
      [1, 0],
      [3, 0],
    ],
  },
  [GameAction.PawnAwarded]: {
    action: GameAction.PawnAwarded,
    player: 1,
    opponent: 2,
    pawnType: PawnType.Cat,
  },
};

describe('GameHistory', () => {
  it('Should render', () => {
    render(<GameHistory gameHistory={[]} />);

    expect(screen.getByText('Game History')).toBeTruthy();
    expect(screen.getByTestId('game-history-logs-container')).toBeTruthy();
  });

  describe('GameStart', () => {
    it(`Should display the right message and right colors on a ${GameAction.GameStart} event for ${Player.PlayerOne}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.GameStart]]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe('Game started Player 1 choose your pawn');
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mx-1 text-player-one',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.GameStart} event for ${Player.PlayerTwo}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.GameStart));
      event.player = Player.PlayerTwo;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe('Game started Player 2 choose your pawn');
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mx-1 text-player-two',
      );
    });
  });

  describe('CurrentPlayerChanged', () => {
    it(`Should display the right message and right colors on a ${GameAction.CurrentPlayerChanged} event for ${Player.PlayerOne}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.CurrentPlayerChanged]]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe('Player 1 choose your pawn');
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.CurrentPlayerChanged} event for ${Player.PlayerTwo}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.CurrentPlayerChanged));
      event.player = Player.PlayerTwo;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe('Player 2 choose your pawn');
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
    });
  });

  describe('PawnPlaced', () => {
    it(`Should display the right message and right colors on a ${GameAction.PawnPlaced} event for ${Player.PlayerOne}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.PawnPlaced]]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe('Player 1 has placed a Kitten at [2,1]');
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.PawnPlaced} event for ${Player.PlayerTwo}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.PawnPlaced));
      event.player = Player.PlayerTwo;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe('Player 2 has placed a Kitten at [2,1]');
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
    });
  });

  describe('PawnBumped', () => {
    it(`Should display the right message and right colors on a ${GameAction.PawnBumped} event for ${Player.PlayerOne}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.PawnBumped));
      event.player = Player.PlayerTwo;
      event.opponent = Player.PlayerOne;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe('Player 1 has bumped a Kitten from [1,3] to [1,4]');
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
      expect(logPlayerOne?.getElementsByTagName('strong').item(1)?.className).toBe(
        'mx-1 text-player-two',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.PawnBumped} event for ${Player.PlayerTwo}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.PawnBumped]]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe('Player 2 has bumped a Kitten from [1,3] to [1,4]');
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
      expect(logPlayerTwo?.getElementsByTagName('strong').item(1)?.className).toBe(
        'mx-1 text-player-one',
      );
    });
  });

  describe('PawnBumpedOutOfBoundaries', () => {
    it(`Should display the right message and right colors on a ${GameAction.PawnBumpedOutOfBoundaries} event for ${Player.PlayerOne}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.PawnBumpedOutOfBoundaries));
      event.player = Player.PlayerTwo;
      event.opponent = Player.PlayerOne;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe(
        `Player 1 has bumped a Kitten outside the board's boundaries`,
      );
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
      expect(logPlayerOne?.getElementsByTagName('strong').item(1)?.className).toBe(
        'mx-1 text-player-two',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.PawnBumpedOutOfBoundaries} event for ${Player.PlayerTwo}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.PawnBumpedOutOfBoundaries]]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe(
        `Player 2 has bumped a Kitten outside the board's boundaries`,
      );
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
      expect(logPlayerTwo?.getElementsByTagName('strong').item(1)?.className).toBe(
        'mx-1 text-player-one',
      );
    });
  });

  describe('PawnsPromoted', () => {
    it(`Should display the right message and right colors on a ${GameAction.PawnsPromoted} event for ${Player.PlayerOne}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.PawnsPromoted]]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe(`Player 1 has promoted the Kittens at[2,0][1,0][3,0]`);
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.PawnsPromoted} event for ${Player.PlayerTwo}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.PawnsPromoted));
      event.player = Player.PlayerTwo;
      event.opponent = Player.PlayerOne;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe(`Player 2 has promoted the Kittens at[2,0][1,0][3,0]`);
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
    });
  });

  describe('PawnAwarded', () => {
    it(`Should display the right message and right colors on a ${GameAction.PawnAwarded} event for ${Player.PlayerOne}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.PawnAwarded]]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe(`Player 1 has been awarded a Cat pawn`);
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.PawnAwarded} event for ${Player.PlayerTwo}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.PawnAwarded));
      event.player = Player.PlayerTwo;
      event.opponent = Player.PlayerOne;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe(`Player 2 has been awarded a Cat pawn`);
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
    });
  });

  describe('PlayerWin', () => {
    it(`Should display the right message and right colors on a ${GameAction.PlayerWin} event for ${Player.PlayerOne}`, () => {
      render(<GameHistory gameHistory={[gameHistory[GameAction.PlayerWin]]} />);

      const logPlayerOne = screen.getByTestId('game-history-logs-container').firstElementChild;

      expect(logPlayerOne?.textContent).toBe(`Player 1 has won the game!`);
      expect(logPlayerOne?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-one',
      );
    });

    it(`Should display the right message and right colors on a ${GameAction.PlayerWin} event for ${Player.PlayerTwo}`, () => {
      const event: GameLog = JSON.parse(JSON.stringify(gameHistory.PlayerWin));
      event.player = Player.PlayerTwo;
      event.opponent = Player.PlayerOne;

      render(<GameHistory gameHistory={[event]} />);

      const logPlayerTwo = screen.getByTestId('game-history-logs-container').firstElementChild;
      expect(logPlayerTwo?.textContent).toBe(`Player 2 has won the game!`);
      expect(logPlayerTwo?.getElementsByTagName('strong').item(0)?.className).toBe(
        'mr-1 text-player-two',
      );
    });
  });
});
