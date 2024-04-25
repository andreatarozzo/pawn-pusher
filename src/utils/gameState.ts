import { AvailablePawns, IGameState, PawnType, Player } from '@/types';

export class GameState implements IGameState {
  currentPlayer: Player = Player.PlayerOne;
  winner: Player | null = null;
  availablePawns: AvailablePawns = {
    [Player.PlayerOne]: {
      Cat: 0,
      Kitten: 0,
    },
    [Player.PlayerTwo]: {
      Cat: 0,
      Kitten: 0,
    },
  };

  constructor(currentPlayer?: Player, availablePawns?: AvailablePawns) {
    if (currentPlayer && availablePawns) {
      this.currentPlayer = currentPlayer;
      this.availablePawns = availablePawns;
    }
  }

  /**
   * Increase the player's pawn counter for the given pawn type
   * @param player
   * @param type
   */
  addPawnToAvailablePlayerPawns(player: Player, type: PawnType): void {
    this.availablePawns[player][type] += 1;
  }

  /**
   * Decrease the player's pawn counter for the given pawn type
   * @param player
   * @param type
   */
  removePawnToAvailablePlayerPawns(player: Player, type: PawnType): void {
    this.availablePawns[player][type] -= this.availablePawns[player][type] ? 1 : 0;
  }
}
