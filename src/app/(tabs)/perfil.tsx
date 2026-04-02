import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Chip, PosterCard, Screen, SectionHeader } from '@/src/components';
import { contentLibrary } from '@/src/data/content';
import { theme } from '@/theme';

const watched = contentLibrary.filter((item) => item.watched);
const favorites = contentLibrary.filter((item) => item.favorite);
const watchLater = contentLibrary.filter((item) => item.watchLater);

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <Screen>
      <SectionHeader
        title="Perfil"
        subtitle="Preferencias, historico e atalhos para escolher mais rapido no dia a dia."
      />

      <View style={styles.hero}>
        <View style={styles.avatar}>
          <AppText style={styles.avatarText}>MM</AppText>
        </View>
        <View style={styles.heroText}>
          <AppText style={styles.name}>Marcello</AppText>
          <AppText style={styles.caption}>Curte ficcao cientifica, suspense e dramas intensos.</AppText>
        </View>
      </View>

      <Pressable onPress={() => router.push('/streamings')} style={styles.streamingButton}>
        <View style={styles.streamingButtonTextWrap}>
          <AppText style={styles.streamingButtonTitle}>Meus streamings</AppText>
          <AppText style={styles.streamingButtonCaption}>
            Escolha os servicos que voce assina para personalizar as sugestoes.
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.primarySoft} />
      </Pressable>

      <View style={styles.statsRow}>
        <StatCard label="Assistidos" value={String(watched.length)} />
        <StatCard label="Favoritos" value={String(favorites.length)} />
        <StatCard label="Depois" value={String(watchLater.length)} />
      </View>

      <View style={styles.section}>
        <AppText style={styles.label}>Preferencias de genero</AppText>
        <View style={styles.tagRow}>
          {['Ficcao Cientifica', 'Suspense', 'Drama', 'Familia'].map((genre) => (
            <Chip key={genre} label={genre} active />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText style={styles.label}>Assistir depois</AppText>
        <View style={styles.list}>
          {watchLater.map((item) => (
            <PosterCard key={item.id} item={item} compact />
          ))}
        </View>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#271539',
    borderWidth: 1,
    borderColor: '#8A2BE244',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#1b1422',
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: '#8A2BE255',
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
  statsRow: {
    flexDirection: 'row',
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
    textAlign:'center'
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.medium,
    textAlign:'center'
    
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: theme.spacing.md,
  },
});
