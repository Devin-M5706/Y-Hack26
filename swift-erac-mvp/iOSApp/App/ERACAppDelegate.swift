import Foundation

#if os(iOS)
import UIKit

final class ERACAppDelegate: UIResponder, UIApplicationDelegate {
    private let coordinator = VictimEmergencyCoordinator()

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
    ) -> Bool {
        coordinator.start()
        return true
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        coordinator.didRegisterDeviceToken(deviceToken)
    }

    func application(
        _ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable : Any],
        fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
    ) {
        coordinator.didReceiveRemoteNotification(userInfo)
        completionHandler(.newData)
    }

    func cancelEmergencyWithinWindowFromUI() {
        coordinator.cancelEmergencyWithinWindow()
    }
}

#endif
