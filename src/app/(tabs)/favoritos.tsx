import { StyleSheet, View } from 'react-native';

import { AppText, PosterCard, Screen, SectionHeader } from '@/src/components';
import { contentLibrary } from '@/src/data/content';
import { theme } from '@/theme';

const favorites = contentLibrary.filter((item) => item.favorite);

export default function FavoritesScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Favoritos"
        subtitle="Sua selecao pessoal, com foco rapido em disponibilidade nas plataformas."
      />

      <View style={styles.summaryCard}>
        <AppText style={styles.summaryTitle}>3 titulos salvos estao em servicos que voce assina</AppText>
        <AppText style={styles.summaryText}>
          Prioridade hoje: continue de onde parou ou explore algo proximo do seu gosto.
        </AppText>
      </View>

      <View style={styles.list}>
        {favorites.map((item) => (
          <PosterCard key={item.id} item={item} compact />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: '#1b1422',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: '#8A2BE233',
    padding: theme.spacing.lg,
    gap: 8,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  summaryText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 22,
  },
  list: {
    gap: theme.spacing.md,
  },
});
