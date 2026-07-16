import type { GameEngine } from '../core/GameEngine';

import { CONTINENTAL_TOTAL_ROUNDS } from './rules';
import {
  calculateContinentalPlayerTotal,
  calculateContinentalRanking,
  getContinentalWinnerPlayerIds,
} from './scoring';
import { validateContinentalRound } from './validation';

export const continentalEngine: GameEngine = {
  calculatePlayerTotal:
    calculateContinentalPlayerTotal,

  calculateRanking:
    calculateContinentalRanking,

  validateRound:
    validateContinentalRound,

  isGameFinished(game) {
    return (
      game.rounds.length >= CONTINENTAL_TOTAL_ROUNDS ||
      game.rounds.some(
        (round) =>
          round.closingVariant === 'continental',
      )
    );
  },

  getWinnerPlayerIds:
    getContinentalWinnerPlayerIds,
};