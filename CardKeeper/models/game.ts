import type {
  GameSettings,
  GameType
} from '@/games/core/types';
import type { Player } from './player';
import type { Round } from './round';

export type GameStatus =
  | 'setup'
  | 'in_progress'
  | 'finished';

export type Game = {
  id: string;
  gameType: GameType;
  status: GameStatus;

  players: Player[];
  rounds: Round[];

  settings: GameSettings;

  winnerPlayerIds?: string[];

  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
};