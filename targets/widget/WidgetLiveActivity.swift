import ActivityKit
import WidgetKit
import SwiftUI

struct ParkingAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var location: String
        var timeRemaining: String
        var status: String
        var endTime: String // Hora de finalización de la reserva
        var canExtend: Bool // Si se puede extender la reserva
        var startTime: Date // Hora de inicio para calcular progreso
        var totalDurationMinutes: Int // Duración total en minutos
    }

    // Fixed non-changing properties about your activity go here!
    var reservationId: String
}

struct WidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: ParkingAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Image(systemName: "car.fill")
                        .foregroundColor(.blue)
                    Text("ReservPark")
                        .font(.headline)
                        .foregroundColor(.primary)
                    Spacer()
                    Text(context.state.status)
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(context.state.status == "Activo" ? Color.green.opacity(0.2) : Color.orange.opacity(0.2))
                        .cornerRadius(8)
                }
                
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("📍 " + context.state.location)
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Text("⏰ Termina: " + context.state.endTime)
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                    
                    // Contador mejorado con círculo de progreso visual
                    VStack(alignment: .trailing, spacing: 6) {
                        ZStack {
                            // Fondo del círculo
                            Circle()
                                .stroke(Color.blue.opacity(0.2), lineWidth: 3)
                                .frame(width: 50, height: 50)
                            
                            // Círculo de progreso dinámico
                            Circle()
                                .trim(from: 0, to: calculateProgress(startTime: context.state.startTime, totalMinutes: context.state.totalDurationMinutes))
                                .stroke(
                                    calculateProgress(startTime: context.state.startTime, totalMinutes: context.state.totalDurationMinutes) > 0.8 ? Color.green :
                                    calculateProgress(startTime: context.state.startTime, totalMinutes: context.state.totalDurationMinutes) > 0.3 ? Color.blue : Color.orange,
                                    style: StrokeStyle(lineWidth: 3, lineCap: .round)
                                )
                                .frame(width: 50, height: 50)
                                .rotationEffect(.degrees(-90))
                            
                            // Tiempo en el centro
                            Text(context.state.timeRemaining)
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.blue)
                                .minimumScaleFactor(0.8)
                        }
                        
                        Text("restante")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                
                // Botones de acción
                if context.state.canExtend {
                    HStack(spacing: 8) {
                        Button(intent: ExtendTimeIntent(reservationId: context.attributes.reservationId, minutes: 30)) {
                            HStack {
                                Image(systemName: "plus.circle.fill")
                                Text("+30min")
                            }
                            .font(.caption)
                            .foregroundColor(.blue)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.blue.opacity(0.1))
                            .cornerRadius(16)
                        }
                        .buttonStyle(.plain)
                        
                        Button(intent: ExtendTimeIntent(reservationId: context.attributes.reservationId, minutes: 60)) {
                            HStack {
                                Image(systemName: "plus.circle.fill")
                                Text("+1h")
                            }
                            .font(.caption)
                            .foregroundColor(.blue)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.blue.opacity(0.1))
                            .cornerRadius(16)
                        }
                        .buttonStyle(.plain)
                        
                        Spacer()
                        
                        Button(intent: EndReservationIntent(reservationId: context.attributes.reservationId)) {
                            HStack {
                                Image(systemName: "stop.circle.fill")
                                Text("Finalizar")
                            }
                            .font(.caption)
                            .foregroundColor(.red)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(16)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding()
            .activityBackgroundTint(Color.blue.opacity(0.1))
            .activitySystemActionForegroundColor(Color.blue)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    HStack {
                        Image(systemName: "car.fill")
                            .foregroundColor(.blue)
                        VStack(alignment: .leading) {
                            Text("ReservPark")
                                .font(.caption)
                                .fontWeight(.medium)
                            Text(context.state.status)
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                DynamicIslandExpandedRegion(.trailing) {
                    VStack(alignment: .trailing, spacing: 4) {
                        // Contador visual para Dynamic Island
                        ZStack {
                            // Mini círculo de progreso
                            Circle()
                                .stroke(Color.blue.opacity(0.3), lineWidth: 2)
                                .frame(width: 32, height: 32)
                            
                            Circle()
                                .trim(from: 0, to: calculateProgress(startTime: context.state.startTime, totalMinutes: context.state.totalDurationMinutes))
                                .stroke(
                                    calculateProgress(startTime: context.state.startTime, totalMinutes: context.state.totalDurationMinutes) > 0.8 ? Color.green :
                                    calculateProgress(startTime: context.state.startTime, totalMinutes: context.state.totalDurationMinutes) > 0.3 ? Color.blue : Color.orange,
                                    style: StrokeStyle(lineWidth: 2, lineCap: .round)
                                )
                                .frame(width: 32, height: 32)
                                .rotationEffect(.degrees(-90))
                            
                            // Icono de reloj en el centro
                            Image(systemName: "clock.fill")
                                .font(.caption2)
                                .foregroundColor(.blue)
                        }
                        
                        Text(context.state.timeRemaining)
                            .font(.caption2)
                            .fontWeight(.bold)
                            .foregroundColor(.blue)
                            .monospacedDigit() // Para que los números no se muevan
                        
                        Text("restante")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(spacing: 8) {
                        HStack {
                            Image(systemName: "location.fill")
                                .foregroundColor(.gray)
                            Text(context.state.location)
                                .font(.caption)
                                .lineLimit(1)
                            Spacer()
                        }
                        
                        // Botones de acción en Dynamic Island
                        if context.state.canExtend {
                            HStack(spacing: 6) {
                                Button(intent: ExtendTimeIntent(reservationId: context.attributes.reservationId, minutes: 30)) {
                                    Text("+30m")
                                        .font(.caption2)
                                        .fontWeight(.medium)
                                        .foregroundColor(.blue)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.blue.opacity(0.1))
                                        .cornerRadius(8)
                                }
                                .buttonStyle(.plain)
                                
                                Button(intent: ExtendTimeIntent(reservationId: context.attributes.reservationId, minutes: 60)) {
                                    Text("+1h")
                                        .font(.caption2)
                                        .fontWeight(.medium)
                                        .foregroundColor(.blue)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.blue.opacity(0.1))
                                        .cornerRadius(8)
                                }
                                .buttonStyle(.plain)
                                
                                Spacer()
                                
                                Button(intent: EndReservationIntent(reservationId: context.attributes.reservationId)) {
                                    Text("Finalizar")
                                        .font(.caption2)
                                        .fontWeight(.medium)
                                        .foregroundColor(.red)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.red.opacity(0.1))
                                        .cornerRadius(8)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
            } compactLeading: {
                Image(systemName: "car.fill")
                    .foregroundColor(.blue)
            } compactTrailing: {
                // Contador compacto con indicador visual
                HStack(spacing: 2) {
                    // Mini indicador de tiempo
                    Circle()
                        .fill(context.state.status == "Activo" ? Color.green : Color.orange)
                        .frame(width: 4, height: 4)
                    
                    Text(context.state.timeRemaining)
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.blue)
                        .monospacedDigit()
                }
            } minimal: {
                Image(systemName: "car.fill")
                    .foregroundColor(.blue)
            }
            .widgetURL(URL(string: "reservpark://reservation/\(context.attributes.reservationId)"))
            .keylineTint(Color.blue)
        }
    }
}

// MARK: - Helper Functions

func calculateProgress(startTime: Date, totalMinutes: Int) -> Double {
    let now = Date()
    let elapsedMinutes = now.timeIntervalSince(startTime) / 60.0
    let remainingMinutes = Double(totalMinutes) - elapsedMinutes
    
    // Progreso como fracción del tiempo restante (1.0 = tiempo completo, 0.0 = tiempo agotado)
    let progress = max(0.0, min(1.0, remainingMinutes / Double(totalMinutes)))
    return progress
}

func formatTimeRemaining(startTime: Date, totalMinutes: Int) -> String {
    let now = Date()
    let elapsedMinutes = now.timeIntervalSince(startTime) / 60.0
    let remainingMinutes = max(0, Double(totalMinutes) - elapsedMinutes)
    
    let hours = Int(remainingMinutes) / 60
    let minutes = Int(remainingMinutes) % 60
    
    if hours > 0 {
        return minutes > 0 ? "\(hours)h \(minutes)m" : "\(hours)h"
    } else {
        return "\(minutes)m"
    }
}

extension ParkingAttributes {
    fileprivate static var preview: ParkingAttributes {
        ParkingAttributes(reservationId: "test-reservation-123")
    }
}

extension ParkingAttributes.ContentState {
    fileprivate static var activeParking: ParkingAttributes.ContentState {
        let startTime = Date().addingTimeInterval(-30 * 60) // Iniciado hace 30 minutos
        return ParkingAttributes.ContentState(
            location: "Gran Vía, 123",
            timeRemaining: "1h 30m",
            status: "Activo",
            endTime: "14:30",
            canExtend: true,
            startTime: startTime,
            totalDurationMinutes: 120 // 2 horas total
        )
     }
     
     fileprivate static var expiringSoon: ParkingAttributes.ContentState {
         let startTime = Date().addingTimeInterval(-45 * 60) // Iniciado hace 45 minutos
         return ParkingAttributes.ContentState(
            location: "Calle Serrano, 45",
            timeRemaining: "15m",
            status: "Expira pronto",
            endTime: "13:15",
            canExtend: true,
            startTime: startTime,
            totalDurationMinutes: 60 // 1 hora total
         )
     }
}

// MARK: - App Intents for Widget Actions

import AppIntents

@available(iOS 16.0, *)
struct ExtendTimeIntent: AppIntent {
    static var title: LocalizedStringResource = "Extender tiempo de parking"
    static var description = IntentDescription("Extiende el tiempo de la reserva de parking")
    
    @Parameter(title: "Reservation ID")
    var reservationId: String
    
    @Parameter(title: "Minutes to extend")
    var minutes: Int
    
    init() {}
    
    init(reservationId: String, minutes: Int) {
        self.reservationId = reservationId
        self.minutes = minutes
    }
    
    func perform() async throws -> some IntentResult {
        // Abrir la app directamente con la acción
        let urlString = "reservpark://extend-time?id=\(reservationId)&minutes=\(minutes)"
        if let url = URL(string: urlString) {
            _ = try await OpenURLIntent(url).perform()
        }
        
        return .result()
    }
}

@available(iOS 16.0, *)
struct EndReservationIntent: AppIntent {
    static var title: LocalizedStringResource = "Finalizar reserva de parking"
    static var description = IntentDescription("Finaliza la reserva de parking actual")
    
    @Parameter(title: "Reservation ID")
    var reservationId: String
    
    init() {}
    
    init(reservationId: String) {
        self.reservationId = reservationId
    }
    
    func perform() async throws -> some IntentResult {
        // Abrir la app directamente con la acción
        let urlString = "reservpark://end-reservation?id=\(reservationId)"
        if let url = URL(string: urlString) {
            _ = try await OpenURLIntent(url).perform()
        }
        
        return .result()
    }
}

#Preview("Notification", as: .content, using: ParkingAttributes.preview) {
   WidgetLiveActivity()
} contentStates: {
    ParkingAttributes.ContentState.activeParking
    ParkingAttributes.ContentState.expiringSoon
}
