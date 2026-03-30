import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ContentItem, platformMeta } from '@/src/data/content';
import { theme } from '@/theme';

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  if (!scroll) {
    return <View style={styles.screen}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

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

export function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </View>
  );
}

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

export function StreamingRow({ platforms }: { platforms: ContentItem['availableOn'] }) {
  return (
    <View style={styles.streamingRow}>
      {platforms.map((platform) => (
        <PlatformBadge key={platform} platform={platform} />
      ))}
    </View>
  );
}

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

export function HeroCard({ item }: { item: ContentItem }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/content/${item.id}`)} style={styles.heroCard}>
      <Image source={{ uri: item.backdrop }} style={styles.heroImage} contentFit="cover" />
      <View style={styles.heroShade} />
      <View style={styles.heroContent}>
        <Text style={styles.heroEyebrow}>Destaque do dia</Text>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroDescription}>{item.shortSynopsis}</Text>
        <View style={styles.heroInfoRow}>
          <Text style={styles.heroInfo}>{item.year}</Text>
          <Text style={styles.heroInfo}>{item.duration}</Text>
          <Text style={styles.heroInfo}>IMDb {item.imdb}</Text>
        </View>
        <Text style={styles.heroSectionTitle}>Onde assistir</Text>
        <StreamingRow platforms={item.availableOn} />
      </View>
    </Pressable>
  );
}

export function HorizontalRail({ items }: { items: ContentItem[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}>
      {items.map((item) => (
        <PosterCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  sectionHeader: {
    gap: 6,
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
    fontWeight: theme.fonts.medium,
  },
  chipTextActive: {
    color: theme.colors.primarySoft,
  },
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
  streamingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
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
    backgroundColor: theme.colors.surface,
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
  heroCard: {
    minHeight: 420,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.38)',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: theme.spacing.xl,
    gap: 10,
  },
  heroEyebrow: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.sm,
    fontWeight: theme.fonts.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: theme.fonts.xl,
    fontWeight: theme.fonts.bold,
  },
  heroDescription: {
    color: '#ece4f9',
    fontSize: theme.fonts.md,
    lineHeight: 24,
  },
  heroInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  heroInfo: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    fontWeight: theme.fonts.medium,
  },
  heroSectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontWeight: theme.fonts.semibold,
    marginTop: 6,
  },
  rail: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
});
