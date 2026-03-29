import Foundation

#if os(iOS)
import UIKit

@MainActor
final class VictimEmergencyCoordinator {
    private let watchReceiver: WatchMessageReceiver
    private let apiClient: EmergencyAPIClient
    private let locationProvider: LocationProvider
    private let notifications: APNsNotificationManager
    private let peerRelay: MultipeerRelayService

    private var pendingTrigger: [String: Any]?
    private var cancelTask: Task<Void, Never>?

    init(
        watchReceiver: WatchMessageReceiver = WatchMessageReceiver(),
        apiClient: EmergencyAPIClient = EmergencyAPIClient(endpointURL: AppEndpoints.emergencyPOST),
        locationProvider: LocationProvider = LocationProvider(),
        notifications: APNsNotificationManager = APNsNotificationManager(),
        peerRelay: MultipeerRelayService = MultipeerRelayService()
    ) {
        self.watchReceiver = watchReceiver
        self.apiClient = apiClient
        self.locationProvider = locationProvider
        self.notifications = notifications
        self.peerRelay = peerRelay
    }

    func start() {
        locationProvider.requestAlwaysAuthorization()
        notifications.configureNotifications()
        peerRelay.start()

        watchReceiver.onEmergencyMessage = { [weak self] message in
            Task { @MainActor in
                await self?.handleWatchTrigger(message)
            }
        }

        notifications.onEmergencyPush = { [weak self] userInfo in
            Task { @MainActor in
                try? self?.relayPushToPeers(userInfo: userInfo)
            }
        }
    }

    func stop() {
        peerRelay.stop()
        cancelTask?.cancel()
    }

    func didRegisterDeviceToken(_ token: Data) {
        notifications.didRegisterForRemoteNotifications(deviceToken: token)
    }

    func didReceiveRemoteNotification(_ userInfo: [AnyHashable: Any]) {
        notifications.handleRemoteNotification(userInfo: userInfo)
    }

    func cancelEmergencyWithinWindow() {
        pendingTrigger = nil
        cancelTask?.cancel()
    }

    func injectMockEmergencyPush(_ userInfo: [AnyHashable: Any]) {
        notifications.injectMockEmergencyPush(userInfo: userInfo)
    }

    func injectMockEmergencyPush() {
        injectMockEmergencyPush(Self.defaultMockEmergencyPushPayload())
    }

    private func handleWatchTrigger(_ message: [String: Any]) async {
        pendingTrigger = message
        cancelTask?.cancel()

        cancelTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 10_000_000_000)
            await self?.commitPendingEmergency()
        }
    }

    private func commitPendingEmergency() async {
        guard let payload = pendingTrigger else { return }
        pendingTrigger = nil

        do {
            let coordinate = try await locationProvider.fetchCurrentCoordinate()
            let victimId = UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString
            let body: [String: Any] = [
                "victimId": victimId,
                "timestamp": ISO8601DateFormatter().string(from: Date()),
                "latitude": coordinate.latitude,
                "longitude": coordinate.longitude,
                "deviceToken": notifications.deviceTokenHex as Any,
                "trigger": payload
            ]

            try await apiClient.postEmergency(jsonBody: body)
        } catch {
            return
        }
    }

    private func relayPushToPeers(userInfo: [AnyHashable: Any]) throws {
        let emergencyId = (userInfo["emergencyId"] as? String) ?? UUID().uuidString
        let victimName = (userInfo["victimFirstName"] as? String) ?? "Unknown"
        let distance = numericValue(userInfo["distanceMeters"])
        let lat = numericValue(userInfo["latitude"])
        let lon = numericValue(userInfo["longitude"])

        let message = PeerEmergencyRelayMessage(
            emergencyId: emergencyId,
            victimFirstName: victimName,
            distanceMeters: distance,
            latitude: lat,
            longitude: lon
        )

        try peerRelay.relayEmergency(message)
    }

    private func numericValue(_ value: Any?) -> Double? {
        switch value {
        case let number as NSNumber:
            return number.doubleValue
        case let double as Double:
            return double
        case let int as Int:
            return Double(int)
        case let string as String:
            return Double(string)
        default:
            return nil
        }
    }

    static func defaultMockEmergencyPushPayload() -> [AnyHashable: Any] {
        [
            "emergencyId": UUID().uuidString,
            "victimFirstName": "Alex",
            "distanceMeters": 120,
            "latitude": 37.3349,
            "longitude": -122.0090
        ]
    }
}

#endif
