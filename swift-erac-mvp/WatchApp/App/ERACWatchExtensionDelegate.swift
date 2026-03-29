import Foundation

#if os(watchOS)
import WatchKit

final class ERACWatchExtensionDelegate: NSObject, WKExtensionDelegate {
    private let runtime = ERACWatchRuntime()

    func applicationDidFinishLaunching() {
        Task {
            try? await runtime.start()
        }
    }
}

#endif
