import { BoardSize } from '@/types';
import { GameBoard, GameState } from '@/utils';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { PawnCoordinatesSummary } from './PawnCoordinatesSummary';

describe('DebugPanel', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState(new GameBoard(BoardSize.Rows, BoardSize.Cols));
  });

  it('Should render just the pawn images when no pawn coordinates are present in the game state', () => {
    render(<PawnCoordinatesSummary gameState={gameState} />);

    expect(screen.getByText('Pawn Summary'));

    const images = screen.queryAllByRole('img');
    expect(images[0].getAttribute('alt')).toBe('blue kitten');
    expect(images[1].getAttribute('alt')).toBe('blue cat');
    expect(images[2].getAttribute('alt')).toBe('orange kitten');
    expect(images[3].getAttribute('alt')).toBe('orange cat');
  });

  it('Should render just the pawn images when no pawn coordinates are present in the game state', () => {
    gameState.pawnsCoordinates[1].Kitten.push([0, 0]);
    gameState.pawnsCoordinates[1].Cat.push([0, 1]);
    gameState.pawnsCoordinates[2].Kitten.push([5, 0]);
    gameState.pawnsCoordinates[2].Cat.push([5, 1]);
    render(<PawnCoordinatesSummary gameState={gameState} />);

    expect(
      screen.getByTestId('player-1-kitten-pawn-coordinates-summary').children.item(1)?.textContent,
    ).toBe('[0,0]');
    expect(
      screen.getByTestId('player-1-cat-pawn-coordinates-summary').children.item(1)?.textContent,
    ).toBe('[0,1]');
    expect(
      screen.getByTestId('player-2-kitten-pawn-coordinates-summary').children.item(1)?.textContent,
    ).toBe('[5,0]');
    expect(
      screen.getByTestId('player-2-cat-pawn-coordinates-summary').children.item(1)?.textContent,
    ).toBe('[5,1]');
  });
});
