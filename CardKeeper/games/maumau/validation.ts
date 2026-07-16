import type { RoundValidationResult } from '@/games/core/GameEngine';
import type { Game, Round } from '@/models';

import {
    getMauMauClosingScore,
    getNextMauMauRoundNumber,
    isValidMauMauScoreLimit,
} from './rules';
import {
    getActiveMauMauPlayerIds
} from './scoring';

export function validateMauMauRound(
  round: Round,
  game: Game,
): RoundValidationResult {
  const errors: string[] = [];

  validateGame(game, errors);
  validateRoundNumber(round, game, errors);
  validateClosingVariant(round, errors);
  validateClosingPlayer(round, game, errors);
  validateScores(round, game, errors);
  validateClosingScore(round, errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateGame(
  game: Game,
  errors: string[],
): void {
  if (game.gameType !== 'maumau') {
    errors.push(
      'La partida no pertenece al juego MauMau.',
    );

    return;
  }

  if (game.settings.type !== 'maumau') {
    errors.push(
      'La configuración de la partida no pertenece a MauMau.',
    );

    return;
  }

  if (
    !isValidMauMauScoreLimit(
      game.settings.scoreLimit,
    )
  ) {
    errors.push(
      'El límite de puntos configurado no es válido.',
    );
  }

  if (game.status === 'finished') {
    errors.push(
      'No se pueden añadir rondas a una partida finalizada.',
    );
  }
}

function validateRoundNumber(
  round: Round,
  game: Game,
  errors: string[],
): void {
  if (
    !Number.isInteger(round.number) ||
    round.number < 1
  ) {
    errors.push(
      'El número de ronda debe ser un entero mayor que cero.',
    );

    return;
  }

  const expectedRoundNumber =
    getNextMauMauRoundNumber(
      game.rounds.length,
    );

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

function validateClosingVariant(
  round: Round,
  errors: string[],
): void {
  if (
    round.closingVariant !== 'normal' &&
    round.closingVariant !==
      'full_straight'
  ) {
    errors.push(
      'El cierre de MauMau debe ser normal o con escalera completa.',
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

  const closingPlayerExists =
    game.players.some(
      (player) =>
        player.id === round.closedByPlayerId,
    );

  if (!closingPlayerExists) {
    errors.push(
      'El jugador que cerró no pertenece a la partida.',
    );

    return;
  }

  const activePlayerIds =
    getActiveMauMauPlayerIds(game);

  if (
    !activePlayerIds.includes(
      round.closedByPlayerId,
    )
  ) {
    errors.push(
      'Un jugador eliminado no puede cerrar una ronda.',
    );
  }
}

function validateScores(
  round: Round,
  game: Game,
  errors: string[],
): void {
  const activePlayerIds =
    getActiveMauMauPlayerIds(game);

  const scorePlayerIds = round.scores.map(
    (score) => score.playerId,
  );

  const uniqueScorePlayerIds = new Set(
    scorePlayerIds,
  );

  if (
    uniqueScorePlayerIds.size !==
    scorePlayerIds.length
  ) {
    errors.push(
      'No puede haber más de una puntuación para un mismo jugador.',
    );
  }

  if (
    round.scores.length !==
    activePlayerIds.length
  ) {
    errors.push(
      'Debe existir una puntuación para cada jugador activo.',
    );
  }

  const unknownPlayerIds =
    scorePlayerIds.filter(
      (playerId) =>
        !game.players.some(
          (player) =>
            player.id === playerId,
        ),
    );

  if (unknownPlayerIds.length > 0) {
    errors.push(
      'Hay puntuaciones asociadas a jugadores que no pertenecen a la partida.',
    );
  }

  const eliminatedPlayerIds =
    scorePlayerIds.filter(
      (playerId) =>
        !activePlayerIds.includes(playerId),
    );

  if (eliminatedPlayerIds.length > 0) {
    errors.push(
      'Los jugadores eliminados no deben recibir puntuación en rondas posteriores.',
    );
  }

  const activePlayersWithoutScore =
    activePlayerIds.filter(
      (playerId) =>
        !uniqueScorePlayerIds.has(playerId),
    );

  if (
    activePlayersWithoutScore.length > 0
  ) {
    errors.push(
      'Todos los jugadores activos deben tener una puntuación registrada.',
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

  const invalidNegativeScores =
    round.scores.filter(
      (score) =>
        score.playerId !==
          round.closedByPlayerId &&
        score.points < 0,
    );

  if (invalidNegativeScores.length > 0) {
    errors.push(
      'Solo el jugador que cierra puede tener una puntuación negativa.',
    );
  }
}

function validateClosingScore(
  round: Round,
  errors: string[],
): void {
  if (
    round.closingVariant !== 'normal' &&
    round.closingVariant !==
      'full_straight'
  ) {
    return;
  }

  const closingPlayerScores =
    round.scores.filter(
      (score) =>
        score.playerId ===
        round.closedByPlayerId,
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

  const expectedClosingScore =
    getMauMauClosingScore(
      round.closingVariant,
    );

  if (
    closingPlayerScores[0].points !==
    expectedClosingScore
  ) {
    errors.push(
      `El jugador que cierra debe recibir ${expectedClosingScore} puntos.`,
    );
  }
}