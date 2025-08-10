import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Olvidé mi contraseña', 'Se ha enviado un enlace de restablecimiento a tu email.');
  };

  return (
    <SafeAreaView style={styles.container}> 
      <View style={styles.header}> 
        <Image 
          source={require('../assets/images/reservpark-logo.jpeg')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.card}> 
        <ThemedText style={[styles.title, { color: colors.text }]}>Iniciar sesión</ThemedText>
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={[styles.input, { color: colors.text, borderColor: '#E5E7EB' }]}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, styles.passwordInput, { color: colors.text, borderColor: '#E5E7EB' }]}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? 'eye-off' : 'eye'} 
                size={22} 
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.forgotText, { color: colors.primary }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>{loading ? 'Entrando…' : 'Entrar'}</Text>
        </TouchableOpacity>
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
    padding: 24, 
    justifyContent: 'center',
    backgroundColor: '#FAFAFA'
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  logo: { 
    width: 150, 
    height: 150, 
    marginBottom: 30,
    borderRadius: 12
  },

  card: { 
    backgroundColor: 'white',
    borderRadius: 20, 
    padding: 24, 
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700',
    marginBottom: 24, 
    textAlign: 'center' 
  },
  inputContainer: {
    marginBottom: 16
  },
  input: { 
    borderWidth: 1.5, 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#F8F9FA'
  },
  button: { 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  buttonText: { 
    fontWeight: '700', 
    fontSize: 16 
  },
  footer: { 
    alignItems: 'center', 
    marginTop: 32 
  },
  footerText: { 
    fontWeight: '600',
    fontSize: 16
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
    top: 16, 
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


