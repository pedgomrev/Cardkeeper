import type { Game, Player, Round } from '@/models';

import {
    calculateContinentalPlayerTotal,
    calculateContinentalRanking,
    getContinentalClosingScore,
    getContinentalWinnerPlayerIds,
} from '@/games/continental/scoring';

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

function createRound(
  number: number,
  scores: Array<{
    playerId: string;
    points: number;
  }>,
  closedByPlayerId: string,
  closingVariant: Round['closingVariant'] = 'normal',
): Round {
  return {
    id: `round-${number}`,
    number,
    scores,
    closedByPlayerId,
    closingVariant,
    createdAt: new Date(
      2026,
      0,
      number,
    ).toISOString(),
  };
}

function createGame(
  rounds: Round[] = [],
): Game {
  return {
    id: 'game-1',
    gameType: 'continental',
    status:
      rounds.length === 7
        ? 'finished'
        : 'in_progress',
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

describe('Continental scoring', () => {
  describe('calculateContinentalPlayerTotal', () => {
    it('suma correctamente los puntos de todas las rondas', () => {
      const rounds: Round[] = [
        createRound(
          1,
          [
            {
              playerId: 'player-1',
              points: -10,
            },
            {
              playerId: 'player-2',
              points: 25,
            },
            {
              playerId: 'player-3',
              points: 40,
            },
          ],
          'player-1',
        ),
        createRound(
          2,
          [
            {
              playerId: 'player-1',
              points: 15,
            },
            {
              playerId: 'player-2',
              points: -20,
            },
            {
              playerId: 'player-3',
              points: 30,
            },
          ],
          'player-2',
        ),
        createRound(
          3,
          [
            {
              playerId: 'player-1',
              points: 20,
            },
            {
              playerId: 'player-2',
              points: 10,
            },
            {
              playerId: 'player-3',
              points: -30,
            },
          ],
          'player-3',
        ),
      ];

      const total =
        calculateContinentalPlayerTotal(
          'player-1',
          rounds,
        );

      expect(total).toBe(25);
    });

    it('devuelve cero si el jugador no tiene puntuaciones', () => {
      const rounds: Round[] = [
        createRound(
          1,
          [
            {
              playerId: 'player-1',
              points: -10,
            },
            {
              playerId: 'player-2',
              points: 20,
            },
          ],
          'player-1',
        ),
      ];

      const total =
        calculateContinentalPlayerTotal(
          'unknown-player',
          rounds,
        );

      expect(total).toBe(0);
    });

    it('permite puntuaciones negativas del jugador que cierra', () => {
      const rounds: Round[] = [
        createRound(
          1,
          [
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
              points: 35,
            },
          ],
          'player-1',
        ),
        createRound(
          2,
          [
            {
              playerId: 'player-1',
              points: -20,
            },
            {
              playerId: 'player-2',
              points: 10,
            },
            {
              playerId: 'player-3',
              points: 25,
            },
          ],
          'player-1',
        ),
      ];

      const total =
        calculateContinentalPlayerTotal(
          'player-1',
          rounds,
        );

      expect(total).toBe(-30);
    });
  });

  describe('getContinentalClosingScore', () => {
    it.each([
      [1, -10],
      [2, -20],
      [3, -30],
      [4, -40],
      [5, -50],
      [6, -60],
      [7, -70],
    ])(
      'devuelve %i puntos para la ronda %i',
      (roundNumber, expectedScore) => {
        expect(
          getContinentalClosingScore(
            roundNumber,
          ),
        ).toBe(expectedScore);
      },
    );

    it('lanza un error para una ronda inexistente', () => {
      expect(() =>
        getContinentalClosingScore(8),
      ).toThrow(
        'Ronda de Continental no válida: 8',
      );
    });
  });

  describe('calculateContinentalRanking', () => {
    it('ordena de menor a mayor puntuación', () => {
      const game = createGame([
        createRound(
          1,
          [
            {
              playerId: 'player-1',
              points: 25,
            },
            {
              playerId: 'player-2',
              points: -10,
            },
            {
              playerId: 'player-3',
              points: 40,
            },
          ],
          'player-2',
        ),
      ]);

      const ranking =
        calculateContinentalRanking(game);

      expect(ranking).toEqual([
        {
          playerId: 'player-2',
          totalPoints: -10,
          position: 1,
        },
        {
          playerId: 'player-1',
          totalPoints: 25,
          position: 2,
        },
        {
          playerId: 'player-3',
          totalPoints: 40,
          position: 3,
        },
      ]);
    });

    it('asigna la misma posición a jugadores empatados', () => {
      const game = createGame([
        createRound(
          1,
          [
            {
              playerId: 'player-1',
              points: 10,
            },
            {
              playerId: 'player-2',
              points: 10,
            },
            {
              playerId: 'player-3',
              points: -10,
            },
          ],
          'player-3',
        ),
      ]);

      const ranking =
        calculateContinentalRanking(game);

      expect(ranking[0]).toEqual({
        playerId: 'player-3',
        totalPoints: -10,
        position: 1,
      });

      expect(ranking[1].totalPoints).toBe(10);
      expect(ranking[1].position).toBe(2);

      expect(ranking[2].totalPoints).toBe(10);
      expect(ranking[2].position).toBe(2);
    });

    it('mantiene a todos los jugadores empatados al inicio', () => {
      const game = createGame();

      const ranking =
        calculateContinentalRanking(game);

      expect(ranking).toHaveLength(3);

      ranking.forEach((entry) => {
        expect(entry.totalPoints).toBe(0);
        expect(entry.position).toBe(1);
      });
    });
  });

  describe('getContinentalWinnerPlayerIds', () => {
    it('no devuelve ganador antes de completar la séptima ronda', () => {
      const game = createGame([
        createRound(
          1,
          [
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
              points: 30,
            },
          ],
          'player-1',
        ),
      ]);

      expect(
        getContinentalWinnerPlayerIds(game),
      ).toEqual([]);
    });

    it('devuelve al jugador con menos puntos al terminar la séptima ronda', () => {
      const rounds: Round[] = [
        createRound(
          1,
          [
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
              points: 30,
            },
          ],
          'player-1',
        ),
        createRound(
          2,
          [
            {
              playerId: 'player-1',
              points: 15,
            },
            {
              playerId: 'player-2',
              points: -20,
            },
            {
              playerId: 'player-3',
              points: 25,
            },
          ],
          'player-2',
        ),
        createRound(
          3,
          [
            {
              playerId: 'player-1',
              points: 10,
            },
            {
              playerId: 'player-2',
              points: 20,
            },
            {
              playerId: 'player-3',
              points: -30,
            },
          ],
          'player-3',
        ),
        createRound(
          4,
          [
            {
              playerId: 'player-1',
              points: -40,
            },
            {
              playerId: 'player-2',
              points: 25,
            },
            {
              playerId: 'player-3',
              points: 20,
            },
          ],
          'player-1',
        ),
        createRound(
          5,
          [
            {
              playerId: 'player-1',
              points: 15,
            },
            {
              playerId: 'player-2',
              points: -50,
            },
            {
              playerId: 'player-3',
              points: 30,
            },
          ],
          'player-2',
        ),
        createRound(
          6,
          [
            {
              playerId: 'player-1',
              points: 20,
            },
            {
              playerId: 'player-2',
              points: 25,
            },
            {
              playerId: 'player-3',
              points: -60,
            },
          ],
          'player-3',
        ),
        createRound(
          7,
          [
            {
              playerId: 'player-1',
              points: -70,
            },
            {
              playerId: 'player-2',
              points: 35,
            },
            {
              playerId: 'player-3',
              points: 25,
            },
          ],
          'player-1',
        ),
      ];

      const game = createGame(rounds);

      expect(
        getContinentalWinnerPlayerIds(game),
      ).toEqual(['player-1']);
    });

    it('devuelve varios ganadores cuando hay empate final', () => {
      const rounds: Round[] = Array.from(
        { length: 7 },
        (_, index) => {
          const number = index + 1;

          return createRound(
            number,
            [
              {
                playerId: 'player-1',
                points:
                  number === 1 ? -10 : 10,
              },
              {
                playerId: 'player-2',
                points:
                  number === 2 ? -20 : 15,
              },
              {
                playerId: 'player-3',
                points:
                  -10 * number,
              },
            ],
            'player-3',
          );
        },
      );

      // Ajustamos manualmente el resultado para crear
      // un empate final entre Pedro y María.
      rounds.forEach((round) => {
        round.scores = [
          {
            playerId: 'player-1',
            points: 0,
          },
          {
            playerId: 'player-2',
            points: 0,
          },
          {
            playerId: 'player-3',
            points: round.number * 5,
          },
        ];
      });

      const game = createGame(rounds);

      expect(
        getContinentalWinnerPlayerIds(game),
      ).toEqual([
        'player-1',
        'player-2',
      ]);
    });

    it('da la victoria inmediata al jugador que consigue Continental', () => {
      const rounds: Round[] = Array.from(
        { length: 7 },
        (_, index) => {
          const number = index + 1;
          const closingPlayerId =
            number === 7
              ? 'player-2'
              : 'player-1';

          return createRound(
            number,
            [
              {
                playerId: 'player-1',
                points:
                  closingPlayerId === 'player-1'
                    ? -10 * number
                    : 0,
              },
              {
                playerId: 'player-2',
                points:
                  closingPlayerId === 'player-2'
                    ? -10 * number
                    : 100,
              },
              {
                playerId: 'player-3',
                points: 20,
              },
            ],
            closingPlayerId,
            number === 7
              ? 'continental'
              : 'normal',
          );
        },
      );

      const game = createGame(rounds);

      expect(
        getContinentalWinnerPlayerIds(game),
      ).toEqual(['player-2']);
    });
  });
});