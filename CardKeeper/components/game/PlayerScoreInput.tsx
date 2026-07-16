import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    colors,
    fontSize,
    radius,
    spacing,
} from '@/constants/theme';

type PlayerScoreInputProps = {
  playerName: string;
  value: string;
  isClosingPlayer: boolean;
  closingScore: number;
  onChangeText: (value: string) => void;
  onSelectClosingPlayer: () => void;
};

export function PlayerScoreInput({
  playerName,
  value,
  isClosingPlayer,
  closingScore,
  onChangeText,
  onSelectClosingPlayer,
}: PlayerScoreInputProps) {
  return (
    <View
      style={[
        styles.container,
        isClosingPlayer && styles.closingContainer,
      ]}
    >
      <Pressable
        accessibilityLabel={`${playerName} cerró la ronda`}
        accessibilityRole="radio"
        accessibilityState={{
          checked: isClosingPlayer,
        }}
        onPress={onSelectClosingPlayer}
        style={({ pressed }) => [
          styles.playerButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.playerName}>
          {playerName}
        </Text>

        <Text style={styles.crown}>
          {isClosingPlayer ? '👑' : '○'}
        </Text>
      </Pressable>

      <TextInput
        accessibilityLabel={`Puntuación de ${playerName}`}
        editable={!isClosingPlayer}
        keyboardType="number-pad"
        onChangeText={onChangeText}
        placeholder="0"
        placeholderTextColor={colors.textSecondary}
        selectTextOnFocus
        style={[
          styles.input,
          isClosingPlayer && styles.closingInput,
        ]}
        value={
          isClosingPlayer
            ? String(closingScore)
            : value
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  closingContainer: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },

  playerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },

  pressed: {
    opacity: 0.65,
  },

  playerName: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  crown: {
    marginLeft: spacing.sm,
    fontSize: fontSize.lg,
  },

  input: {
    width: 82,
    minHeight: 46,
    paddingHorizontal: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  closingInput: {
    color: colors.success,
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
});