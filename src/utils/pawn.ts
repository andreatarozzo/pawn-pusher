import { Pawn, PawnType, Player } from '@/types';

export const generatePawn = (player: Player, type: PawnType): Pawn => ({
  player,
  type,
});
