import { gameRegistry } from '@/games/core/GameRegistry';
import type { Game, Round } from '@/models';

export function addRound(
  game: Game,
  round: Round,
): Game {
  const engine = gameRegistry[game.gameType].engine;

  const validation = engine.validateRound(
    round,
    game,
  );

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  const updatedGame: Game = {
    ...game,
    rounds: [...game.rounds, round],
    updatedAt: new Date().toISOString(),
  };

  if (!engine.isGameFinished(updatedGame)) {
    return updatedGame;
  }

  const finishedAt = new Date().toISOString();

  return {
    ...updatedGame,
    status: 'finished',
    winnerPlayerIds:
      engine.getWinnerPlayerIds(updatedGame),
    finishedAt,
    updatedAt: finishedAt,
  };
}