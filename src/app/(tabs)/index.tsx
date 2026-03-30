import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Chip, HeroCard, HorizontalRail, Screen, SectionHeader } from '@/src/components';
import { contentLibrary } from '@/src/data/content';
import { theme } from '@/theme';

const featured = contentLibrary[0];
const recommended = contentLibrary.filter((item) => item.recommended);
const trending = contentLibrary.filter((item) => item.trending);

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.brand}>streamMind</Text>
        <Text style={styles.subtitle}>Seu guia inteligente para descobrir o que assistir.</Text>
      </View>

      <HeroCard item={featured} />

      <View style={styles.section}>
        <SectionHeader
          title="Generos em destaque"
          subtitle="Atalhos rapidos para explorar sem perder tempo."
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {['Suspense', 'Familia', 'Drama', 'Animacao', 'Acao', 'Ficcao Cientifica'].map((genre, index) => (
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
    fontWeight: theme.fonts.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.md,
    lineHeight: 24,
  },
  section: {
    gap: theme.spacing.md,
  },
  chips: {
    gap: 10,
    paddingRight: theme.spacing.lg,
  },
});
