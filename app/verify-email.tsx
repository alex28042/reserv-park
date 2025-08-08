import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function VerifyEmailScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const router = useRouter();

  const displayEmail = useMemo(() => (email ?? '').toString(), [email]);

  const handleVerify = () => {
    if (code.join('').length < 5) {
      Alert.alert('Código incompleto', 'Introduce el código de 5 dígitos');
      return;
    }
    router.push('/set-password');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.headerRow}>
        <ThemedText style={[styles.step, { color: colors.text }]}>Paso 2 / 3</ThemedText>
        <ThemedText style={[styles.title, { color: colors.text }]} type="title">Verifica tu email</ThemedText>
        <ThemedText style={{ color: colors.text, opacity: 0.8 }}>
          Te enviamos un código de 5 dígitos a {displayEmail || 'tu correo'}
        </ThemedText>
      </View>

      <View style={styles.codeRow}>
        {code.map((c, i) => (
          <TextInput
            key={i}
            keyboardType="number-pad"
            maxLength={1}
            value={c}
            onChangeText={(t) => {
              const next = [...code];
              next[i] = t.replace(/\D/g, '');
              setCode(next);
            }}
            style={[styles.codeInput, { borderColor: colors.border, color: colors.text }]}
          />
        ))}
      </View>

      <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleVerify}>
        <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Verificar email</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { gap: 6, marginTop: 6, marginBottom: 16 },
  step: { fontSize: 12, opacity: 0.7 },
  title: { fontSize: 22 },
  codeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  codeInput: { width: 48, height: 56, borderWidth: 1, borderRadius: 12, textAlign: 'center', fontSize: 20 },
  primaryButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { fontSize: 16 },
});


