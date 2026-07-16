import { useState } from 'react';
import { Alert } from 'react-native';

import { useGameContext } from '@/contexts/GameContext';
import {
  CONTINENTAL_TOTAL_ROUNDS,
  formatContinentalRoundLabel,
  getContinentalRoundRule,
} from '@/games/continental/rules';
import {
  calculateContinentalPlayerTotal,
  calculateContinentalRanking,
} from '@/games/continental/scoring';
import type { RankingEntry } from '@/games/core/GameEngine';
import type {
  ClosingVariant,
  Game,
  Round,
} from '@/models';
import { addRound } from '@/services/addRound';
import { gameService } from '@/services/gameService';
import { generateId } from '@/utils/generateId';

type ScoreFormState = Record<string, string>;

export type ContinentalRoundHistoryItem = {
  round: Round;
  roundLabel: string;
  accumulatedTotals: Record<string, number>;
};

type EmptyContinentalGameState = {
  activeGame: null;
  currentRoundNumber: number;
  currentRoundRule: undefined;
  currentRoundLabel: string;
  ranking: RankingEntry[];
  historyItems: ContinentalRoundHistoryItem[];
  closingPlayerId: string | null;
  closingVariant: ClosingVariant;
  scores: ScoreFormState;
  totalRounds: number;
  isFinished: false;
  isSavingRound: boolean;
  handleSelectClosingPlayer: (
    playerId: string,
  ) => void;
  handleClosingVariantChange: (
    variant: ClosingVariant,
  ) => void;
  handleScoreChange: (
    playerId: string,
    value: string,
  ) => void;
  handleSaveRound: () => Promise<void>;
};

type ActiveContinentalGameState = {
  activeGame: Game;
  currentRoundNumber: number;
  currentRoundRule: ReturnType<
    typeof getContinentalRoundRule
  >;
  currentRoundLabel: string;
  ranking: RankingEntry[];
  historyItems: ContinentalRoundHistoryItem[];
  closingPlayerId: string | null;
  closingVariant: ClosingVariant;
  scores: ScoreFormState;
  totalRounds: number;
  isFinished: boolean;
  isSavingRound: boolean;
  handleSelectClosingPlayer: (
    playerId: string,
  ) => void;
  handleClosingVariantChange: (
    variant: ClosingVariant,
  ) => void;
  handleScoreChange: (
    playerId: string,
    value: string,
  ) => void;
  handleSaveRound: () => Promise<void>;
};

export type ContinentalGameState =
  | EmptyContinentalGameState
  | ActiveContinentalGameState;

export function useContinentalGame(): ContinentalGameState {
  const {
    activeGame,
    updateActiveGame,
  } = useGameContext();

  const [closingPlayerId, setClosingPlayerId] =
    useState<string | null>(null);

  const [closingVariant, setClosingVariant] =
    useState<ClosingVariant>('normal');

  const [scores, setScores] =
    useState<ScoreFormState>({});

  const [isSavingRound, setIsSavingRound] =
    useState(false);

  function handleSelectClosingPlayer(
    playerId: string,
  ): void {
    setClosingPlayerId(playerId);
  }

  function handleClosingVariantChange(
    variant: ClosingVariant,
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

  if (!activeGame) {
    return {
      activeGame: null,
      currentRoundNumber: 1,
      currentRoundRule: undefined,
      currentRoundLabel: '',
      ranking: [],
      historyItems: [],
      closingPlayerId,
      closingVariant,
      scores,
      totalRounds: CONTINENTAL_TOTAL_ROUNDS,
      isFinished: false,
      isSavingRound,
      handleSelectClosingPlayer,
      handleClosingVariantChange,
      handleScoreChange,
      handleSaveRound: async () => {
        Alert.alert(
          'No hay partida activa',
          'Crea o carga una partida antes de registrar rondas.',
        );
      },
    };
  }

  const game: Game = activeGame;

  const currentRoundNumber =
    game.rounds.length + 1;

  const currentRoundRule =
    getContinentalRoundRule(currentRoundNumber);

  const currentRoundLabel =
    formatContinentalRoundLabel(
      currentRoundNumber,
    );

  const ranking =
    calculateContinentalRanking(game);

  const historyItems =
    createContinentalHistoryItems(game);

  function resetRoundForm(): void {
    setClosingPlayerId(null);
    setClosingVariant('normal');
    setScores({});
  }

  async function handleSaveRound(): Promise<void> {
    if (isSavingRound) {
      return;
    }

    if (!currentRoundRule) {
      Alert.alert(
        'Partida terminada',
        'Ya se han registrado las siete rondas.',
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
      closingVariant === 'continental' &&
      currentRoundNumber !==
        CONTINENTAL_TOTAL_ROUNDS
    ) {
      Alert.alert(
        'Cierre no válido',
        'Solo se puede conseguir un Continental en la séptima ronda.',
      );

      return;
    }

    const hasEmptyScores = game.players.some(
      (player) =>
        player.id !== closingPlayerId &&
        !scores[player.id]?.trim(),
    );

    if (hasEmptyScores) {
      Alert.alert(
        'Faltan puntuaciones',
        'Introduce la puntuación de todos los jugadores.',
      );

      return;
    }

    const round: Round = {
      id: generateId('round'),
      number: currentRoundNumber,
      closedByPlayerId: closingPlayerId,
      closingVariant,
      createdAt: new Date().toISOString(),
      scores: game.players.map((player) => ({
        playerId: player.id,
        points:
          player.id === closingPlayerId
            ? currentRoundRule.closingScore
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
    currentRoundNumber,
    currentRoundRule,
    currentRoundLabel,
    ranking,
    historyItems,
    closingPlayerId,
    closingVariant,
    scores,
    totalRounds: CONTINENTAL_TOTAL_ROUNDS,
    isFinished: game.status === 'finished',
    isSavingRound,
    handleSelectClosingPlayer,
    handleClosingVariantChange,
    handleScoreChange,
    handleSaveRound,
  };
}

function createContinentalHistoryItems(
  game: Game,
): ContinentalRoundHistoryItem[] {
  return game.rounds.map((round, index) => ({
    round,
    roundLabel: formatContinentalRoundLabel(
      round.number,
    ),
    accumulatedTotals: Object.fromEntries(
      game.players.map((player) => [
        player.id,
        calculateContinentalPlayerTotal(
          player.id,
          game.rounds.slice(0, index + 1),
        ),
      ]),
    ),
  }));
}

function showFinishedGameAlert(
  game: Game,
): void {
  const continentalRound = game.rounds.find(
    (round) =>
      round.closingVariant === 'continental',
  );

  if (continentalRound) {
    const winner = game.players.find(
      (player) =>
        player.id ===
        continentalRound.closedByPlayerId,
    );

    Alert.alert(
      '¡Continental!',
      winner
        ? `${winner.name} gana la partida automáticamente.`
        : 'La partida termina con un Continental.',
    );

    return;
  }

  const winnerNames = game.winnerPlayerIds
    ?.map((winnerId) =>
      game.players.find(
        (player) => player.id === winnerId,
      )?.name,
    )
    .filter(
      (name): name is string =>
        Boolean(name),
    );

  Alert.alert(
    'Partida terminada',
    winnerNames?.length
      ? formatWinnerMessage(winnerNames)
      : 'Se han completado las siete rondas.',
  );
}

function formatWinnerMessage(
  winnerNames: string[],
): string {
  if (winnerNames.length === 1) {
    return `Ganador: ${winnerNames[0]}`;
  }

  return `Empate entre: ${winnerNames.join(', ')}`;
}