import { describe, it, expect, beforeEach } from 'vitest';
import { Board, GameState } from '.';
import { BoardSize, BoopResult, PawnType, Player } from '@/types';

const baseAvailablePawns = {
  [Player.PlayerOne]: {
    Cat: 0,
    Kitten: 8,
  },
  [Player.PlayerTwo]: {
    Cat: 0,
    Kitten: 8,
  },
};

// TODO: Review the tests again. Probably some more meaningful tests could be written.

describe('GameState', () => {
  describe('constructor', () => {
    it('Should initialize correctly', () => {
      const gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));

      expect(gameState).toBeTruthy();
      expect(gameState.winner).toBe(null);
      expect(gameState.currentPlayer).toBe(Player.PlayerOne);
      expect(gameState.availablePawns).toStrictEqual(baseAvailablePawns);
    });
  });

  describe('addPawnToAvailablePlayerPawns', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));
    });

    it('Should add a pawn as expected', () => {
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten, 8, Player.PlayerOne);
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten, 8, Player.PlayerTwo);

      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(PawnType.Kitten);
      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat, null, Player.PlayerTwo);
      gameState.addPawnToAvailablePlayerPawns(PawnType.Kitten, null, Player.PlayerTwo);

      expect(gameState.availablePawns).toStrictEqual({
        [Player.PlayerOne]: {
          Cat: 1,
          Kitten: 1,
        },
        [Player.PlayerTwo]: {
          Cat: 1,
          Kitten: 1,
        },
      });
    });

    it('Should not update the pawn counters if the pawn limit is reached', () => {
      Array.from({ length: 20 }).forEach((_) => {
        gameState.addPawnToAvailablePlayerPawns(PawnType.Cat);
        gameState.addPawnToAvailablePlayerPawns(PawnType.Kitten);
      });

      expect(gameState.getAvailablePawns(PawnType.Cat)).toBe(8);
      expect(gameState.getAvailablePawns(PawnType.Kitten)).toBe(8);
    });
  });

  describe('removePawnToAvailablePlayerPawns', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));
    });

    it('Available pawns counter should not go below 0', () => {
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Cat);
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten);

      Array.from({ length: 20 }).forEach((_) => {
        gameState.removePawnFromAvailablePlayerPawns(PawnType.Cat);
        gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten);
      });

      expect(gameState.getAvailablePawns(PawnType.Cat)).toBe(0);
      expect(gameState.getAvailablePawns(PawnType.Cat)).toBe(0);
    });

    it('Should remove a pawn as expected', () => {
      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat);

      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat, null, Player.PlayerTwo);
      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat, null, Player.PlayerTwo);

      gameState.removePawnFromAvailablePlayerPawns(PawnType.Cat);
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten);
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Cat, null, Player.PlayerTwo);
      gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten, null, Player.PlayerTwo);

      expect(gameState.getAvailablePawns(PawnType.Cat)).toBe(1);
      expect(gameState.getAvailablePawns(PawnType.Kitten)).toBe(7);
      gameState.switchPlayer();
      expect(gameState.getAvailablePawns(PawnType.Cat)).toBe(1);
      expect(gameState.getAvailablePawns(PawnType.Kitten)).toBe(7);
    });
  });

  describe('registerPawn', () => {
    it('Should successfully register a new pawn for the current player', () => {
      const gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));

      const registerPawnResult = gameState.registerPawn(1, 1, PawnType.Kitten);
      expect(registerPawnResult).toBe(true);
      expect(gameState.pawnsCoordinates[Player.PlayerOne]).toStrictEqual([[1, 1]]);
      expect(gameState.availablePawns[Player.PlayerOne][PawnType.Kitten]).toBe(7);
    });

    it('Should not register a pawn if there are not available pawn left of the same kind for the current player', () => {
      const gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));

      const registerPawnResult = gameState.registerPawn(1, 1, PawnType.Cat);
      expect(registerPawnResult).toBe(false);
      expect(gameState.pawnsCoordinates[Player.PlayerOne]).toStrictEqual([]);
    });
  });

  describe('removePawnCoordinate', () => {
    it('Should remove the provided pawn coordinates from the pawns coordinate list associated with the specified player', () => {
      const gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));

      gameState.registerPawn(1, 1, PawnType.Kitten);
      gameState.removePawnCoordinate(1, 1, Player.PlayerOne);
      expect(gameState.pawnsCoordinates[Player.PlayerOne]).toStrictEqual([]);
    });

    it('Should remove the provided pawn coordinates from the pawns coordinate list associated with the target player', () => {
      const gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));

      gameState.registerPawn(1, 1, PawnType.Kitten);
      gameState.removePawnCoordinate(1, 1, Player.PlayerOne);
      expect(gameState.pawnsCoordinates[Player.PlayerOne]).toStrictEqual([]);
    });
  });

  describe('checkWinCondition', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));
    });

    it('Should return null if the winning condition is not met for the current player', () => {
      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat, 2);
      gameState.registerPawn(0, 1, PawnType.Cat);
      gameState.registerPawn(1, 1, PawnType.Cat);
      gameState.registerPawn(2, 1, PawnType.Kitten);

      expect(gameState.checkWinCondition(0, 1)).toBe(null);
    });

    it('Should return the current player as winner if the winning condition is met for the current player', () => {
      gameState.addPawnToAvailablePlayerPawns(PawnType.Cat, 3);
      gameState.registerPawn(0, 1, PawnType.Cat);
      gameState.registerPawn(1, 1, PawnType.Cat);
      gameState.registerPawn(2, 1, PawnType.Cat);

      expect(gameState.checkWinCondition(0, 1)).toBe(Player.PlayerOne);
    });
  });

  describe('boopScan', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));
    });

    it('Should not update the board if the boop conditions for the pawn at the given coordinates are not met', () => {
      gameState.registerPawn(0, 1, PawnType.Kitten);
      gameState.registerPawn(1, 1, PawnType.Kitten);

      expect(gameState.boopScan(0, 1)).toBe(null);
      expect(gameState.getAvailablePawns(PawnType.Kitten)).toBe(6);
      expect(gameState.getAvailablePawns(PawnType.Kitten, Player.PlayerTwo)).toBe(8);
    });

    it('Should update the board by booping the opponent player kittens if the conditions are met', () => {
      gameState.registerPawn(0, 1, PawnType.Kitten);
      gameState.registerPawn(1, 1, PawnType.Kitten, Player.PlayerTwo);

      expect(gameState.boopScan(0, 1)).toStrictEqual([
        {
          type: PawnType.Kitten,
          pawnBoopedOriginCell: [1, 1],
          pawnBoopedDestinationCell: [2, 1],
        },
      ] as BoopResult[]);
    });
  });

  describe('promotionScan', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState(new Board(BoardSize.Rows, BoardSize.Cols));
    });

    it('Should not update the board if the promotion conditions for the pawn at the given coordinates are not met', () => {
      gameState.registerPawn(0, 1, PawnType.Kitten);
      gameState.registerPawn(1, 1, PawnType.Kitten);
      gameState.registerPawn(2, 1, PawnType.Cat);

      expect(gameState.promotionScan(0, 1)).toBe(null);

      gameState.registerPawn(0, 2, PawnType.Kitten);
      gameState.registerPawn(1, 2, PawnType.Kitten);
      gameState.registerPawn(2, 2, PawnType.Kitten, Player.PlayerTwo);

      expect(gameState.promotionScan(0, 2)).toBe(null);
    });

    it('Should update the board by removing the promoted pawn and award the player a Cat pawn', () => {
      gameState.registerPawn(0, 1, PawnType.Kitten);
      gameState.registerPawn(1, 1, PawnType.Kitten);
      gameState.registerPawn(2, 1, PawnType.Kitten);

      expect(gameState.getAvailablePawns(PawnType.Kitten)).toBe(5);
      expect(gameState.promotionScan(0, 1)).toStrictEqual([
        [0, 1],
        [1, 1],
        [2, 1],
      ]);
      expect(gameState.getAvailablePawns(PawnType.Kitten)).toBe(8);
    });
  });
});
