import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
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
import type { Game } from '@/models';
import { gameRepository } from '@/storage/AsyncStorageGameRepository';

export default function HistoryScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function loadGames(): Promise<void> {
        setLoading(true);

        try {
          const storedGames =
            await gameRepository.findAll();

          const sortedGames = [...storedGames].sort(
            (firstGame, secondGame) =>
              new Date(
                secondGame.updatedAt,
              ).getTime() -
              new Date(
                firstGame.updatedAt,
              ).getTime(),
          );

          if (mounted) {
            setGames(sortedGames);
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

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver"
          hitSlop={12}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View>
          <Text style={styles.title}>
            Historial
          </Text>

          <Text style={styles.subtitle}>
            Consulta tus partidas anteriores.
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            color={colors.primary}
            size="large"
          />
        </View>
      ) : games.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🃏</Text>

          <Text style={styles.emptyTitle}>
            Todavía no hay partidas
          </Text>

          <Text style={styles.emptyText}>
            Las partidas que crees aparecerán aquí.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {games.map((game) => (
            <GameHistoryCard
              key={game.id}
              game={game}
              onPress={() =>
                router.push({
                  pathname: '/history/[gameId]',
                  params: {
                    gameId: game.id,
                  },
                })
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
  },

  pressed: {
    opacity: 0.6,
  },

  backIcon: {
    color: colors.primary,
    fontSize: 42,
    lineHeight: 42,
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
  },

  centered: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
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