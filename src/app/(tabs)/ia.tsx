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
  View
} from "react-native";

import { AppText, Screen } from "@/src/components";
import {
  getUserLists,
  toCatalogMediaType,
  type UserTitleItem,
} from "@/src/services/api";
import { theme } from "@/theme";

type WatchedMovie = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterUrl: string | null;
  genres?: string[];
};

type AiRecommendationResult = {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterUrl: string | null;
  overview: string;
  reason: string;
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

const mockRecommendationsByGenre: Record<
  string,
  Omit<AiRecommendationResult, "reason">[]
> = {
  Ação: [
    {
      tmdbId: 603,
      mediaType: "movie",
      title: "Matrix",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/qFHE09iQDbpHUBXJ8cFZu9v2ViO.jpg",
      overview:
        "Um programador descobre que sua realidade e uma simulação controlada por máquinas.",
    },
    {
      tmdbId: 76341,
      mediaType: "movie",
      title: "Mad Max: Estrada da Fúria",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/tH64gzAHDFg7EFcgfkkZyHdGM5P.jpg",
      overview:
        "Em um deserto pós-apocalíptico, uma fugitiva lidera uma fuga explosiva por sobrevivência.",
    },
    {
      tmdbId: 245891,
      mediaType: "movie",
      title: "John Wick",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/rboZslo3eQWKBQ3QvlO6wGV0J3K.jpg",
      overview:
        "Um ex-assassino retorna ao submundo em uma jornada brutal de vinganca.",
    },
  ],
  Terror: [
    {
      tmdbId: 493922,
      mediaType: "movie",
      title: "Hereditario",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/lHV8HHlhwNup2VbpiACtlKzaGIQ.jpg",
      overview:
        "Uma família em luto descobre segredos sombrios que tornam a casa cada vez mais ameaçadora.",
    },
    {
      tmdbId: 419430,
      mediaType: "movie",
      title: "Corra!",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/7hmmKIWDHi7jzOiGzffZesXKKfp.jpg",
      overview:
        "Um jovem fotógrafo descobre uma verdade perturbadora durante uma visita familiar.",
    },
    {
      tmdbId: 138843,
      mediaType: "movie",
      title: "Invocacao do Mal",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/1NxHKZW5DPbUFtbF3MxbdSyxRqU.jpg",
      overview:
        "Investigadores paranormais ajudam uma família assombrada por uma presença violenta.",
    },
  ],
  Suspense: [
    {
      tmdbId: 807,
      mediaType: "movie",
      title: "Seven",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg",
      overview:
        "Dois detetives investigam uma série de crimes ligados aos sete pecados capitais.",
    },
    {
      tmdbId: 11324,
      mediaType: "movie",
      title: "Ilha do Medo",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/qnWJFFkRv61e030YcOBVI9U4o6V.jpg",
      overview:
        "Um agente federal investiga um desaparecimento em um hospital psiquiátrico isolado.",
    },
    {
      tmdbId: 210577,
      mediaType: "movie",
      title: "Garota Exemplar",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/9i1ks1VxXl19A9RZCVu14xemI1P.jpg",
      overview:
        "O desaparecimento de uma mulher transforma seu marido no centro de uma trama ambígua.",
    },
  ],
  "Ficção cientifica": [
    {
      tmdbId: 157336,
      mediaType: "movie",
      title: "Interestelar",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/nCbkOyOMTEwlEV0LtCOvCnwEONA.jpg",
      overview:
        "Exploradores cruzam o espaco em busca de um novo lar para a humanidade.",
    },
    {
      tmdbId: 335984,
      mediaType: "movie",
      title: "Blade Runner 2049",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
      overview:
        "Um novo blade runner descobre um segredo capaz de abalar a ordem da sociedade.",
    },
    {
      tmdbId: 329865,
      mediaType: "movie",
      title: "A Chegada",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/4Iu5f2nv7huqvuYkmZvSPOtbFjs.jpg",
      overview:
        "Uma linguista tenta decifrar a comunicação de visitantes extraterrestres misteriosos.",
    },
  ],
  Drama: [
    {
      tmdbId: 550,
      mediaType: "movie",
      title: "Clube da Luta",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/mCICnh7QBH0gzYaTQChBDDVIKdm.jpg",
      overview:
        "Um homem insone se envolve com um estranho vendedor e um clube clandestino.",
    },
    {
      tmdbId: 244786,
      mediaType: "movie",
      title: "Whiplash",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
      overview:
        "Um jovem baterista enfrenta um professor implacável em busca da excelência.",
    },
    {
      tmdbId: 106646,
      mediaType: "movie",
      title: "O Lobo de Wall Street",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/esJTXTdj4rl9dJnDijTqY8E4w4T.jpg",
      overview:
        "A ascensão e queda de um corretor marcado por ambição, excessos e fraudes.",
    },
  ],
  Comédia: [
    {
      tmdbId: 8363,
      mediaType: "movie",
      title: "Superbad",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg",
      overview:
        "Dois amigos tentam transformar uma festa em uma despedida memoravel do ensino medio.",
    },
    {
      tmdbId: 12153,
      mediaType: "movie",
      title: "As Branquelas",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/aJZOcorpgloDLkPP6ED0t9sXjNu.jpg",
      overview:
        "Dois agentes do FBI entram em uma missão absurda envolvendo disfarces improváveis.",
    },
    {
      tmdbId: 38365,
      mediaType: "movie",
      title: "Gente Grande",
      posterUrl:
        "https://image.tmdb.org/t/p/w500/cQGM5k1NtU85n4TUlrOrwijSCcm.jpg",
      overview:
        "Amigos de infância se reencontram para um fim de semana cheio de confusões.",
    },
  ],
};

const fallbackRecommendations = Object.values(
  mockRecommendationsByGenre,
).flat();

const genreTraits: Record<string, string[]> = {
  Ação: ["ritmo acelerado", "conflitos diretos", "energia visual"],
  Aventura: ["descoberta", "jornada", "escala emocional"],
  Comédia: ["humor leve", "situações absurdas", "elenco carismático"],
  Drama: ["personagens em conflito", "tensão emocional", "decisões difíceis"],
  "Ficção cientifica": [
    "ideias provocativas",
    "atmosfera futurista",
    "mistério conceitual",
  ],
  Terror: ["atmosfera sombria", "tensão crescente", "desconforto psicológico"],
  Suspense: ["ritmo psicológico", "ambiguidade", "viradas de roteiro"],
  Romance: ["conexão emocional", "intimidade", "conflitos afetivos"],
  Animação: ["imaginação visual", "aventura acessível", "leveza emocional"],
  Documentário: ["curiosidade", "contexto real", "descoberta"],
};

function toWatchedMovie(item: UserTitleItem): WatchedMovie {
  return {
    tmdbId: item.tmdbId,
    mediaType: toCatalogMediaType(item.mediaType),
    title: item.title,
    posterUrl: item.posterUrl || null,
  };
}

function getMediaKey(
  item: Pick<AiRecommendationResult | WatchedMovie, "mediaType" | "tmdbId">,
) {
  return `${item.mediaType}-${item.tmdbId}`;
}

function buildRecommendationReason(
  recommendation: Omit<AiRecommendationResult, "reason">,
  selectedMovies: WatchedMovie[],
  desiredGenre: string,
  index: number,
) {
  const selectedTitles = selectedMovies.map((movie) => movie.title).join(" e ");
  const traits = genreTraits[desiredGenre] ?? genreTraits.Ação;
  const trait = traits[index % traits.length];

  return `Com base em ${selectedTitles} e no gênero ${desiredGenre}, a IA identificou uma preferência por ${trait}, tom consistente e personagens com objetivos bem definidos. Por isso, ${recommendation.title} combina com o tipo de experiência que você demonstrou gostar.`;
}

function createMockRecommendations(
  selectedMovies: WatchedMovie[],
  desiredGenre: string,
): AiRecommendationResult[] {
  const selectedKeys = new Set(selectedMovies.map(getMediaKey));
  const preferredOptions = mockRecommendationsByGenre[desiredGenre] ?? [];
  const candidates = [...preferredOptions, ...fallbackRecommendations].filter(
    (recommendation, index, list) =>
      !selectedKeys.has(getMediaKey(recommendation)) &&
      list.findIndex(
        (item) => getMediaKey(item) === getMediaKey(recommendation),
      ) === index,
  );

  return candidates.slice(0, 2).map((recommendation, index) => ({
    ...recommendation,
    reason: buildRecommendationReason(
      recommendation,
      selectedMovies,
      desiredGenre,
      index,
    ),
  }));
}

export default function AIScreen() {
  const router = useRouter();
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [isWatchedLoading, setIsWatchedLoading] = useState(true);
  const [watchedError, setWatchedError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovieKeys, setSelectedMovieKeys] = useState<string[]>([]);
  const [desiredGenre, setDesiredGenre] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<
    AiRecommendationResult[]
  >([]);

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
              "Não foi possível carregar seus filmes assistidos agora.",
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
    selectedMovies.length > 0 && Boolean(desiredGenre) && !isGenerating;

  function openRecommendationModal() {
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
    if (!canGenerate || !desiredGenre) {
      return;
    }

    setIsGenerating(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 900);
    });

    setRecommendations(createMockRecommendations(selectedMovies, desiredGenre));
    setIsGenerating(false);
    setIsModalVisible(false);
  }

  function openRecommendedDetails(recommendation: AiRecommendationResult) {
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
              <Pressable onPress={goBack} style={styles.backButton}>
                <Ionicons
                  name="arrow-back"
                  size={18}
                  color={theme.colors.text}
                />
              </Pressable>
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
                Com base nos filmes escolhidos e no gênero selecionado, a IA
                simulou duas sugestões com perfis complementares.
              </AppText>

              <View style={styles.recommendationList}>
                {recommendations.map((recommendation) => (
                  <View
                    key={getMediaKey(recommendation)}
                    style={styles.recommendedMovie}
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
                      <AppText style={styles.recommendedOverview}>
                        {recommendation.overview}
                      </AppText>
                      <AppText style={styles.recommendedReason}>
                        {recommendation.reason}
                      </AppText>
                      <Pressable
                        style={styles.detailsButton}
                        onPress={() => openRecommendedDetails(recommendation)}
                      >
                        <AppText style={styles.detailsButtonText}>
                          Ver detalhes
                        </AppText>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.colors.primarySoft}
                        />
                      </Pressable>
                    </View>
                  </View>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <AppText style={styles.modalTitle}>
                  Escolha até 2 filmes que você já assistiu
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
                    Marque filmes como assistidos para receber recomendações
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
          </View>
        </View>
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
    paddingTop: theme.spacing.top,
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
