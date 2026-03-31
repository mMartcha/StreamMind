import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ContentItem } from '@/src/data/content';
import { theme } from '@/theme';

import { AppText } from './AppText';
import { StreamingRow } from './StreamingRow';

export function HeroCard({ item }: { item: ContentItem }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/content/${item.id}`)} style={styles.heroCard}>
      <Image source={{ uri: item.backdrop }} style={styles.heroImage} contentFit="cover" />
      <View style={styles.heroShade} />
      <View style={styles.heroContent}>
        <AppText style={styles.heroEyebrow}>Destaque do dia</AppText>
        <AppText style={styles.heroTitle}>{item.title}</AppText>
        <AppText style={styles.heroDescription}>{item.shortSynopsis}</AppText>
        <View style={styles.heroInfoRow}>
          <AppText style={styles.heroInfo}>{item.year}</AppText>
          <AppText style={styles.heroInfo}>{item.duration}</AppText>
          <AppText style={styles.heroInfo}>IMDb {item.imdb}</AppText>
        </View>
        <AppText style={styles.heroSectionTitle}>Onde assistir</AppText>
        <StreamingRow platforms={item.availableOn} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    fontFamily: theme.fonts.family.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: theme.fonts.xl,
    fontFamily: theme.fonts.family.bold,
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
    fontFamily: theme.fonts.family.medium,
  },
  heroSectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.semibold,
    marginTop: 6,
  },
});
