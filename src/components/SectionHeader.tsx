import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { AppText } from './AppText';

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <>
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>{title}</AppText>
      </View>
        {subtitle ? <AppText style={styles.sectionSubtitle}>{subtitle}</AppText> : null}
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    gap: 6,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    borderColor: theme.colors.primarySoft,
    backgroundColor: theme.colors.surfaceGlass,
    alignItems:'center'
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  sectionSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    
  },
});
