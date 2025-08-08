import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SetPasswordScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleFinish = async () => {
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'Usa al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      Alert.alert('No coincide', 'La confirmación no coincide');
      return;
    }
    // Demo: usaremos un email temporal si no llega desde params
    await signUp('nuevo@reservpark.com', password);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <ThemedText style={[styles.step, { color: colors.text }]}>Paso 3 / 3</ThemedText>
          <ThemedText style={[styles.title, { color: colors.text }]} type="title">Crea tu contraseña</ThemedText>
        </View>

        <View style={styles.card}> 
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
          />
          <TextInput
            placeholder="Confirmar contraseña"
            placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleFinish}>
            <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Finalizar</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { gap: 6, marginTop: 6, marginBottom: 10 },
  step: { fontSize: 12, opacity: 0.7 },
  title: { fontSize: 22 },
  card: { gap: 12 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  primaryButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryText: { fontSize: 16 },
});


