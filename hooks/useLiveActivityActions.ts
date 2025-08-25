import { LiveActivityManager } from '@/modules/LiveActivityManager';
import { useEffect, useRef } from 'react';
import { Alert, Linking } from 'react-native';

export interface LiveActivityState {
  id: string | null;
  reservationId: string | null;
  location: string;
  endTime: Date | null;
}

interface UseLiveActivityActionsProps {
  liveActivityState: LiveActivityState;
  onStateUpdate: (state: Partial<LiveActivityState>) => void;
}

export function useLiveActivityActions({ liveActivityState, onStateUpdate }: UseLiveActivityActionsProps) {
  const linkingListenerRef = useRef<any>();

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      try {
        console.log('🔗 Deep link received:', url);
        
        const urlObj = new URL(url);
        const action = urlObj.pathname.replace('//', '');
        const params = new URLSearchParams(urlObj.search);
        
        console.log('🔍 Action:', action, 'Params:', Object.fromEntries(params));
        
        if (action === 'extend-time') {
          const reservationId = params.get('id');
          const minutes = parseInt(params.get('minutes') || '0');
          
          console.log('⏰ Extend time request:', { reservationId, minutes, hasActiveActivity: !!liveActivityState.id });
          
          if (reservationId && minutes) {
            await handleExtendTime(minutes);
          }
        } else if (action === 'end-reservation') {
          const reservationId = params.get('id');
          
          console.log('🛑 End reservation request:', { reservationId, hasActiveActivity: !!liveActivityState.id });
          
          if (reservationId) {
            await handleEndReservation();
          }
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    };

    const setupLinking = async () => {
      // Handle initial URL if app was opened via deep link
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }

      // Listen for subsequent deep links
      linkingListenerRef.current = Linking.addEventListener('url', (event) => {
        handleDeepLink(event.url);
      });
    };

    setupLinking();

    return () => {
      if (linkingListenerRef.current) {
        linkingListenerRef.current.remove();
      }
    };
  }, [liveActivityState.id]);

  const handleExtendTime = async (minutes: number) => {
    if (!liveActivityState.id || !liveActivityState.endTime) {
      Alert.alert('Error', 'No hay una reserva activa para extender');
      return;
    }

    try {
      // Calculate new end time
      const newEndTime = new Date(liveActivityState.endTime.getTime() + minutes * 60 * 1000);
      const now = new Date();
      const timeDiff = newEndTime.getTime() - now.getTime();
      const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      const timeRemaining = hoursRemaining > 0 
        ? `${hoursRemaining}h${minutesRemaining > 0 ? ` ${minutesRemaining}m` : ''}` 
        : `${minutesRemaining}m`;

      // Calculate new total duration in minutes
      const newTotalMinutes = Math.ceil(newEndTime.getTime() - Date.now()) / (1000 * 60);
      
      // Update Live Activity
      const updateData = {
        location: liveActivityState.location,
        timeRemaining: timeRemaining,
        status: 'Activo',
        endTime: newEndTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        canExtend: true,
        totalDurationMinutes: Math.round(newTotalMinutes),
      };

      const result = await LiveActivityManager.update(liveActivityState.id, updateData);
      
      if (result.isSuccess) {
        // Update local state
        onStateUpdate({ endTime: newEndTime });
        
        Alert.alert(
          'Tiempo extendido',
          `Se han agregado ${minutes} minutos a tu reserva. Nueva hora de finalización: ${newEndTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
        );
      } else {
        throw new Error(result.message || 'Error updating Live Activity');
      }
    } catch (error) {
      console.error('Error extending time:', error);
      Alert.alert('Error', 'No se pudo extender el tiempo de la reserva');
    }
  };

  const handleEndReservation = async () => {
    if (!liveActivityState.id) {
      Alert.alert('Error', 'No hay una reserva activa para finalizar');
      return;
    }

    Alert.alert(
      'Finalizar reserva',
      '¿Estás seguro de que quieres finalizar tu reserva de parking?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await LiveActivityManager.stop(liveActivityState.id!);
              
              if (result.isSuccess) {
                // Reset local state
                onStateUpdate({ 
                  id: null, 
                  reservationId: null, 
                  location: '',
                  endTime: null 
                });
                
                Alert.alert('Reserva finalizada', 'Tu reserva de parking ha sido finalizada exitosamente');
              } else {
                throw new Error(result.message || 'Error stopping Live Activity');
              }
            } catch (error) {
              console.error('Error ending reservation:', error);
              Alert.alert('Error', 'No se pudo finalizar la reserva');
            }
          }
        }
      ]
    );
  };

  const startLiveActivity = async (reservationData: {
    location: string;
    timeRemaining: string;
    status: string;
    endTime: string;
    canExtend: boolean;
    reservationId: string;
  }) => {
    try {
      const result = await LiveActivityManager.start(reservationData);
      
      if (result.isSuccess && result.id) {
        const endTimeDate = new Date();
        const [hours, minutes] = reservationData.endTime.split(':').map(Number);
        endTimeDate.setHours(hours, minutes, 0, 0);
        
        onStateUpdate({
          id: result.id,
          reservationId: reservationData.reservationId,
          location: reservationData.location,
          endTime: endTimeDate,
        });
        
        return { success: true, id: result.id };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error starting Live Activity:', error);
      return { success: false, message: 'Error iniciando Live Activity' };
    }
  };

  return {
    handleExtendTime,
    handleEndReservation,
    startLiveActivity,
  };
}
