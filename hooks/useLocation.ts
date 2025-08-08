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
      // Evitar mostrar loading si ya tenemos una ubicación previa
      const hadPreviousLocation = Boolean(location);
      if (!hadPreviousLocation) {
        setLoading(true);
      }
      setErrorMsg(null);

      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return; // No se pudo obtener permiso
      }

      console.log('📍 Obteniendo ubicación (rápida si hay caché, luego precisa)...');

      // 1) Intento rápido: usar la última ubicación conocida para pintar algo al instante
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown) {
          const quickLocation: LocationData = {
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          };
          setLocation(quickLocation);
          setLoading(false);
        }
      } catch (e) {
        // Ignorar errores de last known; continuamos con el fetch en vivo
      }

      // 2) Actualización en segundo plano con una precisión equilibrada para ser más rápida
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          // maximumAge permite devolver valores cacheados muy recientes si están disponibles
          // @ts-ignore: algunas versiones permiten maximumAge
          maximumAge: 10000,
        } as any);

        const preciseLocation: LocationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };

        setLocation(preciseLocation);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error obteniendo ubicación (rápida/precisa):', error);
        if (!hadPreviousLocation) {
          setErrorMsg('No se pudo obtener tu ubicación. Verifica que el GPS esté activado.');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('❌ Error general al obtener ubicación:', error);
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