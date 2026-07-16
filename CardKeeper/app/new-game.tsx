import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GameSelectionCard } from '@/components/game/GameSelectionCard';
import { PlayerFormRow } from '@/components/player/PlayerFormRow';
import { GameRulesCard } from '@/components/rules/GameRulesCard';
import { AppCard } from '@/components/ui/AppCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
  colors,
  fontSize,
  radius,
  spacing,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import { continentalDefinition } from '@/games/continental/definition';
import {
  GAME_TYPES,
  type GameType,
} from '@/games/core/types';
import { maumauDefinition } from '@/games/maumau/definition';
import {
  DEFAULT_MAUMAU_SCORE_LIMIT,
  MAUMAU_MAXIMUM_SCORE_LIMIT,
  MAUMAU_MINIMUM_SCORE_LIMIT,
  isValidMauMauScoreLimit,
} from '@/games/maumau/rules';
import {
  createContinentalGame,
  createMauMauGame,
} from '@/services/createGame';
import { gameService } from '@/services/gameService';

type PlayerFormValue = {
  id: string;
  name: string;
};

const GAME_DEFINITIONS = {
  [GAME_TYPES.CONTINENTAL]: continentalDefinition,
  [GAME_TYPES.MAUMAU]: maumauDefinition,
} as const;

function createInitialPlayers(
  minimumPlayers: number,
): PlayerFormValue[] {
  return Array.from(
    { length: minimumPlayers },
    (_, index) => ({
      id: `temporary-player-${index + 1}`,
      name: '',
    }),
  );
}

export default function NewGameScreen() {
  const { setActiveGame } = useGameContext();

  const [selectedGameType, setSelectedGameType] =
    useState<GameType>(GAME_TYPES.CONTINENTAL);

  const selectedDefinition =
    GAME_DEFINITIONS[selectedGameType];

  const minimumPlayers =
    selectedDefinition.minimumPlayers;

  const maximumPlayers =
    selectedDefinition.maximumPlayers ?? 6;

  const [players, setPlayers] = useState<
    PlayerFormValue[]
  >(() => createInitialPlayers(minimumPlayers));

  const [scoreLimitInput, setScoreLimitInput] =
    useState(
      String(DEFAULT_MAUMAU_SCORE_LIMIT),
    );

  const [isCreatingGame, setIsCreatingGame] =
    useState(false);

  const normalizedNames = useMemo(
    () =>
      players.map((player) =>
        player.name.trim().toLocaleLowerCase(
          'es-ES',
        ),
      ),
    [players],
  );

  const hasEmptyNames = normalizedNames.some(
    (name) => name.length === 0,
  );

  const hasDuplicatedNames =
    new Set(normalizedNames).size !==
    normalizedNames.length;

  const scoreLimit = Number(scoreLimitInput);

  const isScoreLimitValid =
    selectedGameType !== GAME_TYPES.MAUMAU ||
    isValidMauMauScoreLimit(scoreLimit);

  const canStartGame =
    players.length >= minimumPlayers &&
    players.length <= maximumPlayers &&
    !hasEmptyNames &&
    !hasDuplicatedNames &&
    isScoreLimitValid &&
    !isCreatingGame;

  function handleSelectGame(
    gameType: GameType,
  ): void {
    setSelectedGameType(gameType);

    const definition =
      GAME_DEFINITIONS[gameType];

    setPlayers((currentPlayers) => {
      if (
        currentPlayers.length >=
        definition.minimumPlayers
      ) {
        return currentPlayers.slice(
          0,
          definition.maximumPlayers ?? 6,
        );
      }

      const missingPlayers =
        definition.minimumPlayers -
        currentPlayers.length;

      const additionalPlayers = Array.from(
        { length: missingPlayers },
        (_, index) => ({
          id: `temporary-player-${Date.now()}-${index}`,
          name: '',
        }),
      );

      return [
        ...currentPlayers,
        ...additionalPlayers,
      ];
    });
  }

  function updatePlayerName(
    playerId: string,
    name: string,
  ): void {
    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === playerId
          ? {
              ...player,
              name,
            }
          : player,
      ),
    );
  }

  function addPlayer(): void {
    if (
      players.length >= maximumPlayers
    ) {
      return;
    }

    setPlayers((currentPlayers) => [
      ...currentPlayers,
      {
        id: `temporary-player-${Date.now()}`,
        name: '',
      },
    ]);
  }

  function removePlayer(
    playerId: string,
  ): void {
    if (
      players.length <= minimumPlayers
    ) {
      return;
    }

    setPlayers((currentPlayers) =>
      currentPlayers.filter(
        (player) => player.id !== playerId,
      ),
    );
  }

  function handleScoreLimitChange(
    value: string,
  ): void {
    setScoreLimitInput(
      value.replace(/[^0-9]/g, ''),
    );
  }

  async function handleStartGame(): Promise<void> {
    if (isCreatingGame) {
      return;
    }

    if (hasEmptyNames) {
      Alert.alert(
        'Faltan jugadores',
        'Introduce el nombre de todos los jugadores.',
      );

      return;
    }

    if (hasDuplicatedNames) {
      Alert.alert(
        'Nombres repetidos',
        'Cada jugador debe tener un nombre diferente.',
      );

      return;
    }

    if (
      players.length < minimumPlayers ||
      players.length > maximumPlayers
    ) {
      Alert.alert(
        'Número de jugadores no válido',
        `${selectedDefinition.name} necesita entre ${minimumPlayers} y ${maximumPlayers} jugadores.`,
      );

      return;
    }

    if (!isScoreLimitValid) {
      Alert.alert(
        'Límite no válido',
        `El límite debe estar entre ${MAUMAU_MINIMUM_SCORE_LIMIT} y ${MAUMAU_MAXIMUM_SCORE_LIMIT} puntos.`,
      );

      return;
    }

    setIsCreatingGame(true);

    try {
      const playerNames = players.map(
        (player) => player.name,
      );

      const createdGame =
        selectedGameType ===
        GAME_TYPES.CONTINENTAL
          ? createContinentalGame({
              playerNames,
            })
          : createMauMauGame({
              playerNames,
              scoreLimit,
            });

      await gameService.saveGame(createdGame);

      setActiveGame(createdGame);
      router.replace('/game');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error al crear la partida.';

      Alert.alert(
        'No se pudo crear la partida',
        message,
      );
    } finally {
      setIsCreatingGame(false);
    }
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver"
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed &&
              styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonIcon}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Nueva partida
          </Text>

          <Text style={styles.subtitle}>
            Elige el juego y añade a los
            participantes.
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <SectionTitle>Juego</SectionTitle>

          <View style={styles.gameList}>
            <GameSelectionCard
              name={continentalDefinition.name}
              description={
                continentalDefinition.shortDescription
              }
              selected={
                selectedGameType ===
                GAME_TYPES.CONTINENTAL
              }
              onPress={() =>
                handleSelectGame(
                  GAME_TYPES.CONTINENTAL,
                )
              }
            />

            <GameSelectionCard
              name={maumauDefinition.name}
              description={
                maumauDefinition.shortDescription
              }
              selected={
                selectedGameType ===
                GAME_TYPES.MAUMAU
              }
              onPress={() =>
                handleSelectGame(
                  GAME_TYPES.MAUMAU,
                )
              }
            />
          </View>
        </View>

        <GameRulesCard
          key={selectedGameType}
          sections={
            selectedDefinition.ruleSections
          }
        />

        {selectedGameType ===
          GAME_TYPES.MAUMAU && (
          <View>
            <SectionTitle>
              Configuración
            </SectionTitle>

            <AppCard>
              <Text style={styles.settingLabel}>
                Límite de eliminación
              </Text>

              <Text style={styles.settingDescription}>
                Un jugador queda eliminado al
                alcanzar o superar este valor.
              </Text>

              <View
                style={styles.scoreLimitContainer}
              >
                <TextInput
                  accessibilityLabel="Límite de puntos"
                  keyboardType="number-pad"
                  maxLength={3}
                  onChangeText={
                    handleScoreLimitChange
                  }
                  selectTextOnFocus
                  style={[
                    styles.scoreLimitInput,
                    !isScoreLimitValid &&
                      styles.invalidInput,
                  ]}
                  value={scoreLimitInput}
                />

                <Text style={styles.pointsLabel}>
                  puntos
                </Text>
              </View>

              {!isScoreLimitValid && (
                <Text style={styles.errorText}>
                  Introduce un valor entre{' '}
                  {MAUMAU_MINIMUM_SCORE_LIMIT} y{' '}
                  {MAUMAU_MAXIMUM_SCORE_LIMIT}.
                </Text>
              )}
            </AppCard>
          </View>
        )}

        <View>
          <SectionTitle>Jugadores</SectionTitle>

          <AppCard>
            <View style={styles.playerList}>
              {players.map(
                (player, index) => (
                  <PlayerFormRow
                    key={player.id}
                    position={index + 1}
                    value={player.name}
                    canRemove={
                      players.length >
                      minimumPlayers
                    }
                    onChangeText={(name) =>
                      updatePlayerName(
                        player.id,
                        name,
                      )
                    }
                    onRemove={() =>
                      removePlayer(player.id)
                    }
                  />
                ),
              )}
            </View>

            {players.length <
              maximumPlayers && (
              <Pressable
                accessibilityRole="button"
                onPress={addPlayer}
                style={({ pressed }) => [
                  styles.addPlayerButton,
                  pressed &&
                    styles.addPlayerPressed,
                ]}
              >
                <Text
                  style={styles.addPlayerText}
                >
                  + Añadir jugador
                </Text>
              </Pressable>
            )}

            <Text style={styles.playerHelp}>
              Entre {minimumPlayers} y{' '}
              {maximumPlayers} jugadores.
            </Text>
          </AppCard>
        </View>

        <PrimaryButton
          label={
            isCreatingGame
              ? 'Creando partida...'
              : 'Empezar partida'
          }
          onPress={() => {
            void handleStartGame();
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },

  backButtonPressed: {
    backgroundColor: colors.border,
  },

  backButtonIcon: {
    color: colors.primary,
    fontSize: 42,
    lineHeight: 42,
  },

  headerText: {
    flex: 1,
    paddingTop: spacing.xs,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  content: {
    gap: spacing.xl,
  },

  gameList: {
    gap: spacing.md,
  },

  settingLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  settingDescription: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  scoreLimitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  scoreLimitInput: {
    width: 100,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '800',
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  invalidInput: {
    borderColor: colors.danger,
  },

  pointsLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
  },

  errorText: {
    marginTop: spacing.sm,
    color: colors.danger,
    fontSize: fontSize.xs,
  },

  playerList: {
    gap: spacing.sm,
  },

  addPlayerButton: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  addPlayerPressed: {
    opacity: 0.6,
  },

  addPlayerText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  playerHelp: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});