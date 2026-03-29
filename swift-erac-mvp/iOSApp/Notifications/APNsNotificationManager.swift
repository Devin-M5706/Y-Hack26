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
