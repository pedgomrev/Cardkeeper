import { StyleSheet, Text, View } from 'react-native';

import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';

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
      <Text
        numberOfLines={1}
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
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 96,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  name: {
    maxWidth: 90,
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  crown: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
  },
});