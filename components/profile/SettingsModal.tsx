import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ProfileModalBase visible={visible} title="Configuración" onClose={onClose}>
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, gap: 10 }}>
        <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Privacidad</ThemedText>
        <ThemedText style={{ color: colors.text, opacity: 0.8 }}>Compartir ubicación: Solo al usar la app</ThemedText>
        <ThemedText style={{ color: colors.text, opacity: 0.8 }}>Tema: Automático</ThemedText>
      </View>
    </ProfileModalBase>
  );
}


