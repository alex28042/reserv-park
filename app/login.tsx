import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Introduce email y contraseña');
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}> 
        <View style={[styles.logo, { backgroundColor: colors.primary }]} />
        <ThemedText style={[styles.appName, { color: colors.text }]} type="title">ReservPark</ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <ThemedText style={[styles.title, { color: colors.text }]} type="defaultSemiBold">Iniciar sesión</ThemedText>
        <TextInput
          placeholder="Email"
          placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
          <Text style={[styles.buttonText, { color: colors.accent }]}>{loading ? 'Entrando…' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}> 
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.footerText, { color: colors.primary }]}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginTop: Platform.select({ ios: 0, default: 10 }), marginBottom: 16 },
  logo: { width: 48, height: 48, borderRadius: 24, marginBottom: 8 },
  appName: { fontSize: 20 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  title: { fontSize: 20, marginBottom: 4, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  button: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  buttonText: { fontWeight: '700' },
  footer: { alignItems: 'center', marginTop: 12 },
  footerText: { fontWeight: '700' },
});


