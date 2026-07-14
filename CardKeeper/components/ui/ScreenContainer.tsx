import type { PropsWithChildren } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
}>;

export function ScreenContainer({
  children,
  scrollable = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  if (scrollable) {
    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom:
                spacing.lg + insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.fixedContent,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  fixedContent: {
    paddingHorizontal: spacing.lg,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
});