import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import { GAME_TYPES } from '@/games/core/types';
import type { PlayerStatistics } from '@/models';

type PlayerStatisticsCardProps = {
  statistics: PlayerStatistics;
  rankingPosition: number;
};

export function PlayerStatisticsCard({
  statistics,
  rankingPosition,
}: PlayerStatisticsCardProps) {
  const continental =
    statistics.byGame[
      GAME_TYPES.CONTINENTAL
    ];

  const maumau =
    statistics.byGame[GAME_TYPES.MAUMAU];

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.position}>
          <Text style={styles.positionText}>
            {rankingPosition}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name}>
            {statistics.playerName}
          </Text>

          <Text style={styles.summary}>
            {statistics.gamesPlayed}{' '}
            {statistics.gamesPlayed === 1
              ? 'partida'
              : 'partidas'}
          </Text>
        </View>

        <View style={styles.wins}>
          <Text style={styles.winsValue}>
            {statistics.wins}
          </Text>

          <Text style={styles.winsLabel}>
            victorias
          </Text>
        </View>
      </View>

      <View style={styles.mainStats}>
        <Stat
          label="Victorias"
          value={`${statistics.winRate}%`}
        />

        <Stat
          label="Media final"
          value={formatPoints(
            statistics.averageFinalPoints,
          )}
        />

        <Stat
          label="Continentales"
          value={statistics.continentalsAchieved}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.gameStats}>
        <GameStat
          name="Continental"
          games={continental.gamesPlayed}
          wins={continental.wins}
        />

        <GameStat
          name="MauMau"
          games={maumau.gamesPlayed}
          wins={maumau.wins}
        />
      </View>
    </AppCard>
  );
}

type StatProps = {
  label: string;
  value: string | number;
};

function Stat({
  label,
  value,
}: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

type GameStatProps = {
  name: string;
  games: number;
  wins: number;
};

function GameStat({
  name,
  games,
  wins,
}: GameStatProps) {
  return (
    <View style={styles.gameStat}>
      <Text style={styles.gameName}>
        {name}
      </Text>

      <Text style={styles.gameDescription}>
        {games} jugadas · {wins}{' '}
        {wins === 1 ? 'victoria' : 'victorias'}
      </Text>
    </View>
  );
}

function formatPoints(
  points: number,
): string {
  return Number.isInteger(points)
    ? String(points)
    : points.toFixed(1);
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  position: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 19,
  },

  positionText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '800',
  },

  headerText: {
    flex: 1,
  },

  name: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },

  summary: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },

  wins: {
    alignItems: 'center',
  },

  winsValue: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },

  winsLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },

  mainStats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '800',
  },

  statLabel: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },

  divider: {
    marginVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },

  gameStats: {
    gap: spacing.sm,
  },

  gameStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  gameName: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  gameDescription: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'right',
  },
});