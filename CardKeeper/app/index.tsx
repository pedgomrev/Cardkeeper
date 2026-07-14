import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';

export default function HomeScreen() {
  function handleNewGame(): void {
    router.push('/new-game');
  }

  function handleContinueGame(): void {
    console.log('Continuar partida');
  }

  function handleHistory(): void {
    router.push('/history');
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoIcon}>♠</Text>
          </View>

          <Text style={styles.title}>CardKeeper</Text>

          <Text style={styles.subtitle}>
            Gestiona tus partidas de cartas y olvídate de
            apuntar los puntos en papel.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label="Nueva partida"
            onPress={handleNewGame}
          />

          <PrimaryButton
            label="Continuar partida"
            onPress={handleContinueGame}
          />

          <PrimaryButton
            label="Historial"
            onPress={handleHistory}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },

  hero: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },

  logoPlaceholder: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 48,
  },

  logoIcon: {
    color: colors.white,
    fontSize: 48,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.hero,
    fontWeight: '800',
  },

  subtitle: {
    maxWidth: 320,
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 24,
    textAlign: 'center',
  },

  actions: {
    gap: spacing.md,
  },
});