import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
}

export function FeatureCard({ 
  title, 
  description, 
  iconName, 
  onPress,
  variant = 'primary' 
}: FeatureCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cardStyle = variant === 'primary' 
    ? [styles.card, { backgroundColor: colors.primary }]
    : [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }];

  const textColor = variant === 'primary' ? colors.accent : colors.text;
  const iconColor = variant === 'primary' ? colors.accent : colors.primary;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView style={cardStyle}>
        <View style={styles.iconContainer}>
          <IconSymbol 
            name={iconName} 
            size={32} 
            color={iconColor}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <ThemedText 
            style={[styles.title, { color: textColor }]}
            type="defaultSemiBold"
          >
            {title}
          </ThemedText>
          
          <ThemedText 
            style={[styles.description, { color: textColor }]}
            type="default"
          >
            {description}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconContainer: {
    marginBottom: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});