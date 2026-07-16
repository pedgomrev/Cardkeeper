import {
    GAME_TYPES,
    type GameType,
} from '@/games/core/types';
import type {
    AppStatistics,
    Game,
    GameTypeStatistics,
    PlayerGameStatistics,
    PlayerStatistics,
} from '@/models';
import { gameService } from '@/services/gameService';

type MutablePlayerStatistics = {
  playerKey: string;
  playerName: string;

  gamesPlayed: number;
  wins: number;

  totalFinalPoints: number;

  continentalWins: number;
  maumauWins: number;
  continentalsAchieved: number;

  byGame: Record<GameType, MutablePlayerGameStatistics>;
};

type MutablePlayerGameStatistics = {
  gamesPlayed: number;
  wins: number;
  totalFinalPoints: number;
};

export const statisticsService = {
  async getStatistics(): Promise<AppStatistics> {
    const games = await gameService.getAllGames();

    return calculateAppStatistics(games);
  },
};

export function calculateAppStatistics(
  games: Game[],
): AppStatistics {
  const completedGames = games.filter(
    (game) => game.status === 'finished',
  );

  const playerStatisticsMap =
    new Map<string, MutablePlayerStatistics>();

  for (const game of completedGames) {
    processFinishedGame(
      game,
      playerStatisticsMap,
    );
  }

  const players = Array.from(
    playerStatisticsMap.values(),
  )
    .map(toPlayerStatistics)
    .sort(comparePlayerStatistics);

  return {
    totalGames: games.length,
    completedGames: completedGames.length,
    gamesInProgress:
      games.length - completedGames.length,
    players,
    gamesByType: calculateGameTypeStatistics(
      completedGames,
    ),
  };
}

function processFinishedGame(
  game: Game,
  statisticsMap: Map<
    string,
    MutablePlayerStatistics
  >,
): void {
  const winnerIds = new Set(
    game.winnerPlayerIds ?? [],
  );

  const continentalWinnerId =
    getContinentalWinnerId(game);

  for (const player of game.players) {
    const playerKey = normalizePlayerName(
      player.name,
    );

    const statistics =
      statisticsMap.get(playerKey) ??
      createEmptyPlayerStatistics(
        playerKey,
        player.name.trim(),
      );

    const finalPoints = calculateFinalPoints(
      player.id,
      game,
    );

    const isWinner = winnerIds.has(player.id);

    statistics.gamesPlayed += 1;
    statistics.totalFinalPoints += finalPoints;

    const gameStatistics =
      statistics.byGame[game.gameType];

    gameStatistics.gamesPlayed += 1;
    gameStatistics.totalFinalPoints +=
      finalPoints;

    if (isWinner) {
      statistics.wins += 1;
      gameStatistics.wins += 1;

      if (
        game.gameType ===
        GAME_TYPES.CONTINENTAL
      ) {
        statistics.continentalWins += 1;
      }

      if (
        game.gameType === GAME_TYPES.MAUMAU
      ) {
        statistics.maumauWins += 1;
      }
    }

    if (
      continentalWinnerId === player.id
    ) {
      statistics.continentalsAchieved += 1;
    }

    statisticsMap.set(
      playerKey,
      statistics,
    );
  }
}

function createEmptyPlayerStatistics(
  playerKey: string,
  playerName: string,
): MutablePlayerStatistics {
  return {
    playerKey,
    playerName,

    gamesPlayed: 0,
    wins: 0,

    totalFinalPoints: 0,

    continentalWins: 0,
    maumauWins: 0,
    continentalsAchieved: 0,

    byGame: {
      [GAME_TYPES.CONTINENTAL]:
        createEmptyPlayerGameStatistics(),

      [GAME_TYPES.MAUMAU]:
        createEmptyPlayerGameStatistics(),
    },
  };
}

function createEmptyPlayerGameStatistics():
  MutablePlayerGameStatistics {
  return {
    gamesPlayed: 0,
    wins: 0,
    totalFinalPoints: 0,
  };
}

function toPlayerStatistics(
  statistics: MutablePlayerStatistics,
): PlayerStatistics {
  return {
    playerKey: statistics.playerKey,
    playerName: statistics.playerName,

    gamesPlayed: statistics.gamesPlayed,
    wins: statistics.wins,

    winRate: calculatePercentage(
      statistics.wins,
      statistics.gamesPlayed,
    ),

    totalFinalPoints:
      statistics.totalFinalPoints,

    averageFinalPoints: calculateAverage(
      statistics.totalFinalPoints,
      statistics.gamesPlayed,
    ),

    continentalWins:
      statistics.continentalWins,

    maumauWins:
      statistics.maumauWins,

    continentalsAchieved:
      statistics.continentalsAchieved,

    byGame: {
      [GAME_TYPES.CONTINENTAL]:
        toPlayerGameStatistics(
          statistics.byGame[
            GAME_TYPES.CONTINENTAL
          ],
        ),

      [GAME_TYPES.MAUMAU]:
        toPlayerGameStatistics(
          statistics.byGame[
            GAME_TYPES.MAUMAU
          ],
        ),
    },
  };
}

function toPlayerGameStatistics(
  statistics: MutablePlayerGameStatistics,
): PlayerGameStatistics {
  return {
    gamesPlayed: statistics.gamesPlayed,
    wins: statistics.wins,
    totalFinalPoints:
      statistics.totalFinalPoints,
    averageFinalPoints: calculateAverage(
      statistics.totalFinalPoints,
      statistics.gamesPlayed,
    ),
  };
}

function calculateGameTypeStatistics(
  games: Game[],
): GameTypeStatistics[] {
  return [
    GAME_TYPES.CONTINENTAL,
    GAME_TYPES.MAUMAU,
  ].map((gameType) => {
    const gamesOfType = games.filter(
      (game) => game.gameType === gameType,
    );

    const totalRounds = gamesOfType.reduce(
      (total, game) =>
        total + game.rounds.length,
      0,
    );

    return {
      gameType,
      gamesPlayed: gamesOfType.length,
      averageRounds: calculateAverage(
        totalRounds,
        gamesOfType.length,
      ),
    };
  });
}

function calculateFinalPoints(
  playerId: string,
  game: Game,
): number {
  return game.rounds.reduce(
    (total, round) => {
      const score = round.scores.find(
        (roundScore) =>
          roundScore.playerId === playerId,
      );

      return total + (score?.points ?? 0);
    },
    0,
  );
}

function getContinentalWinnerId(
  game: Game,
): string | undefined {
  if (
    game.gameType !==
    GAME_TYPES.CONTINENTAL
  ) {
    return undefined;
  }

  return game.rounds.find(
    (round) =>
      round.closingVariant ===
      'continental',
  )?.closedByPlayerId;
}

function normalizePlayerName(
  playerName: string,
): string {
  return playerName
    .trim()
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function calculateAverage(
  total: number,
  count: number,
): number {
  if (count === 0) {
    return 0;
  }

  return roundToTwoDecimals(
    total / count,
  );
}

function calculatePercentage(
  value: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }

  return roundToTwoDecimals(
    (value / total) * 100,
  );
}

function roundToTwoDecimals(
  value: number,
): number {
  return Math.round(value * 100) / 100;
}

function comparePlayerStatistics(
  first: PlayerStatistics,
  second: PlayerStatistics,
): number {
  if (second.wins !== first.wins) {
    return second.wins - first.wins;
  }

  if (
    second.winRate !== first.winRate
  ) {
    return second.winRate - first.winRate;
  }

  return first.playerName.localeCompare(
    second.playerName,
    'es-ES',
  );
}