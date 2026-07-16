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

import { PlayerStatisticsCard } from '@/components/statistics/PlayerStatisticsCard';
import { StatisticCard } from '@/components/statistics/StatisticCard';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import { GAME_TYPES } from '@/games/core/types';
import type { AppStatistics } from '@/models';
import { statisticsService } from '@/services/statisticsService';

export default function StatisticsScreen() {
  const [statistics, setStatistics] =
    useState<AppStatistics | null>(null);

  const [loading, setLoading] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      async function loadStatistics():
        Promise<void> {
        setLoading(true);

        try {
          const loadedStatistics =
            await statisticsService.getStatistics();

          if (mounted) {
            setStatistics(
              loadedStatistics,
            );
          }
        } catch {
          if (mounted) {
            Alert.alert(
              'No se pudieron cargar las estadísticas',
              'Ha ocurrido un error al analizar las partidas guardadas.',
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }

      void loadStatistics();

      return () => {
        mounted = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator
            color={colors.primary}
            size="large"
          />

          <Text style={styles.loadingText}>
            Calculando estadísticas...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!statistics) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>
            No se pudieron cargar los datos
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const continentalStatistics =
    statistics.gamesByType.find(
      (item) =>
        item.gameType ===
        GAME_TYPES.CONTINENTAL,
    );

  const maumauStatistics =
    statistics.gamesByType.find(
      (item) =>
        item.gameType ===
        GAME_TYPES.MAUMAU,
    );

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
          <Text style={styles.backIcon}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Estadísticas
          </Text>

          <Text style={styles.subtitle}>
            Resultados calculados a partir de
            las partidas finalizadas.
          </Text>
        </View>
      </View>

      {statistics.completedGames === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>
            📊
          </Text>

          <Text style={styles.emptyTitle}>
            Todavía no hay estadísticas
          </Text>

          <Text style={styles.emptyText}>
            Completa una partida para empezar
            a comparar los resultados.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View>
            <SectionTitle>Resumen</SectionTitle>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <StatisticCard
                  label="Finalizadas"
                  value={
                    statistics.completedGames
                  }
                  helper={`${statistics.totalGames} guardadas`}
                />
              </View>

              <View style={styles.summaryItem}>
                <StatisticCard
                  label="En curso"
                  value={
                    statistics.gamesInProgress
                  }
                />
              </View>

              <View style={styles.summaryItem}>
                <StatisticCard
                  label="Continental"
                  value={
                    continentalStatistics
                      ?.gamesPlayed ?? 0
                  }
                  helper="partidas"
                />
              </View>

              <View style={styles.summaryItem}>
                <StatisticCard
                  label="MauMau"
                  value={
                    maumauStatistics
                      ?.gamesPlayed ?? 0
                  }
                  helper="partidas"
                />
              </View>
            </View>
          </View>

          <View>
            <SectionTitle>
              Clasificación de jugadores
            </SectionTitle>

            <View style={styles.playerList}>
              {statistics.players.map(
                (player, index) => (
                  <PlayerStatisticsCard
                    key={player.playerKey}
                    statistics={player}
                    rankingPosition={index + 1}
                  />
                ),
              )}
            </View>
          </View>
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

  content: {
    gap: spacing.xl,
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },

  summaryItem: {
    width: '47%',
  },

  playerList: {
    gap: spacing.md,
  },

  centered: {
    flex: 1,
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
});