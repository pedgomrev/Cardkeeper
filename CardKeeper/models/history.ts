import type { Game } from './game';

export type GameHistoryItem = {
  game: Game;
  winnerNames: string[];
  durationInMinutes?: number;
};