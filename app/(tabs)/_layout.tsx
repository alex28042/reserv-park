import { Tabs, router } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isAuthenticated } = useAuth();

  // Guard: if not authenticated, redirect to welcome
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('TabLayout: Usuario no autenticado, redirigiendo a welcome');
      router.replace('/welcome');
    } else {
      console.log('TabLayout: Usuario autenticado, manteniéndose en tabs');
    }
  }, [isAuthenticated]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 85,
            paddingBottom: 32,
            paddingTop: 8,
            borderTopWidth: 0,
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(28, 28, 30, 0.8)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
          },
          default: {
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 0,
            backgroundColor: colorScheme === 'dark' 
              ? 'rgba(28, 28, 30, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            elevation: 0,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 24 : 22} 
              name={focused ? "house.fill" : "house.fill"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 24 : 22} 
              name={focused ? "location.fill" : "location.fill"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Reservas',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 24 : 22} 
              name={focused ? "calendar" : "calendar"} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={focused ? 24 : 22} 
              name={focused ? "person.fill" : "person.fill"} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
