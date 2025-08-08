import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { OfferSpotModal, OfferSpotPayload } from '@/components/OfferSpotModal';
import { ReservationDetails } from '@/components/ReservationDetails';
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

const initialSpots: ParkingSpot[] = [
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
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'available' | 'all'>('available');
  const [spots, setSpots] = useState<ParkingSpot[]>(initialSpots);
  const [mapView, setMapView] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<any>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [reservationDetailsVisible, setReservationDetailsVisible] = useState(false);
  const [reservationDetailsData, setReservationDetailsData] = useState<{
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
  } | null>(null);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  
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
    if (!spots || !Array.isArray(spots)) {
      console.warn('🚨 mockParkingSpots no está disponible');
      return [];
    }
    
    try {
      return spots.filter(spot => {
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
    setActiveSpotId(spot.id);
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

    // Preguntar si desea reservar y abrir detalles
    setTimeout(() => promptReserve(spot), 600);
  };

  const handleSearchPress = () => {
    Alert.alert('Búsqueda', 'Abrir búsqueda de ubicación');
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    Alert.alert('Buscar', `Aún no implementado. Consulta: ${searchQuery.trim()}`);
  };

  const computeDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbySuggestions = React.useMemo(() => {
    const source = spots.filter((s) => s.type === 'available');
    const text = searchQuery.trim().toLowerCase();
    const filtered = text
      ? source.filter((s) => s.address.toLowerCase().includes(text))
      : source;
    const items = [...filtered]
      .map((s) => {
        let distanceMeters = Number.MAX_SAFE_INTEGER;
        if (location?.latitude && location?.longitude) {
          distanceMeters = computeDistanceMeters(
            location.latitude,
            location.longitude,
            s.latitude,
            s.longitude
          );
        }
        const distanceKm = (distanceMeters / 1000);
        const distanceLabel = distanceMeters === Number.MAX_SAFE_INTEGER
          ? s.distance
          : `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
        return {
          id: s.id,
          title: s.address,
          subtitle: `${formatPriceLabel(s.price)} • ${distanceLabel}`,
          latitude: s.latitude,
          longitude: s.longitude,
          distanceMeters,
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
      .slice(0, 8);
    return items;
  }, [location, searchQuery, spots]);

  const goToSuggestion = (sug: { latitude: number; longitude: number; title: string }) => {
    setSearchQuery(sug.title);
    setIsSearchActive(false);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: sug.latitude,
          longitude: sug.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        },
        600
      );
    }
  };

  const centerOnUserLocation = async () => {
    try {
      await getCurrentLocation();
      // El useEffect se encargará de centrar el mapa cuando la ubicación se actualice
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    }
  };

  const getRegionOrFallback = (): Region => {
    if (currentRegion) return currentRegion;
    return {
      latitude: location?.latitude || 40.4168,
      longitude: location?.longitude || -3.7038,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const zoom = (factor: number) => {
    const region = getRegionOrFallback();
    const newRegion: Region = {
      ...region,
      latitudeDelta: clamp(region.latitudeDelta * factor, 0.001, 0.2),
      longitudeDelta: clamp(region.longitudeDelta * factor, 0.001, 0.2),
    };
    mapRef.current?.animateToRegion(newRegion, 250);
  };

  const zoomIn = () => zoom(0.5);
  const zoomOut = () => zoom(2);

  const handleOfferSubmit = (payload: OfferSpotPayload) => {
    // Create a new spot at current user location (or map center if available)
    const lat = location?.latitude || currentRegion?.latitude || 40.4168;
    const lon = location?.longitude || currentRegion?.longitude || -3.7038;
    const newSpot: ParkingSpot = {
      id: `${Date.now()}`,
      type: 'available',
      address: payload.address || 'Plaza ofrecida por usuario',
      price: `€${payload.price.toFixed(2)}/hora`,
      timeLeft: `${payload.leaveInMinutes} min (se va) • oferta ${Math.round(payload.offerDurationMinutes/60)}h`,
      distance: '0.1 km',
      latitude: lat,
      longitude: lon,
    };
    setSpots((prev) => [newSpot, ...prev]);
    setOfferModalVisible(false);
    // Centrar el mapa en la nueva plaza sin abrir modales
    setTimeout(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }, 100);
  };

  const handleMarkerPress = (spot: ParkingSpot) => {
    setActiveSpotId(spot.id);
    // Zoom y abrir modal directamente
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: spot.latitude,
        longitude: spot.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 400);
    }
    promptReserve(spot);
  };

  const promptReserve = (spot: ParkingSpot) => {
    Alert.alert(
      'Reservar plaza',
      `¿Quieres reservar esta plaza en\n${spot.address}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, reservar',
          style: 'default',
          onPress: () => openReservationFlowFromSpot(spot),
        },
      ]
    );
  };

  const openReservationFlowFromSpot = (spot: ParkingSpot) => {
    // Close fullscreen map and search
    setIsFullscreenMap(false);
    setIsSearchActive(false);
    setSearchQuery('');
    // Open ReservationModal (multi-step flow)
    handleReservation(spot);
  };

  const openReservationDetailsFromSpot = (spot: ParkingSpot) => {
    // Close fullscreen map and search UI if open
    setIsFullscreenMap(false);
    setIsSearchActive(false);
    setSearchQuery('');

    const now = new Date();
    const date = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const reservation = {
      id: `r-${spot.id}-${now.getTime()}`,
      type: 'active' as const,
      address: spot.address,
      date,
      time,
      price: spot.price,
      duration: '1 hora',
      status: 'Reserva pendiente de inicio',
      latitude: spot.latitude,
      longitude: spot.longitude,
    };
    setReservationDetailsData(reservation);
    setReservationDetailsVisible(true);
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
                  onRegionChangeComplete={(r) => setCurrentRegion(r)}
                  zoomEnabled={true}
                  zoomControlEnabled={Platform.OS === 'android'}
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
                      onPress={() => handleMarkerPress(spot)}
                    >
                      <View style={styles.priceMarkerContainer}>
                        <View
                          style={[
                            styles.priceMarkerBubble,
                            {
                              backgroundColor:
                                activeSpotId === spot.id ? colors.primary : '#FFFFFF',
                              borderColor:
                                activeSpotId === spot.id ? colors.primary : '#E5E7EB',
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.priceMarkerText,
                              { color: activeSpotId === spot.id ? colors.accent : '#111827' },
                            ]}
                          >
                            {formatPriceLabel(spot.price)}
                          </ThemedText>
                        </View>
                        <View
                          style={[
                            styles.priceMarkerArrow,
                            {
                              borderTopColor:
                                activeSpotId === spot.id ? colors.primary : '#FFFFFF',
                            },
                          ]}
                        />
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
                onPress={zoomIn}
              >
                <IconSymbol name="plus" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 10 }]}
                onPress={zoomOut}
              >
                <IconSymbol name="minus" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 10 }]}
                onPress={centerOnUserLocation}
              >
                <IconSymbol name="location.fill" size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 10 }]}
                onPress={() => setIsFullscreenMap(true)}
              >
                <IconSymbol name="arrow.up.left.and.arrow.down.right" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botón debajo del mapa para ofrecer plaza */}
        {mapView && (
          <View style={styles.belowMapActions}>
            <TouchableOpacity
              style={[styles.offerButton, { backgroundColor: colors.primary }]}
              onPress={() => setOfferModalVisible(true)}
            >
              <IconSymbol name="plus" size={18} color={colors.accent} />
              <ThemedText style={[styles.offerButtonText, { color: colors.accent }]} type="defaultSemiBold">
                Ofrecer mi plaza
              </ThemedText>
            </TouchableOpacity>
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

      {/* Reservation Details Modal */}
      <ReservationDetails
        visible={reservationDetailsVisible}
        reservation={reservationDetailsData as any}
        onBack={() => setReservationDetailsVisible(false)}
      />

      {/* Offer Spot Modal */}
      <OfferSpotModal
        visible={offerModalVisible}
        onClose={() => setOfferModalVisible(false)}
        onSubmit={handleOfferSubmit}
      />

      {/* Fullscreen Map Modal */}
      <Modal visible={isFullscreenMap} animationType="slide" presentationStyle="fullScreen">
        <View style={{ flex: 1, backgroundColor: colors.background }}> 

          <View style={styles.fullscreenMapContainer}>
            <MapView
              ref={mapRef}
              style={styles.fullscreenMap}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              initialRegion={{
                latitude: location?.latitude || 40.4168,
                longitude: location?.longitude || -3.7038,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              onRegionChangeComplete={(r) => setCurrentRegion(r)}
              zoomEnabled={true}
              zoomControlEnabled={Platform.OS === 'android'}
              showsUserLocation={true}
              showsMyLocationButton={false}
              showsCompass={false}
              showsScale={false}
              mapType="standard"
              customMapStyle={colorScheme === 'dark' ? getDarkMapStyle() : undefined}
            >
              {/* User location marker */}
              {location && (
                <Marker
                  coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                  title="Tu ubicación"
                  description="Estás aquí"
                >
                  <View style={[styles.userMarker, { backgroundColor: colors.primary, borderColor: colorScheme === 'dark' ? '#1d2c4d' : '#FFFFFF' }]}> 
                    <View style={[styles.userMarkerInner, { backgroundColor: colors.accent }]} />
                  </View>
                </Marker>
              )}

              {/* Parking spots */}
              {filteredSpots?.length > 0 && filteredSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                  title={spot.address}
                  description={`${spot.price} • ${getStatusText(spot.type)} • ${spot.distance}`}
                  onPress={() => handleMarkerPress(spot)}
                >
                  <View style={styles.priceMarkerContainer}>
                    <View
                      style={[
                        styles.priceMarkerBubble,
                        {
                          backgroundColor: activeSpotId === spot.id ? colors.primary : '#FFFFFF',
                          borderColor: activeSpotId === spot.id ? colors.primary : '#E5E7EB',
                        },
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.priceMarkerText,
                          { color: activeSpotId === spot.id ? colors.accent : '#111827' },
                        ]}
                      >
                        {formatPriceLabel(spot.price)}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.priceMarkerArrow,
                        { borderTopColor: activeSpotId === spot.id ? colors.primary : '#FFFFFF' },
                      ]}
                    />
                  </View>
                </Marker>
              ))}
            </MapView>

            {/* Controls inside fullscreen */}
            <View style={styles.mapControls}>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={zoomIn}
              >
                <IconSymbol name="plus" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 10 }]}
                onPress={zoomOut}
              >
                <IconSymbol name="minus" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background, borderColor: colors.border, marginTop: 10 }]}
                onPress={centerOnUserLocation}
              >
                <IconSymbol name="location.fill" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Floating search + suggestions */}
            <View pointerEvents="box-none" style={[styles.floatingOverlay, { top: insets.top + 6 }]}>
              <View style={styles.floatingRow}>
                <TouchableOpacity
                  style={[styles.roundButton, { backgroundColor: '#FFFFFF' }]}
                  onPress={() => setIsFullscreenMap(false)}
                >
                  <IconSymbol name="chevron.down" size={18} color="#111827" />
                </TouchableOpacity>

                <View style={styles.searchPill}>
                  <IconSymbol name="magnifyingglass" size={18} color="#6B7280" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsSearchActive(true)}
                    onBlur={() => setIsSearchActive(false)}
                    onSubmitEditing={handleSearchSubmit}
                    placeholder="Buscar destino"
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchPillInput}
                    returnKeyType="search"
                  />
                </View>
              </View>

              {isSearchActive && (
                <View style={styles.suggestionsCard}> 
                  {nearbySuggestions.map((s, idx) => (
                    <TouchableOpacity key={s.id} style={styles.suggestionRow} onPress={() => goToSuggestion(s)}>
                      <View style={styles.suggestionIcon}>
                        <IconSymbol name="mappin.and.ellipse" size={14} color="#2563EB" />
                      </View>
                      <View style={styles.suggestionTexts}>
                        <ThemedText style={[styles.suggestionTitle, idx === 0 && { color: '#111827', fontWeight: '700' }]}>
                          {s.title}
                        </ThemedText>
                        <ThemedText style={styles.suggestionSubtitle}>{s.subtitle}</ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            </View>
        </View>
      </Modal>
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

function formatPriceLabel(price: string) {
  if (!price) return '';
  try {
    const normalized = price.replace(/\s/g, '');
    const match = normalized.match(/([0-9]+(?:[\.,][0-9]{1,2})?)/);
    if (!match) return price;
    const numeric = parseFloat(match[1].replace(',', '.'));
    if (Number.isNaN(numeric)) return price;
    const isInteger = Math.abs(numeric - Math.round(numeric)) < 1e-9;
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: isInteger ? 0 : 2,
    });
    return formatter.format(numeric);
  } catch (e) {
    return price;
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



