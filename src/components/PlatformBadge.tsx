import { Text, Pressable, StyleSheet, View, Linking } from 'react-native';

import { platformMeta } from '@/src/data/content';
import { theme } from '@/theme';

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
        <Text style={styles.platformDotText}>{meta.short}</Text>
      </View>
      <Text style={styles.platformText}>{platform}</Text>
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
    fontWeight: theme.fonts.bold,
  },
  platformText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontWeight: theme.fonts.semibold,
  },
});
