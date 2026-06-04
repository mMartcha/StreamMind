import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, Screen } from "@/src/components";
import {
  getUserLists,
  toCatalogMediaType,
  type UserTitleItem,
} from "@/src/services/api";
import {
  generateRecommendations,
  type RecommendationItem,
  type RecommendationMediaType,
} from "@/src/services/recommendations.service";
import { theme } from "@/theme";

type WatchedMovie = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterUrl: string | null;
  genres?: string[];
};

const desiredGenres = [
  "Ação",
  "Aventura",
  "Comédia",
  "Drama",
  "Ficção cientifica",
  "Terror",
  "Suspense",
  "Romance",
  "Animação",
  "Documentário",
];

const desiredMediaTypes: {
  label: string;
  value: RecommendationMediaType;
}[] = [
  { label: "Filme", value: "movie" },
  { label: "Série", value: "tv" },
];

function toWatchedMovie(item: UserTitleItem): WatchedMovie {
  return {
    tmdbId: item.tmdbId,
    mediaType: toCatalogMediaType(item.mediaType),
    title: item.title,
    posterUrl: item.posterUrl || null,
  };
}

function getMediaKey(
  item: Pick<RecommendationItem | WatchedMovie, "mediaType" | "tmdbId">,
) {
  return `${item.mediaType}-${item.tmdbId}`;
}

function truncateText(text: string | null | undefined, maxLength = 200) {
  if (!text) {
    return "Sinopse não disponível.";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export default function AIScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [isWatchedLoading, setIsWatchedLoading] = useState(true);
  const [watchedError, setWatchedError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovieKeys, setSelectedMovieKeys] = useState<string[]>([]);
  const [desiredGenre, setDesiredGenre] = useState<string | null>(null);
  const [desiredMediaType, setDesiredMediaType] =
    useState<RecommendationMediaType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadWatchedMovies() {
        try {
          setIsWatchedLoading(true);
          setWatchedError(null);
          const watched = await getUserLists("WATCHED");

          if (isActive) {
            setWatchedMovies(watched.map(toWatchedMovie));
          }
        } catch {
          if (isActive) {
            setWatchedMovies([]);
            setWatchedError(
              "Não foi possível carregar seus títulos assistidos agora.",
            );
          }
        } finally {
          if (isActive) {
            setIsWatchedLoading(false);
          }
        }
      }

      loadWatchedMovies();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const selectedMovies = useMemo(
    () =>
      watchedMovies.filter((movie) =>
        selectedMovieKeys.includes(`${movie.mediaType}-${movie.tmdbId}`),
      ),
    [selectedMovieKeys, watchedMovies],
  );

  const canGenerate =
    selectedMovies.length > 0 &&
    Boolean(desiredGenre) &&
    Boolean(desiredMediaType) &&
    !isGenerating;

  function openRecommendationModal() {
    setRecommendationError(null);
    setIsModalVisible(true);
  }

  function closeRecommendationModal() {
    if (!isGenerating) {
      setIsModalVisible(false);
    }
  }

  function toggleMovie(movie: WatchedMovie) {
    const movieKey = `${movie.mediaType}-${movie.tmdbId}`;

    setSelectedMovieKeys((current) => {
      if (current.includes(movieKey)) {
        return current.filter((key) => key !== movieKey);
      }

      if (current.length >= 2) {
        return current;
      }

      return [...current, movieKey];
    });
  }

  async function generateRecommendation() {
    if (
      selectedMovies.length < 1 ||
      selectedMovies.length > 2 ||
      !desiredGenre ||
      !desiredMediaType
    ) {
      setRecommendationError(
        "Selecione 1 ou 2 títulos, um gênero e o tipo de conteúdo para continuar.",
      );
      return;
    }

    setIsGenerating(true);
    setRecommendationError(null);

    try {
      const result = await generateRecommendations({
        selectedMovies: selectedMovies.map((movie) => ({
          tmdbId: movie.tmdbId,
          mediaType: movie.mediaType,
          title: movie.title,
        })),
        desiredGenre,
        desiredMediaType,
      });

      setRecommendations(
        result.recommendations
          .filter(
            (recommendation) => recommendation.mediaType === desiredMediaType,
          )
          .slice(0, 2),
      );
      setIsModalVisible(false);
    } catch {
      setRecommendationError(
        "Não foi possível gerar recomendações agora. Tente novamente.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function openRecommendedDetails(recommendation: RecommendationItem) {
    router.push(
      `/content/${recommendation.mediaType}-${recommendation.tmdbId}`,
    );
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.streamMateHero}>
            <View style={styles.heroTopRow}>
              <Pressable onPress={goBack} style={styles.backButton}>
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={theme.colors.text}
                />
              </Pressable>
              <View style={styles.aiBadge}>
                <Ionicons
                  name="sparkles"
                  size={15}
                  color={theme.colors.primarySoft}
                />
                <AppText style={styles.aiBadgeText}>
                  Recomendações interativas
                </AppText>
              </View>
            </View>

            <View style={styles.heroIconWrap}>
              <Ionicons
                name="sparkles"
                size={26}
                color={theme.colors.primarySoft}
              />
            </View>

            <View style={styles.heroTextBlock}>
              <AppText style={styles.heroTitle}>
                Descubra o próximo título com o StreamMate
              </AppText>
              <AppText style={styles.heroText}>
                Escolha até 2 títulos assistidos, defina um gênero e receba uma
                recomendação personalizada com justificativa.
              </AppText>
            </View>

            <View style={styles.heroSteps}>
              {["Assistidos", "Gênero", "Explicação"].map((step, index) => (
                <View key={step} style={styles.heroStepChip}>
                  <AppText style={styles.heroStepNumber}>{index + 1}</AppText>
                  <AppText style={styles.heroStepText}>{step}</AppText>
                </View>
              ))}
            </View>

            <Pressable
              style={styles.primaryButton}
              onPress={openRecommendationModal}
            >
              <AppText style={styles.primaryButtonText}>
                Gerar recomendação personalizada
              </AppText>
              <Ionicons name="arrow-forward" size={17} color="#111" />
            </Pressable>
          </View>

          {recommendations.length > 0 ? (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.resultIcon}>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color={theme.colors.primarySoft}
                  />
                </View>
                <AppText style={styles.resultTitle}>
                  Recomendações da IA
                </AppText>
              </View>

              <AppText style={styles.resultText}>
                Com base nos títulos escolhidos e no gênero selecionado, a IA
                encontrou sugestões reais do catálogo para você assistir.
              </AppText>

              <View style={styles.recommendationList}>
                {recommendations.map((recommendation) => (
                  <Pressable
                    key={getMediaKey(recommendation)}
                    style={styles.recommendedMovie}
                    onPress={() => openRecommendedDetails(recommendation)}
                  >
                    {recommendation.posterUrl ? (
                      <Image
                        source={{ uri: recommendation.posterUrl }}
                        style={styles.recommendedPoster}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.recommendedPosterFallback}>
                        <Ionicons
                          name="film-outline"
                          size={24}
                          color={theme.colors.textMuted}
                        />
                      </View>
                    )}

                    <View style={styles.recommendedInfo}>
                      <AppText style={styles.recommendedTitle}>
                        {recommendation.title}
                      </AppText>
                      {recommendation.voteAverage !== null && (
                        <AppText style={styles.recommendedMeta}>
                          TMDB {recommendation.voteAverage.toFixed(1)}
                        </AppText>
                      )}
                      <AppText
                        numberOfLines={4}
                        ellipsizeMode="tail"
                        style={styles.recommendedOverview}
                      >
                        {truncateText(recommendation.overview)}
                      </AppText>
                      <AppText style={styles.recommendedReason}>
                        {recommendation.reason}
                      </AppText>
                      <View style={styles.detailsButton}>
                        <AppText style={styles.detailsButtonText}>
                          Ver detalhes
                        </AppText>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.colors.primarySoft}
                        />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyResultCard}>
              <Ionicons
                name="bulb-outline"
                size={22}
                color={theme.colors.primarySoft}
              />
              <AppText style={styles.emptyResultText}>
                Gere uma recomendação para ver aqui uma sugestão com
                justificativa.
              </AppText>
            </View>
          )}

          <AppText style={styles.footnote}>
            O StreamMind recomenda e direciona você para plataformas externas. O
            app não reproduz conteúdo.
          </AppText>
        </ScrollView>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeRecommendationModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeRecommendationModal}>
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={[
              styles.modalSheet,
              { paddingBottom: theme.spacing.lg + insets.bottom },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <AppText style={styles.modalTitle}>
                  Escolha até 2 títulos que você já assistiu
                </AppText>
                <AppText style={styles.modalSubtitle}>
                  Selecione de 1 a 2 títulos e escolha o gênero desejado.
                </AppText>
              </View>
              <Pressable
                disabled={isGenerating}
                onPress={closeRecommendationModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color={theme.colors.text} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {isWatchedLoading && (
                <View style={styles.centerFeedback}>
                  <ActivityIndicator color={theme.colors.primarySoft} />
                  <AppText style={styles.feedback}>
                    Carregando assistidos...
                  </AppText>
                </View>
              )}

              {watchedError && (
                <AppText style={styles.feedback}>{watchedError}</AppText>
              )}

              {!isWatchedLoading &&
                !watchedError &&
                watchedMovies.length === 0 && (
                  <AppText style={styles.feedback}>
                    Marque títulos como assistidos para receber recomendações
                    personalizadas.
                  </AppText>
                )}

              {watchedMovies.length > 0 && (
                <View style={styles.movieGrid}>
                  {watchedMovies.map((movie) => {
                    const movieKey = `${movie.mediaType}-${movie.tmdbId}`;
                    const isSelected = selectedMovieKeys.includes(movieKey);

                    return (
                      <Pressable
                        key={movieKey}
                        onPress={() => toggleMovie(movie)}
                        style={[
                          styles.movieCard,
                          isSelected && styles.movieCardSelected,
                        ]}
                      >
                        {movie.posterUrl ? (
                          <Image
                            source={{ uri: movie.posterUrl }}
                            style={styles.moviePoster}
                            contentFit="cover"
                          />
                        ) : (
                          <View style={styles.moviePosterFallback}>
                            <Ionicons
                              name="film-outline"
                              size={20}
                              color={theme.colors.textMuted}
                            />
                          </View>
                        )}
                        <AppText numberOfLines={2} style={styles.movieTitle}>
                          {movie.title}
                        </AppText>
                        <View
                          style={[
                            styles.selectionBadge,
                            isSelected && styles.selectionBadgeActive,
                          ]}
                        >
                          <Ionicons
                            name={isSelected ? "checkmark" : "add"}
                            size={14}
                            color={isSelected ? "#111" : theme.colors.textMuted}
                          />
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {recommendationError && (
                <AppText style={styles.errorFeedback}>
                  {recommendationError}
                </AppText>
              )}

              <View style={styles.genreBlock}>
                <AppText style={styles.genreTitle}>Gênero desejado</AppText>
                <View style={styles.genreGrid}>
                  {desiredGenres.map((genre) => {
                    const isSelected = desiredGenre === genre;

                    return (
                      <Pressable
                        key={genre}
                        onPress={() => setDesiredGenre(genre)}
                        style={[
                          styles.genreChip,
                          isSelected && styles.genreChipSelected,
                        ]}
                      >
                        <AppText
                          style={[
                            styles.genreChipText,
                            isSelected && styles.genreChipTextSelected,
                          ]}
                        >
                          {genre}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.genreBlock}>
                <AppText style={styles.genreTitle}>Quero receber</AppText>
                <View style={styles.mediaTypeGrid}>
                  {desiredMediaTypes.map((mediaType) => {
                    const isSelected = desiredMediaType === mediaType.value;

                    return (
                      <Pressable
                        key={mediaType.value}
                        onPress={() => setDesiredMediaType(mediaType.value)}
                        style={[
                          styles.mediaTypeChip,
                          isSelected && styles.mediaTypeChipSelected,
                        ]}
                      >
                        <Ionicons
                          name={
                            mediaType.value === "movie"
                              ? "film-outline"
                              : "tv-outline"
                          }
                          size={16}
                          color={isSelected ? "#111" : theme.colors.textMuted}
                        />
                        <AppText
                          style={[
                            styles.mediaTypeChipText,
                            isSelected && styles.mediaTypeChipTextSelected,
                          ]}
                        >
                          {mediaType.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <Pressable
              disabled={!canGenerate}
              onPress={generateRecommendation}
              style={[
                styles.generateButton,
                !canGenerate && styles.generateButtonDisabled,
              ]}
            >
              {isGenerating ? (
                <ActivityIndicator color="#111" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={18} color="#111" />
                  <AppText style={styles.generateButtonText}>
                    Gerar recomendação
                  </AppText>
                </>
              )}
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  streamMateHero: {
    gap: theme.spacing.md,
    backgroundColor: "#1a1124",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#8A2BE266",
    padding: theme.spacing.lg,
    ...theme.shadow.glow,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  aiBadge: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flexShrink: 1,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "#8A2BE266",
    backgroundColor: "rgba(202, 152, 255, 0.1)",
    paddingHorizontal: 12,
  },
  aiBadgeText: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.bold,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(202, 152, 255, 0.12)",
    borderWidth: 1,
    borderColor: "#8A2BE288",
  },
  heroTextBlock: {
    gap: theme.spacing.sm,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    lineHeight: 27,
    fontFamily: theme.fonts.family.bold,
  },
  heroText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 21,
  },
  heroSteps: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  heroStepChip: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    paddingLeft: 6,
    paddingRight: 12,
  },
  heroStepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: "hidden",
    color: "#111",
    backgroundColor: theme.colors.primarySoft,
    textAlign: "center",
    lineHeight: 22,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.bold,
  },
  heroStepText: {
    color: theme.colors.text,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.semibold,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: theme.spacing.lg,
  },
  primaryButtonText: {
    color: "#111",
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.bold,
  },
  resultCard: {
    gap: theme.spacing.md,
    backgroundColor: "#19131f",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#8A2BE244",
    padding: theme.spacing.md,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#21112f",
    borderWidth: 1,
    borderColor: "#8A2BE244",
  },
  resultTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  resultText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
    lineHeight: 24,
  },
  recommendationList: {
    gap: theme.spacing.md,
  },
  recommendedMovie: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  recommendedPoster: {
    width: 92,
    height: 138,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceElevated,
  },
  recommendedPosterFallback: {
    width: 92,
    height: 138,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceElevated,
  },
  recommendedInfo: {
    flex: 1,
    gap: 8,
  },
  recommendedTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  recommendedMeta: {
    color: theme.colors.imdb,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  recommendedOverview: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  recommendedReason: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  detailsButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  detailsButtonText: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  emptyResultCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: "#19131f",
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: "#8A2BE244",
    padding: theme.spacing.md,
  },
  emptyResultText: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
    lineHeight: 22,
  },
  inputBarWrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: "#131114",
    borderTopWidth: 1,
    borderTopColor: "#8A2BE244",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1124",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "#8A2BE244",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.regular,
  },
  footnote: {
    color: theme.colors.textSoft,
    fontSize: theme.fonts.sm,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  modalSheet: {
    maxHeight: "88%",
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  modalTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  modalSubtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
    marginTop: 4,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalScroll: {
    flexGrow: 0,
  },
  modalScrollContent: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  centerFeedback: {
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
    lineHeight: 22,
  },
  errorFeedback: {
    color: theme.colors.danger,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  movieGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  movieCard: {
    width: "31%",
    minHeight: 188,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: 8,
    gap: 8,
    position: "relative",
  },
  movieCardSelected: {
    borderColor: theme.colors.primarySoft,
    backgroundColor: "#22152f",
  },
  moviePoster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceElevated,
  },
  moviePosterFallback: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: theme.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceElevated,
  },
  movieTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.xsm,
    lineHeight: 16,
    fontFamily: theme.fonts.family.semibold,
  },
  selectionBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectionBadgeActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primarySoft,
  },
  genreBlock: {
    gap: theme.spacing.sm,
  },
  genreTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  genreChip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  genreChipSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primarySoft,
  },
  genreChipText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  genreChipTextSelected: {
    color: "#111",
  },
  mediaTypeGrid: {
    flexDirection: "row",
    gap: 10,
  },
  mediaTypeChip: {
    minHeight: 42,
    flex: 1,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  mediaTypeChipSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primarySoft,
  },
  mediaTypeChipText: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  mediaTypeChipTextSelected: {
    color: "#111",
  },
  generateButton: {
    minHeight: 52,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.45,
  },
  generateButtonText: {
    color: "#111",
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.bold,
  },
});
