import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import {
  AppText,
  Chip,
  HeroCard,
  HorizontalRail,
  Screen,
  SectionHeader,
} from "@/src/components";
import {
  CatalogContentItem,
  MovieDetails,
  getTrending,
  toContentItem,
} from "@/src/services/api";
import { getMovieById } from "@/src/services/catalog.service";
import { theme } from "@/theme";

export default function HomeScreen() {
  const [items, setItems] = useState<CatalogContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testMovie, setTestMovie] = useState<MovieDetails | null>(null);
  const [isTestMovieLoading, setIsTestMovieLoading] = useState(true);
  const [testMovieError, setTestMovieError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function testBackendConnection() {
      try {
        setIsTestMovieLoading(true);
        setTestMovieError(null);
        const movie = await getMovieById(550);

        if (isMounted) {
          setTestMovie(movie);
          console.log("Filme recebido do backend:", movie);
        }
      } catch (error) {
        if (isMounted) {
          setTestMovie(null);
          setTestMovieError("Nao foi possivel buscar o filme 550 no backend.");
          console.log("Erro ao conectar com o backend:", error);
        }
      } finally {
        if (isMounted) {
          setIsTestMovieLoading(false);
        }
      }
    }

    testBackendConnection();

    return () => {
      isMounted = false;
    };
  }, []);

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
          setError("Nao foi possivel carregar o catalogo agora.");
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
          <AppText style={styles.innerBrand}>Mind</AppText>
        </AppText>
        <AppText style={styles.subtitle}>
          Seu guia inteligente para descobrir o que assistir.
        </AppText>
      </View>

      <View style={styles.backendTestCard}>
        <AppText style={styles.backendTestTitle}>Teste backend local</AppText>
        {isTestMovieLoading && (
          <AppText style={styles.feedback}>Buscando filme 550...</AppText>
        )}
        {testMovieError && (
          <AppText style={styles.feedback}>{testMovieError}</AppText>
        )}
        {testMovie && (
          <View style={styles.backendMovieRow}>
            {testMovie.posterUrl && (
              <Image
                source={{ uri: testMovie.posterUrl }}
                style={styles.backendPoster}
                contentFit="cover"
              />
            )}
            <View style={styles.backendMovieInfo}>
              <AppText style={styles.backendMovieTitle}>
                {testMovie.title}
              </AppText>
              {!!testMovie.overview && (
                <AppText style={styles.backendOverview}>
                  {testMovie.overview}
                </AppText>
              )}
              <View style={styles.backendMetaList}>
                {!!testMovie.releaseDate && (
                  <AppText style={styles.backendMeta}>
                    Lancamento: {testMovie.releaseDate}
                  </AppText>
                )}
                {typeof testMovie.voteAverage === "number" && (
                  <AppText style={styles.backendMeta}>
                    Nota media: {testMovie.voteAverage.toFixed(1)}
                  </AppText>
                )}
                {testMovie.genres.length > 0 && (
                  <AppText style={styles.backendMeta}>
                    Generos:{" "}
                    {testMovie.genres.map((genre) => genre.name).join(", ")}
                  </AppText>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      {isLoading && (
        <AppText style={styles.feedback}>Carregando catalogo...</AppText>
      )}
      {error && <AppText style={styles.feedback}>{error}</AppText>}
      {featured && <HeroCard item={featured} />}

      <View style={styles.section}>
        <SectionHeader
          title="Generos em destaque"
          subtitle="Atalhos rapidos para explorar sem perder tempo."
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {[
            "Suspense",
            "Familia",
            "Drama",
            "Animacao",
            "Acao",
            "Ficcao Cientifica",
          ].map((genre, index) => (
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
    alignSelf: "center",
  },
  innerBrand: {
    color: theme.colors.primary,
    fontSize: 34,
    fontFamily: theme.fonts.family.bold,
    alignSelf: "center",
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
  backendTestCard: {
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  backendTestTitle: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  backendMovieRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  backendPoster: {
    width: 96,
    height: 144,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surfaceElevated,
  },
  backendMovieInfo: {
    flex: 1,
    gap: theme.spacing.sm,
  },
  backendMovieTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  backendOverview: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  backendMetaList: {
    gap: 4,
  },
  backendMeta: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
  },
});
