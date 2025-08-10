import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    LayoutAnimation,
    Modal,
    Platform,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ProfileModalBase } from './ProfileModalBase';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WorkScheduleModalProps {
  visible: boolean;
  onClose: () => void;
}

type DayKey = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'L', label: 'Lunes' },
  { key: 'M', label: 'Martes' },
  { key: 'X', label: 'Miércoles' },
  { key: 'J', label: 'Jueves' },
  { key: 'V', label: 'Viernes' },
  { key: 'S', label: 'Sábado' },
  { key: 'D', label: 'Domingo' },
];

export function WorkScheduleModal({ visible, onClose }: WorkScheduleModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedDays, setSelectedDays] = useState<DayKey[]>(['L', 'M', 'X', 'J', 'V']);
  const [workArea, setWorkArea] = useState('');
  const [arrivalTime, setArrivalTime] = useState('08:30');
  const [departureTime, setDepartureTime] = useState('17:00');
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [tempArrivalDate, setTempArrivalDate] = useState<Date | null>(null);
  const [tempDepartureDate, setTempDepartureDate] = useState<Date | null>(null);
  const [price, setPrice] = useState('3.50');
  const [enabled, setEnabled] = useState(true);
  const [notifyNoSpot, setNotifyNoSpot] = useState(true);
  const [showAutoInfo, setShowAutoInfo] = useState(false);
  const [showNotifyInfo, setShowNotifyInfo] = useState(false);

  // Preview animation
  const previewOpacity = useRef(new Animated.Value(0)).current;
  const previewTranslate = useRef(new Animated.Value(8)).current;

  const isFormReady = useMemo(() => {
    return (
      enabled && selectedDays.length > 0 &&
      /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime.trim()) &&
      /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(departureTime.trim()) &&
      price.trim().length > 0
    );
  }, [enabled, selectedDays, arrivalTime, departureTime, price]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(previewOpacity, { toValue: isFormReady ? 1 : 0.25, duration: 220, useNativeDriver: true }),
      Animated.timing(previewTranslate, { toValue: isFormReady ? 0 : 8, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [isFormReady, previewOpacity, previewTranslate]);

  const toggleDay = (key: DayKey) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDays((prev) => (
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    ));
  };

  const formatPrice = (value: string) => {
    const sanitized = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    return sanitized;
  };

  const handleSave = () => {
    if (!isFormReady) {
      Alert.alert('Completa el formulario', 'Revisa los campos marcados para continuar.');
      return;
    }

    const daysLabel = DAYS.filter((d) => selectedDays.includes(d.key)).map((d) => d.label).join(', ');
    Alert.alert(
      'Horario guardado',
      `Días: ${daysLabel}\nEntrada: ${arrivalTime}\nSalida: ${departureTime}\nZona: ${workArea || 'No especificada'}\nPrecio por tu plaza: €${Number(formatPrice(price)).toFixed(2)}`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const parseToDate = (time: string) => {
    const [hh = '08', mm = '00'] = time.split(':');
    const d = new Date();
    d.setHours(Number(hh));
    d.setMinutes(Number(mm));
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  };

  const handleTimeChange = (type: 'arrival' | 'departure') => (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    const date = selectedDate ?? new Date();
    if (Platform.OS === 'android') {
      if (event.type !== 'set') return;
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      if (type === 'arrival') {
        setArrivalTime(`${hh}:${mm}`);
      } else {
        setDepartureTime(`${hh}:${mm}`);
      }
      return;
    }
    if (type === 'arrival') {
      setTempArrivalDate(date);
    } else {
      setTempDepartureDate(date);
    }
  };

  const InfoCard = ({ visible, text }: { visible: boolean; text: string }) => {
    const fade = useRef(new Animated.Value(0)).current;
    const translate = useRef(new Animated.Value(-6)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fade, { toValue: visible ? 1 : 0, duration: 180, useNativeDriver: true }),
        Animated.timing(translate, { toValue: visible ? 0 : -6, duration: 180, useNativeDriver: true }),
      ]).start();
    }, [visible, fade, translate]);

    if (!visible) return null;

    return (
      <Animated.View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 2,
            opacity: fade,
            transform: [{ translateY: translate }],
          },
        ]}
      >
        <View style={[styles.infoHeader, { borderBottomColor: colors.border }]}> 
          <IconSymbol name="info.circle.fill" size={16} color={colors.primary} />
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">¿Qué significa?</ThemedText>
        </View>
        <ThemedText style={{ color: colors.text, opacity: 0.9, fontSize: 13 }}>
          {text}
        </ThemedText>
      </Animated.View>
    );
  };

  return (
    <ProfileModalBase visible={visible} title="Horario de trabajo" onClose={onClose}>
      {/* Intro */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <View style={styles.cardHeader}> 
          <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}> 
            <IconSymbol name="calendar" size={18} color={colors.accent} />
          </View>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Automatiza tu jornada</ThemedText>
        </View>
        <ThemedText style={{ color: colors.text, opacity: 0.8 }}>
          Selecciona tus días y horas para reservarte una plaza al llegar y ofrecer la tuya cuando te vayas.
        </ThemedText>
      </View>

      {/* iOS bottom sheet para hora - modal superpuesto */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showArrivalPicker || showDeparturePicker}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
          onRequestClose={() => { setShowArrivalPicker(false); setShowDeparturePicker(false); }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.sheetScrim}
              activeOpacity={1}
              onPress={() => { setShowArrivalPicker(false); setShowDeparturePicker(false); }}
            />
            <View style={[styles.timeSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
              <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}> 
                <TouchableOpacity onPress={() => { setShowArrivalPicker(false); setShowDeparturePicker(false); }}>
                  <ThemedText style={{ color: colors.text }}>Cancelar</ThemedText>
                </TouchableOpacity>
                <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Seleccionar hora</ThemedText>
                <TouchableOpacity onPress={() => {
                  if (showArrivalPicker && tempArrivalDate) {
                    const hh = String(tempArrivalDate.getHours()).padStart(2, '0');
                    const mm = String(tempArrivalDate.getMinutes()).padStart(2, '0');
                    setArrivalTime(`${hh}:${mm}`);
                  }
                  if (showDeparturePicker && tempDepartureDate) {
                    const hh = String(tempDepartureDate.getHours()).padStart(2, '0');
                    const mm = String(tempDepartureDate.getMinutes()).padStart(2, '0');
                    setDepartureTime(`${hh}:${mm}`);
                  }
                  setShowArrivalPicker(false);
                  setShowDeparturePicker(false);
                }}>
                  <ThemedText style={{ color: colors.primary }} type="defaultSemiBold">OK</ThemedText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={showArrivalPicker ? (tempArrivalDate ?? parseToDate(arrivalTime)) : (tempDepartureDate ?? parseToDate(departureTime))}
                mode="time"
                display="spinner"
                onChange={handleTimeChange(showArrivalPicker ? 'arrival' : 'departure')}
                minuteInterval={5}
                style={{ alignSelf: 'stretch' }}
              />
            </View>
          </View>
        </Modal>
      )}
      {/* Days */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <ThemedText style={[styles.label, { color: colors.text }]}>Días de trabajo</ThemedText>
        <View style={styles.daysRow}>
          {DAYS.map((d) => {
            const isSelected = selectedDays.includes(d.key);
            return (
              <TouchableOpacity
                key={d.key}
                onPress={() => toggleDay(d.key)}
                style={[
                  styles.dayPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.background,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                activeOpacity={0.9}
              >
                <ThemedText style={{ color: isSelected ? colors.accent : colors.text }} type="defaultSemiBold">
                  {d.key}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Work area */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <ThemedText style={[styles.label, { color: colors.text }]}>Zona de trabajo</ThemedText>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}> 
          <IconSymbol name="mappin.and.ellipse" size={16} color={colors.text} />
          <TextInput
            value={workArea}
            onChangeText={setWorkArea}
            placeholder="Dirección o zona (opcional)"
            placeholderTextColor={colorScheme === 'dark' ? '#94A3B8' : '#94A3B8'}
            style={[styles.input, { color: colors.text }]}
            returnKeyType="done"
          />
        </View>
      </View>

      {/* Times */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <ThemedText style={[styles.label, { color: colors.text }]}>Horario</ThemedText>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.smallLabel, { color: colors.text }]}>Hora de llegada</ThemedText>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setTempArrivalDate(parseToDate(arrivalTime));
                  setShowArrivalPicker(true);
                } else {
                  DateTimePickerAndroid.open({
                    value: parseToDate(arrivalTime),
                    onChange: handleTimeChange('arrival'),
                    mode: 'time',
                    is24Hour: true,
                  });
                }
              }}
              style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <IconSymbol name="clock.fill" size={16} color={colors.text} />
              <ThemedText style={{ color: colors.text, fontSize: 16 }}>{arrivalTime}</ThemedText>
            </TouchableOpacity>
            {/* Android: diálogo nativo; iOS: bottom sheet al final */}
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <ThemedText style={[styles.smallLabel, { color: colors.text }]}>Hora de salida</ThemedText>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  setTempDepartureDate(parseToDate(departureTime));
                  setShowDeparturePicker(true);
                } else {
                  DateTimePickerAndroid.open({
                    value: parseToDate(departureTime),
                    onChange: handleTimeChange('departure'),
                    mode: 'time',
                    is24Hour: true,
                  });
                }
              }}
              style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <IconSymbol name="clock.fill" size={16} color={colors.text} />
              <ThemedText style={{ color: colors.text, fontSize: 16 }}>{departureTime}</ThemedText>
            </TouchableOpacity>
            {/* Android: diálogo nativo; iOS: bottom sheet al final */}
          </View>
        </View>
      </View>

      {/* Price & toggles */}
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
        <ThemedText style={[styles.label, { color: colors.text }]}>Precio por tu plaza mientras trabajas</ThemedText>
        <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.background }]}> 
          <IconSymbol name="eurosign" size={16} color={colors.text} />
          <TextInput
            value={price}
            onChangeText={(t) => setPrice(formatPrice(t))}
            placeholder="3.50"
            placeholderTextColor={colorScheme === 'dark' ? '#94A3B8' : '#94A3B8'}
            style={[styles.input, { color: colors.text }]}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.toggleRow}>
          <View style={[styles.toggleItem, { flexShrink: 1 }]}> 
            <IconSymbol name="bolt.fill" size={16} color={colors.text} />
            <ThemedText style={{ color: colors.text }}>Activar automatización</ThemedText>
            <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setShowAutoInfo((v) => !v); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconSymbol name="info.circle.fill" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Switch value={enabled} onValueChange={(v) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setEnabled(v); }} />
        </View>
        <InfoCard
          visible={showAutoInfo}
          text="Reservará una plaza al llegar y publicará tu plaza al salir, solo en los días seleccionados."
        />

        <View style={styles.toggleRow}>
          <View style={[styles.toggleItem, { flexShrink: 1 }]}> 
            <IconSymbol name="bell.fill" size={16} color={colors.text} />
            <ThemedText style={{ color: colors.text }}>Notificar si no hay plaza</ThemedText>
            <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setShowNotifyInfo((v) => !v); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <IconSymbol name="info.circle.fill" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Switch value={notifyNoSpot} onValueChange={(v) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setNotifyNoSpot(v); }} />
        </View>
        <InfoCard
          visible={showNotifyInfo}
          text="Si al llegar no hay plazas disponibles, te avisaremos para que puedas elegir otra zona."
        />
      </View>

      {/* Preview */}
      <Animated.View
        style={[
          styles.previewCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: previewOpacity,
            transform: [{ translateY: previewTranslate }],
          },
        ]}
      >
        <View style={styles.previewHeader}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}> 
            <IconSymbol name="checkmark" size={16} color={colors.accent} />
          </View>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Vista previa</ThemedText>
        </View>
        <View style={styles.previewRow}>
          <ThemedText style={{ color: colors.text, opacity: 0.8 }}>Días</ThemedText>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">
            {DAYS.filter((d) => selectedDays.includes(d.key)).map((d) => d.key).join(' · ') || '—'}
          </ThemedText>
        </View>
        <View style={styles.previewRow}>
          <ThemedText style={{ color: colors.text, opacity: 0.8 }}>Horario</ThemedText>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">{arrivalTime} — {departureTime}</ThemedText>
        </View>
        <View style={styles.previewRow}>
          <ThemedText style={{ color: colors.text, opacity: 0.8 }}>Zona</ThemedText>
          <ThemedText style={{ color: colors.text }} numberOfLines={1}>{workArea || 'No especificada'}</ThemedText>
        </View>
        <View style={styles.previewRow}>
          <ThemedText style={{ color: colors.text, opacity: 0.8 }}>Precio</ThemedText>
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">€{price || '0.00'}</ThemedText>
        </View>
      </Animated.View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <ThemedText style={{ color: colors.text }} type="defaultSemiBold">Cancelar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
        >
          <ThemedText style={{ color: colors.accent }} type="defaultSemiBold">Guardar</ThemedText>
        </TouchableOpacity>
      </View>
    </ProfileModalBase>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, marginBottom: 6 },
  smallLabel: { fontSize: 12, marginBottom: 6, opacity: 0.9 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
  row: { flexDirection: 'row' },
  toggleRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 8, marginBottom: 8, borderBottomWidth: 1 },
  infoCard: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  previewCard: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 10 },
  previewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 2, marginBottom: Platform.select({ ios: 10, default: 6 }) },
  secondaryButton: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  primaryButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  timePicker: { alignSelf: 'stretch' },
  sheetScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  timeSheet: { borderWidth: 1, paddingBottom: Platform.select({ ios: 12, default: 0 }), borderRadius: 16, width: '92%', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
});


