import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
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
        <View style={styles.bottomCard}>
          <Animated.Image
            source={require('../assets/images/reservpark-logo.jpeg')}
            style={[styles.miniLogo, { transform: [{ translateY: miniLogoTranslateY }] }]}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.accent }]}>ReservPark</Text>
          <Text style={[styles.subtitle, { color: colors.accent }]}>Encuentra y ofrece plazas fácilmente</Text>

          <Animated.View style={[styles.actions, { opacity: buttonsOpacity }]}> 
            <Link href="/login" asChild>
              <TouchableOpacity style={[styles.ctaButton, styles.primaryButton]}> 
                <Text style={[styles.ctaText, styles.primaryText]}>Iniciar sesión</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/register" asChild>
              <TouchableOpacity style={[styles.ctaButton, styles.secondaryButton]}> 
                <Text style={[styles.ctaText, styles.secondaryText]}>Registrarse</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  fullLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullLogo: {
    width: '80%',
    height: '80%',
  },
  bottomCard: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  miniLogo: {
    width: 120,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
  },
  actions: {
    marginTop: 16,
    width: '100%',
    gap: 12,
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
  },
  primaryText: {
    color: '#111827',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderColor: '#E5E7EB',
  },
  secondaryText: {
    color: '#111827',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});


