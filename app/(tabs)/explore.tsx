import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';

interface ParkingSpot {
  id: string;
  type: 'available' | 'reserved' | 'occupied';
  address: string;
  price: string;
  timeLeft: string;
  distance: string;
  latitude: number;
  longitude: number;
}

const mockParkingSpots: ParkingSpot[] = [
  {
    id: '1',
    type: 'available',
    address: 'Calle Gran Vía, 15',
    price: '€2.50/hora',
    timeLeft: '45 min',
    distance: '0.2 km',
    latitude: 40.4200,
    longitude: -3.7025
  },
  {
    id: '2',
    type: 'reserved',
    address: 'Plaza de España, 8',
    price: '€3.00/hora',
    timeLeft: '15 min',
    distance: '0.5 km',
    latitude: 40.4240,
    longitude: -3.7120
  },
  {
    id: '3',
    type: 'available',
    address: 'Calle Serrano, 32',
    price: '€2.00/hora',
    timeLeft: '1h 20min',
    distance: '0.8 km',
    latitude: 40.4300,
    longitude: -3.6900
  },
  {
    id: '4',
    type: 'occupied',
    address: 'Paseo de la Castellana, 100',
    price: '€4.00/hora',
    timeLeft: '30 min',
    distance: '1.2 km',
    latitude: 40.4400,
    longitude: -3.6950
  },
];

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedFilter, setSelectedFilter] = useState<'available' | 'all'>('available');
  const [mapView, setMapView] = useState(true);
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<any>(null);
  
  const getToggleIcon = (): 'funnel.fill' | 'map.fill' => {
    return mapView ? 'funnel.fill' : 'map.fill';
  };
  const { location, errorMsg, loading, getCurrentLocation } = useLocation();
  
  // Auto-center map on user location when available
  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    }
  }, [location]);
  
  const filteredSpots = mockParkingSpots.filter(spot => {
    if (selectedFilter === 'all') return true;
    return spot.type === selectedFilter;
  });

  const handleSpotPress = (spot: ParkingSpot) => {
    // Hacer scroll hacia el mapa para mostrarlo
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }

    // Centrar el mapa en la plaza seleccionada
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.animateToRegion({
          latitude: spot.latitude,
          longitude: spot.longitude,
          latitudeDelta: 0.01, // Zoom más cercano para ver la plaza
          longitudeDelta: 0.01,
        }, 800);
      }, 300); // Delay para que primero se haga el scroll
    }

    // Mostrar el alert después del scroll y zoom
    setTimeout(() => {
      Alert.alert(
        'Plaza de aparcamiento',
        `${spot.address}\n${spot.price}\nDisponible: ${spot.timeLeft}\nDistancia: ${spot.distance}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Ver en mapa', 
            onPress: () => {
              // Hacer zoom aún más cercano cuando presionan "Ver en mapa"
              if (mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: spot.latitude,
                  longitude: spot.longitude,
                  latitudeDelta: 0.005, // Zoom muy cercano
                  longitudeDelta: 0.005,
                }, 600);
              }
            }
          },
          { 
            text: 'Reservar', 
            onPress: () => Alert.alert('Reservado', `Plaza en ${spot.address} reservada`) 
          }
        ]
      );
    }, 800);
  };

  const handleSearchPress = () => {
    Alert.alert('Búsqueda', 'Abrir búsqueda de ubicación');
  };

  const centerOnUserLocation = async () => {
    try {
      Alert.alert(
        '📍 Ubicación GPS',
        '¿Deseas actualizar tu ubicación y centrar el mapa?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Sí, obtener ubicación', 
            onPress: async () => {
              await getCurrentLocation();
              // El useEffect se encargará de centrar el mapa cuando la ubicación se actualice
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    }
  };

  const handleMarkerPress = (spot: ParkingSpot) => {
    // Zoom directo al marcador
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: spot.latitude,
        longitude: spot.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }

    // Mostrar información del spot sin mover el mapa de nuevo
    Alert.alert(
      'Plaza de aparcamiento',
      `${spot.address}\n${spot.price}\nDisponible: ${spot.timeLeft}\nDistancia: ${spot.distance}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reservar', 
          onPress: () => Alert.alert('Reservado', `Plaza en ${spot.address} reservada`) 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        ref={scrollRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simple Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <View style={[styles.logoSmall, { backgroundColor: colors.primary }]}>
              <IconSymbol name="location.fill" size={20} color={colors.accent} />
            </View>
            <ThemedText style={[styles.appName, { color: colors.text }]} type="defaultSemiBold">
              Explorar Plazas
            </ThemedText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <TouchableOpacity 
            style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleSearchPress}
          >
            <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
            <ThemedText style={[styles.searchPlaceholder, { color: colors.text }]}>
              ¿Dónde buscas aparcar?
            </ThemedText>
          </TouchableOpacity>

          {/* Quick Filters */}
          <View style={styles.quickFilters}>
            <TouchableOpacity
              style={[
                styles.quickFilter,
                { backgroundColor: selectedFilter === 'available' ? colors.primary : colors.surface }
              ]}
              onPress={() => setSelectedFilter('available')}
            >
              <IconSymbol 
                name="checkmark.circle.fill" 
                size={16} 
                color={selectedFilter === 'available' ? colors.accent : colors.text} 
              />
              <ThemedText 
                style={[
                  styles.quickFilterText, 
                  { color: selectedFilter === 'available' ? colors.accent : colors.text }
                ]}
              >
                Disponibles
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickFilter,
                { backgroundColor: selectedFilter === 'all' ? colors.primary : colors.surface }
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <IconSymbol 
                name="map.fill" 
                size={16} 
                color={selectedFilter === 'all' ? colors.accent : colors.text} 
              />
              <ThemedText 
                style={[
                  styles.quickFilterText, 
                  { color: selectedFilter === 'all' ? colors.accent : colors.text }
                ]}
              >
                Todas
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.viewToggle, { backgroundColor: colors.surface }]}
              onPress={() => setMapView(!mapView)}
            >
              <IconSymbol 
                name="arrow.up.arrow.down" 
                size={16} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Section */}
        {mapView && (
          <View style={styles.mapSection}>
            <View style={styles.mapContainer}>
              {loading ? (
                <View style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <ThemedText style={[styles.mapText, { color: colors.text }]} type="defaultSemiBold">
                    📍 Obteniendo tu ubicación...
                  </ThemedText>
                  <ThemedText style={[styles.mapSubtext, { color: colors.text }]}>
                    Asegúrate de permitir el acceso al GPS
                  </ThemedText>
                </View>
              ) : errorMsg ? (
                <View style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="location.fill" size={48} color={colors.error} />
                  <ThemedText style={[styles.mapText, { color: colors.error }]} type="defaultSemiBold">
                    Error de ubicación
                  </ThemedText>
                  <ThemedText style={[styles.mapSubtext, { color: colors.text }]}>
                    {errorMsg}
                  </ThemedText>
                  <TouchableOpacity 
                    style={[styles.retryButton, { backgroundColor: colors.primary }]}
                    onPress={getCurrentLocation}
                  >
                    <ThemedText style={[styles.retryText, { color: colors.accent }]}>
                      Reintentar
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <MapView
                  ref={mapRef}
                  style={styles.map}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                  initialRegion={{
                    latitude: location?.latitude || 40.4168,
                    longitude: location?.longitude || -3.7038,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                  }}
                  showsUserLocation={true}
                  showsMyLocationButton={false}
                  showsCompass={false}
                  showsScale={false}
                  mapType="standard"
                  customMapStyle={colorScheme === 'dark' ? [
                    {
                      "featureType": "all",
                      "stylers": [
                        { "saturation": -100 },
                        { "gamma": 0.5 }
                      ]
                    }
                  ] : undefined}
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
                      pinColor={colors.primary}
                    />
                  )}
                  
                  {/* Parking Spots Markers */}
                  {filteredSpots.map((spot) => (
                    <Marker
                      key={spot.id}
                      coordinate={{
                        latitude: spot.latitude,
                        longitude: spot.longitude,
                      }}
                      title={spot.address}
                      description={`${spot.price} • ${getStatusText(spot.type)} • ${spot.distance}`}
                      pinColor={getMarkerColor(spot.type, colors)}
                      onPress={() => handleMarkerPress(spot)}
                    >
                      <View style={[
                        styles.customMarker, 
                        { backgroundColor: getMarkerColor(spot.type, colors) }
                      ]}>
                        <ThemedText style={styles.markerText}>P</ThemedText>
                      </View>
                    </Marker>
                  ))}
                </MapView>
              )}
            </View>
            
            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={centerOnUserLocation}
              >
                <IconSymbol name="location.fill" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <ThemedText style={[styles.resultsTitle, { color: colors.text }]} type="defaultSemiBold">
              {filteredSpots.length} plazas encontradas
            </ThemedText>
            <TouchableOpacity onPress={() => Alert.alert('Ordenar', 'Opciones de ordenación')}>
              <IconSymbol name="arrow.up.arrow.down" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Parking Spots List */}
          <View style={styles.spotsList}>
            {filteredSpots.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                style={[styles.spotCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleSpotPress(spot)}
              >
                <View style={styles.spotContent}>
                  <View style={styles.spotInfo}>
                    <View style={styles.spotHeader}>
                      <ThemedText style={[styles.spotAddress, { color: colors.text }]} type="defaultSemiBold">
                        {spot.address}
                      </ThemedText>
                      <View style={[
                        styles.statusIndicator,
                        { backgroundColor: getStatusColor(spot.type, colors) }
                      ]} />
                    </View>
                    
                    <View style={styles.spotDetails}>
                      <View style={styles.spotDetail}>
                        <IconSymbol name="location.fill" size={14} color={colors.text} />
                        <ThemedText style={[styles.detailText, { color: colors.text }]}>
                          {spot.distance}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.spotDetail}>
                        <IconSymbol name="clock.fill" size={14} color={colors.text} />
                        <ThemedText style={[styles.detailText, { color: colors.text }]}>
                          {spot.timeLeft}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.spotPrice}>
                    <ThemedText style={[styles.priceText, { color: colors.primary }]} type="defaultSemiBold">
                      {spot.price}
                    </ThemedText>
                    <ThemedText style={[styles.priceSubtext, { color: colors.text }]}>
                      {getStatusText(spot.type)}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusColor(type: ParkingSpot['type'], colors: any) {
  switch (type) {
    case 'available':
      return colors.success;
    case 'reserved':
      return colors.warning;
    case 'occupied':
      return colors.error;
    default:
      return colors.primary;
  }
}

function getStatusText(type: ParkingSpot['type']) {
  switch (type) {
    case 'available':
      return 'Disponible';
    case 'reserved':
      return 'Reservada';
    case 'occupied':
      return 'Ocupada';
    default:
      return 'Desconocido';
  }
}

function getMarkerColor(type: ParkingSpot['type'], colors: any) {
  switch (type) {
    case 'available':
      return colors.success; // Verde para disponible
    case 'reserved':
      return colors.warning; // Naranja para reservada  
    case 'occupied':
      return colors.error;   // Rojo para ocupada
    default:
      return colors.primary; // Teal de la app
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
  // Search section
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    flex: 1,
  },
  quickFilters: {
    flexDirection: 'row',
    gap: 12,
  },
  quickFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  quickFilterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  // Map section
  mapSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  mapContainer: {
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mapText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  mapControl: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  // Custom marker styles
  customMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Results section
  resultsSection: {
    paddingHorizontal: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  spotsList: {
    gap: 12,
  },
  spotCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  spotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  spotInfo: {
    flex: 1,
    marginRight: 16,
  },
  spotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spotAddress: {
    fontSize: 16,
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  spotDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  spotDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    opacity: 0.7,
  },
  spotPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  priceSubtext: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
});