import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppCard } from '@/components/ui/AppCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import {
  colors,
  fontSize,
  spacing,
} from '@/constants/theme';
import type { RuleSection } from '@/games/core/GameDefinition';

type GameRulesCardProps = {
  sections: RuleSection[];
  initiallyExpanded?: boolean;
};

export function GameRulesCard({
  sections,
  initiallyExpanded = false,
}: GameRulesCardProps) {
  const [expanded, setExpanded] = useState(
    initiallyExpanded,
  );

  const visibleSections = expanded
    ? sections
    : sections.slice(0, 1);

  return (
    <AppCard>
      <View style={styles.header}>
        <SectionTitle>Cómo se juega</SectionTitle>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() =>
            setExpanded((current) => !current)
          }
          style={({ pressed }) => [
            styles.toggleButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.toggleText}>
            {expanded
              ? 'Ocultar reglas'
              : 'Ver reglas completas'}
          </Text>

          <Text style={styles.toggleIcon}>
            {expanded ? '⌃' : '⌄'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.sections}>
        {visibleSections.map((section) => (
          <View
            key={section.title}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>

            <View style={styles.rules}>
              {section.content.map((rule, index) => (
                <View
                  key={`${section.title}-${index}`}
                  style={styles.ruleRow}
                >
                  <Text style={styles.bullet}>•</Text>

                  <Text style={styles.ruleText}>
                    {rule}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.md,
  },

  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
  },

  pressed: {
    opacity: 0.6,
  },

  toggleText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },

  toggleIcon: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  sections: {
    gap: spacing.lg,
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    color: colors.primaryDark,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  rules: {
    gap: spacing.sm,
  },

  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },

  bullet: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  ruleText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 21,
  },
});