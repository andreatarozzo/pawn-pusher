import {
  AvailablePawns,
  BoopResult,
  Coordinate,
  GameAction,
  GameLog,
  IGameState,
  PawnLimit,
  PawnLocations,
  PawnType,
  Player,
} from '@/types';
import { GameBoard } from './board';
import { generatePawn } from './pawn';

export class GameState implements IGameState {
  gameBoard: GameBoard;
  currentPlayer: Player = Player.PlayerOne;
  gameHistory: GameLog[] = [];
  gameTurn: number;
  winner: Player | null = null;
  readonly pawnsCoordinates: PawnLocations = {
    [Player.PlayerOne]: {
      [PawnType.Cat]: [],
      [PawnType.Kitten]: [],
    },
    [Player.PlayerTwo]: {
      [PawnType.Cat]: [],
      [PawnType.Kitten]: [],
    },
  };
  readonly availablePawns: AvailablePawns = {
    [Player.PlayerOne]: {
      [PawnType.Cat]: 0,
      [PawnType.Kitten]: PawnLimit.Kitten,
    },
    [Player.PlayerTwo]: {
      [PawnType.Cat]: 0,
      [PawnType.Kitten]: PawnLimit.Kitten,
    },
  };

  // TODO: see todo below, we should pass some config where a dev can pass some sort of method mapping
  // Depending on action required instead of tightly coupling a gameBoard object with a gameState object

  // TODO: 2 - Thinking about replacing params in methods with params object
  constructor(
    gameBoard: GameBoard,
    currentPlayer?: Player,
    availablePawns?: AvailablePawns,
    gameTurn?: number,
  ) {
    this.gameBoard = gameBoard;
    if (currentPlayer && availablePawns) {
      this.currentPlayer = currentPlayer;
      this.availablePawns = availablePawns;
    }
    this.gameTurn = gameTurn || 1;
    this.addGameLogToHistory({ action: GameAction.GameStart, player: this.currentPlayer });
  }

  /**
   * set the currentPlayer value to the opposite player.
   * @returns
   */
  switchPlayer(): Player {
    this.currentPlayer =
      this.currentPlayer === Player.PlayerOne ? Player.PlayerTwo : Player.PlayerOne;
    this.addGameLogToHistory({
      action: GameAction.CurrentPlayerChanged,
      player: this.currentPlayer,
    });
    this.gameTurn += 1;
    return this.currentPlayer;
  }

  /**
   * Returns the current player available pawns for the pawn type provided.
   * If no player is specified the current player will be used.
   * @param type
   * @param player
   * @returns
   */
  getAvailablePawns(type: PawnType, player?: Player): number {
    return this.availablePawns[player || this.currentPlayer][type];
  }

  /**
   * Returns the pawn coordinate for the current player.
   * If no player is specified the current player will be used.
   * @param player
   * @returns
   */
  getPawnCoordinates(type: PawnType, player?: Player): Coordinate[] {
    const targetPlayer = player || this.currentPlayer;
    return this.pawnsCoordinates[targetPlayer][type];
  }

  /**
   * Adds a new entry to the game history
   * @param params
   */
  addGameLogToHistory(params: GameLog): void {
    const targetPlayer = params.player || this.currentPlayer;

    this.gameHistory.push({
      action: params.action,
      player: targetPlayer,
      opponent: targetPlayer === Player.PlayerOne ? Player.PlayerTwo : Player.PlayerOne,
      gameTurn: params.gameTurn || this.gameTurn,
      pawnType: params.pawnType,
      originCoordinates: params.originCoordinates,
      destinationCoordinates: params.destinationCoordinates,
    });
  }

  /**
   * Increase the player's pawn counter for the given pawn type.
   * If no player is specified the current player will be used.
   * @param player
   * @param type
   */
  addPawnToAvailablePlayerPawns(
    type: PawnType,
    incrementValue?: number | null,
    player?: Player,
  ): void {
    const targetPlayer = player || this.currentPlayer;
    const targetIncrementValue = incrementValue || 1;

    if (this.getAvailablePawns(type, targetPlayer) + targetIncrementValue > PawnLimit[type]) {
      this.availablePawns[targetPlayer][type] = PawnLimit[type];
      return;
    }

    this.availablePawns[targetPlayer][type] += targetIncrementValue;
  }

  /**
   * Decrease the player's pawn counter for the given pawn type
   *  If no player is specified the current player will be used.
   * @param player
   * @param type
   */
  removePawnFromAvailablePlayerPawns(
    type: PawnType,
    decrementValue?: number | null,
    player?: Player,
  ): void {
    const targetPlayer = player || this.currentPlayer;
    const targetDecrementValue = decrementValue || 1;

    if (this.getAvailablePawns(type, targetPlayer) - targetDecrementValue < 0) {
      this.availablePawns[targetPlayer][type] = 0;
      return;
    }

    this.availablePawns[targetPlayer][type] -= targetDecrementValue;
  }

  /**
   * Register a new Pawn placed on the board.
   * If no player is specified the current player will be used.
   * @param row
   * @param col
   * @param player
   */
  registerPawn(row: number, col: number, type: PawnType, player?: Player): boolean {
    const targetPlayer = player || this.currentPlayer;

    if (this.getAvailablePawns(type, targetPlayer) > 0) {
      this.pawnsCoordinates[targetPlayer][type].push([row, col]);
      this.gameBoard.state[row][col].value = generatePawn(targetPlayer, type);
      this.removePawnFromAvailablePlayerPawns(type, null, targetPlayer);

      this.addGameLogToHistory({
        action: GameAction.PawnPlaced,
        pawnType: type,
        originCoordinates: [row, col],
        player: targetPlayer,
      });
      return true;
    }
    return false;
  }

  /**
   * Remove the given coordinate from the player pawn coordinates
   * @param row
   * @param col
   * @param type
   * @param player
   */
  removePawnCoordinate(row: number, col: number, type: PawnType, player?: Player): void {
    const targetPlayer = player || this.currentPlayer;
    const indexToRemove = this.pawnsCoordinates[targetPlayer][type].findIndex(
      (coordinate) => coordinate[0] === row && coordinate[1] === col,
    );
    if (indexToRemove !== -1) this.pawnsCoordinates[targetPlayer][type].splice(indexToRemove, 1);
  }

  // TODO: These methods should accepts a callback function to be execute when needed to increase flexibility of the solution.
  // In this way the different checks and actions con been registered/swapped as needed.
  // At the moment we are coupling the current game state definition with the current game board definition,
  // which is not optimal for flexibility of the solution.

  /**
   * Checks if the current player pawn at the coordinates provided caused the player to win the game.
   * Returns the player if the current player won.
   * Returns null otherwise.
   * @param board
   * @param pawnRow
   * @param pawnCol
   * @returns
   */
  checkWinCondition(pawnRow: number, pawnCol: number, player?: Player): Player | null {
    const targetPlayer = player || this.currentPlayer;
    for (const directionKey of this.gameBoard.directionsList) {
      if (this.gameBoard.hasPlayerWon(pawnRow, pawnCol, directionKey, targetPlayer)) {
        this.winner = targetPlayer;
        this.addGameLogToHistory({ action: GameAction.PlayerWin, player: targetPlayer });
        return this.winner;
      }
    }
    return null;
  }

  /**
   * Scan the neighbors of the pawn at the given coordinates and boop the opponent player's pawn
   * if the condition are met.
   * If not player is specified the current player will be used.
   * @param pawnRow
   * @param pawnCol
   */
  boopScan(pawnRow: number, pawnCol: number, player?: Player): BoopResult[] | null {
    const targetPlayer = player || this.currentPlayer;
    const opponent = targetPlayer === Player.PlayerOne ? Player.PlayerTwo : Player.PlayerOne;
    const result: BoopResult[] = [];

    for (const directionKey of this.gameBoard.directionsList) {
      const boopResult = this.gameBoard.boopPawn(pawnRow, pawnCol, directionKey, targetPlayer);

      // If there is a boop result then it means that a pawn has been booped
      if (boopResult) {
        result.push(boopResult);

        this.removePawnCoordinate(
          boopResult.pawnBoopedOriginCell[0],
          boopResult.pawnBoopedOriginCell[1],
          boopResult.type,
          targetPlayer === Player.PlayerOne ? Player.PlayerTwo : Player.PlayerOne,
        );

        if (boopResult.pawnBoopedDestinationCell) {
          this.pawnsCoordinates[opponent][boopResult.type].push(
            boopResult.pawnBoopedDestinationCell,
          );
          this.addGameLogToHistory({
            action: GameAction.PawnBumped,
            pawnType: boopResult.type,
            player: boopResult.player,
            originCoordinates: boopResult.pawnBoopedOriginCell,
            destinationCoordinates: boopResult.pawnBoopedDestinationCell,
          });
        } else {
          // This means that the pawn fell off the board
          // So we remove add back the pawn to the counter
          this.addPawnToAvailablePlayerPawns(boopResult.type, null, opponent);
          this.addGameLogToHistory({
            action: GameAction.PawnBumpedOutOfBoundaries,
            pawnType: boopResult.type,
            player: boopResult.player,
            originCoordinates: boopResult.pawnBoopedOriginCell,
          });
          this.addGameLogToHistory({
            action: GameAction.PawnAwarded,
            pawnType: boopResult.type,
            player: boopResult.player,
          });
        }
      }
    }

    return result.length > 0 ? result : null;
  }

  /**
   * Scan the pawn at the given coordinate for promotions.
   * If not player is specified the current player will be used.
   * @param pawnRow
   * @param pawnCol
   * @returns
   */
  promotionScan(pawnRow: number, pawnCol: number, player?: Player): Coordinate[] | null {
    const targetPlayer = player || this.currentPlayer;
    let promotedPawnOrigin: Coordinate[] = [];

    for (const directionKey of this.gameBoard.directionsList) {
      const promotionResult = this.gameBoard.promoteKittens(
        pawnRow,
        pawnCol,
        directionKey,
        targetPlayer,
      );

      // If there is a promotion result then it means a set of 3 pawns has been promoted
      if (promotionResult) {
        promotedPawnOrigin = [...promotedPawnOrigin, ...promotionResult];
        this.addPawnToAvailablePlayerPawns(PawnType.Kitten, 3, targetPlayer);
        this.addPawnToAvailablePlayerPawns(PawnType.Cat, null, targetPlayer);
        promotionResult.forEach((c) =>
          this.removePawnCoordinate(c[0], c[1], PawnType.Kitten, targetPlayer),
        );
        this.addGameLogToHistory({
          action: GameAction.PawnsPromoted,
          pawnType: PawnType.Kitten,
          player: targetPlayer,
          originCoordinates: promotionResult,
        });
        this.addGameLogToHistory({
          action: GameAction.PawnAwarded,
          pawnType: PawnType.Cat,
          player: targetPlayer,
        });
      }
    }

    return promotedPawnOrigin.length > 0 ? promotedPawnOrigin : null;
  }
}
