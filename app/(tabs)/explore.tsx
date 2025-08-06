import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

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
  
  const getToggleIcon = (): 'funnel.fill' | 'map.fill' => {
    return mapView ? 'funnel.fill' : 'map.fill';
  };
  const { location, errorMsg, loading, getCurrentLocation } = useLocation();
  
  const filteredSpots = mockParkingSpots.filter(spot => {
    if (selectedFilter === 'all') return true;
    return spot.type === selectedFilter;
  });

  const handleSpotPress = (spot: ParkingSpot) => {
    Alert.alert(
      'Plaza de aparcamiento',
      `${spot.address}\n${spot.price}\nDisponible: ${spot.timeLeft}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reservar', onPress: () => Alert.alert('Reservado', `Plaza en ${spot.address} reservada`) }
      ]
    );
  };

  const handleSearchPress = () => {
    Alert.alert('Búsqueda', 'Abrir búsqueda de ubicación');
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
                    Cargando mapa...
                  </ThemedText>
                </View>
              ) : Platform.OS === 'ios' ? (
                <WebView
                  style={styles.map}
                  source={{
                    html: `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          * { margin: 0; padding: 0; }
                          html, body { height: 100%; width: 100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                          #map { 
                            height: 100%; 
                            width: 100%; 
                            background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%);
                            position: relative;
                            overflow: hidden;
                          }
                          .street { 
                            position: absolute; 
                            background: #ffffff; 
                            border-radius: 3px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          }
                          .building { 
                            position: absolute; 
                            background: #f0f0f0; 
                            border: 1px solid #e0e0e0;
                            border-radius: 6px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                          }
                          .park {
                            position: absolute;
                            background: #c8e6c9;
                            border-radius: 8px;
                            border: 1px solid #a5d6a7;
                          }
                          .marker { 
                            position: absolute; 
                            width: 32px; 
                            height: 32px; 
                            border-radius: 50%; 
                            border: 3px solid white;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: white;
                            font-size: 14px;
                            box-shadow: 0 3px 12px rgba(0,0,0,0.3);
                            transform: translate(-50%, -50%);
                            z-index: 10;
                            transition: all 0.2s ease;
                          }
                          .marker:hover {
                            transform: translate(-50%, -50%) scale(1.1);
                          }
                          .user-marker {
                            background: #007AFF;
                            animation: pulse 2s infinite;
                            width: 20px;
                            height: 20px;
                          }
                          .available { 
                            background: #34C759;
                            animation: availablePulse 3s infinite;
                          }
                          .reserved { background: #FF9500; }
                          .occupied { background: #FF3B30; }
                          
                          @keyframes pulse {
                            0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7); }
                            70% { box-shadow: 0 0 0 15px rgba(0, 122, 255, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
                          }
                          
                          @keyframes availablePulse {
                            0% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5); }
                            70% { box-shadow: 0 0 0 10px rgba(52, 199, 89, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0); }
                          }
                          
                          .label {
                            position: absolute;
                            background: rgba(0,0,0,0.8);
                            color: white;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-size: 11px;
                            font-weight: 500;
                            white-space: nowrap;
                            z-index: 5;
                            transform: translate(-50%, -100%);
                            margin-top: -8px;
                          }
                        </style>
                      </head>
                      <body>
                        <div id="map">
                          <!-- Streets with Apple Maps style -->
                          <div class="street" style="top: 25%; left: 0; width: 100%; height: 10px;"></div>
                          <div class="street" style="top: 50%; left: 0; width: 100%; height: 12px;"></div>
                          <div class="street" style="top: 75%; left: 0; width: 100%; height: 10px;"></div>
                          <div class="street" style="top: 0; left: 25%; width: 10px; height: 100%;"></div>
                          <div class="street" style="top: 0; left: 50%; width: 12px; height: 100%;"></div>
                          <div class="street" style="top: 0; left: 75%; width: 10px; height: 100%;"></div>
                          
                          <!-- Buildings with Apple Maps styling -->
                          <div class="building" style="top: 5%; left: 5%; width: 18%; height: 18%;"></div>
                          <div class="building" style="top: 5%; left: 27%; width: 20%; height: 18%;"></div>
                          <div class="building" style="top: 5%; left: 52%; width: 20%; height: 18%;"></div>
                          <div class="building" style="top: 5%; left: 77%; width: 18%; height: 18%;"></div>
                          
                          <div class="building" style="top: 27%; left: 5%; width: 18%; height: 20%;"></div>
                          <div class="building" style="top: 27%; left: 77%; width: 18%; height: 20%;"></div>
                          
                          <div class="building" style="top: 52%; left: 5%; width: 18%; height: 20%;"></div>
                          <div class="building" style="top: 52%; left: 77%; width: 18%; height: 20%;"></div>
                          
                          <div class="building" style="top: 77%; left: 5%; width: 18%; height: 18%;"></div>
                          <div class="building" style="top: 77%; left: 27%; width: 20%; height: 18%;"></div>
                          <div class="building" style="top: 77%; left: 52%; width: 20%; height: 18%;"></div>
                          <div class="building" style="top: 77%; left: 77%; width: 18%; height: 18%;"></div>
                          
                          <!-- Parks -->
                          <div class="park" style="top: 30%; left: 30%; width: 15%; height: 15%;"></div>
                          <div class="park" style="top: 55%; left: 55%; width: 15%; height: 15%;"></div>
                          
                          <!-- User Location -->
                          <div class="marker user-marker" style="top: 50%; left: 50%;"></div>
                          <div class="label" style="top: 50%; left: 50%;">Tu ubicación</div>
                          
                          <!-- Parking Spots -->
                          <div class="marker available" style="top: 30%; left: 15%;">P</div>
                          <div class="label" style="top: 30%; left: 15%;">€2.50/h</div>
                          
                          <div class="marker reserved" style="top: 70%; left: 40%;">P</div>
                          <div class="label" style="top: 70%; left: 40%;">€3.00/h</div>
                          
                          <div class="marker available" style="top: 20%; left: 85%;">P</div>
                          <div class="label" style="top: 20%; left: 85%;">€2.00/h</div>
                          
                          <div class="marker occupied" style="top: 85%; left: 20%;">P</div>
                          <div class="label" style="top: 85%; left: 20%;">€4.00/h</div>
                          
                          <div class="marker available" style="top: 40%; left: 65%;">P</div>
                          <div class="label" style="top: 40%; left: 65%;">€2.80/h</div>
                        </div>
                      </body>
                      </html>
                    `,
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                />
              ) : (
                <WebView
                  style={styles.map}
                  source={{
                    html: `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                          * { margin: 0; padding: 0; }
                          html, body { height: 100%; width: 100%; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                          #map { 
                            height: 100%; 
                            width: 100%; 
                            background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
                            position: relative;
                            overflow: hidden;
                          }
                          .street { 
                            position: absolute; 
                            background: #ddd; 
                            border-radius: 2px;
                          }
                          .building { 
                            position: absolute; 
                            background: #ccc; 
                            border: 1px solid #bbb;
                            border-radius: 4px;
                          }
                          .marker { 
                            position: absolute; 
                            width: 24px; 
                            height: 24px; 
                            border-radius: 50%; 
                            border: 2px solid white;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            color: white;
                            font-size: 12px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            transform: translate(-50%, -50%);
                            z-index: 10;
                          }
                          .user-marker {
                            background: #3A7A6B;
                            animation: pulse 2s infinite;
                          }
                          .available { background: #10B981; }
                          .reserved { background: #F59E0B; }
                          .occupied { background: #EF4444; }
                          @keyframes pulse {
                            0% { box-shadow: 0 0 0 0 rgba(58, 122, 107, 0.7); }
                            70% { box-shadow: 0 0 0 10px rgba(58, 122, 107, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(58, 122, 107, 0); }
                          }
                        </style>
                      </head>
                      <body>
                        <div id="map">
                          <!-- Streets -->
                          <div class="street" style="top: 30%; left: 0; width: 100%; height: 8px;"></div>
                          <div class="street" style="top: 70%; left: 0; width: 100%; height: 8px;"></div>
                          <div class="street" style="top: 0; left: 30%; width: 8px; height: 100%;"></div>
                          <div class="street" style="top: 0; left: 70%; width: 8px; height: 100%;"></div>
                          
                          <!-- Buildings -->
                          <div class="building" style="top: 10%; left: 10%; width: 15%; height: 15%;"></div>
                          <div class="building" style="top: 10%; left: 40%; width: 25%; height: 15%;"></div>
                          <div class="building" style="top: 10%; left: 75%; width: 20%; height: 15%;"></div>
                          <div class="building" style="top: 45%; left: 10%; width: 15%; height: 20%;"></div>
                          <div class="building" style="top: 45%; left: 40%; width: 25%; height: 20%;"></div>
                          <div class="building" style="top: 45%; left: 75%; width: 20%; height: 20%;"></div>
                          <div class="building" style="top: 80%; left: 10%; width: 15%; height: 15%;"></div>
                          <div class="building" style="top: 80%; left: 40%; width: 25%; height: 15%;"></div>
                          <div class="building" style="top: 80%; left: 75%; width: 20%; height: 15%;"></div>
                          
                          <!-- User Location -->
                          <div class="marker user-marker" style="top: 50%; left: 50%;">📍</div>
                          
                          <!-- Parking Spots -->
                          <div class="marker available" style="top: 35%; left: 20%;">P</div>
                          <div class="marker reserved" style="top: 75%; left: 45%;">P</div>
                          <div class="marker available" style="top: 25%; left: 80%;">P</div>
                          <div class="marker occupied" style="top: 85%; left: 25%;">P</div>
                        </div>
                      </body>
                      </html>
                    `,
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                />
              )}
            </View>
            
            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity 
                style={[styles.mapControl, { backgroundColor: colors.background }]}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    getCurrentLocation();
                  } else {
                    Alert.alert('Mi ubicación', 'Centrando en tu ubicación');
                  }
                }}
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
    height: 250,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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