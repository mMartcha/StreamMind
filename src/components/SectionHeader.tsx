import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    gap: 6,
    borderWidth:1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    borderColor: theme.colors.primarySoft,
    backgroundColor:theme.colors.surfaceGlass,
    alignSelf: 'flex-start',

  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontWeight: theme.fonts.bold,
  },
  sectionSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
  },
});
