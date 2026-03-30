import { StyleSheet, Text, View } from 'react-native';

import { PosterCard, Screen, SectionHeader } from '@/src/components/ui';
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
        <Text style={styles.summaryTitle}>3 titulos salvos estao em servicos que voce assina</Text>
        <Text style={styles.summaryText}>
          Prioridade hoje: continue de onde parou ou explore algo proximo do seu gosto.
        </Text>
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
    fontWeight: theme.fonts.bold,
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
