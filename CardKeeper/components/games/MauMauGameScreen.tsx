import { router } from 'expo-router';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { GameHeader } from '@/components/game/GameHeader';
import { MauMauCurrentRoundCard } from '@/components/game/MauMauCurrentRoundCard';
import { RankingCard } from '@/components/game/RankingCard';
import { RoundHistory } from '@/components/game/RoundHistory';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import {
    colors,
    fontSize,
    spacing,
} from '@/constants/theme';
import { useMauMauGame } from '@/hooks/useMauMauGame';

export function MauMauGameScreen() {
  const game = useMauMauGame();

  if (!game.activeGame) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No hay una partida de MauMau activa
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
        gameName="MauMau / Chinchón"
        playerCount={
          game.activeGame.players.length
        }
      />

      <View style={styles.content}>
        {!game.isFinished && (
          <MauMauCurrentRoundCard
            roundNumber={
              game.currentRoundNumber
            }
            scoreLimit={game.scoreLimit}
            players={game.activePlayers}
            closingPlayerId={
              game.closingPlayerId
            }
            closingVariant={
              game.closingVariant
            }
            closingScore={game.closingScore}
            scores={game.scores}
            isSaving={game.isSavingRound}
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