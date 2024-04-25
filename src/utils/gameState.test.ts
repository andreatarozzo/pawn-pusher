import { describe, it, expect } from 'vitest';
import { GameState } from '.';
import { PawnType, Player } from '@/types';

const baseAvailablePawns = {
  [Player.PlayerOne]: {
    Cat: 0,
    Kitten: 0,
  },
  [Player.PlayerTwo]: {
    Cat: 0,
    Kitten: 0,
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
    it('Should add a pawn as expected', () => {
      const gameState = new GameState();

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
  });

  describe('removePawnToAvailablePlayerPawns', () => {
    it('Available pawns number should not go below 0', () => {
      const gameState = new GameState();

      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Kitten);

      expect(gameState.availablePawns).toStrictEqual(baseAvailablePawns);
    });

    it('Should remove a pawn as expected', () => {
      const gameState = new GameState();

      gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);
      gameState.addPawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Kitten);

      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerOne, PawnType.Kitten);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Cat);
      gameState.removePawnToAvailablePlayerPawns(Player.PlayerTwo, PawnType.Kitten);

      expect(gameState.availablePawns).toStrictEqual(baseAvailablePawns);
    });
  });
});
