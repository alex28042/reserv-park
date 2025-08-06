import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    Platform,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { reservationDetailsStyles as styles } from '@/components/ReservationDetails.styles';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';

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

interface ReservationDetailsProps {
  visible: boolean;
  reservation: Reservation | null;
  onBack: () => void;
}

// Función para el mapa oscuro (reutilizada de explore)
function getDarkMapStyle() {
  return [
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#1d2c4d" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#8ec3b9" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1a3646" }]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#4b6878" }]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#64779f" }]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#4b6878" }]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#334e87" }]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [{ "color": "#023e58" }]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{ "color": "#283d6a" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#6f9ba4" }]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1d2c4d" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#3A7A6B" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#6CB89A" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#304a7d" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#98a5be" }]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1d2c4d" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "color": "#2c6675" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#255763" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#b0d5ce" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#023e58" }]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#98a5be" }]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#1d2c4d" }]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [{ "color": "#283d6a" }]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{ "color": "#3a4762" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#0e1626" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#4e6d70" }]
    }
  ];
}

// Navegación a mapas nativos (reutilizada de explore)
async function openNativeNavigation(latitude: number, longitude: number, address: string) {
  const destination = `${latitude},${longitude}`;
  const encodedAddress = encodeURIComponent(address);
  
  try {
    if (Platform.OS === 'ios') {
      const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}&ll=${destination}`;
      const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl);
      
      if (canOpenAppleMaps) {
        await Linking.openURL(appleMapsUrl);
        return;
      }
      
      const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
      await Linking.openURL(googleMapsWebUrl);
      
    } else {
      Alert.alert(
        '🗺️ Navegación',
        'Elige tu aplicación de mapas preferida:',
        [
          { 
            text: 'Google Maps', 
            onPress: async () => {
              try {
                const googleMapsAppUrl = `google.navigation:q=${destination}`;
                const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsAppUrl);
                
                if (canOpenGoogleMaps) {
                  await Linking.openURL(googleMapsAppUrl);
                } else {
                  const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
                  await Linking.openURL(googleMapsWebUrl);
                }
              } catch (error) {
                console.error('Error opening Google Maps:', error);
                Alert.alert('Error', 'No se pudo abrir Google Maps');
              }
            }
          },
          { 
            text: 'Waze', 
            onPress: async () => {
              try {
                const wazeUrl = `waze://?ll=${destination}&navigate=yes`;
                const canOpenWaze = await Linking.canOpenURL(wazeUrl);
                
                if (canOpenWaze) {
                  await Linking.openURL(wazeUrl);
                } else {
                  const wazeWebUrl = `https://waze.com/ul?ll=${destination}&navigate=yes`;
                  await Linking.openURL(wazeWebUrl);
                }
              } catch (error) {
                console.error('Error opening Waze:', error);
                Alert.alert('Error', 'No se pudo abrir Waze. ¿Está instalado?');
              }
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    }
  } catch (error) {
    console.error('Error opening navigation:', error);
    Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
  }
}

// Función para calcular distancia aproximada (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Función para estimar tiempo de viaje
function calculateTravelTime(distanceKm: number): string {
  // Estimación simple: velocidad promedio en ciudad ~25 km/h
  const averageSpeed = 25; 
  const timeHours = distanceKm / averageSpeed;
  const timeMinutes = Math.round(timeHours * 60);
  
  if (timeMinutes < 60) {
    return `${timeMinutes} min`;
  } else {
    const hours = Math.floor(timeMinutes / 60);
    const minutes = timeMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
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

export function ReservationDetails({ visible, reservation, onBack }: ReservationDetailsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { location } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [travelInfo, setTravelInfo] = useState<{ distance: string; time: string } | null>(null);

  // Coordenadas por defecto para la reserva (en un caso real vendrían de la API)
  const reservationLocation = reservation ? {
    latitude: reservation.latitude || 40.4168 + (Math.random() - 0.5) * 0.02,
    longitude: reservation.longitude || -3.7038 + (Math.random() - 0.5) * 0.02,
  } : {
    latitude: 40.4168,
    longitude: -3.7038,
  };

  // Calcular distancia y tiempo cuando tenemos la ubicación del usuario
  useEffect(() => {
    if (location && reservation) {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        reservationLocation.latitude,
        reservationLocation.longitude
      );
      
      const distanceText = distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
      const timeText = calculateTravelTime(distance);
      
      setTravelInfo({
        distance: distanceText,
        time: timeText
      });
    } else {
      setTravelInfo(null);
    }
  }, [location, reservation, reservationLocation.latitude, reservationLocation.longitude]);

  // Auto-centrar mapa en la reserva
  useEffect(() => {
    if (mapRef.current && reservation) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: reservationLocation.latitude,
          longitude: reservationLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }, 500);
    }
  }, [reservation, reservationLocation]);

  const handleNavigateToReservation = () => {
    if (reservation) {
      openNativeNavigation(reservationLocation.latitude, reservationLocation.longitude, reservation.address);
    }
  };

  const handleCancelReservation = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.',
      [
        { text: 'No cancelar', style: 'cancel' },
        { 
          text: 'Sí, cancelar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Reserva cancelada', 'Tu reserva ha sido cancelada exitosamente');
            onBack();
          }
        }
      ]
    );
  };

  const handleExtendReservation = () => {
    Alert.alert(
      'Extender Reserva',
      'Selecciona cuánto tiempo adicional necesitas:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: '30 min - €1.25', onPress: () => Alert.alert('Extendida', 'Reserva extendida por 30 minutos') },
        { text: '1 hora - €2.50', onPress: () => Alert.alert('Extendida', 'Reserva extendida por 1 hora') },
        { text: '2 horas - €5.00', onPress: () => Alert.alert('Extendida', 'Reserva extendida por 2 horas') },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onBack}
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <IconSymbol name="chevron.left" size={20} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={[styles.headerTitle, { color: colors.text }]} type="defaultSemiBold">
            Detalles de la Reserva
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Conditional content rendering */}
        {!reservation ? (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ThemedText style={[{ color: colors.text }]}>
              No se encontró información de la reserva
            </ThemedText>
          </View>
        ) : (

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(reservation.type, colors) }]}>
          <View style={styles.statusContent}>
            <IconSymbol 
              name={reservation.type === 'active' ? 'location.fill' : 'checkmark.circle.fill'} 
              size={24} 
              color={colors.background} 
            />
            <View style={styles.statusTextContainer}>
              <ThemedText style={[styles.statusText, { color: colors.background }]} type="defaultSemiBold">
                {reservation.status}
              </ThemedText>
              <ThemedText style={[styles.statusSubtext, { color: colors.background }]}>
                {reservation.type === 'active' ? 'Reserva activa' : 'Reserva completada'}
              </ThemedText>
            </View>
            <ThemedText style={[styles.statusPrice, { color: colors.background }]} type="title">
              {reservation.price}
            </ThemedText>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: reservationLocation.latitude,
                longitude: reservationLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              showsCompass={false}
              showsScale={false}
              mapType="standard"
              customMapStyle={colorScheme === 'dark' ? getDarkMapStyle() : undefined}
            >
              {/* User Location Marker */}
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Tu ubicación"
                  description="Estás aquí"
                >
                  <View style={[
                    styles.userMarker,
                    { 
                      backgroundColor: colors.primary,
                      borderColor: colorScheme === 'dark' ? '#1d2c4d' : '#FFFFFF',
                    }
                  ]}>
                    <View style={[styles.userMarkerInner, { backgroundColor: colors.accent }]} />
                  </View>
                </Marker>
              )}
              
              {/* Reservation Location Marker */}
              <Marker
                coordinate={reservationLocation}
                title={reservation.address}
                description="Tu plaza reservada"
              >
                <View style={[
                  styles.reservationMarker,
                  { 
                    backgroundColor: getStatusColor(reservation.type, colors),
                    borderColor: colorScheme === 'dark' ? '#1d2c4d' : '#FFFFFF',
                  }
                ]}>
                  <ThemedText style={styles.markerText}>P</ThemedText>
                </View>
              </Marker>
            </MapView>
          </View>
        </View>

        {/* Travel Info */}
        {travelInfo && (
          <View style={[styles.travelInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.travelItem}>
              <IconSymbol name="location.circle.fill" size={20} color={colors.primary} />
              <View>
                <ThemedText style={[styles.travelLabel, { color: colors.text }]}>Distancia</ThemedText>
                <ThemedText style={[styles.travelValue, { color: colors.text }]} type="defaultSemiBold">
                  {travelInfo.distance}
                </ThemedText>
              </View>
            </View>
            <View style={styles.travelItem}>
              <IconSymbol name="clock.fill" size={20} color={colors.primary} />
              <View>
                <ThemedText style={[styles.travelLabel, { color: colors.text }]}>Tiempo estimado</ThemedText>
                <ThemedText style={[styles.travelValue, { color: colors.text }]} type="defaultSemiBold">
                  {travelInfo.time}
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Reservation Details */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText style={[styles.cardTitle, { color: colors.text }]} type="defaultSemiBold">
            Información de la Reserva
          </ThemedText>
          
          <View style={styles.detailRow}>
            <IconSymbol name="calendar" size={16} color={colors.text} />
            <ThemedText style={[styles.detailLabel, { color: colors.text }]}>Fecha y hora:</ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.text }]} type="defaultSemiBold">
              {reservation.date} • {reservation.time}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <IconSymbol name="clock.fill" size={16} color={colors.text} />
            <ThemedText style={[styles.detailLabel, { color: colors.text }]}>Duración:</ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.text }]} type="defaultSemiBold">
              {reservation.duration}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <IconSymbol name="location.fill" size={16} color={colors.text} />
            <ThemedText style={[styles.detailLabel, { color: colors.text }]}>Ubicación:</ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.text }]} type="defaultSemiBold">
              {reservation.address}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <IconSymbol name="eurosign" size={16} color={colors.primary} />
            <ThemedText style={[styles.detailLabel, { color: colors.text }]}>Total pagado:</ThemedText>
            <ThemedText style={[styles.detailValue, { color: colors.primary }]} type="defaultSemiBold">
              {reservation.price}
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryAction, { backgroundColor: colors.primary }]}
            onPress={handleNavigateToReservation}
          >
            <IconSymbol name="location.fill" size={20} color={colors.accent} />
            <ThemedText style={[styles.actionText, { color: colors.accent }]} type="defaultSemiBold">
              Navegar a la Plaza
            </ThemedText>
          </TouchableOpacity>

          {reservation.type === 'active' && (
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={[styles.secondaryAction, { borderColor: colors.border }]}
                onPress={handleExtendReservation}
              >
                <IconSymbol name="clock.fill" size={16} color={colors.text} />
                <ThemedText style={[styles.secondaryActionText, { color: colors.text }]}>
                  Extender Tiempo
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.secondaryAction, { borderColor: colors.error }]}
                onPress={handleCancelReservation}
              >
                <IconSymbol name="xmark.circle.fill" size={16} color={colors.error} />
                <ThemedText style={[styles.secondaryActionText, { color: colors.error }]}>
                  Cancelar Reserva
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
        )}
    </SafeAreaView>
    </Modal>
  );
}