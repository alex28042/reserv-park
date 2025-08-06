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
  const [location, setLocation] = useState<LocationData | null>({
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        // Si no tenemos permisos, usar ubicación por defecto (Madrid)
        console.log('Permission denied, using default location');
        const defaultLocation: LocationData = {
          latitude: 40.4168,
          longitude: -3.7038,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setLocation(defaultLocation);
        setLoading(false);
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Error requesting permission, using default location');
      // Si hay error, usar ubicación por defecto
      const defaultLocation: LocationData = {
        latitude: 40.4168,
        longitude: -3.7038,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(defaultLocation);
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
        return; // Ya se estableció la ubicación por defecto
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationData: LocationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(locationData);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      // Si hay error, usar ubicación por defecto (Madrid)
      const defaultLocation: LocationData = {
        latitude: 40.4168,
        longitude: -3.7038,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(defaultLocation);
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