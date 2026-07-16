import { StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';

type StatisticCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function StatisticCard({
  label,
  value,
  helper,
}: StatisticCardProps) {
  return (
    <AppCard>
      <View style={styles.container}>
        <Text style={styles.value}>
          {value}
        </Text>

        <Text style={styles.label}>
          {label}
        </Text>

        {helper && (
          <Text style={styles.helper}>
            {helper}
          </Text>
        )}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  value: {
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },

  label: {
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
  },

  helper: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});