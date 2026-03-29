# ERAC Swift MVP (watchOS + iOS)

This subdirectory contains Swift-only starter code for the Phase 2 native flow described in `PRD.md`:

1. Watch captures required HealthKit metrics (heart rate, HRV, SpO2) plus motion activity.
2. Watch sends emergency payload to paired iPhone with WatchConnectivity.
3. iPhone waits through a 10-second cancellation window, then posts to a mock HTTPS endpoint.
4. iPhone receives APNs payloads and displays push alerts.
5. iPhone relays alert payloads to nearby devices over MultipeerConnectivity.

## Folder layout

- `WatchApp/` watch-side HealthKit + motion + WatchConnectivity + direct fallback POST
- `iOSApp/` iPhone-side WatchConnectivity receive + cancellation + HTTPS relay + APNs + peer relay

## Notes

- The HTTPS endpoint is intentionally mocked via a configurable URL.
- No Python/FastAPI code is included.
- Critical Alert entitlement and capability setup must be done in Xcode project settings.

## Integration points

- Instantiate `ERACWatchRuntime` from your watch extension lifecycle and call `start()`.
- Instantiate `VictimEmergencyCoordinator` from your iOS app lifecycle and call `start()`.
- Wire APNs callbacks from `UIApplicationDelegate` into:
  - `didRegisterForRemoteNotifications` -> `didRegisterDeviceToken(_:)`
  - `didReceiveRemoteNotification` -> `didReceiveRemoteNotification(_:)`
- Wire your 10-second "I'm OK - Cancel" UI action to `cancelEmergencyWithinWindow()`.
