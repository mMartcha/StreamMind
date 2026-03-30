import { ScrollView, StyleSheet } from 'react-native';

import { ContentItem } from '@/src/data/content';
import { theme } from '@/theme';

import { PosterCard } from './PosterCard';

export function HorizontalRail({ items }: { items: ContentItem[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}>
      {items.map((item) => (
        <PosterCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rail: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
});
