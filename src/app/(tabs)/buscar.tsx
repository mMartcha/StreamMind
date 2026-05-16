import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Chip, PosterCard, Screen, SectionHeader } from '@/src/components';
import { genres } from '@/src/data/content';
import { CatalogContentItem, searchCatalog, toContentItem } from '@/src/services/api';
import { theme } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trimmedQuery = query.trim();

  useEffect(() => {
    let isMounted = true;

    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await searchCatalog(trimmedQuery);

        if (isMounted) {
          setResults(data.map(toContentItem));
        }
      } catch {
        if (isMounted) {
          setError('Não foi possível buscar no catálogo agora.');
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }, 350);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [trimmedQuery]);

  return (
    <Screen>
      <SectionHeader
        title="Buscar"
        subtitle="Encontre filmes e séries e veja rapidamente onde estão disponíveis."
      />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={theme.colors.textSoft} />
        <TextInput
          placeholder="Busque por título, gênero ou clima"
          placeholderTextColor={theme.colors.textSoft}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.section}>
        <AppText style={styles.label}>Gêneros populares</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {genres.map((genre, index) => (
            <Chip key={genre} label={genre} active={index === 1} />
          ))}
        </ScrollView>
      </View>

      {!trimmedQuery && (
        <AppText style={styles.feedback}>Digite um título para buscar no catálogo.</AppText>
      )}
      {isLoading && <AppText style={styles.feedback}>Buscando...</AppText>}
      {error && <AppText style={styles.feedback}>{error}</AppText>}
      {trimmedQuery && !isLoading && !error && results.length === 0 && (
        <AppText style={styles.feedback}>Nenhum resultado encontrado.</AppText>
      )}

      <View style={styles.grid}>
        {results.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            <PosterCard item={item} compact />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.regular,
  },
  section: {
    gap: 10,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.semibold,
  },
  chips: {
    gap: 10,
    paddingRight: theme.spacing.lg,
  },
  grid: {
    gap: theme.spacing.md,
  },
  gridItem: {
    width: '100%',
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
  },
});
