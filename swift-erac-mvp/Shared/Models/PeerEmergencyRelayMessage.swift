import Foundation

public struct PeerEmergencyRelayMessage: Codable, Sendable {
    public let emergencyId: String
    public let victimFirstName: String
    public let distanceMeters: Double?
    public let latitude: Double?
    public let longitude: Double?
    public let receivedAt: Date

    public init(
        emergencyId: String,
        victimFirstName: String,
        distanceMeters: Double?,
        latitude: Double?,
        longitude: Double?,
        receivedAt: Date = Date()
    ) {
        self.emergencyId = emergencyId
        self.victimFirstName = victimFirstName
        self.distanceMeters = distanceMeters
        self.latitude = latitude
        self.longitude = longitude
        self.receivedAt = receivedAt
    }
}
