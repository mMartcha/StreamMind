import { StyleSheet, View } from 'react-native';

import { ContentItem } from '@/src/data/content';

import { PlatformBadge } from './PlatformBadge';

export function StreamingRow({ platforms }: { platforms: ContentItem['availableOn'] }) {
  return (
    <View style={styles.streamingRow}>
      {platforms.map((platform) => (
        <PlatformBadge key={platform} platform={platform} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  streamingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
