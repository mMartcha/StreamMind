import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/theme';

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  buscar: 'search',
  favoritos: 'heart',
  perfil: 'person',
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: theme.colors.border,
          height: 66 + insets.bottom,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        tabBarLabelStyle: {
          fontSize: theme.fonts.xsm,
          fontWeight: theme.fonts.semibold,
        },
        tabBarActiveTintColor: theme.colors.primarySoft,
        tabBarInactiveTintColor: theme.colors.textSoft,
        tabBarIcon: ({ color, focused, size }) => {
          const name = iconByRoute[route.name] ?? 'ellipse';
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="ia" options={{ href: null }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
