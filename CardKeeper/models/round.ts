import type { PlayerRoundScore } from './score';

export type ClosingVariant =
  | 'normal'
  | 'full_straight'
  | 'continental';

export type Round = {
  id: string;
  number: number;
  scores: PlayerRoundScore[];
  closedByPlayerId: string;
  closingVariant: ClosingVariant;
  createdAt: string;
};