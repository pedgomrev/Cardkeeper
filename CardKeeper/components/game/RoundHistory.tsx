import { StyleSheet, View } from 'react-native';

import type { Player, Round } from '@/models';

import { spacing } from '@/constants/theme';
import { SectionTitle } from '../ui/SectionTitle';
import { RoundScoreTable } from './RoundScoreTable';

type RoundHistoryItem = {
  round: Round;
  roundLabel: string;
  accumulatedTotals: Record<string, number>;
};

type RoundHistoryProps = {
  players: Player[];
  items: RoundHistoryItem[];
};

export function RoundHistory({
  players,
  items,
}: RoundHistoryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View>
      <SectionTitle>Historial de rondas</SectionTitle>

      <View style={styles.list}>
        {items.map((item) => (
          <RoundScoreTable
            key={item.round.id}
            round={item.round}
            players={players}
            roundLabel={item.roundLabel}
            accumulatedTotals={
              item.accumulatedTotals
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});