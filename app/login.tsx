import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSuccess = (msg: string) => {
    (global as any).__mockAuth = true;
    router.replace('/(tabs)');
    Alert.alert('Éxito', msg);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerText}>Iniciar sesión</Text></View>
      <View style={styles.form}> 
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" />
        <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <TouchableOpacity style={[styles.submit, styles.primary]} onPress={() => onSuccess('Has iniciado sesión correctamente')}>
          <Text style={styles.submitText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.divider}><Text style={styles.dividerText}>o continúa con</Text></View>

        <TouchableOpacity style={[styles.submit, styles.google]} onPress={() => onSuccess('Login con Google OK')}>
          <Text style={[styles.submitText, { color: '#111827' }]}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submit, styles.apple]} onPress={() => onSuccess('Login con Apple OK')}>
          <Text style={styles.submitText}>Apple</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003346' },
  header: { padding: 24 },
  headerText: { color: '#E6F2EE', fontSize: 20, fontWeight: '800' },
  form: { flex: 1, paddingHorizontal: 24, gap: 12 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  submit: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#0EA5E9' },
  google: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  apple: { backgroundColor: '#111827' },
  submitText: { color: '#FFFFFF', fontWeight: '700' },
  divider: { alignItems: 'center', marginVertical: 8 },
  dividerText: { color: '#E6F2EE' },
});


