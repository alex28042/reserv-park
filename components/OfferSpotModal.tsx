import { offerSpotStyles as styles } from '@/components/OfferSpotModal.styles';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useLocation } from '@/hooks/useLocation';
import * as ExpoLocation from 'expo-location';
import React, { useMemo, useState } from 'react';
import { Modal, TextInput, TouchableOpacity, View } from 'react-native';

export interface OfferSpotPayload {
  address?: string;
  price: number;
  leaveInMinutes: number; // En cuánto tiempo te vas
  offerDurationMinutes: number; // Cuánto tiempo durará la oferta
  latitude?: number;
  longitude?: number;
}

interface OfferSpotModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: OfferSpotPayload) => void;
}

export function OfferSpotModal({ visible, onClose, onSubmit }: OfferSpotModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { location, getCurrentLocation, requestPermission } = useLocation();

  const [address, setAddress] = useState('');
  const [pickedCoords, setPickedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [price, setPrice] = useState('2.50');
  const [leaveInMinutes, setLeaveInMinutes] = useState(10);
  const [durationOption, setDurationOption] = useState<'1h' | '2h' | 'custom'>('1h');
  const [customDays, setCustomDays] = useState('0');
  const [customHours, setCustomHours] = useState('0');
  const [customMinutes, setCustomMinutes] = useState('0');

  const computedOfferMinutes = useMemo(() => {
    if (durationOption === '1h') return 60;
    if (durationOption === '2h') return 120;
    const d = Math.max(0, parseInt(customDays || '0', 10));
    const h = Math.max(0, parseInt(customHours || '0', 10));
    const m = Math.max(0, parseInt(customMinutes || '0', 10));
    return d * 24 * 60 + h * 60 + m;
  }, [durationOption, customDays, customHours, customMinutes]);

  const canSubmit = useMemo(() => {
    const p = Number(price.replace(',', '.'));
    return (
      !Number.isNaN(p) &&
      p > 0 &&
      !!location &&
      computedOfferMinutes > 0 &&
      address.trim().length > 2
    );
  }, [price, location, computedOfferMinutes, address]);

  const handlePublish = async () => {
    const numeric = Number(price.replace(',', '.'));
    if (Number.isNaN(numeric) || numeric <= 0) return;
    let coords = pickedCoords;
    try {
      // Intentar geocodificar la dirección para obtener coordenadas precisas
      const results = await ExpoLocation.geocodeAsync(address);
      if (results && results.length > 0) {
        coords = { latitude: results[0].latitude, longitude: results[0].longitude };
      }
    } catch {}
    onSubmit({
      address: address.trim() || undefined,
      price: numeric,
      leaveInMinutes,
      offerDurationMinutes: computedOfferMinutes,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });
    // reset
    setAddress('');
    setPickedCoords(null);
    setPrice('2.50');
    setLeaveInMinutes(10);
    setDurationOption('1h');
    setCustomDays('0');
    setCustomHours('0');
    setCustomMinutes('0');
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}> 
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <IconSymbol name="xmark" size={18} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={[styles.title, { color: colors.text }]} type="defaultSemiBold">Ofrecer mi plaza</ThemedText>
          <View style={styles.iconButton} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText style={[styles.label, { color: colors.text }]}>Dirección</ThemedText>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
            <IconSymbol name="mappin.and.ellipse" size={16} color={colors.text} />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Calle y número"
              placeholderTextColor={colors.text}
              style={[styles.input, { color: colors.text }]}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={async () => {
                try {
                  const hasPermission = await requestPermission();
                  if (!hasPermission) return;
                  if (!location) {
                    await getCurrentLocation();
                  }
                  const lat = location?.latitude;
                  const lon = location?.longitude;
                  if (lat && lon) {
                    const results = await ExpoLocation.reverseGeocodeAsync({ latitude: lat, longitude: lon });
                    if (results && results.length > 0) {
                      const a = results[0] as any;
                      const street = a.street || a.name || '';
                      const number = a.streetNumber || '';
                      const city = a.city || a.district || '';
                      const formatted = `${[street, number].filter(Boolean).join(' ')}${city ? `, ${city}` : ''}`.trim();
                      if (formatted.length > 0) setAddress(formatted);
                      setPickedCoords({ latitude: lat, longitude: lon });
                    }
                  }
                } catch {}
              }}
              style={styles.inlineButton}
            >
              <IconSymbol name="location.fill" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ThemedText style={[styles.label, { color: colors.text }]}>Precio fijo</ThemedText>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
            <IconSymbol name="eurosign" size={16} color={colors.primary} />
            <TextInput
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              placeholder="2.50"
              placeholderTextColor={colors.text}
              style={[styles.input, { color: colors.text }]}
            />
            <ThemedText style={{ color: colors.text, opacity: 0.7 }}>/ periodo</ThemedText>
          </View>

          <ThemedText style={[styles.label, { color: colors.text }]}>Duración de la oferta</ThemedText>
          <View style={styles.chipsRow}>
            {[
              { k: '1h', label: '1 hora' },
              { k: '2h', label: '2 horas' },
              { k: 'custom', label: 'Personalizado' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.k}
                style={[
                  styles.chip,
                  {
                    borderColor: durationOption === (opt.k as any) ? colors.primary : colors.border,
                    backgroundColor: durationOption === (opt.k as any) ? colors.primary : colors.surface,
                  },
                ]}
                onPress={() => setDurationOption(opt.k as any)}
              >
                <ThemedText style={{ color: durationOption === (opt.k as any) ? colors.accent : colors.text }}>
                  {opt.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {durationOption === 'custom' && (
            <View style={styles.customDurationRow}>
              <View style={[styles.customBox, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                <TextInput
                  keyboardType="number-pad"
                  value={customDays}
                  onChangeText={setCustomDays}
                  placeholder="0"
                  placeholderTextColor={colors.text}
                  style={[styles.customInput, { color: colors.text }]}
                />
                <ThemedText style={[styles.customLabel, { color: colors.text }]}>días</ThemedText>
              </View>
              <View style={[styles.customBox, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                <TextInput
                  keyboardType="number-pad"
                  value={customHours}
                  onChangeText={setCustomHours}
                  placeholder="0"
                  placeholderTextColor={colors.text}
                  style={[styles.customInput, { color: colors.text }]}
                />
                <ThemedText style={[styles.customLabel, { color: colors.text }]}>horas</ThemedText>
              </View>
              <View style={[styles.customBox, { borderColor: colors.border, backgroundColor: colors.surface }]}> 
                <TextInput
                  keyboardType="number-pad"
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  placeholder="0"
                  placeholderTextColor={colors.text}
                  style={[styles.customInput, { color: colors.text }]}
                />
                <ThemedText style={[styles.customLabel, { color: colors.text }]}>min</ThemedText>
              </View>
            </View>
          )}

          <ThemedText style={[styles.label, { color: colors.text }]}>Me voy en</ThemedText>
          <View style={styles.chipsRow}>
            {[5, 10, 15, 30, 60].map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.chip, { borderColor: m === leaveInMinutes ? colors.primary : colors.border, backgroundColor: m === leaveInMinutes ? colors.primary : colors.surface }]}
                onPress={() => setLeaveInMinutes(m)}
              >
                <ThemedText style={{ color: m === leaveInMinutes ? colors.accent : colors.text }}>{m} min</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.publishButton, { backgroundColor: canSubmit ? colors.primary : colors.border }]}
            disabled={!canSubmit}
            onPress={handlePublish}
          >
            <IconSymbol name="paperplane.fill" size={18} color={colors.accent} />
            <ThemedText style={[styles.publishText, { color: colors.accent }]} type="defaultSemiBold">Publicar</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


