import { router } from 'expo-router';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';

type GameHeaderProps = {
  gameName: string;
  playerCount: number;
};

export function GameHeader({
  gameName,
  playerCount,
}: GameHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Volver"
        accessibilityRole="button"
        hitSlop={12}
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>{gameName}</Text>

        <Text style={styles.subtitle}>
          {playerCount}{' '}
          {playerCount === 1 ? 'jugador' : 'jugadores'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },

  pressed: {
    opacity: 0.6,
  },

  backIcon: {
    color: colors.primary,
    fontSize: 42,
    lineHeight: 42,
  },

  content: {
    flex: 1,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});