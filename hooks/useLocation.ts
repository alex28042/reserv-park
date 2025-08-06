import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationHookResult {
  location: LocationData | null;
  errorMsg: string | null;
  loading: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}

export function useLocation(): LocationHookResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const requestPermission = async (): Promise<boolean> => {
    try {
      // Primero verificar el estado actual de los permisos
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        return true;
      }

      // Si no tenemos permisos, solicitarlos
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Se necesitan permisos de ubicación para mostrar tu posición en el mapa');
        setLoading(false);
        return false;
      }
      
      setErrorMsg(null);
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setErrorMsg('Error al solicitar permisos de ubicación');
      setLoading(false);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<void> => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return; // No se pudo obtener permiso
      }

      console.log('📍 Obteniendo ubicación GPS del dispositivo...');
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Usar alta precisión
      });

      console.log('✅ Ubicación obtenida:', {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };

      setLocation(locationData);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error obteniendo ubicación:', error);
      setErrorMsg('No se pudo obtener tu ubicación. Verifica que el GPS esté activado.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get current location in background
    getCurrentLocation();
  }, []);

  return {
    location,
    errorMsg,
    loading,
    requestPermission,
    getCurrentLocation,
  };
}