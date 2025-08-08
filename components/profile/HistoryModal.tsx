import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HistoryModal({ visible, onClose }: HistoryModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ProfileModalBase visible={visible} title="Historial" onClose={onClose}>
      <ThemedText style={{ marginBottom: 6, color: colors.text }} type="defaultSemiBold">Últimas reservas</ThemedText>
      {[{ t: 'Gran Vía, 15', s: 'Ayer, 12:00 - 14:00' }, { t: 'Serrano, 32', s: 'Lun, 09:00 - 11:00' }].map((h, idx) => (
        <TouchableOpacity key={idx} style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
          backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <IconSymbol name="calendar" size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: colors.text }} type="defaultSemiBold">{h.t}</ThemedText>
              <ThemedText style={{ color: colors.text, opacity: 0.7 }}>{h.s}</ThemedText>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={16} color={colors.text} />
        </TouchableOpacity>
      ))}
    </ProfileModalBase>
  );
}


