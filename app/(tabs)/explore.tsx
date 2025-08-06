import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReservationModal } from '@/components/ReservationModal';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import { exploreStyles as styles } from './explore.styles';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
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

  const filteredSpots = React.useMemo(() => {
    if (!mockParkingSpots || !Array.isArray(mockParkingSpots)) {
      console.warn('🚨 mockParkingSpots no está disponible');
      return [];
    }
    
    try {
      return mockParkingSpots.filter(spot => {
        if (!spot || typeof spot !== 'object') return false;
    if (selectedFilter === 'all') return true;
    return spot.type === selectedFilter;
  });
    } catch (error) {
      console.error('🚨 Error filtrando spots:', error);
      return [];
    }
  }, [selectedFilter]);

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
        '🅿️ Plaza de aparcamiento',
        `📍 ${spot.address}\n💰 ${spot.price}\n⏱️ Disponible: ${spot.timeLeft}\n📏 Distancia: ${spot.distance}`,
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
            text: '🚗 Reservar', 
            onPress: () => handleReservation(spot),
            style: 'default'
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
      '🅿️ Plaza de aparcamiento',
      `📍 ${spot.address}\n💰 ${spot.price}\n⏱️ Disponible: ${spot.timeLeft}\n📏 Distancia: ${spot.distance}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: '🚗 Reservar', 
          onPress: () => handleReservation(spot)
        }
      ]
    );
  };

  const handleReservation = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedSpot(null);
  };

  const handleNavigation = (latitude: number, longitude: number, address: string) => {
    console.log('🚗 Iniciando navegación a:', address);
    openNativeNavigation(latitude, longitude, address);
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
                          shadowColor: colorScheme === 'dark' ? '#000' : colors.primary,
                          shadowOpacity: colorScheme === 'dark' ? 0.6 : 0.4,
                        }
                      ]}>
                        <View style={[styles.userMarkerInner, { backgroundColor: colors.accent }]} />
                      </View>
                    </Marker>
                  )}
                  
                  {/* Parking Spots Markers */}
                  {filteredSpots?.length > 0 && filteredSpots.map((spot) => (
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
                        { 
                          backgroundColor: getMarkerColor(spot.type, colors),
                          borderColor: colorScheme === 'dark' ? '#1d2c4d' : '#FFFFFF',
                          shadowColor: colorScheme === 'dark' ? '#000' : '#000',
                          shadowOpacity: colorScheme === 'dark' ? 0.5 : 0.3,
                        }
                      ]}>
                        <ThemedText style={[styles.markerText, {
                          color: colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF',
                          textShadowColor: colorScheme === 'dark' ? '#000' : 'rgba(0,0,0,0.3)',
                          textShadowOffset: { width: 1, height: 1 },
                          textShadowRadius: 2,
                        }]}>P</ThemedText>
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
            {filteredSpots?.length > 0 ? filteredSpots.map((spot) => (
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
            )) : (
              <View style={styles.emptyState}>
                <IconSymbol name="car.fill" size={48} color={colors.text} />
                <ThemedText style={[styles.emptyText, { color: colors.text }]} type="defaultSemiBold">
                  No hay plazas {selectedFilter === 'all' ? '' : 'disponibles'} en esta zona
                </ThemedText>
                <ThemedText style={[styles.emptySubtext, { color: colors.text }]}>
                  Intenta cambiar el filtro o buscar en otra ubicación
              </ThemedText>
            </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Reservation Modal */}
      <ReservationModal
        visible={modalVisible}
        spot={selectedSpot}
        onClose={handleModalClose}
        onNavigate={handleNavigation}
      />
    </SafeAreaView>
  );
}

function getStatusColor(type: ParkingSpot['type'], colors: any) {
  if (!type || !colors) {
    console.warn('🚨 getStatusColor: parámetros inválidos', { type, colors: !!colors });
    return '#6366f1'; // Fallback color
  }
  
  switch (type) {
    case 'available':
      return colors.success || '#10b981';
    case 'reserved':
      return colors.warning || '#f59e0b';
    case 'occupied':
      return colors.error || '#ef4444';
    default:
      return colors.primary || '#6366f1';
  }
}

function getStatusText(type: ParkingSpot['type']) {
  if (!type) {
    console.warn('🚨 getStatusText: tipo inválido', { type });
    return 'Desconocido';
  }
  
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
  if (!type || !colors) {
    console.warn('🚨 getMarkerColor: parámetros inválidos', { type, colors: !!colors });
    return '#6366f1'; // Fallback color
  }
  
  switch (type) {
    case 'available':
      return colors.success || '#10b981'; // Verde para disponible
    case 'reserved':
      return colors.warning || '#f59e0b'; // Naranja para reservada  
    case 'occupied':
      return colors.error || '#ef4444';   // Rojo para ocupada
    default:
      return colors.primary || '#6366f1'; // Teal de la app
  }
}

function getDarkMapStyle() {
  return [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779f"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba4"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#3A7A6B"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6CB89A"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ];
}

// Navigation to native maps
async function openNativeNavigation(latitude: number, longitude: number, address: string) {
  const destination = `${latitude},${longitude}`;
  const encodedAddress = encodeURIComponent(address);
  
  try {
    if (Platform.OS === 'ios') {
      // Try Apple Maps first (native iOS)
      const appleMapsUrl = `maps://maps.apple.com/?q=${encodedAddress}&ll=${destination}`;
      const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl);
      
      if (canOpenAppleMaps) {
        await Linking.openURL(appleMapsUrl);
        return;
      }
      
      // Fallback to Google Maps web
      const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
      await Linking.openURL(googleMapsWebUrl);
      
    } else {
      // Android - Show options between Google Maps and Waze
      Alert.alert(
        '🗺️ Navegación',
        'Elige tu aplicación de mapas preferida:',
        [
          { 
            text: 'Google Maps', 
            onPress: async () => {
              try {
                // Try Google Maps app first
                const googleMapsAppUrl = `google.navigation:q=${destination}`;
                const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsAppUrl);
                
                if (canOpenGoogleMaps) {
                  await Linking.openURL(googleMapsAppUrl);
                } else {
                  // Fallback to Google Maps web
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
                // Try Waze app
                const wazeUrl = `waze://?ll=${destination}&navigate=yes`;
                const canOpenWaze = await Linking.canOpenURL(wazeUrl);
                
                if (canOpenWaze) {
                  await Linking.openURL(wazeUrl);
                } else {
                  // Fallback to Waze web
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



