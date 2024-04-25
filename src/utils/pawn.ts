import { Pawn, PawnType, Player } from '@/types';

export const generatePawn = (player: Player, type: PawnType): Pawn => {
  if (!player || !type) throw TypeError('player or type cannot be undefined');

  return {
    player,
    type,
  };
};
