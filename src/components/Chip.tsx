import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { theme } from '@/theme';

export function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <AppText style={[styles.chipText, active && styles.chipTextActive]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.chip,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: '#221330',
    borderColor: '#8A2BE288',
  },
  chipText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.medium,
  },
  chipTextActive: {
    color: theme.colors.primarySoft,
  },
});
