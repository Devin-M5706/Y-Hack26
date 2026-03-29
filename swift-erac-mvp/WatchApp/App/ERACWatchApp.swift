import SwiftUI

#if os(watchOS)
@main
struct ERACWatchApp: App {
    @WKExtensionDelegateAdaptor(ERACWatchExtensionDelegate.self) private var extensionDelegate

    var body: some Scene {
        WindowGroup {
            Text("ERAC Watch MVP")
        }
    }
}
#endif
