import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { theme } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': require('../../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('../../assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
    'Montserrat-SemiBold': require('../../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('../../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    'Sora-Regular': require('../../assets/fonts/Sora/static/Sora-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'fade',
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="content/[id]" />
        <Stack.Screen name="streamings" />
      </Stack>
    </>
  );
}

const styles = {
  loadingScreen: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.background,
  },
};
