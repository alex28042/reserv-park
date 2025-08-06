import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Reservation {
  id: string;
  type: 'active' | 'completed' | 'cancelled';
  address: string;
  date: string;
  time: string;
  price: string;
  duration: string;
  status: string;
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
    status: 'Confirmada'
  },
  {
    id: '2',
    type: 'active',
    address: 'Plaza de España, 8',
    date: 'Mañana',
    time: '09:00 - 11:00',
    price: '€6.00',
    duration: '2h',
    status: 'Pendiente'
  },
  {
    id: '3',
    type: 'completed',
    address: 'Calle Serrano, 32',
    date: 'Ayer',
    time: '12:00 - 14:00',
    price: '€4.00',
    duration: '2h',
    status: 'Completada'
  },
];

export default function ReservationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed'>('active');

  const filteredReservations = mockReservations.filter(reservation => {
    if (selectedTab === 'active') return reservation.type === 'active';
    return reservation.type === 'completed' || reservation.type === 'cancelled';
  });

  const handleReservationPress = (reservation: Reservation) => {
    if (reservation.type === 'active') {
      Alert.alert(
        'Reserva activa',
        `${reservation.address}\n${reservation.date} - ${reservation.time}`,
        [
          { text: 'Ver detalles' },
          { text: 'Cancelar reserva', style: 'destructive' }
        ]
      );
    }
  };

  const handleNewReservation = () => {
    Alert.alert('Nueva reserva', 'Ir al mapa para buscar plazas disponibles');
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
              <IconSymbol name="calendar" size={20} color={colors.accent} />
            </View>
            <ThemedText style={[styles.appName, { color: colors.text }]} type="defaultSemiBold">
              Mis Reservas
            </ThemedText>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSection}>
          <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'active' && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSelectedTab('active')}
            >
              <ThemedText 
                style={[
                  styles.tabText, 
                  { color: selectedTab === 'active' ? colors.accent : colors.text }
                ]}
                type="defaultSemiBold"
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
              <ThemedText 
                style={[
                  styles.tabText, 
                  { color: selectedTab === 'completed' ? colors.accent : colors.text }
                ]}
                type="defaultSemiBold"
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
                 <IconSymbol name="calendar.badge.exclamationmark" size={64} color={colors.primary} />
               </View>
               <ThemedText style={[styles.emptyTitle, { color: colors.text }]} type="title">
                 {selectedTab === 'active' ? 'No hay reservas activas' : 'Sin historial'}
               </ThemedText>
               <ThemedText style={[styles.emptySubtitle, { color: colors.text }]}>
                 {selectedTab === 'active' 
                   ? 'Cuando reserves una plaza de aparcamiento aparecerá aquí'
                   : 'Tus reservas completadas aparecerán en esta sección'
                 }
               </ThemedText>
               {selectedTab === 'active' && (
                 <TouchableOpacity 
                   style={[styles.emptyAction, { backgroundColor: colors.primary }]}
                   onPress={handleNewReservation}
                 >
                   <ThemedText style={[styles.emptyActionText, { color: colors.accent }]} type="defaultSemiBold">
                     Buscar plazas cercanas
                   </ThemedText>
                 </TouchableOpacity>
               )}
             </View>
           ) : (
             <View style={styles.reservationsList}>
               {filteredReservations.map((reservation, index) => (
                 <TouchableOpacity
                   key={reservation.id}
                   style={[
                     styles.reservationCard, 
                     { 
                       backgroundColor: colors.background,
                       marginBottom: index === filteredReservations.length - 1 ? 0 : 16
                     }
                   ]}
                   onPress={() => handleReservationPress(reservation)}
                 >
                   {/* Status Header */}
                   <View style={[
                     styles.statusHeader,
                     { backgroundColor: getStatusColor(reservation.type, colors) }
                   ]}>
                     <View style={styles.statusContent}>
                       <View style={styles.statusLeft}>
                         <IconSymbol 
                           name={reservation.type === 'active' ? 'location.fill' : 'checkmark.circle.fill'} 
                           size={20} 
                           color={colors.background} 
                         />
                         <ThemedText style={[styles.statusText, { color: colors.background }]} type="defaultSemiBold">
                           {reservation.status}
                         </ThemedText>
                       </View>
                       <ThemedText style={[styles.priceText, { color: colors.background }]} type="title">
                         {reservation.price}
                       </ThemedText>
                     </View>
                   </View>

                   {/* Main Content */}
                   <View style={styles.cardContent}>
                     {/* Date and Time */}
                     <View style={styles.dateTimeSection}>
                       <ThemedText style={[styles.dateText, { color: colors.text }]} type="defaultSemiBold">
                         {reservation.date}
                       </ThemedText>
                       <ThemedText style={[styles.timeText, { color: colors.text }]}>
                         {reservation.time} • {reservation.duration}
                       </ThemedText>
                     </View>

                     {/* Location */}
                     <View style={styles.locationSection}>
                       <View style={styles.locationDot}>
                         <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                       </View>
                       <View style={styles.locationContent}>
                         <ThemedText style={[styles.locationLabel, { color: colors.text }]} type="default">
                           Plaza de aparcamiento
                         </ThemedText>
                         <ThemedText style={[styles.locationAddress, { color: colors.text }]} type="defaultSemiBold">
                           {reservation.address}
                         </ThemedText>
                       </View>
                     </View>

                     {/* Actions */}
                     <View style={styles.actionsSection}>
                       {reservation.type === 'active' ? (
                         <View style={styles.actionButtons}>
                           <TouchableOpacity 
                             style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                             onPress={() => Alert.alert('Extender', 'Extender tiempo de reserva')}
                           >
                             <IconSymbol name="clock.fill" size={16} color={colors.text} />
                             <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>
                               Extender
                             </ThemedText>
                           </TouchableOpacity>
                           
                           <TouchableOpacity 
                             style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                             onPress={() => Alert.alert('Navegación', 'Abrir en mapa')}
                           >
                             <IconSymbol name="location.fill" size={16} color={colors.accent} />
                             <ThemedText style={[styles.actionButtonText, { color: colors.accent }]}>
                               Ver en mapa
                             </ThemedText>
                           </TouchableOpacity>
                         </View>
                       ) : (
                         <View style={styles.actionButtons}>
                           <TouchableOpacity 
                             style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                             onPress={() => Alert.alert('Recibo', 'Ver recibo de la transacción')}
                           >
                             <IconSymbol name="creditcard.fill" size={16} color={colors.text} />
                             <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>
                               Ver recibo
                             </ThemedText>
                           </TouchableOpacity>
                           
                           <TouchableOpacity 
                             style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                             onPress={() => Alert.alert('Reservar', 'Reservar de nuevo en esta ubicación')}
                           >
                             <IconSymbol name="arrow.2.circlepath" size={16} color={colors.accent} />
                             <ThemedText style={[styles.actionButtonText, { color: colors.accent }]}>
                               Reservar de nuevo
                             </ThemedText>
                           </TouchableOpacity>
                         </View>
                       )}
                     </View>
                   </View>
                 </TouchableOpacity>
               ))}
             </View>
           )}
         </View>

        {/* Floating Action Button for Active Tab */}
        {selectedTab === 'active' && (
          <View style={styles.fabContainer}>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: colors.primary }]}
              onPress={handleNewReservation}
            >
              <IconSymbol name="plus" size={24} color={colors.accent} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
      ios: 165, // 85px tab bar + 80px spacing
      default: 145, // 65px tab bar + 80px spacing
    }),
  },
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
  tabSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyAction: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
  },
  emptyActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Reservations List
  reservationsList: {
    flex: 1,
  },
  reservationCard: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  // Status Header
  statusHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Card Content
  cardContent: {
    padding: 20,
  },
  dateTimeSection: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  // Location Section
  locationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 12,
  },
  locationDot: {
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  // Actions Section
  actionsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  primaryButton: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.select({
      ios: 105, // 85px tab bar + 20px spacing
      default: 85, // 65px tab bar + 20px spacing
    }),
    right: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});