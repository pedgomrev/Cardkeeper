import type { RoundScore } from './score';

export type ClosingVariant =
  | 'normal'
  | 'full_straight'
  | 'continental';

export type Round = {
  id: string;
  number: number;
  scores: RoundScore[];
  closedByPlayerId: string;
  closingVariant: ClosingVariant;
  createdAt: string;
};