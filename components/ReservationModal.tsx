import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
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

  if (!spot) return null;

  const resetModal = () => {
    setCurrentStep('details');
    setSelectedDuration(timeOptions[1]);
    setPaymentMethod('card');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const calculatePrice = () => {
    const basePrice = parseFloat(spot.price.replace(/[€\/hora]/g, ''));
    return (basePrice * selectedDuration.multiplier).toFixed(2);
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
              €{(parseFloat(spot.price.replace(/[€\/hora]/g, '')) * option.multiplier).toFixed(2)}
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
          onPress={() => setCurrentStep('success')}
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
            <ThemedText style={[styles.buttonText, { color: colors.text }]}>
              Más tarde
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              onNavigate(spot.latitude, spot.longitude, spot.address);
              handleClose();
            }}
          >
            <IconSymbol name="location.fill" size={16} color={colors.accent} />
            <ThemedText style={[styles.buttonText, { color: colors.accent }]} type="defaultSemiBold">
              Navegar Ahora
            </ThemedText>
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