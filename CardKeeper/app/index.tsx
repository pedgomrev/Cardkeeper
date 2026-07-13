import { PrimaryButton } from '@/components/ui/PrimaryButton';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  function handleNewGame() {
    console.log('Nueva partida');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          CardKeeper
        </Text>

        <Text style={styles.subtitle}>
          Lleva la puntuación de tus partidas
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label="Nueva partida"
          onPress={handleNewGame}
        />

        <PrimaryButton
          label="Continuar partida"
          onPress={() => {
            console.log('Continuar partida');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',

    paddingHorizontal: spacing.lg,
    paddingTop: 96,
    paddingBottom: 56,

    backgroundColor: colors.background,
  },

  header: {
    alignItems: 'center',
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontSize.hero,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: spacing.sm,

    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
  },

  actions: {
    gap: spacing.md,
  },
});