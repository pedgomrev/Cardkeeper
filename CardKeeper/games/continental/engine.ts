import type { GameEngine } from '../core/GameEngine';

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
    return getContinentalWinnerPlayerIds(game).length > 0;
  },

  getWinnerPlayerIds:
    getContinentalWinnerPlayerIds,
};