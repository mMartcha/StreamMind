import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { theme } from '@/theme';

const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  buscar: 'search',
  ia: 'sparkles',
  favoritos: 'heart',
  perfil: 'person',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: theme.colors.border,
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: theme.fonts.xsm,
          fontWeight: theme.fonts.semibold,
        },
        tabBarActiveTintColor: theme.colors.primarySoft,
        tabBarInactiveTintColor: theme.colors.textSoft,
        tabBarIcon: ({ color, focused, size }) => {
          const name = iconByRoute[route.name] ?? 'ellipse';
          return (
            <Ionicons
              name={name}
              color={color}
              size={route.name === 'ia' ? size + 4 : size}
              style={
                route.name === 'ia' && focused
                  ? {
                      textShadowColor: '#8A2BE2AA',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 12,
                    }
                  : undefined
              }
            />
          );
        },
      })}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="ia" options={{ title: 'AI' }} />
      <Tabs.Screen name="favoritos" options={{ title: 'Favoritos' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
