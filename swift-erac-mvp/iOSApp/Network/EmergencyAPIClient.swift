import Foundation

final class EmergencyAPIClient {
    private let endpointURL: URL
    private let urlSession: URLSession

    init(endpointURL: URL, urlSession: URLSession = .shared) {
        self.endpointURL = endpointURL
        self.urlSession = urlSession
    }

    func postEmergency(jsonBody: [String: Any]) async throws {
        var request = URLRequest(url: endpointURL)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: jsonBody, options: [])

        let (_, response) = try await urlSession.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw NSError(domain: "ERAC.iOS.Network", code: 4001, userInfo: [NSLocalizedDescriptionKey: "Emergency POST failed"])
        }
    }
}
