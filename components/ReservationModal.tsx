import { Colors } from '@/constants/Colors';
import { useLiveActivity } from '@/contexts/LiveActivityContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { reservationModalStyles as styles } from './ReservationModal.styles';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

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

interface ReservationModalProps {
  visible: boolean;
  spot: ParkingSpot | null;
  onClose: () => void;
  onNavigate: (latitude: number, longitude: number, address: string) => void;
}

type ReservationStep = 'details' | 'duration' | 'confirmation' | 'success';

const timeOptions = [
  { id: '30min', label: '30 minutos', multiplier: 0.5 },
  { id: '1h', label: '1 hora', multiplier: 1 },
  { id: '2h', label: '2 horas', multiplier: 2 },
  { id: '3h', label: '3 horas', multiplier: 3 },
  { id: '4h', label: '4 horas', multiplier: 4 },
  { id: 'day', label: 'Todo el día', multiplier: 8 },
];

export function ReservationModal({ visible, spot, onClose, onNavigate }: ReservationModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentStep, setCurrentStep] = useState<ReservationStep>('details');
  const [selectedDuration, setSelectedDuration] = useState(timeOptions[1]); // Default: 1 hora
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { location } = useLocation();
  const { actions: liveActivityActions } = useLiveActivity();

  if (!spot) return null;

  const resetModal = () => {
    setCurrentStep('details');
    setSelectedDuration(timeOptions[1]);
    setPaymentMethod('card');
  };

  const confirmReservation = async () => {
    try {
      const now = new Date();
      const endTimeDate = new Date(now.getTime() + selectedDuration.multiplier * 60 * 60 * 1000);
      const hours = Math.floor(selectedDuration.multiplier);
      const minutes = Math.floor((selectedDuration.multiplier % 1) * 60);
      const timeRemaining = hours > 0 
        ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` 
        : `${minutes}m`;
      
      const reservationData = {
        location: spot.address,
        timeRemaining: timeRemaining,
        status: 'Activo',
        endTime: endTimeDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        canExtend: true,
        totalDurationMinutes: Math.round(selectedDuration.multiplier * 60),
        reservationId: `res-${spot.id}-${Date.now()}`,
      };

      const result = await liveActivityActions.startLiveActivity(reservationData);
      
      if (result.success) {
        setCurrentStep('success');
      } else {
        // Si falla el Live Activity, continuar con la reserva normal
        console.warn('Live Activity failed to start:', result.message);
        setCurrentStep('success');
      }
    } catch (error) {
      console.error('Error starting Live Activity:', error);
      // Continuar con la reserva normal incluso si falla el Live Activity
      setCurrentStep('success');
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const getFixedPrice = () => {
    try {
      const numeric = parseFloat(String(spot.price).replace(/[^0-9.,]/g, '').replace(',', '.'));
      return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00';
    } catch {
      return '0.00';
    }
  };

  const calculatePrice = () => getFixedPrice();

  const openWithAppleOrGoogleMaps = async () => {
    try {
      const destination = `${spot.latitude},${spot.longitude}`;
      if (Platform.OS === 'ios') {
        const appleUrl = `maps://maps.apple.com/?q=${encodeURIComponent(spot.address)}&ll=${destination}`;
        const canApple = await Linking.canOpenURL(appleUrl);
        if (canApple) {
          await Linking.openURL(appleUrl);
          return;
        }
      }
      const gmapsWeb = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
      await Linking.openURL(gmapsWeb);
    } catch (e) {
      Alert.alert('Error', 'No se pudo abrir Maps');
    }
  };

  const openWithWaze = async () => {
    try {
      const destination = `${spot.latitude},${spot.longitude}`;
      const wazeUrl = `waze://?ll=${destination}&navigate=yes`;
      const canWaze = await Linking.canOpenURL(wazeUrl);
      if (canWaze) {
        await Linking.openURL(wazeUrl);
      } else {
        const wazeWeb = `https://waze.com/ul?ll=${destination}&navigate=yes`;
        await Linking.openURL(wazeWeb);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo abrir Waze');
    }
  };

  const openChat = () => {
    Alert.alert('Chat', 'Abriremos un chat con el propietario (demo)');
  };

  const getStepNumber = (step: ReservationStep): number => {
    const steps = ['details', 'duration', 'confirmation', 'success'];
    return steps.indexOf(step) + 1;
  };

  const renderProgressBar = () => {
    const currentStepNumber = getStepNumber(currentStep);
    const totalSteps = 4;

    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                {
                  backgroundColor: index + 1 <= currentStepNumber ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {index + 1 <= currentStepNumber && (
                <IconSymbol name="checkmark" size={12} color={colors.accent} />
              )}
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.progressLine,
                  {
                    backgroundColor: index + 1 < currentStepNumber ? colors.primary : colors.border,
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderDetailsStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      {/* Map preview first */}
      <View style={styles.mapPreviewWrapper}>
        <MapView
          style={styles.mapPreview}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: spot.latitude,
            longitude: spot.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          showsMyLocationButton={false}
          showsScale={false}
          showsCompass={false}
          mapType="standard"
        >
          {location && (
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Tú" />
          )}
          <Marker coordinate={{ latitude: spot.latitude, longitude: spot.longitude }} title={spot.address}>
            <View style={[styles.reservationMarker, { backgroundColor: colors.primary }]}>
              <ThemedText style={styles.markerText}>P</ThemedText>
            </View>
          </Marker>
        </MapView>
      </View>

      <View style={styles.stepHeader}>
        <ThemedText style={[styles.stepTitle, { color: colors.text }]} type="title">
          Detalles de la Plaza
        </ThemedText>
        <ThemedText style={[styles.stepSubtitle, { color: colors.text }]}>
          Confirma que esta es la plaza que deseas reservar
        </ThemedText>
      </View>

      <View style={[styles.spotCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.spotHeader}>
          <IconSymbol name="location.fill" size={24} color={colors.primary} />
          <ThemedText style={[styles.spotAddress, { color: colors.text }]} type="defaultSemiBold">
            {spot.address}
          </ThemedText>
        </View>

        <View style={styles.spotDetails}>
          <View style={styles.spotDetail}>
            <IconSymbol name="clock.fill" size={16} color={colors.text} />
            <ThemedText style={[styles.detailText, { color: colors.text }]}>
              Disponible: {spot.timeLeft}
            </ThemedText>
          </View>
          <View style={styles.spotDetail}>
            <IconSymbol name="location.circle.fill" size={16} color={colors.text} />
            <ThemedText style={[styles.detailText, { color: colors.text }]}>
              Distancia: {spot.distance}
            </ThemedText>
          </View>
          <View style={styles.spotDetail}>
            <IconSymbol name="eurosign" size={16} color={colors.primary} />
            <ThemedText style={[styles.priceText, { color: colors.primary }]} type="defaultSemiBold">
              {spot.price}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.stepActions}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={handleClose}
        >
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            Cancelar
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => setCurrentStep('duration')}
        >
          <ThemedText style={[styles.buttonText, { color: colors.accent }]} type="defaultSemiBold">
            Continuar
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDurationStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <ThemedText style={[styles.stepTitle, { color: colors.text }]} type="title">
          Duración de la Reserva
        </ThemedText>
        <ThemedText style={[styles.stepSubtitle, { color: colors.text }]}>
          ¿Por cuánto tiempo necesitas la plaza?
        </ThemedText>
      </View>

      <View style={styles.timeOptionsContainer}>
        {timeOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.timeOption,
              {
                backgroundColor: selectedDuration.id === option.id ? colors.primary : colors.surface,
                borderColor: selectedDuration.id === option.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedDuration(option)}
          >
            <ThemedText
              style={[
                styles.timeOptionText,
                {
                  color: selectedDuration.id === option.id ? colors.accent : colors.text,
                },
              ]}
              type="defaultSemiBold"
            >
              {option.label}
            </ThemedText>
            <ThemedText
              style={[
                styles.timeOptionPrice,
                {
                  color: selectedDuration.id === option.id ? colors.accent : colors.text,
                },
              ]}
            >
              Precio fijo
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.stepActions}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={() => setCurrentStep('details')}
        >
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            Volver
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => setCurrentStep('confirmation')}
        >
          <ThemedText style={[styles.buttonText, { color: colors.accent }]} type="defaultSemiBold">
            Continuar
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderConfirmationStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <ThemedText style={[styles.stepTitle, { color: colors.text }]} type="title">
          Confirmar Reserva
        </ThemedText>
        <ThemedText style={[styles.stepSubtitle, { color: colors.text }]}>
          Revisa los detalles antes de confirmar
        </ThemedText>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.text }]}>Plaza:</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: colors.text }]} type="defaultSemiBold">
            {spot.address}
          </ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.text }]}>Duración:</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: colors.text }]} type="defaultSemiBold">
            {selectedDuration.label}
          </ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.text }]}>Total:</ThemedText>
          <ThemedText style={[styles.summaryTotal, { color: colors.primary }]} type="title">
            €{calculatePrice()}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.paymentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText style={[styles.paymentTitle, { color: colors.text }]} type="defaultSemiBold">
          Método de Pago
        </ThemedText>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              {
                backgroundColor: paymentMethod === 'card' ? colors.primary : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <IconSymbol
              name="creditcard.fill"
              size={20}
              color={paymentMethod === 'card' ? colors.accent : colors.text}
            />
            <ThemedText
              style={[
                styles.paymentMethodText,
                { color: paymentMethod === 'card' ? colors.accent : colors.text },
              ]}
            >
              Tarjeta
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              {
                backgroundColor: paymentMethod === 'apple' ? colors.primary : colors.background,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setPaymentMethod('apple')}
          >
            <IconSymbol
              name="applelogo"
              size={20}
              color={paymentMethod === 'apple' ? colors.accent : colors.text}
            />
            <ThemedText
              style={[
                styles.paymentMethodText,
                { color: paymentMethod === 'apple' ? colors.accent : colors.text },
              ]}
            >
              Apple Pay
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepActions}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: colors.border }]}
          onPress={() => setCurrentStep('duration')}
        >
          <ThemedText style={[styles.buttonText, { color: colors.text }]}>
            Volver
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={confirmReservation}
        >
          <ThemedText style={[styles.buttonText, { color: colors.accent }]} type="defaultSemiBold">
            Confirmar Reserva
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.successContainer}>
        <View style={[styles.successIcon, { backgroundColor: colors.success }]}>
          <IconSymbol name="checkmark.circle.fill" size={48} color="#FFFFFF" />
        </View>
        
        <ThemedText style={[styles.successTitle, { color: colors.text }]} type="title">
          ¡Reserva Confirmada!
        </ThemedText>
        
        <ThemedText style={[styles.successMessage, { color: colors.text }]}>
          Tu plaza ha sido reservada exitosamente. Tienes {selectedDuration.label.toLowerCase()} de estacionamiento en {spot.address}.
        </ThemedText>

        <View style={[styles.reservationSummary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.summaryItem}>
            <IconSymbol name="clock.fill" size={16} color={colors.primary} />
            <ThemedText style={[styles.summaryText, { color: colors.text }]}>
              {selectedDuration.label}
            </ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <IconSymbol name="eurosign" size={16} color={colors.primary} />
            <ThemedText style={[styles.summaryText, { color: colors.text }]}>
              €{calculatePrice()}
            </ThemedText>
          </View>
        </View>

        <View style={styles.successActions}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={handleClose}
          >
            <ThemedText style={[styles.buttonText, { color: colors.text }]}>Más tarde</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={openWithAppleOrGoogleMaps}
          >
            <IconSymbol name="map.fill" size={16} color={colors.accent} />
            <ThemedText style={[styles.buttonText, { color: colors.accent }]} type="defaultSemiBold">
              Abrir en Maps
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.singleAction}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.secondary ?? colors.primary, width: '100%' }]}
            onPress={openChat}
          >
            <IconSymbol name="message.fill" size={18} color={colors.accent} />
            <Text
              accessibilityRole="button"
              style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700' }}
              numberOfLines={1}
              allowFontScaling
            >
              Chatear con propietario
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'details':
        return renderDetailsStep();
      case 'duration':
        return renderDurationStep();
      case 'confirmation':
        return renderConfirmationStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderDetailsStep();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <IconSymbol name="xmark" size={20} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={[styles.modalTitle, { color: colors.text }]} type="defaultSemiBold">
            Reservar Plaza
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress Bar */}
        {currentStep !== 'success' && renderProgressBar()}

        {/* Content */}
        <View style={styles.modalContent}>
          {renderCurrentStep()}
        </View>
      </View>
    </Modal>
  );
}