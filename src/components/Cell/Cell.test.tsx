import { PawnType, Player } from '@/types';
import { BoardCell, generatePawn } from '@/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cell } from './Cell';

describe('BoardCell', () => {
  const row = 0;
  const col = 0;
  let boardCell: BoardCell;

  beforeEach(() => {
    boardCell = new BoardCell(row, col);
  });

  it('It should display nothing if the board cell has not a pawn assigned yet', () => {
    render(<Cell boardCell={boardCell} onCellClick={() => {}} />);

    expect(screen.getByTestId(`board-cell-${row}-${col}`)?.children.length).toBe(0);
  });

  it('It should render a player one Kitten pawn', () => {
    boardCell.value = generatePawn(Player.PlayerOne, PawnType.Kitten);
    render(<Cell boardCell={boardCell} onCellClick={() => {}} />);

    const cell = screen.getByTestId(`board-cell-${row}-${col}`);
    expect(cell?.children.length).toBe(1);
    expect(cell?.children.item(0)?.tagName).toBe('IMG');
    expect(cell?.children.item(0)?.getAttribute('alt')).toBe(
      `player ${Player.PlayerOne} blue ${PawnType.Kitten}`,
    );
  });

  it('It should render a player one Cat pawn', () => {
    boardCell.value = generatePawn(Player.PlayerOne, PawnType.Cat);
    render(<Cell boardCell={boardCell} onCellClick={() => {}} />);

    const cell = screen.getByTestId(`board-cell-${row}-${col}`);
    expect(cell?.children.length).toBe(1);
    expect(cell?.children.item(0)?.tagName).toBe('IMG');
    expect(cell?.children.item(0)?.getAttribute('alt')).toBe(
      `player ${Player.PlayerOne} blue ${PawnType.Cat}`,
    );
  });

  it('It should render a player two Kitten pawn', () => {
    boardCell.value = generatePawn(Player.PlayerTwo, PawnType.Kitten);
    render(<Cell boardCell={boardCell} onCellClick={() => {}} />);

    const cell = screen.getByTestId(`board-cell-${row}-${col}`);
    expect(cell?.children.length).toBe(1);
    expect(cell?.children.item(0)?.tagName).toBe('IMG');
    expect(cell?.children.item(0)?.getAttribute('alt')).toBe(
      `player ${Player.PlayerTwo} orange ${PawnType.Kitten}`,
    );
  });

  it('It should render a player two Cat pawn', () => {
    boardCell.value = generatePawn(Player.PlayerTwo, PawnType.Cat);
    render(<Cell boardCell={boardCell} onCellClick={() => {}} />);

    const cell = screen.getByTestId(`board-cell-${row}-${col}`);
    expect(cell?.children.length).toBe(1);
    expect(cell?.children.item(0)?.tagName).toBe('IMG');
    expect(cell?.children.item(0)?.getAttribute('alt')).toBe(
      `player ${Player.PlayerTwo} orange ${PawnType.Cat}`,
    );
  });

  it('It should trigger the onCellClick handler when the cell is clicked', async () => {
    const user = userEvent.setup();
    const onCellClick = vi.fn((boardCell: BoardCell) => boardCell);
    render(<Cell boardCell={boardCell} onCellClick={onCellClick} />);

    await user.click(screen.getByTestId(`board-cell-${row}-${col}`));

    expect(onCellClick).toHaveBeenCalledTimes(1);
    expect(onCellClick).toHaveBeenCalledWith(boardCell);
  });
});
