export type MauMauCombinationType =
  | 'trio'
  | 'quartet'
  | 'short_straight'
  | 'full_straight';

export type MauMauCombinationRule = {
  type: MauMauCombinationType;
  name: string;
  minimumCards: number;
  maximumCards?: number;
};

export const MAUMAU_COMBINATIONS: MauMauCombinationRule[] = [
  {
    type: 'trio',
    name: 'Trío',
    minimumCards: 3,
    maximumCards: 3,
  },
  {
    type: 'quartet',
    name: 'Cuarteto',
    minimumCards: 4,
    maximumCards: 4,
  },
  {
    type: 'short_straight',
    name: 'Escalera corta',
    minimumCards: 4,
    maximumCards: 6,
  },
  {
    type: 'full_straight',
    name: 'Escalera completa',
    minimumCards: 7,
    maximumCards: 7,
  },
];
export type MauMauClosingVariant =
  | 'normal'
  | 'full_straight';
  
export const DEFAULT_MAUMAU_SCORE_LIMIT = 100;

export const MAUMAU_MINIMUM_SCORE_LIMIT = 50;

export const MAUMAU_MAXIMUM_SCORE_LIMIT = 500;

export const MAUMAU_NORMAL_CLOSING_SCORE = -10;

export const MAUMAU_FULL_STRAIGHT_CLOSING_SCORE = -25;

export const MAUMAU_INITIAL_CARDS = 7;

/**
 * MauMau no tiene un número máximo de rondas.
 * La siguiente ronda siempre es la cantidad de rondas
 * ya registradas más una.
 */
export function getNextMauMauRoundNumber(
  completedRounds: number,
): number {
  if (
    !Number.isInteger(completedRounds) ||
    completedRounds < 0
  ) {
    throw new Error(
      'El número de rondas completadas debe ser un entero no negativo.',
    );
  }

  return completedRounds + 1;
}

export function getMauMauClosingScore(
  closingVariant: 'normal' | 'full_straight',
): number {
  switch (closingVariant) {
    case 'normal':
      return MAUMAU_NORMAL_CLOSING_SCORE;

    case 'full_straight':
      return MAUMAU_FULL_STRAIGHT_CLOSING_SCORE;
  }
}

export function isValidMauMauScoreLimit(
  scoreLimit: number,
): boolean {
  return (
    Number.isInteger(scoreLimit) &&
    scoreLimit >= MAUMAU_MINIMUM_SCORE_LIMIT &&
    scoreLimit <= MAUMAU_MAXIMUM_SCORE_LIMIT
  );
}

/**
 * Esta función asume que alcanzar exactamente el límite
 * también elimina al jugador.
 *
 * Ejemplo:
 * scoreLimit = 100
 * totalPoints = 100
 * => eliminado
 */
export function hasReachedMauMauScoreLimit(
  totalPoints: number,
  scoreLimit: number,
): boolean {
  return totalPoints >= scoreLimit;
}

export function getMauMauRoundLabel(
  roundNumber: number,
): string {
  return `Ronda ${roundNumber}`;
}