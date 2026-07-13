import { gameRegistry } from '@/games/core/GameRegistry';
import type { Game, Round } from '@/models';

export function addRound(
  game: Game,
  round: Round,
): Game {
  const engine = gameRegistry[game.gameType].engine;
  const validation = engine.validateRound(round, game);

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  return {
    ...game,
    rounds: [...game.rounds, round],
    updatedAt: new Date().toISOString(),
  };
}