import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
    colors,
    fontSize,
    radius,
    shadows,
    spacing,
} from '@/constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({
  label,
  onPress,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.highlight} />

      <Text style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,

    backgroundColor: colors.primary,
    borderRadius: radius.pill,

    borderWidth: 1,
    borderColor: colors.primaryLight,

    ...shadows.soft,
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
    backgroundColor: colors.primaryDark,
  },

  highlight: {
    position: 'absolute',
    top: 4,
    left: 18,
    right: 18,
    height: 14,

    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },

  label: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});