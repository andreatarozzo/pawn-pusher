import { AvailablePawns, IGameState, PawnLimit, PawnLocations, PawnType, Player } from '@/types';
import { Board } from './board';

export class GameState implements IGameState {
  currentPlayer: Player = Player.PlayerOne;
  winner: Player | null = null;
  readonly pawnsCoordinates: PawnLocations = {
    [Player.PlayerOne]: [],
    [Player.PlayerTwo]: [],
  };
  readonly availablePawns: AvailablePawns = {
    [Player.PlayerOne]: {
      Cat: 0,
      Kitten: PawnLimit.Kitten,
    },
    [Player.PlayerTwo]: {
      Cat: 0,
      Kitten: PawnLimit.Kitten,
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
    this.availablePawns[player][type] +=
      this.availablePawns[player][type] < PawnLimit[type] ? 1 : 0;
  }

  /**
   * Decrease the player's pawn counter for the given pawn type
   * @param player
   * @param type
   */
  removePawnToAvailablePlayerPawns(player: Player, type: PawnType): void {
    this.availablePawns[player][type] -= this.availablePawns[player][type] ? 1 : 0;
  }

  /**
   * Adds the given coordinate to the player pawn coordinates
   * @param row
   * @param col
   * @param player
   */
  addPawnCoordinate(row: number, col: number, player: Player): void {
    this.pawnsCoordinates[player].push([row, col]);
  }

  /**
   * Remove the given coordinate from the player pawn coordinates
   * @param row
   * @param col
   * @param player
   */
  removePawnCoordinate(row: number, col: number, player: Player): void {
    const indexToRemove = this.pawnsCoordinates[player].findIndex(
      (coordinate) => coordinate[0] === row && coordinate[1] === col,
    );
    this.pawnsCoordinates[player].splice(indexToRemove, 1);
  }

  /**
   * Checks if the current player pawn at the coordinates provided caused the player to win the game.
   * Returns the player if the current player won.
   * Returns null otherwise.
   * @param board
   * @param pawnRow
   * @param pawnCol
   * @returns
   */
  checkWinCondition(board: Board, pawnRow: number, pawnCol: number): Player | null {
    for (const directionKey of board.directionsList) {
      if (board.hasPlayerWon(pawnRow, pawnCol, directionKey, this.currentPlayer)) {
        this.winner = this.currentPlayer;
        return this.winner;
      }
    }
    return null;
  }
}
