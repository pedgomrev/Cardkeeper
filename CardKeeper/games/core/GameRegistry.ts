import type { GameDefinition } from './GameDefinition';
import type { GameEngine } from './GameEngine';

import { continentalDefinition } from '../continental/definition';
import { continentalEngine } from '../continental/engine';
import { maumauDefinition } from '../maumau/definition';
import { maumauEngine } from '../maumau/engine';
export type RegisteredGame = {
  definition: GameDefinition;
  engine: GameEngine;
};

export const gameRegistry = {
  continental: {
    definition: continentalDefinition,
    engine: continentalEngine,
  },
  maumau: {
    definition: maumauDefinition,
    engine: maumauEngine,
  },
} as const;