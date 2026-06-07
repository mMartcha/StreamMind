import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  PosterCard,
  Screen,
  SectionHeader
} from "@/src/components";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  CatalogContentItem,
  UserListStats,
  getUserListStats,
  getUserLists,
  toContentItemFromUserList,
} from "@/src/services/api";
import { theme } from "@/theme";

const emptyStats: UserListStats = {
  favorites: 0,
  watchlist: 0,
  watched: 0,
};

let cachedProfileData: {
  stats: UserListStats;
  watchLater: CatalogContentItem[];
} | null = null;

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserListStats>(
    cachedProfileData?.stats ?? emptyStats,
  );
  const [watchLater, setWatchLater] = useState<CatalogContentItem[]>(
    cachedProfileData?.watchLater ?? [],
  );
  const [hasLoadedProfile, setHasLoadedProfile] = useState(
    Boolean(cachedProfileData),
  );
  const [isLoading, setIsLoading] = useState(!cachedProfileData);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadProfileLists() {
        try {
          setIsLoading(!hasLoadedProfile);
          setError(null);

          const [statsResult, watchlistResult] = await Promise.all([
            getUserListStats(),
            getUserLists("WATCHLIST"),
          ]);

          if (isActive) {
            const nextWatchLater = watchlistResult.map(toContentItemFromUserList);

            cachedProfileData = {
              stats: statsResult,
              watchLater: nextWatchLater,
            };
            setStats(statsResult);
            setWatchLater(nextWatchLater);
          }
        } catch {
          if (isActive) {
            if (!hasLoadedProfile) {
              setStats(emptyStats);
              setWatchLater([]);
            }
            setError("Não foi possível carregar os dados do perfil agora.");
          }
        } finally {
          if (isActive) {
            setHasLoadedProfile(true);
            setIsLoading(false);
          }
        }
      }

      loadProfileLists();

      return () => {
        isActive = false;
      };
    }, [hasLoadedProfile]),
  );

  async function handleSignOut() {
    await signOut();
  }

  const initials =
    user?.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SM";
  const shouldShowInitialLoading = isLoading && !hasLoadedProfile;

  return (
    <Screen>
      <SectionHeader
        title="Perfil"
        subtitle="Preferências, histórico e atalhos para escolher mais rápido no dia a dia."
      />

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarText}>{initials}</AppText>
        </View>
        <View style={styles.heroText}>
          <AppText style={styles.name}>{user?.name ?? "Usuario"}</AppText>
          <AppText style={styles.caption}>
            {user?.email ?? "Sessao ativa no StreamMind."}
          </AppText>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/streamings")}
        style={styles.streamingButton}
      >
        <View style={styles.streamingButtonTextWrap}>
          <AppText style={styles.streamingButtonTitle}>Meus streamings</AppText>
          <AppText style={styles.streamingButtonCaption}>
            Escolha os serviços que você assina para personalizar as sugestões.
          </AppText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.primarySoft}
        />
      </Pressable>

      <Pressable onPress={handleSignOut} style={styles.logoutButton}>
        <Ionicons
          name="log-out-outline"
          size={18}
          color={theme.colors.danger}
        />
        <AppText style={styles.logoutText}>Sair da conta</AppText>
      </Pressable>

      {shouldShowInitialLoading ? (
        <View style={styles.profileDataLoading}>
          <ActivityIndicator color={theme.colors.primarySoft} />
        </View>
      ) : (
        <>
      <View style={styles.statsRow}>
        <StatCard label="Assistidos" value={String(stats.watched)} />
        <StatCard label="Favoritos" value={String(stats.favorites)} />
        <StatCard label="Depois" value={String(stats.watchlist)} />
      </View>

      {error && <AppText style={styles.feedback}>{error}</AppText>}

      <View style={styles.section}>
        <AppText style={styles.label}>Assistir depois</AppText>
        {!error && watchLater.length === 0 && (
          <AppText style={styles.feedback}>
            Nenhum título salvo para depois.
          </AppText>
        )}
        <View style={styles.list}>
          {watchLater.map((item) => (
            <PosterCard key={item.id} item={item} compact />
          ))}
        </View>
      </View>
        </>
      )}
    </Screen>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <AppText style={styles.statValue}>{value}</AppText>
      <AppText style={styles.statLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#271539",
    borderWidth: 1,
    borderColor: "#8A2BE244",
  },
  avatarText: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.fonts.lg,
    fontFamily: theme.fonts.family.bold,
  },
  caption: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 22,
  },
  streamingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#1b1422",
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: "#8A2BE255",
    padding: theme.spacing.lg,
  },
  streamingButtonTextWrap: {
    flex: 1,
    gap: 4,
  },
  streamingButtonTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  streamingButtonCaption: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "#ff7d9044",
    paddingVertical: 12,
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 6,
  },
  statValue: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.xl,
    fontFamily: theme.fonts.family.bold,
    textAlign: "center",
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.medium,
    textAlign: "center",
  },
  section: {
    gap: 12,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.semibold,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  list: {
    gap: theme.spacing.md,
  },
  profileDataLoading: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
    paddingVertical: theme.spacing.xxl,
  },
  feedback: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
  },
});
