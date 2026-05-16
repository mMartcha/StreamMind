import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  HeroCard,
  HorizontalRail,
  Screen,
  SectionHeader,
} from "@/src/components";
import {
  CatalogContentItem,
  MovieDetails,
  toContentItem,
} from "@/src/services/api";
import { getMovieById, getTrending } from "@/src/services/catalog.service";
import { theme } from "@/theme";

export default function HomeScreen() {
  const router = useRouter();
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
          setTestMovieError("Não foi possível buscar o filme 550 no backend.");
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
          setItems([]);
          setError("Não foi possível carregar o catálogo agora.");
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

      {isLoading && (
        <AppText style={styles.feedback}>Carregando catálogo...</AppText>
      )}
      {error && <AppText style={styles.feedback}>{error}</AppText>}
      {!isLoading && !error && items.length === 0 && (
        <AppText style={styles.feedback}>
          Nenhum título encontrado agora.
        </AppText>
      )}
      {featured && <HeroCard item={featured} />}

      <View style={styles.section}>
        <SectionHeader
          title="StreamMate"
          subtitle="Receba sugestões personalizadas a partir do que você já assistiu."
        />
        <Pressable
          onPress={() => router.push("/ia")}
          style={({ pressed }) => [
            styles.aiAccessCard,
            pressed && styles.aiAccessCardPressed,
          ]}
        >
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
          <View style={styles.aiIconWrap}>
            <Ionicons
              name="sparkles"
              size={22}
              color={theme.colors.primarySoft}
            />
          </View>
          <View style={styles.aiAccessContent}>
            <AppText style={styles.aiAccessTitle}>
              Descubra o próximo título com o StreamMate
            </AppText>
            <AppText style={styles.aiAccessText}>
              Combine seus assistidos com um gênero desejado e receba uma
              recomendação personalizada com justificativa.
            </AppText>
          </View>
          <View style={styles.aiSteps}>
            {["Escolha assistidos", "Defina o gênero", "Veja a explicação"].map(
              (step, index) => (
                <View key={step} style={styles.aiStepChip}>
                  <AppText style={styles.aiStepNumber}>{index + 1}</AppText>
                  <AppText style={styles.aiStepText}>{step}</AppText>
                </View>
              ),
            )}
          </View>

          <View style={styles.aiActionRow}>
            <View style={styles.aiActionButton}>
              <AppText style={styles.aiActionText}>
                Interagir com o StreamMate
              </AppText>
              <Ionicons name="arrow-forward" size={17} color="#111" />
            </View>
          </View>
          <AppText style={styles.aiHint}>Leva menos de 1 minuto</AppText>
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Em alta"
          subtitle="Títulos que estão puxando conversa agora."
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
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
  },
  aiAccessCard: {
    minHeight: 210,
    alignItems: "stretch",
    gap: theme.spacing.md,
    backgroundColor: "#1a1124",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#8A2BE266",
    padding: theme.spacing.lg,
    ...theme.shadow.glow,
  },
  aiAccessCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  aiBadge: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
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
  aiIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(202, 152, 255, 0.12)",
    borderWidth: 1,
    borderColor: "#8A2BE288",
  },
  aiAccessContent: {
    gap: theme.spacing.sm,
  },
  aiAccessTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    lineHeight: 26,
    fontFamily: theme.fonts.family.bold,
  },
  aiAccessText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  aiSteps: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  aiStepChip: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    paddingLeft: 6,
    paddingRight: 12,
  },
  aiStepNumber: {
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
  aiStepText: {
    color: theme.colors.text,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.semibold,
  },
  aiActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  aiActionButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: theme.spacing.lg,
  },
  aiActionText: {
    color: "#111",
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.bold,
  },
  aiHint: {
    flex: 1,
    color: theme.colors.textSoft,
    fontSize: theme.fonts.xsm,
    textAlign: "right",
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
