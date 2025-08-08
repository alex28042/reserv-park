import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { ProfileModalBase } from './ProfileModalBase';

interface EditProfileModalProps {
  visible: boolean;
  name: string;
  email: string;
  onSave: (name: string, email: string) => void;
  onClose: () => void;
}

export function EditProfileModal({ visible, name, email, onSave, onClose }: EditProfileModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [newName, setNewName] = React.useState(name);
  const [newEmail, setNewEmail] = React.useState(email);

  React.useEffect(() => {
    if (visible) {
      setNewName(name);
      setNewEmail(email);
    }
  }, [visible, name, email]);

  const handleSave = () => {
    onSave(newName.trim(), newEmail.trim());
    onClose();
  };

  return (
    <ProfileModalBase visible={visible} title="Editar perfil" onClose={onClose}>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <IconSymbol name="person.fill" size={32} color={colors.accent} />
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <View style={{ gap: 6 }}>
          <ThemedText style={{ color: colors.text }}>Nombre</ThemedText>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Tu nombre"
            placeholderTextColor={colorScheme === 'dark' ? '#A0A0A0' : '#9AA0A6'}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.text,
            }}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={{ gap: 6 }}>
          <ThemedText style={{ color: colors.text }}>Email</ThemedText>
          <TextInput
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="tu@email.com"
            placeholderTextColor={colorScheme === 'dark' ? '#A0A0A0' : '#9AA0A6'}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.text,
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Cancelar</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ThemedText style={{ color: colors.accent }} type="defaultSemiBold">Guardar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ProfileModalBase>
  );
}


