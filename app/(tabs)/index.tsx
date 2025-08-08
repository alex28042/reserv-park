import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { indexStyles as styles } from './index.styles';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeTab, setActiveTab] = useState('buscar');

  const handleFeaturePress = (feature: string) => {
    // Navegación específica para búsqueda y ubicaciones
    if (feature === 'Búsqueda' || feature === 'Buscar plaza' || feature === 'Reservar' || feature === 'Explorar zona') {
      router.push('/(tabs)/explore');
      return;
    }
    
    // Para otras funcionalidades, mostrar mensaje de desarrollo
    Alert.alert(
      'Funcionalidad en desarrollo',
      `La función "${feature}" estará disponible próximamente.`,
      [{ text: 'OK' }]
    );
  };

  const handleLocationPress = (location: string) => {
    // Navegar a explore cuando se toque una ubicación favorita
    router.push('/(tabs)/explore');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Enhanced Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <View style={styles.logoSection}>
              <View style={[styles.logoSmall, { backgroundColor: colors.primary }]}>
                <IconSymbol name="car.fill" size={22} color={colors.accent} />
              </View>
              <ThemedText style={[styles.appName, { color: colors.text }]} type="title">
                ReservPark
              </ThemedText>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface }]}
                onPress={() => handleFeaturePress('Notificaciones')}
              >
                <IconSymbol name="bell.fill" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface }]}
                onPress={() => handleFeaturePress('Perfil')}
              >
                <IconSymbol name="person.crop.circle.fill" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Enhanced Tab Selector */}
          <View style={styles.tabSection}>
            <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'buscar' && { backgroundColor: colors.primary }]}
                onPress={() => setActiveTab('buscar')}
              >
                <IconSymbol 
                  name="magnifyingglass" 
                  size={20} 
                  color={activeTab === 'buscar' ? colors.accent : colors.text} 
                />
                <ThemedText 
                  style={[
                    styles.tabText, 
                    { color: activeTab === 'buscar' ? colors.accent : colors.text }
                  ]}
                >
                  Buscar
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'ofrecer' && { backgroundColor: colors.primary }]}
                onPress={() => setActiveTab('ofrecer')}
              >
                <IconSymbol 
                  name="megaphone.fill" 
                  size={20} 
                  color={activeTab === 'ofrecer' ? colors.accent : colors.text} 
                />
                <ThemedText 
                  style={[
                    styles.tabText, 
                    { color: activeTab === 'ofrecer' ? colors.accent : colors.text }
                  ]}
                >
                  Ofrecer
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Enhanced Search */}
          <View style={styles.searchSection}>
            <TouchableOpacity 
              style={[styles.searchContainer, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => handleFeaturePress('Búsqueda')}
            >
              <IconSymbol name="magnifyingglass" size={22} color={colors.primary} />
              <ThemedText style={[styles.searchPlaceholder, { color: colors.text }]}>
                {activeTab === 'buscar' ? '¿Dónde quieres aparcar?' : '¿Dónde dejas tu plaza?'}
              </ThemedText>
              <IconSymbol name="arrow.right" size={16} color={colors.text} style={{ opacity: 0.4 }} />
            </TouchableOpacity>

            {/* Uber-like quick chips */}
            <View style={styles.chipsRow}>
              <TouchableOpacity 
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleFeaturePress('Explorar zona')}
              >
                <IconSymbol name="location.fill" size={14} color={colors.primary} />
                <ThemedText style={[styles.chipText, { color: colors.text }]}>Cerca de mí</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleFeaturePress('Reservar')}
              >
                <IconSymbol name="clock.fill" size={14} color={colors.text} />
                <ThemedText style={[styles.chipText, { color: colors.text }]}>Ahora</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleFeaturePress('Búsqueda')}
              >
                <IconSymbol name="building.2.fill" size={14} color={colors.text} />
                <ThemedText style={[styles.chipText, { color: colors.text }]}>Trabajo</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA Banner */}
          <TouchableOpacity 
            style={[styles.ctaBanner, { backgroundColor: colors.primary }]}
            onPress={() => handleFeaturePress('Reserva inteligente')}
          >
            <ThemedText style={[styles.ctaTitle, { color: colors.accent }]}>Reserva en pocos toques</ThemedText>
            <ThemedText style={[styles.ctaSubtitle, { color: colors.accent }]}>Elige un destino rápido o busca y asegura tu plaza</ThemedText>
            <View style={[styles.ctaAction, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <ThemedText style={{ color: colors.accent, fontWeight: '700' }}>Comenzar</ThemedText>
            </View>
          </TouchableOpacity>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]} type="title">
                  127
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                  Plazas cerca
                </ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.success }]} type="title">
                  89
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                  Disponibles
                </ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.warning }]} type="title">
                  €2.50
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                  Precio promedio
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Nearby horizontal list */}
          <View style={{ marginBottom: 24 }}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>Cerca de ti</ThemedText>
              <TouchableOpacity onPress={() => handleFeaturePress('Explorar zona')}>
                <ThemedText style={{ color: colors.primary, fontWeight: '700' }}>Ver más</ThemedText>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {[{ t: 'Centro', d: '0.5 km' }, { t: 'Oficina', d: '1.2 km' }, { t: 'Atocha', d: '2.1 km' }, { t: 'Chueca', d: '1.8 km' }].map((item, idx) => (
                <TouchableOpacity key={idx} style={[styles.nearbyCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => handleFeaturePress('Explorar zona')}>
                  <View style={[styles.nearbyIcon, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="location.fill" size={16} color={colors.accent} />
                  </View>
                  <ThemedText style={[styles.nearbyTitle, { color: colors.text }]}>{item.t}</ThemedText>
                  <ThemedText style={[styles.nearbySubtext, { color: colors.text }]}>{item.d}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Saved Locations */}
          <View style={styles.savedLocationsSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Ubicaciones Favoritas
              </ThemedText>
              <TouchableOpacity 
                style={[styles.seeAllButton, { backgroundColor: colors.surface }]}
                onPress={() => handleLocationPress('Ver todas')}
              >
                <ThemedText style={[styles.seeAllText, { color: colors.primary }]}>
                  Ver todas
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.savedLocations}>
              <SavedLocationItem 
                title="Oficina"
                address="Calle Gran Vía, 123"
                isWork={true}
                colors={colors}
                onPress={() => handleLocationPress('Oficina')}
              />
              <SavedLocationItem 
                title="Casa"
                address="Avenida de la Paz, 456"
                isWork={false}
                colors={colors}
                onPress={() => handleLocationPress('Casa')}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Acciones Rápidas
              </ThemedText>
            </View>
            
            <View style={styles.quickActionsGrid}>
              <QuickActionCard 
                title="Buscar"
                subtitle="Encuentra plazas"
                icon="magnifyingglass"
                colors={colors}
                onPress={() => handleFeaturePress('Buscar plaza')}
              />
              <QuickActionCard 
                title="Reservar"
                subtitle="Asegura tu plaza"
                icon="calendar.badge.plus"
                colors={colors}
                onPress={() => handleFeaturePress('Reservar')}
              />
              <QuickActionCard 
                title="Compartir"
                subtitle="Ofrece tu plaza"
                icon="megaphone.fill"
                colors={colors}
                onPress={() => handleFeaturePress('Compartir plaza')}
              />
            </View>
          </View>

          {/* Featured Services */}
          <View style={styles.featuresSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Descubre ReservPark
              </ThemedText>
            </View>
            
            <View style={styles.featuresList}>
              <FeatureCard 
                title="Reserva Inteligente"
                description="Encuentra y reserva la plaza perfecta con nuestro algoritmo de búsqueda avanzado que considera ubicación, precio y disponibilidad."
                icon="brain.head.profile"
                backgroundColor={colors.primary}
                textColor={colors.accent}
                actionText="Comenzar"
                onPress={() => handleFeaturePress('Reserva inteligente')}
              />
              
              <FeatureCard 
                title="Comunidad Local"
                description="Conecta con vecinos de tu zona para compartir plazas de aparcamiento y crear una red de estacionamiento colaborativo."
                icon="person.3.fill"
                backgroundColor={colors.secondary}
                textColor={colors.background}
                actionText="Unirse"
                onPress={() => handleFeaturePress('Comunidad')}
              />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Actividad Reciente
              </ThemedText>
            </View>
            
            <View style={styles.recentList}>
              <RecentItem 
                title="Plaza reservada en Gran Vía"
                time="Hace 2 horas"
                icon="checkmark.circle.fill"
                iconColor={colors.success}
                colors={colors}
              />
              <RecentItem 
                title="Búsqueda guardada en Centro"
                time="Ayer"
                icon="magnifyingglass.circle.fill"
                iconColor={colors.primary}
                colors={colors}
              />
              <RecentItem 
                title="Plaza compartida en Serrano"
                time="Hace 3 días"
                icon="megaphone.fill"
                iconColor={colors.warning}
                colors={colors}
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
  colors: any;
}

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  colors: any;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  actionText: string;
  onPress: () => void;
}

interface RecentItemProps {
  title: string;
  time: string;
  icon: string;
  iconColor: string;
  colors: any;
}

// Enhanced Saved Location Item Component
function SavedLocationItem({ title, address, onPress, isWork = false, colors }: SavedLocationItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.savedLocationItem, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={[styles.savedLocationIcon, { backgroundColor: colors.primary }]}>
        <IconSymbol 
          name={isWork ? 'building.2.fill' : 'house.fill'} 
          size={20} 
          color={colors.accent} 
        />
      </View>
      <View style={styles.savedLocationContent}>
        <ThemedText style={[styles.savedLocationTitle, { color: colors.text }]} type="defaultSemiBold">
          {title}
        </ThemedText>
        <ThemedText style={[styles.savedLocationAddress, { color: colors.text }]}>
          {address}
        </ThemedText>
      </View>
      <IconSymbol 
        name="chevron.right" 
        size={16} 
        color={colors.text} 
        style={styles.savedLocationChevron}
      />
    </TouchableOpacity>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, subtitle, icon, onPress, colors }: QuickActionCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
        <IconSymbol name={icon} size={28} color={colors.accent} />
      </View>
      <ThemedText style={[styles.quickActionTitle, { color: colors.text }]} type="defaultSemiBold">
        {title}
      </ThemedText>
      <ThemedText style={[styles.quickActionSubtitle, { color: colors.text }]}>
        {subtitle}
      </ThemedText>
    </TouchableOpacity>
  );
}

// Enhanced Feature Card Component
function FeatureCard({ title, description, icon, backgroundColor, textColor, actionText, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.featureCard, { backgroundColor }]} 
      onPress={onPress}
    >
      <View style={styles.featureHeader}>
        <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <IconSymbol name={icon} size={24} color={textColor} />
        </View>
        <View style={styles.featureContent}>
          <ThemedText style={[styles.featureTitle, { color: textColor }]} type="title">
            {title}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={[styles.featureDescription, { color: textColor }]}>
        {description}
      </ThemedText>
      <TouchableOpacity 
        style={[styles.featureAction, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
        onPress={onPress}
      >
        <ThemedText style={[styles.featureActionText, { color: textColor }]} type="defaultSemiBold">
          {actionText}
        </ThemedText>
        <IconSymbol name="arrow.right" size={14} color={textColor} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// Recent Activity Item Component
function RecentItem({ title, time, icon, iconColor, colors }: RecentItemProps) {
  return (
    <TouchableOpacity 
      style={[styles.recentItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.recentIcon, { backgroundColor: `${iconColor}20` }]}>
        <IconSymbol name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.recentContent}>
        <ThemedText style={[styles.recentTitle, { color: colors.text }]} type="defaultSemiBold">
          {title}
        </ThemedText>
        <ThemedText style={[styles.recentTime, { color: colors.text }]}>
          {time}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
