import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HelpModal({ visible, onClose }: HelpModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ProfileModalBase visible={visible} title="Centro de ayuda" onClose={onClose}>
      <ThemedText style={{ marginBottom: 6, color: colors.text }} type="defaultSemiBold">Temas populares</ThemedText>
      {[{ t: 'Problemas con un pago', s: 'Cómo resolverlo', icon: 'creditcard.fill' }, { t: 'Ubicación', s: 'Permisos y ajustes', icon: 'location.fill' }].map((item, idx) => (
        <TouchableOpacity key={idx} style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
          backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <IconSymbol name={item.icon as any} size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: colors.text }} type="defaultSemiBold">{item.t}</ThemedText>
              <ThemedText style={{ color: colors.text, opacity: 0.7 }}>{item.s}</ThemedText>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={16} color={colors.text} />
        </TouchableOpacity>
      ))}
    </ProfileModalBase>
  );
}


