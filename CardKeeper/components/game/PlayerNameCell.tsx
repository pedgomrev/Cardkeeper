import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';

import { SCORE_TABLE_COLUMN_WIDTH } from './scoreTableConstants';

type PlayerNameCellProps = {
  name: string;
  isClosingPlayer?: boolean;
};

export function PlayerNameCell({
  name,
  isClosingPlayer = false,
}: PlayerNameCellProps) {
  return (
    <View style={styles.container}>
      <View style={styles.nameRow}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.name}
        >
          {name}
        </Text>

        {isClosingPlayer && (
          <Text
            accessibilityLabel="Jugador que cerró la ronda"
            style={styles.crown}
          >
            👑
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCORE_TABLE_COLUMN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },

  nameRow: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },

  name: {
    flexShrink: 1,
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },

  crown: {
    fontSize: fontSize.sm,
  },
});