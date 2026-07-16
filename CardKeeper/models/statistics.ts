import type { GameType } from '@/games/core/types';

export type PlayerGameStatistics = {
  gamesPlayed: number;
  wins: number;
  totalFinalPoints: number;
  averageFinalPoints: number;
};

export type PlayerStatistics = {
  playerKey: string;
  playerName: string;

  gamesPlayed: number;
  wins: number;
  winRate: number;

  totalFinalPoints: number;
  averageFinalPoints: number;

  continentalWins: number;
  maumauWins: number;
  continentalsAchieved: number;

  byGame: Record<GameType, PlayerGameStatistics>;
};

export type GameTypeStatistics = {
  gameType: GameType;
  gamesPlayed: number;
  averageRounds: number;
};

export type AppStatistics = {
  totalGames: number;
  completedGames: number;
  gamesInProgress: number;

  players: PlayerStatistics[];
  gamesByType: GameTypeStatistics[];
};