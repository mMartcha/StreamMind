import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, HorizontalRail, SectionHeader } from "@/src/components";
import {
  CatalogContentItem,
  ProvidersResponse,
  StreamingProvider,
  UserTitleItem,
  UserTitleStatus,
  addUserListItem,
  getMovieDetails,
  getMovieProviders,
  getTrending,
  getTvDetails,
  getTvProviders,
  getUserLists,
  parseContentRouteId,
  removeUserListItemById,
  removeUserListItemByTitle,
  toContentItem,
  toUserTitleMediaType,
} from "@/src/services/api";
import {
  UserStreamingProvider,
  hydrateSubscribedUserStreamings,
  useSubscribedUserStreamings,
} from "@/src/services/user-streamings";
import { theme } from "@/theme";

const userListActions: {
  status: UserTitleStatus;
  label: string;
  activeLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    status: "FAVORITE",
    label: "Favoritar",
    activeLabel: "Favorito",
    icon: "heart",
    inactiveIcon: "heart-outline",
  },
  {
    status: "WATCHLIST",
    label: "Quero assistir",
    activeLabel: "Na lista",
    icon: "bookmark",
    inactiveIcon: "bookmark-outline",
  },
  {
    status: "WATCHED",
    label: "Assistido",
    activeLabel: "Assistido",
    icon: "checkmark-circle",
    inactiveIcon: "checkmark-circle-outline",
  },
];

type UserListState = Record<UserTitleStatus, UserTitleItem | null>;
type StreamingProviderWithSubscription = StreamingProvider & {
  isSubscribed: boolean;
};

const emptyUserListState: UserListState = {
  FAVORITE: null,
  WATCHLIST: null,
  WATCHED: null,
};

function normalizeProviderName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function isSubscribedProvider(
  provider: StreamingProvider,
  subscribedStreamings: UserStreamingProvider[],
) {
  const normalizedProviderName = normalizeProviderName(provider.name);

  return subscribedStreamings.some((streaming) => {
    if (provider.id === streaming.providerId) {
      return true;
    }

    const normalizedStreamingName = normalizeProviderName(
      streaming.providerName,
    );

    return (
      normalizedProviderName === normalizedStreamingName ||
      normalizedProviderName.includes(normalizedStreamingName) ||
      normalizedStreamingName.includes(normalizedProviderName)
    );
  });
}

function withSubscriptionFlag(
  providers: StreamingProvider[],
  subscribedStreamings: UserStreamingProvider[],
): StreamingProviderWithSubscription[] {
  return providers.map((provider) => ({
    ...provider,
    isSubscribed: isSubscribedProvider(provider, subscribedStreamings),
  }));
}

const contentStatusTranslations: Record<string, string> = {
  CANCELED: "Cancelado",
  Canceled: "Cancelado",
  ENDED: "Encerrado",
  Ended: "Encerrado",
  FAVORITE: "Favorito",
  "In Production": "Em produção",
  "Post Production": "Pós-produção",
  Planned: "Planejado",
  Pilot: "Piloto",
  Released: "Lançado",
  "Returning Series": "Em exibição",
  Rumored: "Rumorado",
  WATCHED: "Assistido",
  WATCHLIST: "Na lista",
};

function translateContentStatus(status?: string) {
  if (!status) {
    return undefined;
  }

  return contentStatusTranslations[status] ?? status;
}

export default function ContentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const subscribedStreamings = useSubscribedUserStreamings();

  const [item, setItem] = useState<CatalogContentItem | null>(null);
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [related, setRelated] = useState<CatalogContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userListState, setUserListState] =
    useState<UserListState>(emptyUserListState);
  const [pendingStatus, setPendingStatus] = useState<UserTitleStatus | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const routeInfo = useMemo(() => parseContentRouteId(id), [id]);

  useEffect(() => {
    void hydrateSubscribedUserStreamings();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDetails() {
      if (!routeInfo) {
        setError("Conteúdo não encontrado.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const details =
          routeInfo.mediaType === "movie"
            ? await getMovieDetails(routeInfo.tmdbId)
            : await getTvDetails(routeInfo.tmdbId);

        if (isMounted) {
          setItem(toContentItem(details));
        }

        const [providersResult, trendingResult] = await Promise.allSettled([
          routeInfo.mediaType === "movie"
            ? getMovieProviders(routeInfo.tmdbId)
            : getTvProviders(routeInfo.tmdbId),
          getTrending(),
        ]);

        if (!isMounted) {
          return;
        }

        setProviders(
          providersResult.status === "fulfilled" ? providersResult.value : null,
        );
        setRelated(
          trendingResult.status === "fulfilled"
            ? trendingResult.value
                .filter((entry) => entry.tmdbId !== routeInfo.tmdbId)
                .slice(0, 4)
                .map(toContentItem)
            : [],
        );
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar os detalhes agora.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      isMounted = false;
    };
  }, [routeInfo]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadUserLists() {
        if (!routeInfo) {
          return;
        }

        try {
          const mediaType = toUserTitleMediaType(routeInfo.mediaType);
          const lists = await getUserLists();

          if (!isActive) {
            return;
          }

          setUserListState({
            FAVORITE:
              lists.find(
                (entry) =>
                  entry.tmdbId === routeInfo.tmdbId &&
                  entry.mediaType === mediaType &&
                  entry.status === "FAVORITE",
              ) ?? null,
            WATCHLIST:
              lists.find(
                (entry) =>
                  entry.tmdbId === routeInfo.tmdbId &&
                  entry.mediaType === mediaType &&
                  entry.status === "WATCHLIST",
              ) ?? null,
            WATCHED:
              lists.find(
                (entry) =>
                  entry.tmdbId === routeInfo.tmdbId &&
                  entry.mediaType === mediaType &&
                  entry.status === "WATCHED",
              ) ?? null,
          });
        } catch {
          if (isActive) {
            setUserListState(emptyUserListState);
          }
        }
      }

      loadUserLists();

      return () => {
        isActive = false;
      };
    }, [routeInfo]),
  );

  async function toggleUserListStatus(status: UserTitleStatus) {
    if (!item) {
      return;
    }

    const mediaType = toUserTitleMediaType(item.mediaType);
    const currentItem = userListState[status];

    try {
      setPendingStatus(status);

      if (currentItem) {
        if (currentItem.id) {
          await removeUserListItemById(currentItem.id);
        } else {
          await removeUserListItemByTitle({
            tmdbId: item.tmdbId,
            mediaType,
            status,
          });
        }

        setUserListState((current) => ({ ...current, [status]: null }));
        return;
      }

      const createdItem = await addUserListItem({
        tmdbId: item.tmdbId,
        mediaType,
        status,
        title: item.title,
        overview: item.shortSynopsis,
        posterUrl: item.poster,
        backdropUrl: item.backdrop,
        releaseDate: item.releaseDate,
        voteAverage: item.voteAverage,
      });

      setUserListState((current) => ({ ...current, [status]: createdItem }));
    } catch {
      setError("Não foi possível atualizar sua lista agora.");
    } finally {
      setPendingStatus(null);
    }
  }

  const flatrateProviders = useMemo(
    () => withSubscriptionFlag(providers?.flatrate ?? [], subscribedStreamings),
    [providers?.flatrate, subscribedStreamings],
  );
  const translatedStatus = translateContentStatus(item?.status);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: theme.spacing.xxl + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.posterWrap}>
          {item && (
            <Image
              source={{ uri: item.backdrop }}
              style={styles.backdrop}
              contentFit="cover"
            />
          )}
          <View style={styles.posterShade} />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backButton, { marginTop: insets.top + 14 }]}
          >
            <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
          </Pressable>
          {item && (
            <View style={styles.posterContent}>
              <AppText style={styles.title}>{item.title}</AppText>
              <AppText style={styles.meta}>
                {item.type} - {item.year} - {item.duration}
              </AppText>
              <AppText style={styles.genres}>
                {item.genre.join("  -  ")}
              </AppText>
            </View>
          )}
        </View>

        <View style={styles.panel}>
          {isLoading && (
            <AppText style={styles.feedback}>Carregando detalhes...</AppText>
          )}
          {error && <AppText style={styles.feedback}>{error}</AppText>}

          {item && (
            <>
              <View style={styles.scoreRow}>
                <View style={styles.scoreCard}>
                  <AppText style={styles.scoreLabel}>TMDB</AppText>
                  <AppText style={styles.scoreValue}>{item.imdb}</AppText>
                </View>
                <View style={styles.scoreCard}>
                  <AppText style={styles.scoreLabel}>Status</AppText>
                  <AppText style={styles.scoreValueMuted}>
                    {translatedStatus ?? item.duration}
                  </AppText>
                </View>
              </View>

              <View style={styles.actionRow}>
                {userListActions.map((action) => {
                  const isActive = Boolean(userListState[action.status]);
                  const isPending = pendingStatus === action.status;

                  return (
                    <Pressable
                      key={action.status}
                      disabled={Boolean(pendingStatus)}
                      onPress={() => toggleUserListStatus(action.status)}
                      style={[
                        styles.actionButton,
                        isActive && styles.actionButtonActive,
                        isPending && styles.actionButtonPending,
                      ]}
                    >
                      <Ionicons
                        name={isActive ? action.icon : action.inactiveIcon}
                        size={18}
                        color={isActive ? "#111" : theme.colors.text}
                      />
                      <AppText
                        style={[
                          styles.actionText,
                          isActive && styles.actionTextActive,
                        ]}
                      >
                        {isPending
                          ? "..."
                          : isActive
                            ? action.activeLabel
                            : action.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.block}>
                <SectionHeader
                  title="Disponível em"
                  subtitle="A tela de detalhes funciona como ponte para os serviços externos."
                />
                {flatrateProviders.length > 0 ? (
                  <ProviderRow providers={flatrateProviders} />
                ) : (
                  <AppText style={styles.paragraph}>
                    Não disponível por assinatura no Brasil.
                  </AppText>
                )}
              </View>
              <View style={styles.block}>
                <SectionHeader
                  title="Sinopse"
                  subtitle="Resumo oficial carregado pelo catálogo."
                />
                <AppText style={styles.paragraph}>{item.aiSynopsis}</AppText>
              </View>

              {related.length > 0 && (
                <View style={styles.block}>
                  <SectionHeader
                    title="Relacionados"
                    subtitle="Continuando sua descoberta dentro do StreamMind."
                  />
                  <HorizontalRail items={related} />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function ProviderRow({
  providers,
}: {
  providers: StreamingProviderWithSubscription[];
}) {
  return (
    <View style={styles.castRow}>
      {providers.map((provider) => (
        <View
          key={provider.id}
          style={[
            styles.castChip,
            provider.isSubscribed && styles.castChipSubscribed,
          ]}
        >
          {provider.logoUrl ? (
            <Image
              source={{ uri: provider.logoUrl }}
              style={styles.providerLogo}
              contentFit="contain"
            />
          ) : null}
          <AppText style={styles.castText}>{provider.name}</AppText>
        </View>
      ))}
    </View>
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
    justifyContent: "space-between",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  posterShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.42)",
  },
  backButton: {
    marginTop: 54,
    marginLeft: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  posterContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: 8,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontFamily: theme.fonts.family.bold,
  },
  meta: {
    color: "#ece4f9",
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
    flexDirection: "row",
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
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primarySoft,
  },
  actionButtonPending: {
    opacity: 0.72,
  },
  actionText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  actionTextActive: {
    color: "#111",
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
    flexWrap: "wrap",
    gap: 10,
  },
  castChip: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  castChipSubscribed: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  castText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.medium,
  },
  providerLogo: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
  },
});
