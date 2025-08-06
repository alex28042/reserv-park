import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function AppHeader() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={[styles.logoCircle, { backgroundColor: colors.secondary }]}>
          <IconSymbol 
            name="car.fill" 
            size={28} 
            color={colors.accent}
          />
          <View style={[styles.arrowContainer, { backgroundColor: colors.secondary }]}>
            <IconSymbol 
              name="arrow.2.circlepath" 
              size={16} 
              color={colors.accent}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.titleContainer}>
        <ThemedText style={[styles.title, { color: colors.accent }]} type="title">
          ReservPark
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.accent }]} type="default">
          Revolucionando el aparcamiento en la vía pública
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
    maxWidth: 280,
  },
});