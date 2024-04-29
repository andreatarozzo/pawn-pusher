import { Player } from '@/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WinnerModal } from './WinnerModal';

describe('WinnerModal', () => {
  it('Should not render if open props is not true', () => {
    render(
      <WinnerModal
        open={false}
        winner={Player.PlayerOne}
        onClose={() => null}
        onGameReset={() => null}
      />,
    );

    expect(screen.queryByTestId('winner-modal-overlay')).toBeFalsy();
    expect(screen.queryByTestId('winner-modal')).toBeFalsy();
  });

  it('Should render if the open props is true', () => {
    render(
      <WinnerModal
        open={true}
        winner={Player.PlayerOne}
        onClose={() => null}
        onGameReset={() => null}
      />,
    );

    expect(screen.queryByTestId('winner-modal-overlay')).toBeTruthy();
    expect(
      screen.queryByTestId('winner-modal')?.getElementsByTagName('span')?.item(0)?.textContent,
    ).toBe('Congratulation Player 1 you won!');
  });

  it('Should trigger the onClose method when the button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn(() => null);

    render(
      <WinnerModal
        open={true}
        winner={Player.PlayerOne}
        onClose={() => onClose()}
        onGameReset={() => null}
      />,
    );

    await user.click(screen.getByText('Close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Should trigger the onGameReset method when the button is clicked', async () => {
    const user = userEvent.setup();
    const onGameReset = vi.fn(() => null);

    render(
      <WinnerModal
        open={true}
        winner={Player.PlayerOne}
        onClose={() => null}
        onGameReset={() => onGameReset()}
      />,
    );

    await user.click(screen.getByText('Start another game'));

    expect(onGameReset).toHaveBeenCalledTimes(1);
  });
});
