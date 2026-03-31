import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ContentItem, platformMeta } from '@/src/data/content';
import { theme } from '@/theme';

import { AppText } from './AppText';

export function PosterCard({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/content/${item.id}`)}
      style={compact ? styles.posterCardCompact : styles.posterCard}>

      <View style={styles.posterMedia}>
        <Image
          source={{ uri: item.poster }}
          style={compact ? [styles.posterImage, styles.posterImageCompact] : styles.posterImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.posterBody}>
        <View style={styles.posterTopRow}>
          <View style={styles.imdbPill}>
            <Ionicons name="star" size={12} color="#111" />
            <AppText style={styles.imdbText}>{item.imdb}</AppText>
          </View>
          <View style={styles.typePill}>
            <AppText style={styles.typePillText}>{item.type}</AppText>
          </View>
        </View>

        <View style={styles.posterMeta}>
          <AppText numberOfLines={1} style={styles.posterTitle}>
            {item.title}
          </AppText>
          <AppText style={styles.posterSubtitle}>
            {item.year} • {item.genre[0]}
          </AppText>
          <View style={styles.platformTinyRow}>
            {item.availableOn.slice(0, 3).map((platform) => (
              <View
                key={platform}
                style={[
                  styles.platformTiny,
                  { backgroundColor: platformMeta[platform].color },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  posterCard: {
    width: 190,
    minHeight: 286,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  posterCardCompact: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
    maxHeight: 200,
  },
  posterMedia: {
    backgroundColor: '#222',
  },
  posterImage: {
    width: '100%',
    height: 170,
  },
  posterImageCompact: {
    height: 60,
  },
  posterBody: {
    flex: 1,
    gap: 12,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceGlass,
  },
  posterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imdbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.imdb,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  imdbText: {
    color: '#111',
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.bold,
  },
  typePill: {
    backgroundColor: theme.colors.surfaceGlass,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  typePillText: {
    color: theme.colors.text,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.semibold,
  },
  posterMeta: {
    gap: 6,
    
  },
  posterTitle: {
    color: '#fff',
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  posterSubtitle: {
    color: '#dfd7ea',
    fontSize: theme.fonts.sm,
  },
  platformTinyRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  platformTiny: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
