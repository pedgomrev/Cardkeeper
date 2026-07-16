import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  colors,
  fontSize,
  radius,
  spacing,
} from '@/constants/theme';
import type {
  ClosingVariant,
  Player,
} from '@/models';

import { AppCard } from '../ui/AppCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { PlayerScoreInput } from './PlayerScoreInput';

type CurrentRoundCardProps = {
  roundNumber: number;
  totalRounds: number;
  roundLabel: string;
  cardsDealt: number;
  closingScore: number;
  players: Player[];
  closingPlayerId: string | null;
  closingVariant: ClosingVariant;
  scores: Record<string, string>;
  onSelectClosingPlayer: (playerId: string) => void;
  onClosingVariantChange: (
    variant: ClosingVariant,
  ) => void;
  onScoreChange: (
    playerId: string,
    value: string,
  ) => void;
  onSaveRound: () => void | Promise<void>;
};

export function CurrentRoundCard({
  roundNumber,
  totalRounds,
  roundLabel,
  cardsDealt,
  closingScore,
  players,
  closingPlayerId,
  closingVariant,
  scores,
  onSelectClosingPlayer,
  onClosingVariantChange,
  onScoreChange,
  onSaveRound,
}: CurrentRoundCardProps) {
  const isLastRound =
    roundNumber === totalRounds;

  return (
    <AppCard>
      <Text style={styles.eyebrow}>
        Ronda {roundNumber} de {totalRounds}
      </Text>

      <Text style={styles.title}>{roundLabel}</Text>

      <Text style={styles.meta}>
        {cardsDealt} cartas · Cierre: {closingScore}{' '}
        puntos
      </Text>

      {isLastRound && (
        <View style={styles.closingSection}>
          <Text style={styles.closingTitle}>
            Tipo de cierre
          </Text>

          <View style={styles.closingOptions}>
            <ClosingOption
              label="Cierre normal"
              selected={
                closingVariant === 'normal'
              }
              onPress={() =>
                onClosingVariantChange('normal')
              }
            />

            <ClosingOption
              label="Continental"
              description="Gana la partida automáticamente"
              selected={
                closingVariant === 'continental'
              }
              onPress={() =>
                onClosingVariantChange(
                  'continental',
                )
              }
            />
          </View>
        </View>
      )}

      <View style={styles.inputs}>
        {players.map((player) => (
          <PlayerScoreInput
            key={player.id}
            playerName={player.name}
            value={scores[player.id] ?? ''}
            isClosingPlayer={
              player.id === closingPlayerId
            }
            closingScore={closingScore}
            onChangeText={(value) =>
              onScoreChange(player.id, value)
            }
            onSelectClosingPlayer={() =>
              onSelectClosingPlayer(player.id)
            }
          />
        ))}
      </View>

      <Text style={styles.help}>
        Pulsa sobre un jugador para indicar quién cerró
        la ronda.
      </Text>

      <PrimaryButton
        label={
          closingVariant === 'continental'
            ? 'Guardar Continental'
            : 'Guardar ronda'
        }
        onPress={onSaveRound}
      />
    </AppCard>
  );
}

type ClosingOptionProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

function ClosingOption({
  label,
  description,
  selected,
  onPress,
}: ClosingOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.closingOption,
        selected && styles.closingOptionSelected,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected && <View style={styles.radioDot} />}
      </View>

      <View style={styles.optionText}>
        <Text style={styles.optionLabel}>
          {label}
        </Text>

        {description && (
          <Text style={styles.optionDescription}>
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  title: {
    marginTop: spacing.xs,
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },

  meta: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },

  closingSection: {
    marginTop: spacing.lg,
  },

  closingTitle: {
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  closingOptions: {
    gap: spacing.sm,
  },

  closingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 54,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  closingOptionSelected: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },

  pressed: {
    opacity: 0.65,
  },

  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 11,
  },

  radioSelected: {
    borderColor: colors.primary,
  },

  radioDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  optionText: {
    flex: 1,
  },

  optionLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  optionDescription: {
    marginTop: 2,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },

  inputs: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  help: {
    marginVertical: spacing.md,
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    lineHeight: 18,
    textAlign: 'center',
  },
});