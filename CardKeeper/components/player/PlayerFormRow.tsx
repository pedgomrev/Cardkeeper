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

type PlayerFormRowProps = {
  position: number;
  value: string;
  canRemove: boolean;
  onChangeText: (value: string) => void;
  onRemove: () => void;
};

export function PlayerFormRow({
  position,
  value,
  canRemove,
  onChangeText,
  onRemove,
}: PlayerFormRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.position}>
        <Text style={styles.positionText}>
          {position}
        </Text>
      </View>

      <TextInput
        accessibilityLabel={`Nombre del jugador ${position}`}
        autoCapitalize="words"
        maxLength={30}
        onChangeText={onChangeText}
        placeholder={`Jugador ${position}`}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="done"
        style={styles.input}
        value={value}
      />

      {canRemove && (
        <Pressable
          accessibilityLabel={`Eliminar jugador ${position}`}
          hitSlop={10}
          onPress={onRemove}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removeButtonPressed,
          ]}
        >
          <Text style={styles.removeText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  position: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 17,
  },

  positionText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  input: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  removeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },

  removeButtonPressed: {
    backgroundColor: colors.border,
  },

  removeText: {
    color: colors.danger,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '500',
  },
});