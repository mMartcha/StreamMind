import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip, PosterCard, Screen, SectionHeader } from '@/src/components';
import { contentLibrary, genres } from '@/src/data/content';
import { theme } from '@/theme';
import React from 'react';

export default function SearchScreen() {
  return (
    <Screen>
      <SectionHeader
        title="Buscar"
        subtitle="Encontre filmes e series e veja rapidamente onde estao disponiveis."
      />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={theme.colors.textSoft} />
        <TextInput
          placeholder="Busque por titulo, genero ou clima"
          placeholderTextColor={theme.colors.textSoft}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Generos populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {genres.map((genre, index) => (
            <Chip key={genre} label={genre} active={index === 1} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.grid}>
        {contentLibrary.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            <PosterCard item={item} compact />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.md,
  },
  section: {
    gap: 10,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontWeight: theme.fonts.semibold,
  },
  chips: {
    gap: 10,
    paddingRight: theme.spacing.lg,
  },
  grid: {
    gap: theme.spacing.md,
  },
  gridItem: {
    width: '100%',
  },
});
