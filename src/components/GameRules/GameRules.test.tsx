import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameRules } from './GameRules';

describe('GameRules', () => {
  it('Should render the game rules', () => {
    render(<GameRules />);

    expect(screen.getByText('Game Rules')).toBeTruthy();

    const rules = screen.getByTestId('game-rules-rules-container').getElementsByTagName('p');
    expect(rules).toBeTruthy();

    expect(rules[0].textContent).toBe('Each Player starts with 8 Kittens and 0 Cats.');
    expect(rules[1].textContent).toBe(
      'Click on the pawn image to select the pawn you want to play.',
    );
    expect(rules[2].textContent).toBe(
      `A pawn placed nearby other opponent's pawns will boop them away by 1 cell.`,
    );
    expect(rules[3].textContent).toBe('Kittens can boop Kittens but not Cats.');
    expect(rules[4].textContent).toBe('Cats can boop both Kittens and Cats.');
    expect(rules[5].textContent).toBe(
      `Pawns can be booped outside the board returning to the player's pawns pool.`,
    );
    expect(rules[6].textContent).toBe(
      'Placing 3 Kittens in a row will remove them from the game and the player will be awarded with 1 Cat.',
    );
    expect(rules[7].textContent).toBe('The player who places 3 Cats in a row win the game.');
  });
});
