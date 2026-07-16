import type { GameEngine } from '@/games/core/GameEngine';

import {
    calculateMauMauPlayerTotal,
    calculateMauMauRanking,
    getActiveMauMauPlayerIds,
    getMauMauWinnerPlayerIds,
} from './scoring';
import { validateMauMauRound } from './validation';

export const maumauEngine: GameEngine = {
  calculatePlayerTotal:
    calculateMauMauPlayerTotal,

  calculateRanking:
    calculateMauMauRanking,

  validateRound:
    validateMauMauRound,

  isGameFinished(game) {
    if (game.rounds.length === 0) {
      return false;
    }

    const activePlayerIds =
      getActiveMauMauPlayerIds(game);

    return activePlayerIds.length <= 1;
  },

  getWinnerPlayerIds:
    getMauMauWinnerPlayerIds,
};