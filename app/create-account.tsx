import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CreateAccountScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const router = useRouter();

  const notImplemented = (name: string) => Alert.alert(name, 'Disponible próximamente');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <LinearGradient
        colors={scheme === 'dark' ? ['#0f2027', '#203a43'] : ['#f8fafc', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={styles.cardHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={[styles.title, { color: colors.text }]} type="defaultSemiBold">Crear nueva cuenta</ThemedText>
          <View style={{ width: 20 }} />
        </View>
        <ThemedText style={[styles.subtitle, { color: colors.text }]}>Comienza creando una cuenta gratuita. Es rápido y te ayudará a gestionar tus reservas.</ThemedText>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/create-account-email')}
        >
          <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">
            Continuar con email
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.dividerRow}> 
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <ThemedText style={{ color: colors.text, opacity: 0.6 }}>o</ThemedText>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border }]} onPress={() => notImplemented('Apple')}>
          <Ionicons name="logo-apple" size={18} color={colors.text} />
          <ThemedText style={[styles.socialText, { color: colors.text }]}>Continuar con Apple</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border }]} onPress={() => notImplemented('Facebook')}>
          <Ionicons name="logo-facebook" size={18} color={colors.text} />
          <ThemedText style={[styles.socialText, { color: colors.text }]}>Continuar con Facebook</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.socialButton, { borderColor: colors.border }]} onPress={() => notImplemented('Google')}>
          <Ionicons name="logo-google" size={18} color={colors.text} />
          <ThemedText style={[styles.socialText, { color: colors.text }]}>Continuar con Google</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}> 
        <ThemedText style={{ color: colors.text, opacity: 0.6 }}>
          Al continuar, aceptas nuestros Términos y Política de Privacidad
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between' },
  headerRow: { gap: 8, marginTop: 8 },
  title: { fontSize: 24 },
  subtitle: { fontSize: 14, opacity: 0.8 },
  card: { gap: 12, borderRadius: 16, borderWidth: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  primaryButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { fontSize: 16 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6, justifyContent: 'center' },
  divider: { height: 1, flex: 1, opacity: 0.5 },
  socialButton: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  socialText: { fontSize: 15 },
  footer: { alignItems: 'center', marginBottom: 4 },
});


