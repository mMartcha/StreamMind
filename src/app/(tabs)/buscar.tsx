import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppText, PosterCard, Screen } from "@/src/components";
import {
  CatalogContentItem,
  searchCatalog,
  toContentItem,
} from "@/src/services/api";
import { theme } from "@/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const trimmedQuery = query.trim();
  const hasResults = results.length > 0;

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
          setError("Não foi possível buscar no catálogo agora.");
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
      <View style={styles.hero}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <View style={styles.heroIcon}>
            <Ionicons
              name="search"
              size={24}
              color={theme.colors.primarySoft}
            />
          </View>
          <AppText style={styles.heroTitle}>Buscar</AppText>
        </View>

        <View style={styles.heroText}>
          <AppText style={styles.heroSubtitle}>
            Encontre filmes e séries pelo título, gênero ou clima do momento.
          </AppText>
        </View>
      </View>

      <View
        style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}
      >
        <Ionicons
          name="search"
          size={19}
          color={
            isSearchFocused ? theme.colors.primarySoft : theme.colors.textSoft
          }
        />
        <TextInput
          placeholder="Busque por título, gênero ou clima"
          placeholderTextColor={theme.colors.textSoft}
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery("")} style={styles.clearButton}>
            <Ionicons name="close" size={16} color={theme.colors.text} />
          </Pressable>
        )}
      </View>

      {!trimmedQuery && (
        <View style={styles.emptyState}>
          <Ionicons
            name="sparkles-outline"
            size={22}
            color={theme.colors.primarySoft}
          />
          <AppText style={styles.emptyTitle}>Comece sua descoberta</AppText>
          <AppText style={styles.emptyText}>
            Digite um título para buscar no catálogo e encontrar onde assistir.
          </AppText>
        </View>
      )}

      {isLoading && (
        <View style={styles.feedbackCard}>
          <ActivityIndicator color={theme.colors.primarySoft} />
          <AppText style={styles.feedback}>Buscando no catálogo...</AppText>
        </View>
      )}

      {error && (
        <View style={styles.feedbackCard}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={theme.colors.danger}
          />
          <AppText style={styles.feedback}>{error}</AppText>
        </View>
      )}

      {trimmedQuery && !isLoading && !error && results.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="film-outline"
            size={22}
            color={theme.colors.textSoft}
          />
          <AppText style={styles.emptyTitle}>
            Nenhum resultado encontrado
          </AppText>
          <AppText style={styles.emptyText}>
            Tente outro título, gênero ou uma palavra mais curta.
          </AppText>
        </View>
      )}

      {hasResults && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <AppText style={styles.label}>Resultados</AppText>
            <AppText style={styles.resultsCount}>
              {results.length} {results.length === 1 ? "título" : "títulos"}
            </AppText>
          </View>
          <View style={styles.grid}>
            {results.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <PosterCard item={item} compact />
              </View>
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: theme.spacing.md,
    backgroundColor: "#19131f",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#8A2BE244",
    padding: theme.spacing.lg,
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(202, 152, 255, 0.12)",
    borderWidth: 1,
    borderColor: "#8A2BE266",
  },
  heroText: {
    gap: 6,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.xl,
    fontFamily: theme.fonts.family.bold,
  },
  heroSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 21,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 56,
    backgroundColor: "#1a1124",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "#8A2BE244",
    paddingHorizontal: 16,
  },
  searchBarFocused: {
    borderColor: theme.colors.primarySoft,
    backgroundColor: "#21142f",
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.regular,
  },
  clearButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  genrePanel: {
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  panelHeader: {
    gap: 4,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.semibold,
  },
  panelHint: {
    color: theme.colors.textSoft,
    fontSize: theme.fonts.xsm,
  },
  chips: {
    gap: 10,
    paddingRight: theme.spacing.lg,
  },
  resultsSection: {
    gap: theme.spacing.md,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  resultsCount: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.bold,
  },
  grid: {
    gap: theme.spacing.md,
  },
  gridItem: {
    width: "100%",
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
    flex: 1,
  },
  feedbackCard: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
    textAlign: "center",
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
    textAlign: "center",
  },
});
