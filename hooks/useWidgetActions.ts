import { useLiveActivity } from '@/contexts/LiveActivityContext';
import { useEffect, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';

interface WidgetAction {
  action: 'extend_time' | 'end_reservation';
  reservationId: string;
  minutes?: number;
  timestamp: number;
}

export function useWidgetActions() {
  const { actions } = useLiveActivity();
  const processedTimestamps = useRef<Set<number>>(new Set());

  const checkForPendingActions = async () => {
    try {
      // En React Native necesitamos usar AsyncStorage o una librería específica para App Groups
      // Para simplificar, usaremos el sistema de deep links existente
      console.log('Checking for pending widget actions...');
    } catch (error) {
      console.error('Error checking widget actions:', error);
    }
  };

  const handleWidgetAction = async (action: WidgetAction) => {
    // Evitar procesar la misma acción múltiples veces
    if (processedTimestamps.current.has(action.timestamp)) {
      return;
    }
    processedTimestamps.current.add(action.timestamp);

    try {
      switch (action.action) {
        case 'extend_time':
          if (action.minutes) {
            await actions.extendTime(action.minutes);
          }
          break;
        case 'end_reservation':
          await actions.endReservation();
          break;
        default:
          console.warn('Unknown widget action:', action.action);
      }
    } catch (error) {
      console.error('Error handling widget action:', error);
      Alert.alert('Error', 'No se pudo procesar la acción del widget');
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Verificar acciones pendientes cuando la app se activa
        checkForPendingActions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Verificar al montar el componente
    checkForPendingActions();

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    handleWidgetAction,
  };
}
