import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';
import type { Player, Round } from '@/models';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SCORE_TABLE_COLUMN_WIDTH } from './scoreTableConstants';

import { AppCard } from '../ui/AppCard';
import { PlayerNameCell } from './PlayerNameCell';

type RoundScoreTableProps = {
  round: Round;
  players: Player[];
  roundLabel: string;
  accumulatedTotals?: Record<string, number>;
};

export function RoundScoreTable({
  round,
  players,
  roundLabel,
  accumulatedTotals,
}: RoundScoreTableProps) {
  function isContinentalPlayer(playerId: string): boolean {
    return (
      round.closingVariant === 'continental' &&
      round.closedByPlayerId === playerId
    );
  }

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.roundTitle}>
            Ronda {round.number}
          </Text>

          {round.closingVariant === 'continental' && (
            <View style={styles.continentalBadge}>
              <Text style={styles.continentalBadgeText}>
                CONTINENTAL
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.roundDescription}>
          {roundLabel}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          <View style={styles.row}>
            {players.map((player) => (
              <PlayerNameCell
                key={player.id}
                name={player.name}
                isClosingPlayer={
                  player.id === round.closedByPlayerId
                }
              />
            ))}
          </View>

          <View style={[styles.row, styles.scoreRow]}>
            {players.map((player) => {
              const score = round.scores.find(
                (item) => item.playerId === player.id,
              );

              const hasContinental = isContinentalPlayer(
                player.id,
              );

              return (
                <Text
                  key={player.id}
                  style={[
                    styles.score,
                    score?.points !== undefined &&
                      score.points < 0 &&
                      styles.negativeScore,
                    hasContinental &&
                      styles.continentalScore,
                  ]}
                >
                  {hasContinental
                    ? 'CONTINENTAL'
                    : score?.points ?? '—'}
                </Text>
              );
            })}
          </View>

          {accumulatedTotals && (
            <>
              <View style={styles.divider} />

              <Text style={styles.totalLabel}>
                Total acumulado
              </Text>

              <View style={styles.row}>
                {players.map((player) => (
                  <Text
                    key={player.id}
                    style={styles.totalScore}
                  >
                    {accumulatedTotals[player.id] ?? 0}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  roundTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },

  roundDescription: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },

  continentalBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 999,
  },

  continentalBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: '800',
  },

  scrollContent: {
    paddingBottom: spacing.xs,
  },

  row: {
    flexDirection: 'row',
  },

  scoreRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  score: {
    width: SCORE_TABLE_COLUMN_WIDTH,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
  },

  negativeScore: {
    color: colors.success,
  },

  continentalScore: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: '900',
  },

  divider: {
    marginVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  totalLabel: {
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  totalScore: {
    width: SCORE_TABLE_COLUMN_WIDTH,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
  },
});