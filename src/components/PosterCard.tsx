import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ContentItem, platformMeta } from "@/src/data/content";
import { theme } from "@/theme";

import { AppText } from "./AppText";

export function PosterCard({
  item,
  compact = false,
}: {
  item: ContentItem;
  compact?: boolean;
}) {
  const router = useRouter();
  const primaryGenre = item.genre[0];
  const hasRealGenre = primaryGenre && !["Catalogo", "Catálogo"].includes(primaryGenre);
  const metadata = hasRealGenre ? `${item.year} • ${primaryGenre}` : String(item.year);
  const platforms = item.availableOn.slice(0, 3);

  const platformDots = (
    <View style={styles.platformTinyRow}>
      {platforms.map((platform) => (
        <View
          key={platform}
          style={[
            styles.platformTiny,
            { backgroundColor: platformMeta[platform].color },
          ]}
        />
      ))}
    </View>
  );

  const badges = (
    <View style={compact ? styles.posterTopRowCompact : styles.posterTopRow}>
      <View style={styles.imdbPill}>
        <Ionicons name="star" size={12} color="#111" />
        <AppText style={styles.imdbText}>{item.imdb}</AppText>
      </View>
      <View style={styles.typePill}>
        <AppText style={styles.typePillText}>{item.type}</AppText>
      </View>
    </View>
  );

  const details = (
    <View style={styles.posterMeta}>
      <AppText numberOfLines={compact ? 2 : 1} style={styles.posterTitle}>
        {item.title}
      </AppText>

      <View style={styles.posterMetaLower}>
        <AppText style={styles.posterSubtitle}>{metadata}</AppText>
        {compact && (
          <> 
            <AppText style={styles.posterSubtitle}>•</AppText>
            {platformDots}
          </>
        )}
      </View>

      {!compact && platformDots}
    </View>
  );

  if (compact) {
    return (
      <Pressable
        onPress={() => router.push(`/content/${item.id}`)}
        style={styles.posterCardCompact}
      >
        <Image
          source={{ uri: item.poster }}
          style={styles.compactBackground}
          contentFit="cover"
        />
        <View style={styles.compactShade} />

        <View style={styles.posterBodyCompact}>
          <View style={styles.compactPosterGhost}>
            <Image
              source={{ uri: item.poster }}
              style={styles.compactGhostImage}
              contentFit="cover"
            />
          </View>

          <View style={styles.compactInfo}>
            {badges}
            {details}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push(`/content/${item.id}`)}
      style={styles.posterCard}
    >
      <View style={styles.posterMedia}>
        <Image
          source={{ uri: item.poster }}
          style={styles.posterImage}
          contentFit="cover"
        />
        <View style={styles.posterImageShade} />
        <View style={styles.posterFloatingBadges}>{badges}</View>
      </View>

      <View style={styles.posterBody}>
        {details}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  posterCard: {
    width: 178,
    minHeight: 332,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    backgroundColor: "#19131f",
    borderWidth: 1,
    borderColor: "#8A2BE244",
  },
  posterCardCompact: {
    minHeight: 142,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: "100%",
  },
  posterMedia: {
    backgroundColor: "#222",
    position: "relative",
  },
  posterImage: {
    width: "100%",
    height: 252,
  },
  posterImageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 8, 14, 0.1)",
  },
  posterFloatingBadges: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
  },
  compactBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  compactShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 8, 14, 0.66)",
  },
  posterBodyCompact: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: "rgba(17, 12, 22, 0.34)",
  },
  compactPosterGhost: {
    width: 78,
    height: 110,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    opacity: 0.72,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  compactGhostImage: {
    width: "100%",
    height: "100%",
  },
  compactInfo: {
    flex: 1,
    minHeight: 110,
    justifyContent: "space-between",
    gap: 10,
  },
  posterBody: {
    minHeight: 80,
    justifyContent: "space-between",
    gap: 8,
    padding: theme.spacing.md,
    backgroundColor: "#19131f",
  },
  posterTopRowCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  posterTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  imdbPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.imdb,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  imdbText: {
    color: "#111",
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.bold,
  },
  typePill: {
    backgroundColor: "rgba(10, 8, 14, 0.72)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  typePillText: {
    color: theme.colors.text,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.semibold,
  },
  posterMeta: {
    gap: 6,
  },
  posterMetaLower: {
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  posterTitle: {
    color: "#fff",
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  posterSubtitle: {
    color: "#dfd7ea",
    fontSize: theme.fonts.sm,
  },
  platformTinyRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  platformTiny: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
