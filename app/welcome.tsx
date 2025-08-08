import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];

  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const miniLogoTranslateY = useRef(new Animated.Value(40)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(miniLogoTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      });
    }, 3000); // 3 segundos mostrando el logo centrado con fondo de marca

    return () => clearTimeout(timeout);
  }, [overlayOpacity, contentOpacity, miniLogoTranslateY, buttonsOpacity]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#003346' }]}> 
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, { backgroundColor: '#003346', opacity: overlayOpacity }]}
      >
        <Image
          source={require('../assets/images/reservpark-logo.jpeg')}
          style={styles.fullLogo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: contentOpacity }]}> 
        <View style={styles.headerArea}>
          <Animated.Image
            source={require('../assets/images/reservpark-logo.jpeg')}
            style={[styles.miniLogoTop, { transform: [{ translateY: miniLogoTranslateY }] }]}
            resizeMode="contain"
          />
        </View>

        <Animated.View style={[styles.actionsArea, { opacity: buttonsOpacity }]}> 
          <TouchableOpacity
            onPress={() => router.push('/login')}
            activeOpacity={0.85}
            style={styles.ctaButton}
          >
            <View style={styles.buttonInner}>
              <Text style={[styles.ctaText, styles.darkText]}>Iniciar sesión</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/register')}
            activeOpacity={0.85}
            style={styles.ctaButton}
          >
            <View style={styles.buttonInner}>
              <Text style={[styles.ctaText, styles.darkText]}>Crear nueva cuenta</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.footerText}>© 2025 ReservPark · Todos los derechos reservados</Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  fullLogo: {
    width: '80%',
    height: '80%',
  },
  headerArea: { alignItems: 'center', justifyContent: 'flex-start', paddingTop: 96, width: '100%', maxWidth: 520, alignSelf: 'center' },
  miniLogoTop: { width: 380, height: 190, marginBottom: 32 },
  actionsArea: { width: '100%', maxWidth: 520, alignSelf: 'center', paddingHorizontal: 24, paddingBottom: 48, gap: 14, marginTop: 24 },
  ctaButton: {
    width: '100%',
  },
  buttonInner: {
    width: '100%',
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    justifyContent: 'center',
  },
  darkText: { color: '#111827' },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  footerText: { textAlign: 'center', color: '#E6F2EE', marginTop: 14, fontSize: 12, opacity: 0.9 },
});


