import SwiftUI

#if os(iOS)
@main
struct ERACiOSApp: App {
    @UIApplicationDelegateAdaptor(ERACAppDelegate.self) private var appDelegate

    var body: some Scene {
        WindowGroup {
            Text("ERAC iOS MVP")
        }
    }
}
#endif
