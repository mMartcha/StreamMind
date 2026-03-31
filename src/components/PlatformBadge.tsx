import { Pressable, StyleSheet, View, Linking } from 'react-native';

import { platformMeta } from '@/src/data/content';
import { theme } from '@/theme';

import { AppText } from './AppText';

export function PlatformBadge({ platform }: { platform: keyof typeof platformMeta }) {
  const meta = platformMeta[platform];

  return (
    <Pressable
      onPress={() => Linking.openURL(meta.url)}
      style={[
        styles.platformBadge,
        { backgroundColor: `${meta.color}22`, borderColor: `${meta.color}55` },
      ]}>
      <View style={[styles.platformDot, { backgroundColor: meta.color }]}>
        <AppText style={styles.platformDotText}>{meta.short}</AppText>
      </View>
      <AppText style={styles.platformText}>{platform}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  platformDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformDotText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: theme.fonts.family.bold,
  },
  platformText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
});
