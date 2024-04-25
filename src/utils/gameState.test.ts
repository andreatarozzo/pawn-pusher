import { describe, it, expect, beforeEach } from 'vitest';
import { Board, GameState, generatePawn } from '.';
import { BoardSize, PawnType, Player } from '@/types';

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

describe('GameState', () => {
  describe('constructor', () => {
    it('Should initialize correctly', () => {
      const gameState = new GameState();

      expect(gameState).toBeTruthy();
      expect(gameState.winner).toBe(null);
      expect(gameState.currentPlayer).toBe(Player.PlayerOne);
      expect(gameState.availablePawns).toStrictEqual(baseAvailablePawns);
    });
  });

  describe('addPawnToAvailablePlayerPawns', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState();
    });

    it('Should add a pawn as expected', () => {
      gameState.availablePawns[1].Kitten = 0;
      gameState.availablePawns[1].Cat = 0;
      gameState.availablePawns[2].Kitten = 0;
      gameState.availablePawns[2].Cat = 0;

      gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Kitten);

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
        gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
        gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      });

      expect(gameState.availablePawns[Player.PlayerOne][PawnType.Cat]).toBe(8);
      expect(gameState.availablePawns[Player.PlayerOne][PawnType.Kitten]).toBe(8);
    });
  });

  describe('removePawnToAvailablePlayerPawns', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = new GameState();
    });

    it('Available pawns counter should not go below 0', () => {
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);

      Array.from({ length: 20 }).forEach((_) => {
        gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
        gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      });

      expect(gameState.availablePawns[Player.PlayerOne].Cat).toBe(0);
      expect(gameState.availablePawns[Player.PlayerOne].Kitten).toBe(0);
    });

    it('Should remove a pawn as expected', () => {
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);

      gameState.addPawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);

      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Kitten);

      expect(gameState.availablePawns[Player.PlayerOne].Cat).toBe(1);
      expect(gameState.availablePawns[Player.PlayerOne].Kitten).toBe(7);
      expect(gameState.availablePawns[Player.PlayerTwo].Cat).toBe(1);
      expect(gameState.availablePawns[Player.PlayerTwo].Kitten).toBe(7);
    });
  });

  describe('addPawnCoordinate', () => {
    it('Should add the provided pawn coordinates to the pawns coordinate list associated with the specified player', () => {
      const gameState = new GameState();

      gameState.addPawnCoordinate(1, 1, Player.PlayerOne);
      expect(gameState.pawnsCoordinates[Player.PlayerOne]).toStrictEqual([[1, 1]]);
    });
  });

  describe('removePawnCoordinate', () => {
    it('Should remove the provided pawn coordinates from the pawns coordinate list associated with the specified player', () => {
      const gameState = new GameState();

      gameState.addPawnCoordinate(1, 1, Player.PlayerOne);
      gameState.removePawnCoordinate(1, 1, Player.PlayerOne);
      expect(gameState.pawnsCoordinates[Player.PlayerOne]).toStrictEqual([]);
    });
  });

  describe('checkWinCondition', () => {
    let board: Board;
    let gameState: GameState;

    beforeEach(() => {
      board = new Board(BoardSize.Rows, BoardSize.Cols);
      gameState = new GameState();
    });

    it('Should return null if the winning condition is not met for the current player', () => {
      board.state[0][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.state[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.state[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Kitten);

      gameState.addPawnCoordinate(0, 1, Player.PlayerOne);
      gameState.addPawnCoordinate(1, 1, Player.PlayerOne);
      gameState.addPawnCoordinate(2, 1, Player.PlayerOne);

      expect(gameState.checkWinCondition(board, 0, 1)).toBe(null);
    });

    it('Should return the current player as winner if the winning condition is not met for the current player', () => {
      board.state[0][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.state[1][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);
      board.state[2][1].pawn = generatePawn(Player.PlayerOne, PawnType.Cat);

      gameState.addPawnCoordinate(0, 1, Player.PlayerOne);
      gameState.addPawnCoordinate(1, 1, Player.PlayerOne);
      gameState.addPawnCoordinate(2, 1, Player.PlayerOne);

      expect(gameState.checkWinCondition(board, 0, 1)).toBe(Player.PlayerOne);
    });
  });
});
