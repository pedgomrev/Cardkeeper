import type { RankingEntry } from '@/games/core/GameEngine';
import type { Game, Round } from '@/models';

import { hasReachedMauMauScoreLimit } from './rules';

export function calculateMauMauPlayerTotal(
  playerId: string,
  rounds: Round[],
): number {
  return rounds.reduce((total, round) => {
    const score = round.scores.find(
      (item) => item.playerId === playerId,
    );

    return total + (score?.points ?? 0);
  }, 0);
}

export function getMauMauScoreLimit(
  game: Game,
): number {
  if (game.settings.type !== 'maumau') {
    throw new Error(
      'La configuración de la partida no pertenece a MauMau.',
    );
  }

  return game.settings.scoreLimit;
}

export function isMauMauPlayerEliminated(
  playerId: string,
  game: Game,
): boolean {
  const scoreLimit = getMauMauScoreLimit(game);

  const totalPoints = calculateMauMauPlayerTotal(
    playerId,
    game.rounds,
  );

  return hasReachedMauMauScoreLimit(
    totalPoints,
    scoreLimit,
  );
}

export function getActiveMauMauPlayerIds(
  game: Game,
): string[] {
  return game.players
    .filter(
      (player) =>
        !isMauMauPlayerEliminated(
          player.id,
          game,
        ),
    )
    .map((player) => player.id);
}

export function getEliminatedMauMauPlayerIds(
  game: Game,
): string[] {
  return game.players
    .filter((player) =>
      isMauMauPlayerEliminated(
        player.id,
        game,
      ),
    )
    .map((player) => player.id);
}

export function calculateMauMauRanking(
  game: Game,
): RankingEntry[] {
  const orderedEntries = game.players
    .map((player) => ({
      playerId: player.id,
      totalPoints: calculateMauMauPlayerTotal(
        player.id,
        game.rounds,
      ),
      position: 0,
    }))
    .sort(
      (firstEntry, secondEntry) =>
        firstEntry.totalPoints -
        secondEntry.totalPoints,
    );

  let previousPoints: number | undefined;
  let previousPosition = 0;

  return orderedEntries.map((entry, index) => {
    const position =
      entry.totalPoints === previousPoints
        ? previousPosition
        : index + 1;

    previousPoints = entry.totalPoints;
    previousPosition = position;

    return {
      ...entry,
      position,
    };
  });
}

export function getMauMauWinnerPlayerIds(
  game: Game,
): string[] {
  if (game.rounds.length === 0) {
    return [];
  }

  const activePlayerIds =
    getActiveMauMauPlayerIds(game);

  if (activePlayerIds.length === 1) {
    return activePlayerIds;
  }

  if (activePlayerIds.length > 1) {
    return [];
  }

  /*
   * Caso excepcional: todos los jugadores han alcanzado
   * el límite en la misma ronda.
   *
   * Gana quien tenga menos puntos acumulados.
   */
  const ranking = calculateMauMauRanking(game);

  if (ranking.length === 0) {
    return [];
  }

  const winningScore = ranking[0].totalPoints;

  return ranking
    .filter(
      (entry) =>
        entry.totalPoints === winningScore,
    )
    .map((entry) => entry.playerId);
}