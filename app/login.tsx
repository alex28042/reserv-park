import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      console.log('Iniciando login...');
      await signIn(email.trim(), password);
      console.log('Login exitoso!');
      // Forzar redirección manual
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    } catch (e) {
      console.error('Error en login:', e);
      Alert.alert('Error', 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Olvidé mi contraseña', 'Se ha enviado un enlace de restablecimiento a tu email.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}> 
        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
          <View style={styles.cardHeader}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <ThemedText style={[styles.title, { color: colors.text }]} type="title">Iniciar sesión</ThemedText>
            <View style={{ width: 20 }} />
          </View>
          
          <ThemedText style={[styles.subtitle, { color: colors.text, opacity: 0.8 }]}>
            Introduce tus credenciales para acceder a tu cuenta
          </ThemedText>
        
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#94A3B8'}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, styles.passwordInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]} 
            onPress={handleLogin} 
            disabled={loading}
          >
            <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">
              {loading ? 'Entrando…' : 'Entrar'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}> 
        <TouchableOpacity onPress={() => router.push('/create-account')}>
          <Text style={[styles.footerText, { color: colors.primary }]}>¿No tienes cuenta? Crea una</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  content: { 
    flex: 1, 
    justifyContent: 'flex-start' 
  },
  card: { 
    gap: 12, 
    borderRadius: 24, 
    padding: 20, 
    shadowColor: '#000', 
    shadowOpacity: 0.06, 
    shadowRadius: 14, 
    shadowOffset: { width: 0, height: 8 }, 
    elevation: 2 
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingBottom: 4 
  },
  backButton: { 
    width: 32, 
    height: 32, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 16 
  },
  title: { 
    fontSize: 26 
  },
  subtitle: { 
    fontSize: 14, 
    opacity: 0.8 
  },
  inputContainer: {
    marginBottom: 16
  },
  input: { 
    height: 52,
    borderWidth: 1, 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    fontSize: 16
  },
  primaryButton: { 
    height: 52, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.12, 
    shadowRadius: 10, 
    shadowOffset: { width: 0, height: 6 }, 
    elevation: 4 
  },
  primaryText: { 
    fontSize: 16 
  },
  footer: { 
    alignItems: 'center', 
    marginTop: 12, 
    marginBottom: 8 
  },
  footerText: { 
    fontSize: 12,
    fontWeight: '700'
  },
  passwordContainer: { 
    position: 'relative' 
  },
  passwordInput: { 
    paddingRight: 50 
  },
  eyeIcon: { 
    position: 'absolute', 
    right: 16, 
    top: 14, 
    zIndex: 1,
    padding: 4
  },
  forgotText: { 
    textAlign: 'right', 
    fontSize: 14, 
    marginBottom: 16,
    fontWeight: '500'
  },
});


