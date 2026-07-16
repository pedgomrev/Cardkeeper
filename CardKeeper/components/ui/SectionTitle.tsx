import { StyleSheet, Text } from 'react-native';

import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';

type SectionTitleProps = {
  children: string;
};

export function SectionTitle({
  children,
}: SectionTitleProps) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});