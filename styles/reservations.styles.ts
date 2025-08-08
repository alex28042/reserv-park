import { Platform, StyleSheet } from 'react-native';

export const reservationsStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: Platform.select({ ios: 165, default: 145 }) },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoSection: { flexDirection: 'row', alignItems: 'center' },
  logoSmall: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  appName: { fontSize: 22, fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // Tabs
  tabSection: { paddingHorizontal: 20, marginBottom: 24 },
  tabContainer: { flexDirection: 'row', borderRadius: 16, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  tabText: { fontSize: 16, fontWeight: '600' },
  tabIcon: { marginRight: 4 },

  // Content
  content: { flex: 1, paddingHorizontal: 20 },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyIcon: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  emptyTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', opacity: 0.7, lineHeight: 24, marginBottom: 32 },
  emptyAction: { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  emptyActionText: { fontSize: 16, fontWeight: '600' },

  // List
  reservationsList: { flex: 1, gap: 16 },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 14, borderRadius: 14, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  itemLeft: { flex: 1, paddingRight: 12 },
  itemHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  itemSubRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemIconSmall: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  itemSubtitle: { fontSize: 12, opacity: 0.7 },
  tagChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: '700' },
  itemRight: { alignItems: 'flex-end', minWidth: 80 },
  itemPrice: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  itemMeta: { fontSize: 11, opacity: 0.6, marginBottom: 4 },
  reservationCard: { borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6, overflow: 'hidden' },

  // Compact Status Header
  statusHeader: { paddingHorizontal: 16, paddingVertical: 12, position: 'relative' },
  statusContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  statusTextContainer: { gap: 1 },
  statusText: { fontSize: 14, fontWeight: '700' },
  statusSubtext: { fontSize: 11, opacity: 0.8 },
  priceContainer: { alignItems: 'flex-end', gap: 1 },
  priceText: { fontSize: 20, fontWeight: '700' },
  priceLabel: { fontSize: 11, opacity: 0.8 },
  statusGradient: { position: 'absolute', top: 0, right: 0, width: 60, height: '100%', opacity: 0.1 },

  // Card Content
  cardContent: { padding: 16 },

  // Date and Time
  dateTimeSection: { marginBottom: 16, padding: 12, borderRadius: 10, borderWidth: 1 },
  dateTimeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  dateText: { fontSize: 16, fontWeight: '700' },
  timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 14, fontWeight: '500' },
  durationBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  durationText: { fontSize: 11, fontWeight: '600' },

  // Location
  locationSection: { marginBottom: 16, padding: 12, borderRadius: 10, borderWidth: 1 },
  locationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  locationIcon: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  locationHeaderText: { fontSize: 12, fontWeight: '600', opacity: 0.7 },
  locationAddress: { fontSize: 15, fontWeight: '600', lineHeight: 20, marginBottom: 6 },
  locationDetails: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  locationDetail: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationDetailText: { fontSize: 11, opacity: 0.7 },

  // Actions
  actionsSection: { borderTopWidth: 1, paddingTop: 12 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  secondaryButton: { borderWidth: 1, backgroundColor: 'transparent' },
  primaryButton: { borderWidth: 0 },
  actionButtonText: { fontSize: 13, fontWeight: '600' },

  // Quick actions
  quickActions: { flexDirection: 'row', marginBottom: 8, gap: 6 },
  quickAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 8, borderRadius: 8, gap: 4 },
  quickActionText: { fontSize: 11, fontWeight: '600' },

  // FAB
  fabContainer: { position: 'absolute', bottom: Platform.select({ ios: 105, default: 85 }), right: 20 },
  fab: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 12 },
  fabIcon: { marginTop: 2 },

  // Stats
  statsSection: { marginBottom: 24 },
  statsContainer: { flexDirection: 'row', borderRadius: 16, padding: 20, borderWidth: 1, gap: 20 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  statLabel: { fontSize: 12, opacity: 0.7, textAlign: 'center', lineHeight: 16 },
  statDivider: { width: 1, height: 40, opacity: 0.2 },

  // Indicators
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  urgentBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  urgentBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  // Filters
  filterSection: { marginBottom: 20 },
  filterScrollView: { paddingHorizontal: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  filterChipText: { fontSize: 14, fontWeight: '500' },

  // Pull to refresh
  refreshIndicator: { alignItems: 'center', paddingVertical: 20 },
  refreshText: { fontSize: 14, opacity: 0.7, marginTop: 8 },
});


