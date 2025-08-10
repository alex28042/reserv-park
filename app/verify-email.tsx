import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CODE_LENGTH = 6;

export default function VerifyEmailScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const router = useRouter();
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const displayEmail = useMemo(() => (email ?? '').toString(), [email]);

  const handleVerify = () => {
    if (code.join('').length < CODE_LENGTH) {
      Alert.alert('Código incompleto', `Introduce el código de ${CODE_LENGTH} dígitos`);
      return;
    }
    // Para demo: tras verificar, enviamos a login
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ThemedText style={[styles.title, { color: colors.text }]} type="title">Verifica tu email</ThemedText>
          <View style={styles.stepperRow}>
            <View style={[styles.stepDot, { backgroundColor: colors.border }]} />
            <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
            <View style={[styles.stepDot, { backgroundColor: colors.border }]} />
          </View>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}> 
        <Text style={[styles.helperText, { color: colors.text, opacity: 0.8 }]}>Te enviamos un código de {CODE_LENGTH} dígitos a {displayEmail || 'tu correo'}</Text>

        <View style={styles.codeRow}>
          {code.map((c, i) => (
            <TextInput
              key={i}
              ref={(r: TextInput | null) => { inputsRef.current[i] = r; }}
              keyboardType="number-pad"
              maxLength={1}
              value={c}
              onChangeText={(t) => {
                const val = t.replace(/\D/g, '').slice(0, 1);
                const next = [...code];
                next[i] = val;
                setCode(next);
                if (val && i < code.length - 1) {
                  inputsRef.current[i + 1]?.focus();
                }
                if (val && i === code.length - 1) {
                  // Auto-verify when all digits are filled
                  setTimeout(handleVerify, 50);
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && code[i] === '' && i > 0) {
                  inputsRef.current[i - 1]?.focus();
                }
              }}
              style={[styles.codeInput, { borderColor: colors.border, color: colors.text }]}
            />
          ))}
        </View>

        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleVerify}>
          <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Verificar email</ThemedText>
        </TouchableOpacity>

        <View style={styles.helperRow}>
          <Text style={[styles.helperText, { color: colors.text, opacity: 0.7 }]}>¿Email incorrecto? </Text>
          <TouchableOpacity onPress={() => router.replace('/create-account-email')}>
            <Text style={[styles.helperLink, { color: colors.primary }]}>Enviar a otro email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  title: { fontSize: 22 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  stepDot: { width: 18, height: 4, borderRadius: 2 },
  card: { gap: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  helperText: { fontSize: 12 },
  codeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  codeInput: { width: 48, height: 56, borderWidth: 1, borderRadius: 12, textAlign: 'center', fontSize: 20 },
  primaryButton: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  primaryText: { fontSize: 16 },
  helperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  helperLink: { fontSize: 12, fontWeight: '700' },
});


