export const GAME_TYPES = {
  CONTINENTAL: 'continental',
  MAUMAU: 'maumau',
} as const;

export type GameType =
  (typeof GAME_TYPES)[keyof typeof GAME_TYPES];

export type ContinentalSettings = {
  type: typeof GAME_TYPES.CONTINENTAL;
};

export type MauMauSettings = {
  type: typeof GAME_TYPES.MAUMAU;
  scoreLimit: number;
};

export type GameSettings =
  | ContinentalSettings
  | MauMauSettings;