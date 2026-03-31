import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, HorizontalRail, SectionHeader, StreamingRow } from '@/src/components';
import { contentLibrary } from '@/src/data/content';
import { theme } from '@/theme';

export default function ContentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const item = contentLibrary.find((entry) => entry.id === id) ?? contentLibrary[0];
  const related = contentLibrary.filter((entry) => entry.id !== item.id).slice(0, 4);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.posterWrap}>
          <Image source={{ uri: item.backdrop }} style={styles.backdrop} contentFit="cover" />
          <View style={styles.posterShade} />
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
          </Pressable>
          <View style={styles.posterContent}>
            <AppText style={styles.title}>{item.title}</AppText>
            <AppText style={styles.meta}>
              {item.type} • {item.year} • {item.duration}
            </AppText>
            <AppText style={styles.genres}>{item.genre.join('  •  ')}</AppText>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <AppText style={styles.scoreLabel}>IMDb</AppText>
              <AppText style={styles.scoreValue}>{item.imdb}</AppText>
            </View>
            <View style={styles.scoreCard}>
              <AppText style={styles.scoreLabel}>Status</AppText>
              <AppText style={styles.scoreValueMuted}>Disponivel</AppText>
            </View>
          </View>

          <View style={styles.block}>
            <SectionHeader title="Curadoria IA" subtitle="Resumo pensado para ajudar na decisao, nao para reproduzir o conteudo." />
            <AppText style={styles.paragraph}>{item.aiSynopsis}</AppText>
          </View>

          <View style={styles.block}>
            <SectionHeader title="Disponivel em" subtitle="A tela de detalhes funciona como ponte para os servicos externos." />
            <StreamingRow platforms={item.availableOn} />
          </View>

          <View style={styles.block}>
            <SectionHeader title="Elenco" />
            <View style={styles.castRow}>
              {item.cast.map((person) => (
                <View key={person} style={styles.castChip}>
                  <AppText style={styles.castText}>{person}</AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <SectionHeader title="Relacionados" subtitle="Continuando sua descoberta dentro do StreamMind." />
            <HorizontalRail items={related} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  posterWrap: {
    minHeight: 390,
    justifyContent: 'space-between',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  posterShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.42)',
  },
  backButton: {
    marginTop: 54,
    marginLeft: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  posterContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontFamily: theme.fonts.family.bold,
  },
  meta: {
    color: '#ece4f9',
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.medium,
  },
  genres: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
  },
  panel: {
    marginTop: -20,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 6,
  },
  scoreLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
  },
  scoreValue: {
    color: theme.colors.imdb,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  scoreValueMuted: {
    color: theme.colors.success,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  block: {
    gap: 12,
  },
  paragraph: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
    lineHeight: 24,
  },
  castRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  castChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  castText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.medium,
  },
});
