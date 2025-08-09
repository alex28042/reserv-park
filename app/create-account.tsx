import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateAccountScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const router = useRouter();

  const notImplemented = (name: string) => Alert.alert(name, 'Disponible próximamente');
  const openLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch {}
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}> 
        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={[styles.title, { color: colors.text }]} type="title">Crear nueva cuenta</ThemedText>
          <View style={{ width: 20 }} />
        </View>
        <ThemedText style={[styles.subtitle, { color: colors.text, opacity: 0.8 }]}>Crea una cuenta gratuita para empezar. Tardarás menos de un minuto.</ThemedText>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/create-account-email')}
        >
          <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">
            Continuar con email
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.separatorRow}> 
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
          <ThemedText style={{ color: colors.text, opacity: 0.6 }}>o</ThemedText>
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={() => notImplemented('Apple')}>
          <Ionicons name="logo-apple" size={18} color={colors.text} style={{ width: 20 }} />
          <ThemedText style={[styles.socialText, { color: colors.text }]}>Continuar con Apple</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={() => notImplemented('Facebook')}>
          <Ionicons name="logo-facebook" size={18} color={'#1877F2'} style={{ width: 20 }} />
          <ThemedText style={[styles.socialText, { color: colors.text }]}>Continuar con Facebook</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={() => notImplemented('Google')}>
          <Ionicons name="logo-google" size={18} color={'#EA4335'} style={{ width: 20 }} />
          <ThemedText style={[styles.socialText, { color: colors.text }]}>Continuar con Google</ThemedText>
        </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}> 
        <Text style={[styles.legalText, { color: colors.text, opacity: 0.6 }]}>Al continuar, aceptas nuestros</Text>
        <View style={styles.legalRow}>
          <TouchableOpacity onPress={() => openLink('https://reservpark.app/terms')}>
            <Text style={[styles.legalLink, { color: colors.primary }]}>Términos</Text>
          </TouchableOpacity>
          <Text style={[styles.legalText, { color: colors.text, opacity: 0.6 }]}> y </Text>
          <TouchableOpacity onPress={() => openLink('https://reservpark.app/privacy')}>
            <Text style={[styles.legalLink, { color: colors.primary }]}>Política de Privacidad</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  content: { flex: 1, justifyContent: 'flex-start' },
  headerRow: { gap: 8, marginTop: 8 },
  title: { fontSize: 26 },
  subtitle: { fontSize: 14, opacity: 0.8 },
  card: { gap: 12, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  primaryButton: { height: 52, borderRadius: 20, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  primaryText: { fontSize: 16 },
  separatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6, justifyContent: 'center' },
  separator: { height: 1, flex: 1, opacity: 0.5 },
  socialButton: { height: 52, borderRadius: 14, alignItems: 'center', borderWidth: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  socialText: { fontSize: 15 },
  footer: { alignItems: 'center', marginTop: 12, marginBottom: 8 },
  legalText: { fontSize: 12 },
  legalRow: { flexDirection: 'row', alignItems: 'center' },
  legalLink: { fontSize: 12, fontWeight: '700' },
});


