import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { RankingCard } from '@/components/game/RankingCard';
import { RoundHistory } from '@/components/game/RoundHistory';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import {
    formatContinentalRoundLabel,
} from '@/games/continental/rules';
import {
    calculateContinentalPlayerTotal,
    calculateContinentalRanking,
} from '@/games/continental/scoring';
import type { Game } from '@/models';
import { gameRepository } from '@/storage/AsyncStorageGameRepository';

export default function HistoryDetailScreen() {
  const { gameId } = useLocalSearchParams<{
    gameId: string;
  }>();

  const [game, setGame] = useState<Game | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGame(): Promise<void> {
      if (!gameId) {
        setLoading(false);
        return;
      }

      const storedGame =
        await gameRepository.findById(gameId);

      setGame(storedGame);
      setLoading(false);
    }

    void loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator
            color={colors.primary}
            size="large"
          />
        </View>
      </ScreenContainer>
    );
  }

  if (!game) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.notFound}>
            No se ha encontrado la partida.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const ranking =
    calculateContinentalRanking(game);

  const historyItems = game.rounds.map(
    (round, index) => ({
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
    }),
  );

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Volver"
          hitSlop={12}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            Continental
          </Text>

          <Text style={styles.subtitle}>
            {game.players
              .map((player) => player.name)
              .join(', ')}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <RankingCard
          players={game.players}
          ranking={ranking}
        />

        <RoundHistory
          players={game.players}
          items={historyItems}
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

  backIcon: {
    color: colors.primary,
    fontSize: 42,
    lineHeight: 42,
  },

  headerText: {
    flex: 1,
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

  content: {
    gap: spacing.xl,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFound: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});