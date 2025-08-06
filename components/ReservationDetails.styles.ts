import { Platform, StyleSheet } from 'react-native';

export const reservationDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 32,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  
  // Status Banner
  statusBanner: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubtext: {
    fontSize: 14,
    opacity: 0.9,
  },
  statusPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  
  // Map Section
  mapSection: {
    margin: 20,
    marginBottom: 0,
  },
  mapContainer: {
    height: 250,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  
  // Markers
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  userMarkerInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reservationMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Travel Info
  travelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  travelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  travelLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  travelValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Details Card
  detailsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  detailLabel: {
    fontSize: 16,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
  },
  
  // Actions
  actionsContainer: {
    padding: 20,
    paddingBottom: Platform.select({
      ios: 40,
      default: 20,
    }),
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});