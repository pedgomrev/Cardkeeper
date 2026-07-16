import type { Game, Player, Round } from '@/models';

import { validateContinentalRound } from '@/games/continental/validation';

const players: Player[] = [
  {
    id: 'player-1',
    name: 'Pedro',
    position: 1,
  },
  {
    id: 'player-2',
    name: 'María',
    position: 2,
  },
  {
    id: 'player-3',
    name: 'Juan',
    position: 3,
  },
];

function createGame(
  rounds: Round[] = [],
  status: Game['status'] = 'in_progress',
): Game {
  return {
    id: 'game-1',
    gameType: 'continental',
    status,
    players,
    rounds,
    settings: {
      type: 'continental',
    },
    createdAt: new Date(
      2026,
      0,
      1,
    ).toISOString(),
    updatedAt: new Date(
      2026,
      0,
      1,
    ).toISOString(),
  };
}

function createRound(
  number = 1,
  overrides: Partial<Round> = {},
): Round {
  return {
    id: `round-${number}`,
    number,
    scores: [
      {
        playerId: 'player-1',
        points: -10 * number,
      },
      {
        playerId: 'player-2',
        points: 20,
      },
      {
        playerId: 'player-3',
        points: 35,
      },
    ],
    closedByPlayerId: 'player-1',
    closingVariant: 'normal',
    createdAt: new Date(
      2026,
      0,
      number,
    ).toISOString(),
    ...overrides,
  };
}

describe('Continental round validation', () => {
  it('acepta una primera ronda válida', () => {
    const game = createGame();
    const round = createRound(1);

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('permite que dos jugadores tengan la misma puntuación', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: 20,
        },
        {
          playerId: 'player-3',
          points: 20,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rechaza dos puntuaciones para el mismo jugador', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-1',
          points: 20,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'No puede haber más de una puntuación registrada para un mismo jugador.',
    );
  });

  it('rechaza una ronda fuera de orden', () => {
    const game = createGame();

    const round = createRound(2);

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'La siguiente ronda debe ser la número 1.',
    );
  });

  it('acepta la segunda ronda cuando ya existe la primera', () => {
    const firstRound = createRound(1);
    const game = createGame([firstRound]);

    const secondRound = createRound(2);

    const result =
      validateContinentalRound(
        secondRound,
        game,
      );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rechaza una ronda ya registrada', () => {
    const firstRound = createRound(1);
    const game = createGame([firstRound]);

    const duplicatedRound = createRound(1);

    const result =
      validateContinentalRound(
        duplicatedRound,
        game,
      );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'La ronda 1 ya está registrada.',
    );
  });

  it('rechaza una ronda inferior a 1', () => {
    const game = createGame();
    const round = createRound(0);

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'La ronda debe estar comprendida entre 1 y 7.',
    );
  });

  it('rechaza una ronda superior a 7', () => {
    const game = createGame();
    const round = createRound(8);

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'La ronda debe estar comprendida entre 1 y 7.',
    );
  });

  it('rechaza una ronda si la partida está finalizada', () => {
    const game = createGame([], 'finished');
    const round = createRound(1);

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'No se pueden añadir rondas a una partida finalizada.',
    );
  });

  it('rechaza añadir una octava ronda', () => {
    const previousRounds = Array.from(
      { length: 7 },
      (_, index) => createRound(index + 1),
    );

    const game = createGame(previousRounds);
    const round = createRound(8);

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'La partida ya contiene las siete rondas del Continental.',
    );
  });

  it('rechaza un jugador cerrador que no pertenece a la partida', () => {
    const game = createGame();

    const round = createRound(1, {
      closedByPlayerId: 'unknown-player',
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'El jugador que cerró no pertenece a la partida.',
    );
  });

  it('rechaza una ronda sin jugador cerrador', () => {
    const game = createGame();

    const round = createRound(1, {
      closedByPlayerId: '',
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Debe indicarse qué jugador cerró la ronda.',
    );
  });

  it('rechaza puntuaciones de jugadores desconocidos', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: 20,
        },
        {
          playerId: 'unknown-player',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Hay puntuaciones asociadas a jugadores que no pertenecen a la partida.',
    );
  });

  it('rechaza una ronda sin puntuación para todos los jugadores', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: 20,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Debe existir una puntuación para cada jugador.',
    );
    expect(result.errors).toContain(
      'Todos los jugadores deben tener una puntuación registrada.',
    );
  });

  it('rechaza una puntuación decimal', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: 22.5,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Todas las puntuaciones deben ser números enteros válidos.',
    );
  });

  it('rechaza puntuaciones negativas para quien no cerró', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: -5,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Solo el jugador que cierra puede tener una puntuación negativa.',
    );
  });

  it('rechaza puntuaciones que no sean múltiplos de cinco', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: 23,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Las puntuaciones de los jugadores que no cerraron deben ser múltiplos de cinco.',
    );
  });

  it('permite que un jugador que no cerró tenga cero puntos', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -10,
        },
        {
          playerId: 'player-2',
          points: 0,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rechaza una puntuación incorrecta para el jugador que cerró', () => {
    const game = createGame();

    const round = createRound(1, {
      scores: [
        {
          playerId: 'player-1',
          points: -20,
        },
        {
          playerId: 'player-2',
          points: 20,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'El jugador que cierra la ronda 1 debe recibir -10 puntos.',
    );
  });

  it('acepta la puntuación de cierre correspondiente a cada ronda', () => {
    for (
      let roundNumber = 1;
      roundNumber <= 7;
      roundNumber += 1
    ) {
      const previousRounds = Array.from(
        {
          length: roundNumber - 1,
        },
        (_, index) => createRound(index + 1),
      );

      const game = createGame(previousRounds);
      const round = createRound(roundNumber);

      const result =
        validateContinentalRound(round, game);

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    }
  });

  it('rechaza Continental antes de la séptima ronda', () => {
    const game = createGame();

    const round = createRound(1, {
      closingVariant: 'continental',
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Solo se puede conseguir un Continental en la séptima ronda.',
    );
  });

  it('acepta Continental en la séptima ronda', () => {
    const previousRounds = Array.from(
      { length: 6 },
      (_, index) => createRound(index + 1),
    );

    const game = createGame(previousRounds);

    const round = createRound(7, {
      closingVariant: 'continental',
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rechaza full_straight en Continental', () => {
    const game = createGame();

    const round = createRound(1, {
      closingVariant: 'full_straight',
    });

    const result =
      validateContinentalRound(round, game);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'El cierre con escalera completa no es válido en Continental.',
    );
  });

  it('rechaza nuevas rondas si ya se consiguió un Continental', () => {
    const continentalRound = createRound(7, {
      closingVariant: 'continental',
      scores: [
        {
          playerId: 'player-1',
          points: -70,
        },
        {
          playerId: 'player-2',
          points: 20,
        },
        {
          playerId: 'player-3',
          points: 35,
        },
      ],
    });

    const game = createGame([
      createRound(1),
      createRound(2),
      createRound(3),
      createRound(4),
      createRound(5),
      createRound(6),
      continentalRound,
    ]);

    const newRound = createRound(7);

    const result =
      validateContinentalRound(
        newRound,
        game,
      );

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'La partida ya finalizó porque un jugador consiguió un Continental.',
    );
  });
});