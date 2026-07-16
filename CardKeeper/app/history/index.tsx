import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { GameHistoryCard } from '@/components/history/GameHistoryCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { Game } from '@/models';
import { gameService } from '@/services/gameService';

export default function HistoryScreen() {
  const { setActiveGame } = useGameContext();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function loadGames(): Promise<void> {
        setLoading(true);

        try {
          const storedGames =
            await gameService.getAllGames();

          if (mounted) {
            setGames(storedGames);
          }
        } catch {
          if (mounted) {
            Alert.alert(
              'No se pudo cargar el historial',
              'Ha ocurrido un error al recuperar las partidas guardadas.',
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }

      void loadGames();

      return () => {
        mounted = false;
      };
    }, []),
  );

  function handleGamePress(game: Game): void {
    if (game.status === 'in_progress') {
      setActiveGame(game);
      router.push('/game');

      return;
    }

    router.push({
      pathname: '/history/[gameId]',
      params: {
        gameId: game.id,
      },
    });
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
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Historial
          </Text>

          <Text style={styles.subtitle}>
            Consulta o continúa tus partidas guardadas.
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            color={colors.primary}
            size="large"
          />

          <Text style={styles.loadingText}>
            Cargando partidas...
          </Text>
        </View>
      ) : games.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>
            🃏
          </Text>

          <Text style={styles.emptyTitle}>
            Todavía no hay partidas
          </Text>

          <Text style={styles.emptyText}>
            Las partidas que crees aparecerán aquí,
            incluso aunque cierres la aplicación.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {games.map((game) => (
            <GameHistoryCard
              key={game.id}
              game={game}
              onPress={() =>
                handleGamePress(game)
              }
            />
          ))}
        </View>
      )}
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

  pressed: {
    opacity: 0.6,
  },

  backIcon: {
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

  centered: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },

  emptyState: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  emptyIcon: {
    fontSize: 52,
  },

  emptyTitle: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 21,
    textAlign: 'center',
  },

  list: {
    gap: spacing.md,
  },
});