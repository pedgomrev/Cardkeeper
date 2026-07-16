import type { Game, Round } from '@/models';

import type { RankingEntry } from '../core/GameEngine';
import { getContinentalRoundRule } from './rules';

export function calculateContinentalPlayerTotal(
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

export function getContinentalClosingScore(
  roundNumber: number,
): number {
  const rule = getContinentalRoundRule(roundNumber);

  if (!rule) {
    throw new Error(
      `Ronda de Continental no válida: ${roundNumber}`,
    );
  }

  return rule.closingScore;
}

export function calculateContinentalRanking(
  game: Game,
): RankingEntry[] {
  const ordered = game.players
    .map((player) => ({
      playerId: player.id,
      totalPoints: calculateContinentalPlayerTotal(
        player.id,
        game.rounds,
      ),
      position: 0,
    }))
    .sort(
      (a, b) => a.totalPoints - b.totalPoints,
    );

  let previousPoints: number | undefined;
  let previousPosition = 0;

  return ordered.map((entry, index) => {
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

export function getContinentalWinnerPlayerIds(
  game: Game,
): string[] {
  const continentalRound = game.rounds.find(
    (round) =>
      round.number === 7 &&
      round.closingVariant === 'continental',
  );

  if (continentalRound) {
    return [continentalRound.closedByPlayerId];
  }

  if (game.rounds.length < 7) {
    return [];
  }

  const ranking = calculateContinentalRanking(game);

  if (ranking.length === 0) {
    return [];
  }

  const winningScore = ranking[0].totalPoints;

  return ranking
    .filter(
      (entry) => entry.totalPoints === winningScore,
    )
    .map((entry) => entry.playerId);
}