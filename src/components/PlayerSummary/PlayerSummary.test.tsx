import { BoardSize, PawnType, Player } from '@/types';
import { GameBoard, GameState } from '@/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayerSummary } from './PlayerSummary';

describe('PlayerSummary', () => {
  let gameBoard: GameBoard;
  let gameState: GameState;

  beforeEach(() => {
    gameBoard = new GameBoard(BoardSize.Rows, BoardSize.Cols);
    gameState = new GameState(gameBoard);
  });

  it('Should render the correct elements for player 1', () => {
    render(
      <PlayerSummary
        player={Player.PlayerOne}
        availablePawns={gameState.availablePawns}
        currentPlayer={gameState.currentPlayer}
        selectedPawn={null}
        onPawnSelected={() => null}
      />,
    );

    expect(screen.getByText('Player 1')).toBeTruthy();
    expect(screen.getByText('8 X')).toBeTruthy();
    expect(screen.getByText('X 0')).toBeTruthy();
    expect(screen.getByText('Select a pawn')).toBeTruthy();

    const images = screen.queryAllByRole('img');

    expect(images[0].getAttribute('alt')).toBe('player 1 blue kitten');
    expect(images[1].getAttribute('alt')).toBe('player 1 blue cat');
  });

  it('Should render the correct elements for player 2', () => {
    render(
      <PlayerSummary
        player={Player.PlayerTwo}
        availablePawns={gameState.availablePawns}
        currentPlayer={Player.PlayerTwo}
        selectedPawn={null}
        onPawnSelected={() => null}
      />,
    );

    expect(screen.getByText('Player 2')).toBeTruthy();
    expect(screen.getByText('8 X')).toBeTruthy();
    expect(screen.getByText('X 0')).toBeTruthy();
    expect(screen.getByText('Select a pawn')).toBeTruthy();

    const images = screen.queryAllByRole('img');

    expect(images[0].getAttribute('alt')).toBe('player 2 orange kitten');
    expect(images[1].getAttribute('alt')).toBe('player 2 orange cat');
  });

  it('Should show the correct pawn picked for player 1', () => {
    let component = render(
      <PlayerSummary
        player={Player.PlayerOne}
        availablePawns={gameState.availablePawns}
        currentPlayer={gameState.currentPlayer}
        selectedPawn={PawnType.Kitten}
        onPawnSelected={() => null}
      />,
    );

    let pawnSelected = screen.getByText('Pawn selected');
    expect(pawnSelected).toBeTruthy();

    expect(
      pawnSelected
        .getElementsByTagName('img')
        .item(0)
        ?.getAttribute('selected player 1 blue kitten'),
    );

    component.unmount();
    component = render(
      <PlayerSummary
        player={Player.PlayerOne}
        availablePawns={gameState.availablePawns}
        currentPlayer={gameState.currentPlayer}
        selectedPawn={PawnType.Cat}
        onPawnSelected={() => null}
      />,
    );

    pawnSelected = screen.getByText('Pawn selected');
    expect(pawnSelected).toBeTruthy();

    expect(
      pawnSelected.getElementsByTagName('img').item(0)?.getAttribute('selected player 1 blue cat'),
    );
  });

  it('Should show the correct pawn picked for player 2', () => {
    let component = render(
      <PlayerSummary
        player={Player.PlayerTwo}
        availablePawns={gameState.availablePawns}
        currentPlayer={Player.PlayerTwo}
        selectedPawn={PawnType.Kitten}
        onPawnSelected={() => null}
      />,
    );

    let pawnSelected = screen.getByText('Pawn selected');
    expect(pawnSelected).toBeTruthy();

    expect(
      pawnSelected
        .getElementsByTagName('img')
        .item(0)
        ?.getAttribute('selected player 2 orange kitten'),
    );

    component.unmount();
    component = render(
      <PlayerSummary
        player={Player.PlayerTwo}
        availablePawns={gameState.availablePawns}
        currentPlayer={Player.PlayerTwo}
        selectedPawn={PawnType.Cat}
        onPawnSelected={() => null}
      />,
    );

    pawnSelected = screen.getByText('Pawn selected');
    expect(pawnSelected).toBeTruthy();

    expect(
      pawnSelected
        .getElementsByTagName('img')
        .item(0)
        ?.getAttribute('selected player 2 orange cat'),
    );
  });

  it('Should not trigger the onPawnSelected if the player have 0 pawn available', async () => {
    const user = userEvent.setup();
    const onPawnSelected = vi.fn();
    gameState.removePawnFromAvailablePlayerPawns(PawnType.Kitten, 8);
    render(
      <PlayerSummary
        player={Player.PlayerOne}
        availablePawns={gameState.availablePawns}
        currentPlayer={Player.PlayerOne}
        selectedPawn={null}
        onPawnSelected={onPawnSelected}
      />,
    );

    const pawnSelectionButtons = screen.getAllByRole('button');

    await user.click(pawnSelectionButtons[0]);
    expect(onPawnSelected).toHaveBeenCalledTimes(0);

    await user.click(pawnSelectionButtons[1]);
    expect(onPawnSelected).toBeCalledTimes(0);
  });

  it('Should trigger the onPawnSelected method when a pawn is selected', async () => {
    const user = userEvent.setup();
    const onPawnSelected = vi.fn();
    gameState.addPawnToAvailablePlayerPawns(PawnType.Cat);
    render(
      <PlayerSummary
        player={Player.PlayerOne}
        availablePawns={gameState.availablePawns}
        currentPlayer={Player.PlayerOne}
        selectedPawn={null}
        onPawnSelected={onPawnSelected}
      />,
    );

    const pawnSelectionButtons = screen.getAllByRole('button');

    await user.click(pawnSelectionButtons[0]);

    expect(onPawnSelected).toHaveBeenCalledTimes(1);
    expect(onPawnSelected).toHaveBeenCalledWith(Player.PlayerOne, PawnType.Kitten);

    await user.click(pawnSelectionButtons[1]);

    expect(onPawnSelected).toBeCalledTimes(2);
    expect(onPawnSelected).toHaveBeenCalledWith(Player.PlayerOne, PawnType.Cat);
  });
});
