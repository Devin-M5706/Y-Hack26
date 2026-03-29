import Foundation
import HealthKit
#if os(watchOS)
import CoreMotion
import WatchConnectivity
#endif

#if os(watchOS)
final class ERACWatchRuntime: NSObject {
    private let healthStore = HKHealthStore()
    private let activityManager = CMMotionActivityManager()
    private let session = WCSession.default

    private var observerQueries: [HKObserverQuery] = []
    private var latestMotion: String = "unknown"
    private var lastMovementAt: Date = .distantPast
    private var lastSentAt: Date?

    private let emergencyEndpoint = URL(string: "https://mock-erac-endpoint.example.com/api/v1/emergency")!

    func start() async throws {
        try await requestHealthAuthorization()
        startMotionMonitoring()
        startHealthObservers()

        session.delegate = self
        session.activate()
    }

    private func requestHealthAuthorization() async throws {
        var types = Set<HKSampleType>()
        if let t = HKObjectType.quantityType(forIdentifier: .heartRate) { types.insert(t) }
        if let t = HKObjectType.quantityType(forIdentifier: .heartRateVariabilitySDNN) { types.insert(t) }
        if let t = HKObjectType.quantityType(forIdentifier: .oxygenSaturation) { types.insert(t) }
        try await healthStore.requestAuthorization(toShare: [], read: types)
    }

    private func startHealthObservers() {
        let ids: [HKQuantityTypeIdentifier] = [.heartRate, .heartRateVariabilitySDNN, .oxygenSaturation]
        for id in ids {
            guard let type = HKObjectType.quantityType(forIdentifier: id) else { continue }
            let query = HKObserverQuery(sampleType: type, predicate: nil) { [weak self] _, completion, _ in
                Task {
                    await self?.evaluateAndTriggerIfNeeded()
                    completion()
                }
            }
            observerQueries.append(query)
            healthStore.execute(query)
            healthStore.enableBackgroundDelivery(for: type, frequency: .immediate) { _, _ in }
        }
    }

    private func startMotionMonitoring() {
        guard CMMotionActivityManager.isActivityAvailable() else { return }
        activityManager.startActivityUpdates(to: .main) { [weak self] activity in
            guard let self, let activity else { return }
            if activity.walking { self.latestMotion = "walking" }
            else if activity.running { self.latestMotion = "running" }
            else if activity.stationary { self.latestMotion = "stationary" }
            else { self.latestMotion = "unknown" }

            if self.latestMotion != "stationary" {
                self.lastMovementAt = Date()
            }
        }
    }

    private func evaluateAndTriggerIfNeeded() async {
        guard let hr = await latestValue(for: .heartRate, unit: HKUnit.count().unitDivided(by: .minute())),
              let hrv = await latestValue(for: .heartRateVariabilitySDNN, unit: HKUnit.secondUnit(with: .milli)),
              let spo2 = await latestValue(for: .oxygenSaturation, unit: HKUnit.percent()) else {
            return
        }

        let noMotion = Date().timeIntervalSince(lastMovementAt) >= 15
        let confidence = score(heartRate: hr, hrv: hrv, spo2: spo2, noMotion15s: noMotion)
        guard confidence > 0.92 else { return }

        if let lastSentAt, Date().timeIntervalSince(lastSentAt) < 20 { return }

        let timestamp = ISO8601DateFormatter().string(from: Date())
        let payload: [String: Any] = [
            "trigger": "cardiac_arrest",
            "hr": hr,
            "hrv": hrv,
            "spo2": spo2,
            "motion": latestMotion,
            "timestamp": timestamp
        ]

        sendToPhoneOrDirectPOST(payload: payload)
        lastSentAt = Date()
    }

    private func latestValue(for id: HKQuantityTypeIdentifier, unit: HKUnit) async -> Double? {
        guard let type = HKObjectType.quantityType(forIdentifier: id) else { return nil }
        return await withCheckedContinuation { continuation in
            let sort = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
            let query = HKSampleQuery(sampleType: type, predicate: nil, limit: 1, sortDescriptors: [sort]) { _, samples, _ in
                let value = (samples?.first as? HKQuantitySample)?.quantity.doubleValue(for: unit)
                continuation.resume(returning: value)
            }
            self.healthStore.execute(query)
        }
    }

    private func score(heartRate: Double, hrv: Double, spo2: Double, noMotion15s: Bool) -> Double {
        var result = 0.0
        if heartRate <= 5 { result += 0.45 }
        else if heartRate < 30 { result += 0.25 }
        if hrv <= 10 { result += 0.2 }
        if spo2 < 0.88 { result += 0.25 }
        if noMotion15s { result += 0.2 }
        return min(result, 1.0)
    }

    private func sendToPhoneOrDirectPOST(payload: [String: Any]) {
        if session.isReachable {
            session.sendMessage(payload, replyHandler: nil, errorHandler: { _ in })
            return
        }

        Task {
            var request = URLRequest(url: emergencyEndpoint)
            request.httpMethod = "POST"
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try? JSONSerialization.data(withJSONObject: ["source": "apple_watch_direct", "trigger": payload])
            _ = try? await URLSession.shared.data(for: request)
        }
    }
}

extension ERACWatchRuntime: WCSessionDelegate {
    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
}
#endif
