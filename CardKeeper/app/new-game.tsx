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
  spacing,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import { continentalDefinition } from '@/games/continental/definition';
import { createContinentalGame } from '@/services/createGame';
import { gameRepository } from '@/storage/AsyncStorageGameRepository';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type PlayerFormValue = {
  id: string;
  name: string;
};

const MINIMUM_PLAYERS =
  continentalDefinition.minimumPlayers;

const MAXIMUM_PLAYERS =
  continentalDefinition.maximumPlayers ?? 6;

function createInitialPlayers(): PlayerFormValue[] {
  return Array.from(
    { length: MINIMUM_PLAYERS },
    (_, index) => ({
      id: `temporary-player-${index + 1}`,
      name: '',
    }),
  );
}

export default function NewGameScreen() {
  const { setActiveGame } = useGameContext();
  const [players, setPlayers] = useState<PlayerFormValue[]>(
    createInitialPlayers,
  );

  const normalizedNames = useMemo(
    () =>
      players.map((player) =>
        player.name.trim().toLocaleLowerCase(),
      ),
    [players],
  );

  const hasEmptyNames = normalizedNames.some(
    (name) => name.length === 0,
  );

  const hasDuplicatedNames =
    new Set(normalizedNames).size !==
    normalizedNames.length;

  const canStartGame =
    players.length >= MINIMUM_PLAYERS &&
    !hasEmptyNames &&
    !hasDuplicatedNames;

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
    if (players.length >= MAXIMUM_PLAYERS) {
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

  function removePlayer(playerId: string): void {
    if (players.length <= MINIMUM_PLAYERS) {
      return;
    }

    setPlayers((currentPlayers) =>
      currentPlayers.filter(
        (player) => player.id !== playerId,
      ),
    );
  }

async function handleStartGame(): Promise<void> {
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

  if (!canStartGame) {
    Alert.alert(
      'Jugadores insuficientes',
      `Continental necesita al menos ${MINIMUM_PLAYERS} jugadores.`,
    );

    return;
  }

  const createdGame = createContinentalGame({
    playerNames: players.map(
      (player) => player.name,
    ),
  });

  try {
    await gameRepository.save(createdGame);

    setActiveGame(createdGame);

    router.replace('/game');
  } catch {
    Alert.alert(
      'No se pudo crear la partida',
      'Ha ocurrido un error al guardar la partida.',
    );
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
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonIcon}>‹</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Nueva partida
          </Text>

          <Text style={styles.subtitle}>
            Elige el juego y añade a los participantes.
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <SectionTitle>Juego</SectionTitle>

          <GameSelectionCard
            name={continentalDefinition.name}
            description={
              continentalDefinition.shortDescription
            }
            selected
            onPress={() => undefined}
          />
        </View>

        <GameRulesCard
          sections={continentalDefinition.ruleSections}
        />

        <View>
          <SectionTitle>Jugadores</SectionTitle>

          <AppCard>
            <View style={styles.playerList}>
              {players.map((player, index) => (
                <PlayerFormRow
                  key={player.id}
                  position={index + 1}
                  value={player.name}
                  canRemove={
                    players.length > MINIMUM_PLAYERS
                  }
                  onChangeText={(name) =>
                    updatePlayerName(player.id, name)
                  }
                  onRemove={() =>
                    removePlayer(player.id)
                  }
                />
              ))}
            </View>

            {players.length < MAXIMUM_PLAYERS && (
              <Pressable
                accessibilityRole="button"
                onPress={addPlayer}
                style={({ pressed }) => [
                  styles.addPlayerButton,
                  pressed && styles.addPlayerPressed,
                ]}
              >
                <Text style={styles.addPlayerText}>
                  + Añadir jugador
                </Text>
              </Pressable>
            )}

            <Text style={styles.playerHelp}>
              Entre {MINIMUM_PLAYERS} y{' '}
              {MAXIMUM_PLAYERS} jugadores.
            </Text>
          </AppCard>
        </View>

        <PrimaryButton
          label="Empezar partida"
          onPress={handleStartGame}
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
    fontWeight: '400',
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

  playerList: {
    gap: spacing.sm,
  },

  addPlayerButton: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
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