import { useState } from 'react';
import { Alert } from 'react-native';

import { useGameContext } from '@/contexts/GameContext';
import type { RankingEntry } from '@/games/core/GameEngine';
import {
    getMauMauClosingScore,
    getMauMauRoundLabel,
    getNextMauMauRoundNumber,
    type MauMauClosingVariant,
} from '@/games/maumau/rules';
import {
    calculateMauMauPlayerTotal,
    calculateMauMauRanking,
    getActiveMauMauPlayerIds,
} from '@/games/maumau/scoring';
import type {
    Game,
    Player,
    Round,
} from '@/models';
import { addRound } from '@/services/addRound';
import { gameService } from '@/services/gameService';
import { generateId } from '@/utils/generateId';

type ScoreFormState = Record<string, string>;

export type MauMauRoundHistoryItem = {
  round: Round;
  roundLabel: string;
  accumulatedTotals: Record<string, number>;
};

type EmptyMauMauGameState = {
  activeGame: null;
  activePlayers: Player[];
  currentRoundNumber: number;
  currentRoundLabel: string;
  ranking: RankingEntry[];
  historyItems: MauMauRoundHistoryItem[];
  closingPlayerId: string | null;
  closingVariant: MauMauClosingVariant;
  closingScore: number;
  scoreLimit: number;
  scores: ScoreFormState;
  isFinished: false;
  isSavingRound: boolean;
  handleSelectClosingPlayer: (
    playerId: string,
  ) => void;
  handleClosingVariantChange: (
    variant: MauMauClosingVariant,
  ) => void;
  handleScoreChange: (
    playerId: string,
    value: string,
  ) => void;
  handleSaveRound: () => Promise<void>;
};

type ActiveMauMauGameState = {
  activeGame: Game;
  activePlayers: Player[];
  currentRoundNumber: number;
  currentRoundLabel: string;
  ranking: RankingEntry[];
  historyItems: MauMauRoundHistoryItem[];
  closingPlayerId: string | null;
  closingVariant: MauMauClosingVariant;
  closingScore: number;
  scoreLimit: number;
  scores: ScoreFormState;
  isFinished: boolean;
  isSavingRound: boolean;
  handleSelectClosingPlayer: (
    playerId: string,
  ) => void;
  handleClosingVariantChange: (
    variant: MauMauClosingVariant,
  ) => void;
  handleScoreChange: (
    playerId: string,
    value: string,
  ) => void;
  handleSaveRound: () => Promise<void>;
};

export type MauMauGameState =
  | EmptyMauMauGameState
  | ActiveMauMauGameState;

export function useMauMauGame(): MauMauGameState {
  const {
    activeGame,
    updateActiveGame,
  } = useGameContext();

  const [closingPlayerId, setClosingPlayerId] =
    useState<string | null>(null);

  const [closingVariant, setClosingVariant] =
    useState<MauMauClosingVariant>('normal');

  const [scores, setScores] =
    useState<ScoreFormState>({});

  const [isSavingRound, setIsSavingRound] =
    useState(false);

  const closingScore =
    getMauMauClosingScore(closingVariant);

  function handleSelectClosingPlayer(
    playerId: string,
  ): void {
    setClosingPlayerId(playerId);
  }

  function handleClosingVariantChange(
    variant: MauMauClosingVariant,
  ): void {
    setClosingVariant(variant);
  }

  function handleScoreChange(
    playerId: string,
    value: string,
  ): void {
    const sanitizedValue = value.replace(
      /[^0-9]/g,
      '',
    );

    setScores((currentScores) => ({
      ...currentScores,
      [playerId]: sanitizedValue,
    }));
  }

  if (
    !activeGame ||
    activeGame.gameType !== 'maumau' ||
    activeGame.settings.type !== 'maumau'
  ) {
    return {
      activeGame: null,
      activePlayers: [],
      currentRoundNumber: 1,
      currentRoundLabel: 'Ronda 1',
      ranking: [],
      historyItems: [],
      closingPlayerId,
      closingVariant,
      closingScore,
      scoreLimit: 100,
      scores,
      isFinished: false,
      isSavingRound,
      handleSelectClosingPlayer,
      handleClosingVariantChange,
      handleScoreChange,
      handleSaveRound: async () => {
        Alert.alert(
          'No hay partida activa',
          'Crea o carga una partida de MauMau.',
        );
      },
    };
  }

  const game: Game = activeGame;
  const scoreLimit = activeGame.settings.scoreLimit;

  const currentRoundNumber =
    getNextMauMauRoundNumber(
      game.rounds.length,
    );

  const currentRoundLabel =
    getMauMauRoundLabel(currentRoundNumber);

  const activePlayerIds =
    getActiveMauMauPlayerIds(game);

  const activePlayers = game.players.filter(
    (player) =>
      activePlayerIds.includes(player.id),
  );

  const ranking =
    calculateMauMauRanking(game);

  const historyItems =
    createMauMauHistoryItems(game);

  function resetRoundForm(): void {
    setClosingPlayerId(null);
    setClosingVariant('normal');
    setScores({});
  }

  async function handleSaveRound(): Promise<void> {
    if (isSavingRound) {
      return;
    }

    if (game.status === 'finished') {
      Alert.alert(
        'Partida terminada',
        'Esta partida ya ha finalizado.',
      );

      return;
    }

    if (!closingPlayerId) {
      Alert.alert(
        'Falta el jugador que cerró',
        'Selecciona quién cerró la ronda.',
      );

      return;
    }

    if (
      !activePlayerIds.includes(
        closingPlayerId,
      )
    ) {
      Alert.alert(
        'Jugador no válido',
        'Un jugador eliminado no puede cerrar la ronda.',
      );

      return;
    }

    const hasEmptyScores =
      activePlayers.some(
        (player) =>
          player.id !== closingPlayerId &&
          !scores[player.id]?.trim(),
      );

    if (hasEmptyScores) {
      Alert.alert(
        'Faltan puntuaciones',
        'Introduce la puntuación de todos los jugadores activos.',
      );

      return;
    }

    const round: Round = {
      id: generateId('round'),
      number: currentRoundNumber,
      closedByPlayerId: closingPlayerId,
      closingVariant,
      createdAt: new Date().toISOString(),
      scores: activePlayers.map((player) => ({
        playerId: player.id,
        points:
          player.id === closingPlayerId
            ? closingScore
            : Number(scores[player.id]),
      })),
    };

    setIsSavingRound(true);

    try {
      const updatedGame = addRound(
        game,
        round,
      );

      await gameService.saveGame(updatedGame);

      updateActiveGame(updatedGame);
      resetRoundForm();

      showEliminatedPlayersAlert(
        game,
        updatedGame,
      );

      if (updatedGame.status === 'finished') {
        showFinishedGameAlert(updatedGame);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se ha podido guardar la ronda.';

      Alert.alert(
        'Ronda no válida',
        message,
      );
    } finally {
      setIsSavingRound(false);
    }
  }

  return {
    activeGame: game,
    activePlayers,
    currentRoundNumber,
    currentRoundLabel,
    ranking,
    historyItems,
    closingPlayerId,
    closingVariant,
    closingScore,
    scoreLimit,
    scores,
    isFinished:
      game.status === 'finished',
    isSavingRound,
    handleSelectClosingPlayer,
    handleClosingVariantChange,
    handleScoreChange,
    handleSaveRound,
  };
}

function createMauMauHistoryItems(
  game: Game,
): MauMauRoundHistoryItem[] {
  return game.rounds.map((round, index) => ({
    round,
    roundLabel: getMauMauRoundLabel(
      round.number,
    ),
    accumulatedTotals: Object.fromEntries(
      game.players.map((player) => [
        player.id,
        calculateMauMauPlayerTotal(
          player.id,
          game.rounds.slice(0, index + 1),
        ),
      ]),
    ),
  }));
}

function showEliminatedPlayersAlert(
  previousGame: Game,
  updatedGame: Game,
): void {
  const previouslyActiveIds =
    getActiveMauMauPlayerIds(previousGame);

  const currentlyActiveIds =
    getActiveMauMauPlayerIds(updatedGame);

  const newlyEliminatedNames =
    previousGame.players
      .filter(
        (player) =>
          previouslyActiveIds.includes(
            player.id,
          ) &&
          !currentlyActiveIds.includes(
            player.id,
          ),
      )
      .map((player) => player.name);

  if (
    newlyEliminatedNames.length > 0 &&
    updatedGame.status !== 'finished'
  ) {
    Alert.alert(
      'Jugador eliminado',
      newlyEliminatedNames.length === 1
        ? `${newlyEliminatedNames[0]} ha alcanzado el límite de puntos.`
        : `${newlyEliminatedNames.join(
            ', ',
          )} han alcanzado el límite de puntos.`,
    );
  }
}

function showFinishedGameAlert(
  game: Game,
): void {
  const winnerNames =
    game.winnerPlayerIds
      ?.map((winnerId) =>
        game.players.find(
          (player) =>
            player.id === winnerId,
        )?.name,
      )
      .filter(
        (name): name is string =>
          Boolean(name),
      ) ?? [];

  Alert.alert(
    'Partida terminada',
    winnerNames.length === 1
      ? `Ganador: ${winnerNames[0]}`
      : `Empate entre: ${winnerNames.join(
          ', ',
        )}`,
  );
}