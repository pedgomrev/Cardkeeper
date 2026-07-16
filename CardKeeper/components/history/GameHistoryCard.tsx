import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    colors,
    fontSize,
    radius,
    spacing,
} from '@/constants/theme';
import type { Game } from '@/models';

import { AppCard } from '../ui/AppCard';

type GameHistoryCardProps = {
  game: Game;
  onPress: () => void;
};

export function GameHistoryCard({
  game,
  onPress,
}: GameHistoryCardProps) {
  const winnerNames =
    getWinnerNames(game);

  const date = new Intl.DateTimeFormat(
    'es-ES',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(game.createdAt));

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
      ]}
    >
      <AppCard>
        <View style={styles.header}>
          <View>
            <Text style={styles.gameName}>
              {getGameName(game.gameType)}
            </Text>

            <Text style={styles.date}>
              {date}
            </Text>
          </View>

          <StatusBadge status={game.status} />
        </View>

        <View style={styles.details}>
          <Text style={styles.detail}>
            {game.players.length} jugadores
          </Text>

          <Text style={styles.separator}>·</Text>

          <Text style={styles.detail}>
            {game.rounds.length}{' '}
            {game.rounds.length === 1
              ? 'ronda'
              : 'rondas'}
          </Text>
        </View>

        {winnerNames.length > 0 && (
          <View style={styles.winner}>
            <Text style={styles.winnerIcon}>🏆</Text>

            <Text style={styles.winnerText}>
              {winnerNames.length === 1
                ? `Ganador: ${winnerNames[0]}`
                : `Empate: ${winnerNames.join(', ')}`}
            </Text>
          </View>
        )}

        <Text style={styles.players}>
          {game.players
            .map((player) => player.name)
            .join(', ')}
        </Text>
      </AppCard>
    </Pressable>
  );
}

function StatusBadge({
  status,
}: {
  status: Game['status'];
}) {
  const finished = status === 'finished';

  return (
    <View
      style={[
        styles.badge,
        finished
          ? styles.finishedBadge
          : styles.activeBadge,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          finished
            ? styles.finishedBadgeText
            : styles.activeBadgeText,
        ]}
      >
        {finished ? 'Finalizada' : 'En curso'}
      </Text>
    </View>
  );
}

function getWinnerNames(game: Game): string[] {
  if (!game.winnerPlayerIds) {
    return [];
  }

  return game.winnerPlayerIds
    .map(
      (winnerId) =>
        game.players.find(
          (player) => player.id === winnerId,
        )?.name,
    )
    .filter(
      (name): name is string => Boolean(name),
    );
}

function getGameName(
  gameType: Game['gameType'],
): string {
  switch (gameType) {
    case 'continental':
      return 'Continental';

    default:
      return gameType;
  }
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.lg,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },

  gameName: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '800',
  },

  date: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },

  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },

  finishedBadge: {
    backgroundColor: colors.background,
  },

  activeBadge: {
    backgroundColor: colors.primaryLight,
  },

  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },

  finishedBadgeText: {
    color: colors.primaryDark,
  },

  activeBadgeText: {
    color: colors.white,
  },

  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },

  detail: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },

  separator: {
    marginHorizontal: spacing.sm,
    color: colors.textSecondary,
  },

  winner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  winnerIcon: {
    fontSize: fontSize.md,
  },

  winnerText: {
    flex: 1,
    color: colors.primaryDark,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  players: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});