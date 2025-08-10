import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}> 
      {/* Background gradient */}
      <LinearGradient
        colors={scheme === 'dark' ? [colors.background, colors.primary] : [colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/images/reservpark-logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <ThemedText style={[styles.title, { color: colors.accent }]}>Bienvenido a ReservPark</ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.accent }]}>Encuentra plazas cerca de ti y comparte la tuya fácilmente</ThemedText>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <Link href="/create-account" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <ThemedText style={styles.primaryButtonText}>Crear una cuenta</ThemedText>
            </TouchableOpacity>
          </Link>

          <View style={styles.loginRow}>
            <ThemedText style={[styles.loginText, { color: colors.accent }]}>¿Ya tienes cuenta?</ThemedText>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <ThemedText style={[styles.loginLink, { color: colors.accent }]}> Inicia sesión</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40
  },
  logoSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: -40
  },
  logo: { 
    width: 150, 
    height: 150,
    borderRadius: 12,
    marginBottom: 20
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40
  },
  title: { 
    fontSize: 32, 
    fontWeight: '700',
    textAlign: 'center', 
    marginBottom: 16,
    lineHeight: 40
  },
  subtitle: { 
    fontSize: 18, 
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
    opacity: 0.9
  },
  buttonSection: {
    gap: 16
  },
  primaryButton: { 
    width: '100%', 
    backgroundColor: 'white',
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  primaryButtonText: { 
    color: '#059669',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center'
  },
  loginRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginText: { 
    fontSize: 16,
    opacity: 0.9
  },
  loginLink: { 
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
});


