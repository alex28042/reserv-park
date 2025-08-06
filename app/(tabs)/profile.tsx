import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: 'car.fill' | 'creditcard.fill';
  onPress: () => void;
}

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  icon: 'list.bullet' | 'bell.fill' | 'gearshape.fill' | 'questionmark.circle.fill' | 'info.circle.fill' | 'arrow.right.square.fill';
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Simple Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={styles.headerContent}>
            <View style={[styles.logoSmall, { backgroundColor: colors.primary }]}>
              <IconSymbol name="person.fill" size={20} color={colors.accent} />
            </View>
            <ThemedText style={[styles.appName, { color: colors.text }]} type="defaultSemiBold">
              Mi Perfil
            </ThemedText>
          </View>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileSection}>
          <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.profileInfo}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <IconSymbol name="person.fill" size={32} color={colors.accent} />
              </View>
              <View style={styles.userInfo}>
                <ThemedText style={[styles.userName, { color: colors.text }]} type="defaultSemiBold">
                  Alex Alonso
                </ThemedText>
                <ThemedText style={[styles.userEmail, { color: colors.text }]}>
                  alex.alonso@reservpark.com
                </ThemedText>
                <View style={styles.userStats}>
                  <View style={styles.statItem}>
                    <IconSymbol name="star.fill" size={14} color={colors.warning} />
                    <ThemedText style={[styles.statText, { color: colors.text }]}>
                      4.8
                    </ThemedText>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <IconSymbol name="calendar" size={14} color={colors.primary} />
                    <ThemedText style={[styles.statText, { color: colors.text }]}>
                      15 viajes
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Editar perfil', 'Función de edición de perfil')}>
              <IconSymbol name="chevron.right" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsGrid}>
            <QuickAction 
              title="Mis Vehículos"
              subtitle="2 vehículos"
              icon="car.fill"
              onPress={() => Alert.alert('Mis Vehículos', 'Gestiona tus vehículos registrados')}
            />
            <QuickAction 
              title="Pagos"
              subtitle="Visa ****1234"
              icon="creditcard.fill"
              onPress={() => Alert.alert('Métodos de Pago', 'Gestiona tus formas de pago')}
            />
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]} type="defaultSemiBold">
            Tu actividad
          </ThemedText>
          
          <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: colors.primary }]} type="defaultSemiBold">
                  €47
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                  Ahorrado este mes
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statValue, { color: colors.primary }]} type="defaultSemiBold">
                  8
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.text }]}>
                  Plazas compartidas
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]} type="defaultSemiBold">
            Configuración
          </ThemedText>
          
          <View style={styles.settingsGroup}>
            <SettingsItem 
              title="Historial de viajes"
              subtitle="Ver todas tus reservas"
              icon="list.bullet"
              onPress={() => Alert.alert('Historial', 'Ver todas tus transacciones')}
            />
            
            <SettingsItem 
              title="Notificaciones"
              subtitle="Gestionar alertas y avisos"
              icon="bell.fill"
              onPress={() => Alert.alert('Notificaciones', 'Configurar notificaciones')}
            />
            
            <SettingsItem 
              title="Configuración"
              subtitle="Privacidad y preferencias"
              icon="gearshape.fill"
              onPress={() => Alert.alert('Configuración', 'Ajustes de la aplicación')}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <ThemedText style={[styles.sectionTitle, { color: colors.text }]} type="defaultSemiBold">
            Soporte
          </ThemedText>
          
          <View style={styles.settingsGroup}>
            <SettingsItem 
              title="Centro de ayuda"
              icon="questionmark.circle.fill"
              onPress={() => Alert.alert('Ayuda', 'Centro de ayuda y soporte')}
            />
            
            <SettingsItem 
              title="Acerca de ReservPark"
              icon="info.circle.fill"
              onPress={() => Alert.alert('Acerca de', 'Información sobre ReservPark v1.0')}
            />
            
            <SettingsItem 
              title="Cerrar sesión"
              icon="arrow.right.square.fill"
              destructive={true}
              showChevron={false}
              onPress={() => Alert.alert(
                'Cerrar Sesión',
                '¿Estás seguro de que quieres cerrar sesión?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Cerrar Sesión', style: 'destructive' }
                ]
              )}
            />
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <ThemedText style={[styles.versionText, { color: colors.text }]}>
            ReservPark v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Action Component
function QuickAction({ title, subtitle, icon, onPress }: QuickActionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: colors.primary }]}>
        <IconSymbol name={icon} size={24} color={colors.accent} />
      </View>
      <View style={styles.quickActionInfo}>
        <ThemedText style={[styles.quickActionTitle, { color: colors.text }]} type="defaultSemiBold">
          {title}
        </ThemedText>
        <ThemedText style={[styles.quickActionSubtitle, { color: colors.text }]}>
          {subtitle}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

// Settings Item Component
function SettingsItem({ title, subtitle, icon, onPress, showChevron = true, destructive = false }: SettingsItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity 
      style={[styles.settingsItem, { backgroundColor: colors.surface }]}
      onPress={onPress}
    >
      <View style={styles.settingsItemLeft}>
        <View style={[
          styles.settingsIcon, 
          { backgroundColor: destructive ? colors.error : colors.background }
        ]}>
          <IconSymbol 
            name={icon} 
            size={20} 
            color={destructive ? colors.background : colors.text} 
          />
        </View>
        <View style={styles.settingsInfo}>
          <ThemedText 
            style={[
              styles.settingsTitle, 
              { color: destructive ? colors.error : colors.text }
            ]} 
            type="defaultSemiBold"
          >
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={[styles.settingsSubtitle, { color: colors.text }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>
      
      {showChevron && (
        <IconSymbol name="chevron.right" size={16} color={colors.text} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
          paddingBottom: Platform.select({
        ios: 105, // 85px tab bar + 20px spacing
        default: 85, // 65px tab bar + 20px spacing
      }),
  },
  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
  },
  // Profile section
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  statText: {
    fontSize: 12,
  },
  // Quick actions
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionInfo: {
    alignItems: 'flex-start',
  },
  quickActionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  // Stats section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statValue: {
    fontSize: 24,
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  // Settings sections
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  supportSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  settingsGroup: {
    gap: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  // Version section
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.5,
  },
});