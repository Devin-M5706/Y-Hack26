import Foundation

#if os(iOS)
import UserNotifications
import UIKit

final class APNsNotificationManager: NSObject {
    var onEmergencyPush: (([AnyHashable: Any]) -> Void)?
    private(set) var deviceTokenHex: String?

    func configureNotifications() {
        let center = UNUserNotificationCenter.current()
        center.delegate = self
        center.requestAuthorization(options: [.alert, .badge, .sound]) { _, _ in }
        DispatchQueue.main.async {
            UIApplication.shared.registerForRemoteNotifications()
        }
    }

    func didRegisterForRemoteNotifications(deviceToken: Data) {
        deviceTokenHex = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    }

    func handleRemoteNotification(userInfo: [AnyHashable: Any]) {
        onEmergencyPush?(userInfo)
    }

    func injectMockEmergencyPush(userInfo: [AnyHashable: Any]) {
        handleRemoteNotification(userInfo: userInfo)
        scheduleMockAlertBanner(userInfo: userInfo)
    }

    private func scheduleMockAlertBanner(userInfo: [AnyHashable: Any]) {
        let victimName = (userInfo["victimFirstName"] as? String) ?? "Unknown"
        let distanceText: String
        if let distance = numericValue(userInfo["distanceMeters"]) {
            distanceText = String(format: "%.0f", distance)
        } else {
            distanceText = "nearby"
        }

        let content = UNMutableNotificationContent()
        content.title = "Emergency Alert (Mock)"
        if distanceText == "nearby" {
            content.body = "Possible cardiac arrest detected for \(victimName)."
        } else {
            content.body = "Possible cardiac arrest detected for \(victimName), \(distanceText)m away."
        }
        content.sound = .default

        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.2, repeats: false)
        let request = UNNotificationRequest(
            identifier: "mock-emergency-\(UUID().uuidString)",
            content: content,
            trigger: trigger
        )
        UNUserNotificationCenter.current().add(request)
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
}

extension APNsNotificationManager: UNUserNotificationCenterDelegate {
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        onEmergencyPush?(notification.request.content.userInfo)
        completionHandler([.banner, .list, .sound])
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        onEmergencyPush?(response.notification.request.content.userInfo)
        completionHandler()
    }
}

#endif
