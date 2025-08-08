import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container]}> 
      {/* Background gradient (hero) */}
      <LinearGradient
        colors={scheme === 'dark' ? ['#0f2027', '#203a43', '#2c5364'] : ['#1e3a8a', '#0ea5e9', '#14b8a6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Bottom hero content */}
      <View style={[styles.hero, { paddingBottom: Math.max(28, insets.bottom + 18) }]}> 
        <ThemedText style={[styles.title]} type="title">
          Bienvenido a ReservPark
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Encuentra plazas cerca de ti y comparte la tuya fácilmente
        </ThemedText>

        <Link href="/create-account" asChild>
          <TouchableOpacity style={styles.primaryCta}>
            <ThemedText style={styles.primaryCtaText} type="defaultSemiBold">Crear una cuenta</ThemedText>
          </TouchableOpacity>
        </Link>

        <View style={styles.loginRow}>
          <ThemedText style={styles.loginText}>¿Ya tienes cuenta?</ThemedText>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.loginLink} type="defaultSemiBold"> Inicia sesión</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  primaryCta: {
    marginTop: 6,
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryCtaText: {
    color: '#111827',
    fontSize: 16,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  loginLink: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});


