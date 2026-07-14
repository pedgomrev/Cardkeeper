import { StyleSheet, Text, View } from 'react-native';

import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import type { RankingEntry } from '@/games/core/GameEngine';
import type { Player } from '@/models';

import { AppCard } from '../ui/AppCard';
import { SectionTitle } from '../ui/SectionTitle';

type RankingCardProps = {
  players: Player[];
  ranking: RankingEntry[];
};

export function RankingCard({
  players,
  ranking,
}: RankingCardProps) {
  return (
    <View>
      <SectionTitle>Clasificación</SectionTitle>

      <AppCard>
        <View style={styles.list}>
          {ranking.map((entry) => {
            const player = players.find(
              (item) => item.id === entry.playerId,
            );

            return (
              <View
                key={entry.playerId}
                style={styles.row}
              >
                <View style={styles.positionContainer}>
                  <Text style={styles.position}>
                    {entry.position}
                  </Text>
                </View>

                <Text style={styles.name}>
                  {player?.name ?? 'Jugador'}
                </Text>

                <Text style={styles.score}>
                  {entry.totalPoints}
                </Text>
              </View>
            );
          })}
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },

  row: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  positionContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 15,
  },

  position: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '800',
  },

  name: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },

  score: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
});