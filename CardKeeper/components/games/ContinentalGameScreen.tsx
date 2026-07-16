import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { CurrentRoundCard } from '@/components/game/CurrentRoundCard';
import { GameHeader } from '@/components/game/GameHeader';
import { RankingCard } from '@/components/game/RankingCard';
import { RoundHistory } from '@/components/game/RoundHistory';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import { useContinentalGame } from '@/hooks/useContinentalGame';

export function ContinentalGameScreen() {
  const game = useContinentalGame();

  if (!game.activeGame) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No hay una partida de Continental
            activa
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

  return (
    <ScreenContainer scrollable>
      <GameHeader
        gameName="Continental"
        playerCount={
          game.activeGame.players.length
        }
      />

      <View style={styles.content}>
        {game.currentRoundRule &&
          !game.isFinished && (
            <CurrentRoundCard
              roundNumber={
                game.currentRoundNumber
              }
              totalRounds={game.totalRounds}
              roundLabel={
                game.currentRoundLabel
              }
              cardsDealt={
                game.currentRoundRule.cardsDealt
              }
              closingScore={
                game.currentRoundRule.closingScore
              }
              players={
                game.activeGame.players
              }
              closingPlayerId={
                game.closingPlayerId
              }
              closingVariant={
                game.closingVariant
              }
              scores={game.scores}
              onSelectClosingPlayer={
                game.handleSelectClosingPlayer
              }
              onClosingVariantChange={
                game.handleClosingVariantChange
              }
              onScoreChange={
                game.handleScoreChange
              }
              onSaveRound={
                game.handleSaveRound
              }
            />
          )}

        <RankingCard
          players={game.activeGame.players}
          ranking={game.ranking}
        />

        <RoundHistory
          players={game.activeGame.players}
          items={game.historyItems}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },

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