import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import {
    colors,
    fontSize,
    radius,
    spacing,
} from '@/constants/theme';

type GameSelectionCardProps = {
  name: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function GameSelectionCard({
  name,
  description,
  selected,
  disabled = false,
  onPress,
}: GameSelectionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{
        checked: selected,
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <AppCard>
        <View
          style={[
            styles.content,
            selected && styles.selectedContent,
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.name}>{name}</Text>

            <Text style={styles.description}>
              {description}
            </Text>
          </View>

          <View
            style={[
              styles.radio,
              selected && styles.radioSelected,
            ]}
          >
            {selected && <View style={styles.radioDot} />}
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.lg,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
  },

  selectedContent: {
    backgroundColor: colors.background,
  },

  textContainer: {
    flex: 1,
  },

  name: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },

  description: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  radio: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
});