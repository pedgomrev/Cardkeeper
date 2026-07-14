import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import {
    colors,
    radius,
    shadows,
    spacing,
} from '@/constants/theme';

type AppCardProps = PropsWithChildren<{
  padded?: boolean;
}>;

export function AppCard({
  children,
  padded = true,
}: AppCardProps) {
  return (
    <View style={[styles.card, padded && styles.padded]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  padded: {
    padding: spacing.md,
  },
});