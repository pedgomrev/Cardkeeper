import { GAME_TYPES } from '@/games/core/types';
import {
  DEFAULT_MAUMAU_SCORE_LIMIT,
  isValidMauMauScoreLimit,
} from '@/games/maumau/rules';
import type { Game, Player } from '@/models';
import { generateId } from '@/utils/generateId';

type CreateContinentalGameInput = {
  playerNames: string[];
};

type CreateMauMauGameInput = {
  playerNames: string[];
  scoreLimit?: number;
};

function createPlayers(
  playerNames: string[],
): Player[] {
  return playerNames.map((name, index) => ({
    id: generateId('player'),
    name: name.trim(),
    position: index + 1,
  }));
}

export function createContinentalGame({
  playerNames,
}: CreateContinentalGameInput): Game {
  const now = new Date().toISOString();

  return {
    id: generateId('game'),
    gameType: GAME_TYPES.CONTINENTAL,
    status: 'in_progress',
    players: createPlayers(playerNames),
    rounds: [],
    settings: {
      type: GAME_TYPES.CONTINENTAL,
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function createMauMauGame({
  playerNames,
  scoreLimit = DEFAULT_MAUMAU_SCORE_LIMIT,
}: CreateMauMauGameInput): Game {
  if (!isValidMauMauScoreLimit(scoreLimit)) {
    throw new Error(
      'El límite de puntos de MauMau no es válido.',
    );
  }

  const now = new Date().toISOString();

  return {
    id: generateId('game'),
    gameType: GAME_TYPES.MAUMAU,
    status: 'in_progress',
    players: createPlayers(playerNames),
    rounds: [],
    settings: {
      type: GAME_TYPES.MAUMAU,
      scoreLimit,
    },
    createdAt: now,
    updatedAt: now,
  };
}