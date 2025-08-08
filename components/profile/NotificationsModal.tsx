import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Switch, View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [enabled, setEnabled] = React.useState(true);
  const [promo, setPromo] = React.useState(false);

  return (
    <ProfileModalBase visible={visible} title="Notificaciones" onClose={onClose}>
      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Alertas de reservas</ThemedText>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Promociones</ThemedText>
          <Switch value={promo} onValueChange={setPromo} />
        </View>
      </View>
    </ProfileModalBase>
  );
}


