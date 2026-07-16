import type { Game, Round } from '@/models';

import type { RoundValidationResult } from '../core/GameEngine';
import {
    CONTINENTAL_TOTAL_ROUNDS,
    getContinentalRoundRule,
} from './rules';

export function validateContinentalRound(
  round: Round,
  game: Game,
): RoundValidationResult {
  const errors: string[] = [];

  validateGameStatus(game, errors);
  validateRoundNumber(round, game, errors);
  validateClosingPlayer(round, game, errors);
  validateScores(round, game, errors);
  validateClosingVariant(round, errors);
  validateClosingScore(round, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateGameStatus(
  game: Game,
  errors: string[],
): void {
  if (game.status === 'finished') {
    errors.push(
      'No se pueden añadir rondas a una partida finalizada.',
    );
  }

  if (game.rounds.length >= CONTINENTAL_TOTAL_ROUNDS) {
    errors.push(
      'La partida ya contiene las siete rondas del Continental.',
    );
  }

  const hasContinentalWinner = game.rounds.some(
    (existingRound) =>
      existingRound.number === CONTINENTAL_TOTAL_ROUNDS &&
      existingRound.closingVariant === 'continental',
  );

  if (hasContinentalWinner) {
    errors.push(
      'La partida ya finalizó porque un jugador consiguió un Continental.',
    );
  }
}

function validateRoundNumber(
  round: Round,
  game: Game,
  errors: string[],
): void {
  const rule = getContinentalRoundRule(round.number);

  if (!rule) {
    errors.push(
      `La ronda debe estar comprendida entre 1 y ${CONTINENTAL_TOTAL_ROUNDS}.`,
    );

    return;
  }

  const expectedRoundNumber = game.rounds.length + 1;

  if (round.number !== expectedRoundNumber) {
    errors.push(
      `La siguiente ronda debe ser la número ${expectedRoundNumber}.`,
    );
  }

  const roundAlreadyExists = game.rounds.some(
    (existingRound) =>
      existingRound.number === round.number,
  );

  if (roundAlreadyExists) {
    errors.push(
      `La ronda ${round.number} ya está registrada.`,
    );
  }
}

function validateClosingPlayer(
  round: Round,
  game: Game,
  errors: string[],
): void {
  if (!round.closedByPlayerId.trim()) {
    errors.push(
      'Debe indicarse qué jugador cerró la ronda.',
    );

    return;
  }

  const closingPlayerExists = game.players.some(
    (player) =>
      player.id === round.closedByPlayerId,
  );

  if (!closingPlayerExists) {
    errors.push(
      'El jugador que cerró no pertenece a la partida.',
    );
  }
}

function validateScores(
  round: Round,
  game: Game,
  errors: string[],
): void {
  if (round.scores.length !== game.players.length) {
    errors.push(
      'Debe existir una puntuación para cada jugador.',
    );
  }

  const scorePlayerIds = round.scores.map(
    (score) => score.playerId,
  );

  const uniquePlayerIds = new Set(scorePlayerIds);

  if (uniquePlayerIds.size !== scorePlayerIds.length) {
    errors.push(
      'No puede haber más de una puntuación registrada para un mismo jugador.',
    );
  }

  const unknownPlayerIds = scorePlayerIds.filter(
    (playerId) =>
      !game.players.some(
        (player) => player.id === playerId,
      ),
  );

  if (unknownPlayerIds.length > 0) {
    errors.push(
      'Hay puntuaciones asociadas a jugadores que no pertenecen a la partida.',
    );
  }

  const playersWithoutScore = game.players.filter(
    (player) =>
      !uniquePlayerIds.has(player.id),
  );

  if (playersWithoutScore.length > 0) {
    errors.push(
      'Todos los jugadores deben tener una puntuación registrada.',
    );
  }

  const invalidScores = round.scores.filter(
    (score) =>
      !Number.isFinite(score.points) ||
      !Number.isInteger(score.points),
  );

  if (invalidScores.length > 0) {
    errors.push(
      'Todas las puntuaciones deben ser números enteros válidos.',
    );
  }

  const invalidNegativeScores = round.scores.filter(
    (score) =>
      score.playerId !== round.closedByPlayerId &&
      score.points < 0,
  );

  if (invalidNegativeScores.length > 0) {
    errors.push(
      'Solo el jugador que cierra puede tener una puntuación negativa.',
    );
  }

  const invalidPositiveScores = round.scores.filter(
    (score) =>
      score.playerId !== round.closedByPlayerId &&
      score.points >= 0 &&
      score.points % 5 !== 0,
  );

  if (invalidPositiveScores.length > 0) {
    errors.push(
      'Las puntuaciones de los jugadores que no cerraron deben ser múltiplos de cinco.',
    );
  }
}

function validateClosingVariant(
  round: Round,
  errors: string[],
): void {
  if (
    round.closingVariant === 'continental' &&
    round.number !== CONTINENTAL_TOTAL_ROUNDS
  ) {
    errors.push(
      'Solo se puede conseguir un Continental en la séptima ronda.',
    );
  }

  if (round.closingVariant === 'full_straight') {
    errors.push(
      'El cierre con escalera completa no es válido en Continental.',
    );
  }
}

function validateClosingScore(
  round: Round,
  errors: string[],
): void {
  const rule = getContinentalRoundRule(round.number);

  if (!rule) {
    return;
  }

  const closingPlayerScores = round.scores.filter(
    (score) =>
      score.playerId === round.closedByPlayerId,
  );

  if (closingPlayerScores.length === 0) {
    errors.push(
      'No se ha registrado la puntuación del jugador que cerró.',
    );

    return;
  }

  if (closingPlayerScores.length > 1) {
    errors.push(
      'El jugador que cerró tiene más de una puntuación registrada.',
    );

    return;
  }

  const [closingPlayerScore] = closingPlayerScores;

  if (closingPlayerScore.points !== rule.closingScore) {
    errors.push(
      `El jugador que cierra la ronda ${round.number} debe recibir ${rule.closingScore} puntos.`,
    );
  }
}