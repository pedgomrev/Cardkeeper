import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import { gameService } from '@/services/gameService';
export default function HomeScreen() {
  const { setActiveGame } = useGameContext();

  const [isLoadingActiveGame, setIsLoadingActiveGame] =
    useState(false);

  function handleNewGame(): void {
    router.push('/new-game');
  }
function handleStatistics(): void {
  router.push('/statistics');
}
  async function handleContinueGame(): Promise<void> {
    if (isLoadingActiveGame) {
      return;
    }

    setIsLoadingActiveGame(true);

    try {
      const activeGame =
        await gameService.getActiveGame();

      if (!activeGame) {
        Alert.alert(
          'No hay partidas en curso',
          'Crea una nueva partida para empezar a jugar.',
        );

        return;
      }

      setActiveGame(activeGame);
      router.push('/game');
    } catch {
      Alert.alert(
        'No se pudo cargar la partida',
        'Ha ocurrido un error al recuperar la partida guardada.',
      );
    } finally {
      setIsLoadingActiveGame(false);
    }
  }

  function handleHistory(): void {
    router.push('/history');
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoIcon}>♠</Text>
          </View>

          <Text style={styles.title}>
            CardKeeper
          </Text>

          <Text style={styles.subtitle}>
            Gestiona tus partidas de cartas y
            olvídate de apuntar los puntos en papel.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="Nueva partida"
            onPress={handleNewGame}
          />

          <PrimaryButton
            label={
              isLoadingActiveGame
                ? 'Cargando partida...'
                : 'Continuar partida'
            }
            onPress={() => {
              void handleContinueGame();
            }}
          />

          <PrimaryButton
            label="Historial"
            onPress={handleHistory}
          />

          <PrimaryButton
            label="Estadísticas"
            onPress={handleStatistics}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  hero: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  logoPlaceholder: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 48,
  },

  logoIcon: {
    color: colors.white,
    fontSize: 48,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.hero,
    fontWeight: '800',
  },

  subtitle: {
    maxWidth: 320,
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 24,
    textAlign: 'center',
  },

  actions: {
    gap: spacing.md,
  },
});