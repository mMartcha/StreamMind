import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ContentItem, platformMeta } from '@/src/data/content';
import { theme } from '@/theme';

export function PosterCard({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/content/${item.id}`)}
      style={[styles.posterCard, compact && styles.posterCardCompact]}>
      <View style={styles.posterMedia}>
        <Image
          source={{ uri: item.poster }}
          style={[styles.posterImage, compact && styles.posterImageCompact]}
          contentFit="cover"
        />
      </View>

      <View style={styles.posterBody}>
        <View style={styles.posterTopRow}>
          <View style={styles.imdbPill}>
            <Ionicons name="star" size={12} color="#111" />
            <Text style={styles.imdbText}>{item.imdb}</Text>
          </View>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{item.type}</Text>
          </View>
        </View>

        <View style={styles.posterMeta}>
          <Text numberOfLines={1} style={styles.posterTitle}>
            {item.title}
          </Text>
          <Text style={styles.posterSubtitle}>
            {item.year} • {item.genre[0]}
          </Text>
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
    width: '100%',
    minHeight: 220,
  },
  posterMedia: {
    backgroundColor: '#222',
  },
  posterImage: {
    width: '100%',
    height: 170,
  },
  posterImageCompact: {
    height: 118,
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
    fontWeight: theme.fonts.bold,
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
    fontWeight: theme.fonts.semibold,
  },
  posterMeta: {
    gap: 6,
  },
  posterTitle: {
    color: '#fff',
    fontSize: theme.fonts.md,
    fontWeight: theme.fonts.bold,
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
