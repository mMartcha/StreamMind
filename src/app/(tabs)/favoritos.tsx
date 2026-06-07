import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppText, PosterCard, Screen, SectionHeader } from "@/src/components";
import {
  CatalogContentItem,
  getUserLists,
  toContentItemFromUserList,
} from "@/src/services/api";
import { theme } from "@/theme";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<CatalogContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedFavorites, setHasLoadedFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadFavorites() {
        try {
          setIsLoading(!hasLoadedFavorites);
          setError(null);

          const data = await getUserLists("FAVORITE");

          if (isActive) {
            setFavorites(data.map(toContentItemFromUserList));
          }
        } catch {
          if (isActive) {
            setFavorites([]);
            setError("Não foi possível carregar seus favoritos agora.");
          }
        } finally {
          if (isActive) {
            setHasLoadedFavorites(true);
            setIsLoading(false);
          }
        }
      }

      loadFavorites();

      return () => {
        isActive = false;
      };
    }, [hasLoadedFavorites]),
  );

  const shouldShowInitialLoading = isLoading && !hasLoadedFavorites;

  return (
    <Screen>
      <SectionHeader
        title="Favoritos"
        subtitle="Sua seleção pessoal, com foco rápido em disponibilidade nas plataformas."
      />

      {shouldShowInitialLoading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.colors.primarySoft} />
        </View>
      )}
      {error && <AppText style={styles.feedback}>{error}</AppText>}
      {!shouldShowInitialLoading && !error && favorites.length === 0 && (
        <AppText style={styles.feedback}>Nenhum favorito salvo ainda.</AppText>
      )}

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
    backgroundColor: "#1b1422",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#8A2BE233",
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
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xl,
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
  },
});
