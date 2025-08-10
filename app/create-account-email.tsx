import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateAccountEmailScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSeconds, setResendSeconds] = useState<number>(60);
  const [strengthTrackWidth, setStrengthTrackWidth] = useState<number>(0);
  const strengthAnimatedWidth = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { signUp } = useAuth();
  const inputsRef = useRef<Array<TextInput | null>>([]);
  const isCodeComplete = useMemo(() => code.every((d) => d && d.length === 1), [code]);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const prevStep = useRef<1 | 2 | 3>(1);
  const dotScales = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const isStrongPassword = useMemo(() => password.length >= 8 && /\d/.test(password) && /[^\w\s]/.test(password), [password]);
  const strengthScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^\w\s]/.test(password)) score += 1;
    return score; // 0..3
  }, [password]);
  const strengthPercent = useMemo(() => (strengthScore / 3) * 100, [strengthScore]);

  useEffect(() => {
    // Animate step content in from left/right depending on direction
    const direction = step > prevStep.current ? 1 : -1;
    contentOpacity.setValue(0);
    contentTranslateX.setValue(direction * 24);
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.spring(contentTranslateX, { toValue: 0, useNativeDriver: true, mass: 0.6, stiffness: 140, damping: 18 }),
    ]).start();

    // Animate stepper dots
    dotScales.forEach((a, idx) => {
      const active = idx + 1 <= step;
      Animated.spring(a, { toValue: active ? 1.3 : 1, useNativeDriver: true, stiffness: 140, damping: 14 }).start();
    });

    prevStep.current = step;
  }, [step, contentOpacity, contentTranslateX, dotScales]);

  // Animate password strength bar width
  useEffect(() => {
    if (strengthTrackWidth === 0) return;
    Animated.timing(strengthAnimatedWidth, {
      toValue: (strengthPercent / 100) * strengthTrackWidth,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [strengthPercent, strengthTrackWidth, strengthAnimatedWidth]);

  const goNext = () => setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 3));
  const goBack = () => setStep((s) => (s === 3 ? 2 : 1));

  const handleEmailContinue = () => {
    if (!isEmailValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Email inválido', 'Introduce un correo válido');
      return;
    }
    setCode(['', '', '', '', '', '']);
    setResendSeconds(60);
    Haptics.selectionAsync();
    goNext();
    setTimeout(() => inputsRef.current[0]?.focus(), 250);
  };

  const handleVerify = () => {
    if (code.join('').length < 6) return; // no popup
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    goNext();
  };

  const handleFinish = async () => {
    if (password.length < 6) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Contraseña débil', 'Usa al menos 6 caracteres');
      return;
    }
    try {
      setIsSubmitting(true);
      await signUp(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err?.message ?? 'No se pudo crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Countdown for resending code on step 2
  useEffect(() => {
    if (step !== 2) return;
    if (resendSeconds <= 0) return;
    const id = setInterval(() => setResendSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step, resendSeconds]);

  const handleResend = () => {
    if (resendSeconds > 0) return;
    // Simular reenvío
    setResendSeconds(60);
    Haptics.selectionAsync();
    Alert.alert('Código reenviado', `Hemos reenviado el código a ${email}`);
  };

  // Helper to distribute pasted multi-digit input across code fields
  const fillCodeFromIndex = (startIndex: number, text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 6 - startIndex).split('');
    if (digits.length === 0) return;
    const next = [...code];
    digits.forEach((d, idx) => {
      next[startIndex + idx] = d;
    });
    setCode(next);
    const filled = next.join('');
    const lastFilledIndex = startIndex + digits.length - 1;
    if (lastFilledIndex < 5) {
      inputsRef.current[lastFilledIndex + 1]?.focus();
    }
    if (filled.length === 6) {
      handleVerify();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => (step === 1 ? router.back() : goBack())} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ThemedText style={[styles.title, { color: colors.text }]} type="title">
              {step === 1 ? 'Añade tu email' : step === 2 ? 'Verifica tu email' : 'Crea tu contraseña'}
            </ThemedText>
            <View style={styles.stepperRow}>
              {[0,1,2].map((i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.stepDot,
                    { backgroundColor: i < step ? colors.primary : colors.border, transform: [{ scaleX: dotScales[i] }] },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={{ width: 32 }} />
        </View>
        <Animated.View style={[styles.card, { backgroundColor: colors.surface, opacity: contentOpacity, transform: [{ translateX: contentTranslateX }] }]}> 
          {step === 1 && (
            <>
              <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.background }]}> 
                <Ionicons name="mail-outline" size={18} color={colors.text} style={{ opacity: 0.6 }} />
                <TextInput
                  placeholder="example@correo.com"
                  placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#64748B'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { color: colors.text }]}
                  onSubmitEditing={() => isEmailValid && handleEmailContinue()}
                />
              </View>
              <Text style={[styles.helper, { color: colors.text, opacity: 0.6 }]}>Usaremos tu email para crear la cuenta</Text>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: isEmailValid ? colors.primary : '#9CA3AF' }]}
                onPress={handleEmailContinue}
                disabled={!isEmailValid}
              >
                <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Crear cuenta</ThemedText>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.helper, { color: colors.text, opacity: 0.8 }]}>Te enviamos un código de 6 dígitos a {email}</Text>
              <View style={styles.codeRow}>
                {code.map((c, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => { inputsRef.current[i] = r; }}
                    keyboardType="number-pad"
                    inputMode="numeric"
                    textContentType={i === 0 ? 'oneTimeCode' : 'none'}
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={c}
                    onChangeText={(t) => {
                      if (t.length > 1) {
                        fillCodeFromIndex(i, t);
                        return;
                      }
                      const val = t.replace(/\D/g, '').slice(0, 1);
                      const next = [...code];
                      next[i] = val;
                      setCode(next);
                      if (val && i < code.length - 1) inputsRef.current[i + 1]?.focus();
                      if ((next.join('')).length === 6) handleVerify();
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace' && code[i] === '' && i > 0) inputsRef.current[i - 1]?.focus();
                    }}
                    style={[styles.codeInput, { borderColor: colors.border, color: colors.text }]}
                  />
                ))}
              </View>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: isCodeComplete ? 1 : 0.6 }]}
                onPress={handleVerify}
                disabled={!isCodeComplete}
              >
                <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Verificar email</ThemedText>
              </TouchableOpacity>
              <View style={styles.resendRow}>
                <TouchableOpacity onPress={handleResend} disabled={resendSeconds > 0}>
                  <Text style={[styles.linkText, { color: resendSeconds > 0 ? '#9CA3AF' : colors.primary }]}>
                    {resendSeconds > 0 ? `Reenviar en ${resendSeconds}s` : 'Reenviar código'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.background }]}> 
                <Ionicons name="lock-closed-outline" size={18} color={colors.text} style={{ opacity: 0.6 }} />
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor={scheme === 'dark' ? '#94A3B8' : '#64748B'}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { color: colors.text }]}
                  returnKeyType="done"
                  onSubmitEditing={() => (isStrongPassword && !isSubmitting) && handleFinish()}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={18} color={colors.text} style={{ opacity: 0.6 }} />
                </TouchableOpacity>
              </View>
              <View
                style={styles.strengthTrack}
                onLayout={({ nativeEvent }) => setStrengthTrackWidth(nativeEvent.layout.width)}
              >
                <Animated.View
                  style={[
                    styles.strengthFill,
                    {
                      width: strengthAnimatedWidth,
                      backgroundColor: isStrongPassword
                        ? colors.success
                        : (/\d/.test(password) || /[^\w\s]/.test(password))
                        ? colors.warning
                        : colors.error,
                    },
                  ]}
                />
              </View>
              <View style={{ gap: 6 }}>
                <View style={styles.checkRow}><Ionicons name={password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'} size={14} color={password.length >= 8 ? colors.success : colors.text} /><Text style={[styles.checkText, { color: colors.text }]}>8 caracteres mínimo</Text></View>
                <View style={styles.checkRow}><Ionicons name={/\d/.test(password) ? 'checkmark-circle' : 'ellipse-outline'} size={14} color={/\d/.test(password) ? colors.success : colors.text} /><Text style={[styles.checkText, { color: colors.text }]}>un número</Text></View>
                <View style={styles.checkRow}><Ionicons name={/[^\w\s]/.test(password) ? 'checkmark-circle' : 'ellipse-outline'} size={14} color={/[^\w\s]/.test(password) ? colors.success : colors.text} /><Text style={[styles.checkText, { color: colors.text }]}>un símbolo</Text></View>
              </View>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: (isStrongPassword && !isSubmitting) ? colors.primary : '#9CA3AF' }]}
                onPress={handleFinish}
                disabled={!isStrongPassword || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.accent} />
                ) : (
                  <ThemedText style={[styles.primaryText, { color: colors.accent }]} type="defaultSemiBold">Finalizar</ThemedText>
                )}
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  backButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 16 },
  title: { fontSize: 22 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  stepDot: { width: 22, height: 4, borderRadius: 2 },
  card: { gap: 12, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  input: { flex: 1 },
  helper: { fontSize: 12, marginTop: 2 },
  codeRow: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  codeInput: { width: 48, height: 56, borderWidth: 1, borderRadius: 12, textAlign: 'center', fontSize: 20 },
  primaryButton: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  primaryText: { fontSize: 16 },
  strengthTrack: { height: 6, borderRadius: 3, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  strengthFill: { height: 6, borderRadius: 3 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkText: { fontSize: 13 },
  resendRow: { alignItems: 'center', marginTop: 8 },
  linkText: { fontSize: 13, fontWeight: '600' },
});


