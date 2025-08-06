import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('buscar');

  const handleFeaturePress = (feature: string) => {
    Alert.alert(
      'Funcionalidad en desarrollo',
      `La función "${feature}" estará disponible próximamente.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simple Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <View style={[styles.logoSmall, { backgroundColor: colors.primary }]}>
              <IconSymbol name="car.fill" size={20} color={colors.accent} />
            </View>
            <ThemedText style={[styles.appName, { color: colors.text }]} type="defaultSemiBold">
              ReservPark
            </ThemedText>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'buscar' && { backgroundColor: colors.background }]}
            onPress={() => setActiveTab('buscar')}
          >
            <IconSymbol 
              name="magnifyingglass" 
              size={18} 
              color={activeTab === 'buscar' ? colors.primary : colors.text} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                { color: activeTab === 'buscar' ? colors.primary : colors.text }
              ]}
              type="defaultSemiBold"
            >
              Buscar
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ofrecer' && { backgroundColor: colors.background }]}
            onPress={() => setActiveTab('ofrecer')}
          >
            <IconSymbol 
              name="megaphone.fill" 
              size={18} 
              color={activeTab === 'ofrecer' ? colors.primary : colors.text} 
            />
            <ThemedText 
              style={[
                styles.tabText, 
                { color: activeTab === 'ofrecer' ? colors.primary : colors.text }
              ]}
              type="defaultSemiBold"
            >
              Ofrecer
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Search Input */}
          <TouchableOpacity 
            style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleFeaturePress('Búsqueda')}
          >
            <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
            <ThemedText style={[styles.searchPlaceholder, { color: colors.text }]}>
              {activeTab === 'buscar' ? '¿Dónde quieres aparcar?' : '¿Dónde dejas tu plaza?'}
            </ThemedText>
          </TouchableOpacity>

          {/* Saved Locations */}
          <View style={styles.savedLocations}>
            <SavedLocationItem 
              title="Trabajo"
              address="Calle Mayor 123"
              isWork={true}
              onPress={() => handleFeaturePress('Trabajo')}
            />
            <SavedLocationItem 
              title="Casa"
              address="Avenida Principal 456"
              isWork={false}
              onPress={() => handleFeaturePress('Casa')}
            />
          </View>

          {/* Suggestions */}
          <View style={styles.suggestionsSection}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]} type="defaultSemiBold">
                Sugerencias
              </ThemedText>
              <TouchableOpacity onPress={() => handleFeaturePress('Ver todo')}>
                <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>
                  Ver todo
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.suggestionsGrid}>
              <SuggestionCard 
                title="Buscar"
                type="search"
                onPress={() => handleFeaturePress('Buscar plaza')}
              />
              <SuggestionCard 
                title="Anunciar"
                type="announce"
                onPress={() => handleFeaturePress('Anunciar plaza')}
              />
              <SuggestionCard 
                title="Reservar"
                type="reserve"
                onPress={() => handleFeaturePress('Reservar')}
              />
              <SuggestionCard 
                title="Pagar"
                type="pay"
                onPress={() => handleFeaturePress('Pagar')}
              />
            </View>
          </View>

          {/* Ways to plan section */}
          <View style={styles.planningSection}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]} type="defaultSemiBold">
              Formas de aparcar con ReservPark
            </ThemedText>
            
            <View style={styles.planningCards}>
              <PlanningCard 
                title="Reserva una plaza"
                description="Encuentra y reserva tu plaza ideal antes de llegar"
                backgroundColor={colors.primary}
                textColor={colors.accent}
                onPress={() => handleFeaturePress('Reservar plaza')}
              />
              
              <PlanningCard 
                title="Explora tu zona"
                description="Descubre plazas disponibles cerca de ti en tiempo real"
                backgroundColor={colors.secondary}
                textColor={colors.background}
                onPress={() => handleFeaturePress('Explorar zona')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Component interfaces
interface SavedLocationItemProps {
  title: string;
  address: string;
  onPress: () => void;
  isWork?: boolean;
}

interface SuggestionCardProps {
  title: string;
  onPress: () => void;
  type: 'search' | 'announce' | 'reserve' | 'pay';
}

interface PlanningCardProps {
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
}

// Saved Location Item Component
function SavedLocationItem({ title, address, onPress, isWork = false }: SavedLocationItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity style={styles.savedLocationItem} onPress={onPress}>
      <View style={[styles.savedLocationIcon, { backgroundColor: colors.surface }]}>
        <IconSymbol name={isWork ? 'building.2.fill' : 'house.fill'} size={16} color={colors.text} />
      </View>
      <View style={styles.savedLocationContent}>
        <ThemedText style={[styles.savedLocationTitle, { color: colors.text }]} type="defaultSemiBold">
          {title}
        </ThemedText>
        <ThemedText style={[styles.savedLocationAddress, { color: colors.text }]} type="default">
          {address}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

// Suggestion Card Component
function SuggestionCard({ title, onPress, type }: SuggestionCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getIconName = () => {
    switch (type) {
      case 'search': return 'location.fill';
      case 'announce': return 'megaphone.fill';
      case 'reserve': return 'clock.fill';
      case 'pay': return 'creditcard.fill';
      default: return 'location.fill';
    }
  };

  return (
    <TouchableOpacity style={[styles.suggestionCard, { backgroundColor: colors.surface }]} onPress={onPress}>
      <View style={[styles.suggestionIcon, { backgroundColor: colors.background }]}>
        <IconSymbol name={getIconName()} size={24} color={colors.primary} />
      </View>
      <ThemedText style={[styles.suggestionTitle, { color: colors.text }]} type="default">
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Planning Card Component
function PlanningCard({ title, description, backgroundColor, textColor, onPress }: PlanningCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.planningCard, { backgroundColor }]} 
      onPress={onPress}
    >
      <ThemedText style={[styles.planningTitle, { color: textColor }]} type="defaultSemiBold">
        {title}
      </ThemedText>
      <ThemedText style={[styles.planningDescription, { color: textColor }]} type="default">
        {description}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.select({
      ios: 105, // 85px tab bar + 20px spacing
      default: 85, // 65px tab bar + 20px spacing
    }),
  },
  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 16,
  },
  // Content styles
  content: {
    paddingHorizontal: 20,
  },
  // Search styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    flex: 1,
  },
  // Saved locations styles
  savedLocations: {
    marginBottom: 32,
    gap: 12,
  },
  savedLocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  savedLocationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedLocationContent: {
    flex: 1,
  },
  savedLocationTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  savedLocationAddress: {
    fontSize: 14,
    opacity: 0.7,
  },
  // Suggestions styles
  suggestionsSection: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  suggestionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 8,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Planning section styles
  planningSection: {
    marginBottom: 32,
  },
  planningCards: {
    marginTop: 16,
    gap: 12,
  },
  planningCard: {
    padding: 20,
    borderRadius: 16,
    minHeight: 120,
  },
  planningTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planningDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});
