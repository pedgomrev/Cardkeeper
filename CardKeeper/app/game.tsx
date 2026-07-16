import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ContinentalGameScreen } from '@/components/games/ContinentalGameScreen';
import { MauMauGameScreen } from '@/components/games/MauMauGameScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import { GAME_TYPES } from '@/games/core/types';

export default function GameScreen() {
  const { activeGame } = useGameContext();

  if (!activeGame) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No hay ninguna partida activa
          </Text>

          <PrimaryButton
            label="Crear partida"
            onPress={() =>
              router.replace('/new-game')
            }
          />
        </View>
      </ScreenContainer>
    );
  }

  switch (activeGame.gameType) {
    case GAME_TYPES.CONTINENTAL:
      return <ContinentalGameScreen />;

    case GAME_TYPES.MAUMAU:
      return <MauMauGameScreen />;
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },

  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
});