import { Colors } from '@/constants/Colors';
import { useLiveActivity } from '@/contexts/LiveActivityContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface LiveActivityDebugPanelProps {
  onClose: () => void;
}

export function LiveActivityDebugPanel({ onClose }: LiveActivityDebugPanelProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { state, actions } = useLiveActivity();

  const testStartLiveActivity = async () => {
    const testData = {
      location: 'Plaza Test - Calle Ejemplo, 123',
      timeRemaining: '2h',
      status: 'Activo',
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      canExtend: true,
      totalDurationMinutes: 120, // 2 horas
      reservationId: `test-${Date.now()}`,
    };

    try {
      const result = await actions.startLiveActivity(testData);
      if (result.success) {
        Alert.alert('✅ Live Activity iniciado', `ID: ${result.id}`);
      } else {
        Alert.alert('❌ Error', result.message || 'No se pudo iniciar');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error al iniciar Live Activity');
      console.error(error);
    }
  };

  const testExtendTime = async (minutes: number) => {
    if (!state.id) {
      Alert.alert('⚠️ Aviso', 'No hay Live Activity activo');
      return;
    }

    try {
      await actions.extendTime(minutes);
    } catch (error) {
      console.error('Error extending time:', error);
    }
  };

  const testEndReservation = async () => {
    if (!state.id) {
      Alert.alert('⚠️ Aviso', 'No hay Live Activity activo');
      return;
    }

    try {
      await actions.endReservation();
    } catch (error) {
      console.error('Error ending reservation:', error);
    }
  };

  return (
    <View style={{
      position: 'absolute',
      top: 100,
      left: 20,
      right: 20,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
          🧪 Live Activity Test
        </ThemedText>
        <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
          <ThemedText style={{ fontSize: 16, color: colors.text }}>✕</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Estado actual */}
      <View style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <ThemedText style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
          📊 Estado Actual
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: colors.text }}>
          ID: {state.id || 'Ninguno'}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: colors.text }}>
          Reserva: {state.reservationId || 'Ninguna'}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: colors.text }}>
          Ubicación: {state.location || 'Ninguna'}
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: colors.text }}>
          Fin: {state.endTime?.toLocaleTimeString('es-ES') || 'No definido'}
        </ThemedText>
      </View>

      {/* Botones de prueba */}
      <View style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={testStartLiveActivity}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 12,
            padding: 14,
            alignItems: 'center',
          }}
        >
          <ThemedText style={{ color: colors.accent, fontWeight: '600' }}>
            🚀 Iniciar Live Activity de Prueba
          </ThemedText>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => testExtendTime(30)}
            style={{
              flex: 1,
              backgroundColor: colors.success || '#10b981',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 12 }}>
              +30min
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => testExtendTime(60)}
            style={{
              flex: 1,
              backgroundColor: colors.success || '#10b981',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 12 }}>
              +1h
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testEndReservation}
            style={{
              flex: 1,
              backgroundColor: colors.error || '#ef4444',
              borderRadius: 12,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <ThemedText style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 12 }}>
              Finalizar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 12, padding: 8, backgroundColor: colors.background, borderRadius: 8 }}>
        <ThemedText style={{ fontSize: 11, color: colors.text, textAlign: 'center' }}>
          💡 Después de iniciar, ve a Dynamic Island o pantalla de bloqueo para probar los botones del widget
        </ThemedText>
      </View>
    </View>
  );
}
