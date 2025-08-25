import ActivityKit
import SwiftUI
import ExpoModulesCore

final class UnavailableException: GenericException<Void> {
    override var reason: String {
        "Live activities are not available on this system."
    }
}

struct ParkingAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var location: String
        var timeRemaining: String
        var status: String
        var endTime: String
        var canExtend: Bool
        var startTime: Date
        var totalDurationMinutes: Int
    }

    // Fixed non-changing properties about your activity go here!
    var reservationId: String
}

struct StartActivityReturnType: Record {
    @Field
    var id: String?
    
    @Field
    var message: String?
    
    @Field
    var isSuccess: Bool
}

struct StopActivityReturnType: Record {
    @Field
    var id: String?
    
    @Field
    var message: String?
    
    @Field
    var isSuccess: Bool
}

// MARK: Module definition

public class LiveActivityManagerModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LiveActivityManagerModule")
        
        AsyncFunction("start") {
            (
                location: String,
                timeRemaining: String,
                status: String,
                endTime: String,
                canExtend: Bool,
                totalDurationMinutes: Int,
                reservationId: String,
                promise: Promise
            ) in
            guard #available(iOS 16.2, *) else {
                throw UnavailableException(())
            }
            
            let info = ActivityAuthorizationInfo()
            guard info.areActivitiesEnabled else {
                throw UnavailableException(())
            }
            
            let initialContentState = ParkingAttributes.ContentState(
                location: location,
                timeRemaining: timeRemaining,
                status: status,
                endTime: endTime,
                canExtend: canExtend,
                startTime: Date(),
                totalDurationMinutes: totalDurationMinutes
            )
            let activityAttributes = ParkingAttributes(reservationId: reservationId)
            
            let activityContent = ActivityContent(state: initialContentState, staleDate: Date.now.addingTimeInterval(4 * 60 * 60))
            
            do {
                let activity = try Activity.request(attributes: activityAttributes, content: activityContent)
                if let id = activity.id as String? {
                    return promise.resolve(StartActivityReturnType(id: Field(wrappedValue: id), isSuccess: Field(wrappedValue: true)))
                } else {
                    return promise.resolve(StartActivityReturnType(message: Field(wrappedValue: "Failed to create parking activity"), isSuccess: Field(wrappedValue: false)))
                }
            } catch {
                return promise.resolve(StartActivityReturnType(message: Field(wrappedValue: "Error requesting Live Activity \(error.localizedDescription)."), isSuccess: Field(wrappedValue: false)))
            }
        }
        
        AsyncFunction("stop") { (id: String, promise: Promise) in
            guard #available(iOS 16.2, *) else {
                throw UnavailableException(())
            }
            
            Task {
                if let activity = Activity<ParkingAttributes>.activities.first(where: { $0.id == id }) {
                    await activity.end(dismissalPolicy: .immediate)
                    return promise.resolve(StopActivityReturnType(id: Field(wrappedValue: id), isSuccess: Field(wrappedValue: true)))
                } else {
                    return promise.resolve(StopActivityReturnType(message: Field(wrappedValue: "Activity with ID \(id) not found"), isSuccess: Field(wrappedValue: false)))
                }
            }
        }
        
        AsyncFunction("update") { 
            (
                id: String,
                location: String,
                timeRemaining: String,
                status: String,
                endTime: String,
                canExtend: Bool,
                totalDurationMinutes: Int,
                promise: Promise
            ) in
            guard #available(iOS 16.2, *) else {
                throw UnavailableException(())
            }
            
            Task {
                if let activity = Activity<ParkingAttributes>.activities.first(where: { $0.id == id }) {
                    let updatedContentState = ParkingAttributes.ContentState(
                        location: location,
                        timeRemaining: timeRemaining,
                        status: status,
                        endTime: endTime,
                        canExtend: canExtend,
                        startTime: activity.content.state.startTime, // Mantener el tiempo de inicio original
                        totalDurationMinutes: totalDurationMinutes
                    )
                    let activityContent = ActivityContent(state: updatedContentState, staleDate: Date.now.addingTimeInterval(4 * 60 * 60))
                    await activity.update(activityContent)
                    return promise.resolve(StartActivityReturnType(id: Field(wrappedValue: id), isSuccess: Field(wrappedValue: true)))
                } else {
                    return promise.resolve(StartActivityReturnType(message: Field(wrappedValue: "Activity with ID \(id) not found"), isSuccess: Field(wrappedValue: false)))
                }
            }
        }
    }
}
