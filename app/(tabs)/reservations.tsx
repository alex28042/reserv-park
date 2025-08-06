import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReservationDetails } from '@/components/ReservationDetails';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { reservationsStyles as styles } from './reservations.styles';

interface Reservation {
  id: string;
  type: 'active' | 'completed' | 'cancelled';
  address: string;
  date: string;
  time: string;
  price: string;
  duration: string;
  status: string;
  latitude?: number;
  longitude?: number;
}

const mockReservations: Reservation[] = [
  {
    id: '1',
    type: 'active',
    address: 'Calle Gran Vía, 15',
    date: 'Hoy',
    time: '14:30 - 16:30',
    price: '€5.00',
    duration: '2h',
    status: 'Confirmada',
    latitude: 40.4200,
    longitude: -3.7025
  },
  {
    id: '2',
    type: 'active',
    address: 'Plaza de España, 8',
    date: 'Mañana',
    time: '09:00 - 11:00',
    price: '€6.00',
    duration: '2h',
    status: 'Pendiente',
    latitude: 40.4240,
    longitude: -3.7120
  },
  {
    id: '3',
    type: 'completed',
    address: 'Calle Serrano, 32',
    date: 'Ayer',
    time: '12:00 - 14:00',
    price: '€4.00',
    duration: '2h',
    status: 'Completada',
    latitude: 40.4300,
    longitude: -3.6900
  },
];

export default function ReservationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const filteredReservations = mockReservations.filter(reservation => {
    if (selectedTab === 'active') return reservation.type === 'active';
    return reservation.type === 'completed' || reservation.type === 'cancelled';
  });

  const handleReservationPress = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  const handleBackFromDetails = () => {
    setShowDetails(false);
    setSelectedReservation(null);
  };

  const handleNewReservation = () => {
    Alert.alert('Nueva reserva', 'Ir al mapa para buscar plazas disponibles');
  };

  // Removed conditional rendering - now using Modal

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
                <IconSymbol name="calendar" size={22} color={colors.accent} />
              </View>
              <ThemedText style={[styles.appName, { color: colors.text }]} type="title">
                Mis Reservas
              </ThemedText>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface }]}
                onPress={() => Alert.alert('Filtros', 'Filtrar reservas por fecha, estado, etc.')}
              >
                <IconSymbol name="line.3.horizontal.decrease.circle" size={18} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface }]}
                onPress={() => Alert.alert('Ayuda', 'Centro de ayuda para reservas')}
              >
                <IconSymbol name="questionmark.circle" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Tab Selector */}
        <View style={styles.tabSection}>
          <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'active' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSelectedTab('active')}
            >
              <IconSymbol 
                name="clock.badge" 
                size={18} 
                color={selectedTab === 'active' ? colors.accent : colors.text}
                style={styles.tabIcon} 
              />
              <ThemedText 
                style={[
                  styles.tabText, 
                  { color: selectedTab === 'active' ? colors.accent : colors.text }
                ]}
              >
                Activas
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'completed' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSelectedTab('completed')}
            >
              <IconSymbol 
                name="checkmark.circle" 
                size={18} 
                color={selectedTab === 'completed' ? colors.accent : colors.text}
                style={styles.tabIcon} 
              />
              <ThemedText 
                style={[
                  styles.tabText, 
                  { color: selectedTab === 'completed' ? colors.accent : colors.text }
                ]}
              >
                Historial
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {filteredReservations.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
                <IconSymbol 
                  name={selectedTab === 'active' ? "clock.badge.exclamationmark" : "calendar.badge.checkmark"} 
                  size={64} 
                  color={colors.primary} 
                />
              </View>
              <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                {selectedTab === 'active' ? 'No hay reservas activas' : 'Sin historial de reservas'}
              </ThemedText>
              <ThemedText style={[styles.emptySubtitle, { color: colors.text }]}>
                {selectedTab === 'active' 
                  ? 'Encuentra y reserva tu plaza de aparcamiento ideal cerca de ti'
                  : 'Tus reservas completadas y canceladas aparecerán en esta sección'
                }
              </ThemedText>
              {selectedTab === 'active' && (
                <TouchableOpacity 
                  style={[styles.emptyAction, { backgroundColor: colors.primary }]}
                  onPress={handleNewReservation}
                >
                  <IconSymbol name="magnifyingglass" size={16} color={colors.accent} />
                  <ThemedText style={[styles.emptyActionText, { color: colors.accent }]}>
                    Buscar plazas cercanas
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {/* Stats Section */}
              <View style={styles.statsSection}>
                <View style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.statItem}>
                    <ThemedText style={[styles.statNumber, { color: colors.primary }]} type="title">
                      {filteredReservations.length}
                    </ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                      {selectedTab === 'active' ? 'Activas' : 'Completadas'}
                    </ThemedText>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.statItem}>
                    <ThemedText style={[styles.statNumber, { color: colors.success }]} type="title">
                      {filteredReservations.reduce((sum, r) => sum + parseFloat(r.price.replace('€', '')), 0).toFixed(2)}€
                    </ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                      Total gastado
                    </ThemedText>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.statItem}>
                    <ThemedText style={[styles.statNumber, { color: colors.warning }]} type="title">
                      {filteredReservations.filter(r => r.type === 'active').length}
                    </ThemedText>
                    <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                      Pendientes
                    </ThemedText>
                  </View>
                </View>
              </View>
              {/* Enhanced Reservations List */}
              <View style={styles.reservationsList}>
                {filteredReservations.map((reservation, index) => (
                  <TouchableOpacity
                    key={reservation.id}
                    style={[styles.reservationCard, { backgroundColor: colors.background }]}
                    onPress={() => handleReservationPress(reservation)}
                  >
                    {/* Enhanced Status Header */}
                    <View style={[
                      styles.statusHeader,
                      { backgroundColor: getStatusColor(reservation.type, colors) }
                    ]}>
                      <View style={styles.statusContent}>
                        <View style={styles.statusLeft}>
                          <View style={styles.statusIcon}>
                            <IconSymbol 
                              name={reservation.type === 'active' ? 'clock.fill' : 'checkmark.circle.fill'} 
                              size={16} 
                              color={colors.background} 
                            />
                          </View>
                          <View style={styles.statusTextContainer}>
                            <ThemedText style={[styles.statusText, { color: colors.background }]}>
                              {reservation.status}
                            </ThemedText>
                            <ThemedText style={[styles.statusSubtext, { color: colors.background }]}>
                              {reservation.type === 'active' ? 'En curso' : 'Finalizada'}
                            </ThemedText>
                          </View>
                        </View>
                        <View style={styles.priceContainer}>
                          <ThemedText style={[styles.priceText, { color: colors.background }]}>
                            {reservation.price}
                          </ThemedText>
                          <ThemedText style={[styles.priceLabel, { color: colors.background }]}>
                            {reservation.duration}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={[styles.statusGradient, { backgroundColor: colors.background }]} />
                    </View>

                    {/* Enhanced Main Content */}
                    <View style={styles.cardContent}>
                      {/* Enhanced Date and Time */}
                      <View style={[styles.dateTimeSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.dateTimeHeader}>
                          <IconSymbol name="calendar" size={14} color={colors.primary} />
                          <ThemedText style={[styles.dateText, { color: colors.text }]}>
                            {reservation.date}
                          </ThemedText>
                        </View>
                        <View style={styles.timeContainer}>
                          <IconSymbol name="clock" size={12} color={colors.text} />
                          <ThemedText style={[styles.timeText, { color: colors.text }]}>
                            {reservation.time}
                          </ThemedText>
                          <View style={[styles.durationBadge, { backgroundColor: colors.primary }]}>
                            <ThemedText style={[styles.durationText, { color: colors.accent }]}>
                              {reservation.duration}
                            </ThemedText>
                          </View>
                        </View>
                      </View>

                      {/* Enhanced Location */}
                      <View style={[styles.locationSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.locationHeader}>
                          <View style={[styles.locationIcon, { backgroundColor: colors.primary }]}>
                            <IconSymbol name="mappin.circle.fill" size={14} color={colors.accent} />
                          </View>
                          <ThemedText style={[styles.locationHeaderText, { color: colors.text }]}>
                            Plaza de aparcamiento
                          </ThemedText>
                        </View>
                        <ThemedText style={[styles.locationAddress, { color: colors.text }]}>
                          {reservation.address}
                        </ThemedText>
                        <View style={styles.locationDetails}>
                          <View style={styles.locationDetail}>
                            <IconSymbol name="location" size={10} color={colors.text} />
                            <ThemedText style={[styles.locationDetailText, { color: colors.text }]}>
                              Zona centro
                            </ThemedText>
                          </View>
                          <View style={styles.locationDetail}>
                            <IconSymbol name="car" size={10} color={colors.text} />
                            <ThemedText style={[styles.locationDetailText, { color: colors.text }]}>
                              Cubierta
                            </ThemedText>
                          </View>
                        </View>
                      </View>

                      {/* Enhanced Actions */}
                      <View style={[styles.actionsSection, { borderTopColor: colors.border }]}>
                        {reservation.type === 'active' ? (
                          <View style={styles.actionButtons}>
                            <TouchableOpacity 
                              style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                              onPress={() => Alert.alert('Extender', 'Extender tiempo de reserva')}
                            >
                              <IconSymbol name="clock.arrow.circlepath" size={14} color={colors.text} />
                              <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>
                                Extender
                              </ThemedText>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                              onPress={() => Alert.alert('Navegación', 'Abrir en mapa')}
                            >
                              <IconSymbol name="location.fill" size={14} color={colors.accent} />
                              <ThemedText style={[styles.actionButtonText, { color: colors.accent }]}>
                                Ir ahora
                              </ThemedText>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <>
                            <View style={styles.quickActions}>
                              <TouchableOpacity 
                                style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                onPress={() => Alert.alert('Recibo', 'Ver recibo de la transacción')}
                              >
                                <IconSymbol name="doc.text" size={12} color={colors.text} />
                                <ThemedText style={[styles.quickActionText, { color: colors.text }]}>
                                  Recibo
                                </ThemedText>
                              </TouchableOpacity>
                              
                              <TouchableOpacity 
                                style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                onPress={() => Alert.alert('Valorar', 'Valorar experiencia')}
                              >
                                <IconSymbol name="star" size={12} color={colors.warning} />
                                <ThemedText style={[styles.quickActionText, { color: colors.text }]}>
                                  Valorar
                                </ThemedText>
                              </TouchableOpacity>
                              
                              <TouchableOpacity 
                                style={[styles.quickAction, { backgroundColor: colors.primary }]}
                                onPress={() => Alert.alert('Reservar', 'Reservar de nuevo en esta ubicación')}
                              >
                                <IconSymbol name="arrow.2.circlepath" size={12} color={colors.accent} />
                                <ThemedText style={[styles.quickActionText, { color: colors.accent }]}>
                                  Repetir
                                </ThemedText>
                              </TouchableOpacity>
                            </View>
                          </>
                        )}
                      </View>
                    </View>

                    {/* Tap indicator */}
                    <View style={{ 
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: colors.surface,
                      borderRadius: 10,
                      padding: 5
                    }}>
                      <IconSymbol name="chevron.right" size={10} color={colors.text} style={{ opacity: 0.5 }} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Enhanced Floating Action Button for Active Tab */}
        {selectedTab === 'active' && (
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: colors.primary }]}
              onPress={handleNewReservation}
            >
              <IconSymbol name="plus.circle.fill" size={26} color={colors.accent} style={styles.fabIcon} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de Detalles de Reserva */}
      <ReservationDetails
        visible={showDetails}
        reservation={selectedReservation}
        onBack={handleBackFromDetails}
      />
    </SafeAreaView>
  );
}

function getStatusColor(type: Reservation['type'], colors: any) {
  switch (type) {
    case 'active':
      return colors.success;
    case 'completed':
      return colors.primary;
    case 'cancelled':
      return colors.error;
    default:
      return colors.primary;
  }
}

