import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateAccountEmailScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Introduce un correo válido');
      return;
    }
    router.push({ pathname: '/verify-email', params: { email } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <ThemedText style={[styles.step, { color: colors.text }]}>Paso 1 / 3</ThemedText>
          <ThemedText style={[styles.title, { color: colors.text }]} type="title">Añade tu email</ThemedText>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.text, marginBottom: 6 }}>Email</ThemedText>
          <TextInput
            placeholder="example@correo.com"
            placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleContinue}>
            <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Crear cuenta</ThemedText>
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
  card: { gap: 12, borderRadius: 16, borderWidth: 1, padding: 16 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  primaryButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  primaryText: { fontSize: 16 },
});


