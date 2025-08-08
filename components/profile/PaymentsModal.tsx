import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface PaymentsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PaymentsModal({ visible, onClose }: PaymentsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ProfileModalBase visible={visible} title="Pagos" onClose={onClose}>
      <ThemedText style={{ marginBottom: 6, color: colors.text }} type="defaultSemiBold">Métodos de pago</ThemedText>
      {[{ t: 'Visa •••• 1234', s: 'Principal' }, { t: 'Mastercard •••• 4567', s: 'Secundaria' }].map((p, idx) => (
        <TouchableOpacity key={idx} style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
          backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <IconSymbol name="creditcard.fill" size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: colors.text }} type="defaultSemiBold">{p.t}</ThemedText>
              <ThemedText style={{ color: colors.text, opacity: 0.7 }}>{p.s}</ThemedText>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={16} color={colors.text} />
        </TouchableOpacity>
      ))}
    </ProfileModalBase>
  );
}


