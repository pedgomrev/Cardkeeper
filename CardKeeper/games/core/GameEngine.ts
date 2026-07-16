import type { Game, Round } from '@/models';

export type RankingEntry = {
  playerId: string;
  totalPoints: number;
  position: number;
};

export type RoundValidationResult = {
  valid: boolean;
  errors: string[];
};

export interface GameEngine {
  calculatePlayerTotal(
    playerId: string,
    rounds: Round[],
  ): number;

  calculateRanking(game: Game): RankingEntry[];

  validateRound(
    round: Round,
    game: Game,
  ): RoundValidationResult;

  isGameFinished(game: Game): boolean;

  getWinnerPlayerIds(game: Game): string[];
}