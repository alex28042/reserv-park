import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ProfileModalBase visible={visible} title="Acerca de ReservPark" onClose={onClose}>
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, gap: 8 }}>
        <ThemedText style={{ color: colors.text }}>
          ReservPark v1.0.0 — Encuentra y reserva plazas de aparcamiento cerca de ti.
        </ThemedText>
        <ThemedText style={{ color: colors.text, opacity: 0.8 }}>
          © {new Date().getFullYear()} ReservPark. Todos los derechos reservados.
        </ThemedText>
      </View>
    </ProfileModalBase>
  );
}


