import { BoardSize, PawnType, Player } from '@/types';
import { GameBoard, GameState } from '@/utils';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PlayerSummary } from './PlayerSummary';

describe('PlayerSummary', () => {
  const gameBoard: GameBoard = new GameBoard(BoardSize.Rows, BoardSize.Cols);
  const gameState: GameState = new GameState(gameBoard);

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
});
