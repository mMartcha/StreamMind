import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Chip, HeroCard, HorizontalRail, Screen, SectionHeader } from '@/src/components';
import { CatalogContentItem, getTrending, toContentItem } from '@/src/services/api';
import { theme } from '@/theme';

export default function HomeScreen() {
  const [items, setItems] = useState<CatalogContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrending() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTrending();

        if (isMounted) {
          setItems(data.map(toContentItem));
        }
      } catch {
        if (isMounted) {
          setError('Nao foi possivel carregar o catalogo agora.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTrending();

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = items[0];
  const recommended = items.slice(0, 6);
  const trending = items;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={styles.brand}>
            Stream
          <AppText style={styles.innerBrand}>
            Mind
          </AppText>

        </AppText>
        <AppText style={styles.subtitle}>Seu guia inteligente para descobrir o que assistir.</AppText>
      </View>

      {isLoading && <AppText style={styles.feedback}>Carregando catalogo...</AppText>}
      {error && <AppText style={styles.feedback}>{error}</AppText>}
      {featured && <HeroCard item={featured} />}

      <View style={styles.section}>
          <SectionHeader
            title="Generos em destaque"
            subtitle="Atalhos rapidos para explorar sem perder tempo."
          />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {['Suspense', 'Familia', 'Drama', 'Animacao', 'Acao', 'Ficcao Cientifica'].map((genre, index) => (
            <Chip key={genre} label={genre} active={index === 0} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Recomendados por IA"
          subtitle="Selecao baseada em clima, genero e padroes do seu perfil."
        />
        <HorizontalRail items={recommended} />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Em alta"
          subtitle="Titulos que estao puxando conversa agora."
        />
        <HorizontalRail items={trending} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  brand: {
    color: theme.colors.primary,
    fontSize: 34,
    // fontFamily: theme.fonts.family.bold,
    alignSelf: 'center',
  },
  innerBrand: {
    color: theme.colors.primary,
    fontSize: 34,
    fontFamily: theme.fonts.family.bold,
    alignSelf: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
  },
  section: {
    gap: theme.spacing.md,
  },
  chips: {
    gap: 10,
    paddingRight: theme.spacing.lg,
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
  },
});
