import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Screen, SectionHeader } from '@/src/components';
import { platformMeta, PlatformKey } from '@/src/data/content';
import { theme } from '@/theme';

const streamingOptions = Object.keys(platformMeta) as PlatformKey[];
const initialSelection: PlatformKey[] = ['Netflix', 'Prime Video'];

export default function StreamingsScreen() {
  const router = useRouter();
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformKey[]>(initialSelection);

  function togglePlatform(platform: PlatformKey) {
    setSelectedPlatforms((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scroll={false}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
            </Pressable>
            <View style={styles.headerText}>
              <AppText style={styles.eyebrow}>Perfil</AppText>
              <AppText style={styles.title}>Meus streamings</AppText>
            </View>
          </View>

          <SectionHeader
            title="Selecione seus servicos"
            subtitle="Use esse picker simples para marcar as plataformas que voce assina hoje."
          />

          <View style={styles.pickerContent}>
            {streamingOptions.map((platform) => {
              const selected = selectedPlatforms.includes(platform);
              const meta = platformMeta[platform];

              return (
                <Pressable
                  key={platform}
                  onPress={() => togglePlatform(platform)}
                  style={[styles.optionRow, selected && styles.optionRowSelected]}>
                  <View style={[styles.optionDot, { backgroundColor: meta.color }]} />
                  <View style={styles.optionTextWrap}>
                    <AppText style={styles.optionTitle}>{platform}</AppText>
                    <AppText style={styles.optionCaption}>
                      {selected ? 'Selecionado para suas recomendacoes.' : 'Toque para adicionar ao seu perfil.'}
                    </AppText>
                  </View>
                  <View style={[styles.checkBadge, selected && styles.checkBadgeSelected]}>
                    <Ionicons
                      name={selected ? 'checkmark' : 'add'}
                      size={16}
                      color={selected ? '#111' : theme.colors.textMuted}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.footerCard}>
            <AppText style={styles.footerTitle}>Selecionados</AppText>
            <AppText style={styles.footerText}>
              {selectedPlatforms.length > 0
                ? selectedPlatforms.join(', ')
                : 'Nenhum streaming selecionado ainda.'}
            </AppText>
          </View>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.top,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerText: {
    gap: 2,
  },
  eyebrow: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.xsm,
    fontFamily: theme.fonts.family.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fonts.xl,
    fontFamily: theme.fonts.family.bold,
  },
  pickerContent: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionRowSelected: {
    backgroundColor: '#1b1422',
    borderColor: '#8A2BE255',
  },
  optionDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  optionTextWrap: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.semibold,
  },
  optionCaption: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
  checkBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceGlass,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkBadgeSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primarySoft,
  },
  footerCard: {
    gap: 6,
    backgroundColor: theme.colors.surfaceGlass,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footerTitle: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.bold,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    lineHeight: 20,
  },
});
