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
import type { MauMauClosingVariant } from '@/games/maumau/rules';
import type { Player } from '@/models';

import { AppCard } from '../ui/AppCard';
import { PrimaryButton } from '../ui/PrimaryButton';
import { PlayerScoreInput } from './PlayerScoreInput';

type MauMauCurrentRoundCardProps = {
  roundNumber: number;
  scoreLimit: number;
  players: Player[];
  closingPlayerId: string | null;
  closingVariant: MauMauClosingVariant;
  closingScore: number;
  scores: Record<string, string>;
  isSaving: boolean;
  onSelectClosingPlayer: (
    playerId: string,
  ) => void;
  onClosingVariantChange: (
    variant: MauMauClosingVariant,
  ) => void;
  onScoreChange: (
    playerId: string,
    value: string,
  ) => void;
  onSaveRound: () => void | Promise<void>;
};

export function MauMauCurrentRoundCard({
  roundNumber,
  scoreLimit,
  players,
  closingPlayerId,
  closingVariant,
  closingScore,
  scores,
  isSaving,
  onSelectClosingPlayer,
  onClosingVariantChange,
  onScoreChange,
  onSaveRound,
}: MauMauCurrentRoundCardProps) {
  return (
    <AppCard>
      <Text style={styles.eyebrow}>
        Ronda {roundNumber}
      </Text>

      <Text style={styles.title}>
        Registrar puntuaciones
      </Text>

      <Text style={styles.meta}>
        Límite de eliminación: {scoreLimit}{' '}
        puntos
      </Text>

      <View style={styles.closingSection}>
        <Text style={styles.sectionTitle}>
          Tipo de cierre
        </Text>

        <ClosingOption
          label="Cierre normal"
          description="-10 puntos"
          selected={
            closingVariant === 'normal'
          }
          onPress={() =>
            onClosingVariantChange('normal')
          }
        />

        <ClosingOption
          label="Escalera completa"
          description="-25 puntos"
          selected={
            closingVariant ===
            'full_straight'
          }
          onPress={() =>
            onClosingVariantChange(
              'full_straight',
            )
          }
        />
      </View>

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
        Solo aparecen los jugadores que siguen
        activos en la partida.
      </Text>

      <PrimaryButton
        label={
          isSaving
            ? 'Guardando ronda...'
            : 'Guardar ronda'
        }
        onPress={() => {
          void onSaveRound();
        }}
      />
    </AppCard>
  );
}

type ClosingOptionProps = {
  label: string;
  description: string;
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
      accessibilityState={{
        checked: selected,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected && (
          <View style={styles.radioDot} />
        )}
      </View>

      <View style={styles.optionText}>
        <Text style={styles.optionLabel}>
          {label}
        </Text>

        <Text
          style={styles.optionDescription}
        >
          {description}
        </Text>
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
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  option: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },

  optionSelected: {
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