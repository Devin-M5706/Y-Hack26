import Foundation

#if os(iOS)
import WatchConnectivity

final class WatchMessageReceiver: NSObject {
    private let session: WCSession? = WCSession.isSupported() ? WCSession.default : nil
    var onEmergencyMessage: (([String: Any]) -> Void)?

    override init() {
        super.init()
        session?.delegate = self
        session?.activate()
    }
}

extension WatchMessageReceiver: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        onEmergencyMessage?(message)
    }

    func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        onEmergencyMessage?(applicationContext)
    }

    func sessionDidBecomeInactive(_ session: WCSession) {}

    func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
}

#endif
