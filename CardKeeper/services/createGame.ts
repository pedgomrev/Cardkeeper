import { GAME_TYPES } from '@/games/core/types';
import type { Game, Player } from '@/models';
import { generateId } from '@/utils/generateId';

type CreateContinentalGameInput = {
  playerNames: string[];
};

export function createContinentalGame({
  playerNames,
}: CreateContinentalGameInput): Game {
  const now = new Date().toISOString();

  const players: Player[] = playerNames.map(
    (name, index) => ({
      id: generateId('player'),
      name: name.trim(),
      position: index + 1,
    }),
  );

  return {
    id: generateId('game'),
    gameType: GAME_TYPES.CONTINENTAL,
    status: 'in_progress',
    players,
    rounds: [],
    settings: {
      type: GAME_TYPES.CONTINENTAL,
    },
    createdAt: now,
    updatedAt: now,
  };
}