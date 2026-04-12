export interface VictimEvent {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  detectedAt: Date;
  deviceType: "Apple Watch";
}

export interface UserLocation {
  lat: number;
  lng: number;
}

// Mock victim near Kline Science Tower, Yale University
export const MOCK_VICTIM: VictimEvent = {
  id: "evt-001",
  name: "John D.",
  lat: 41.31761,
  lng: -72.92315,
  address: "219 Prospect St, New Haven, CT",
  detectedAt: new Date(Date.now() - 134_000), // 2m 14s ago
  deviceType: "Apple Watch",
};

// Mock responder location ~32m from victim — realistic for demo
export const MOCK_USER_LOCATION: UserLocation = {
  lat: 41.31740,
  lng: -72.92280,
};

/** Haversine distance in meters between two lat/lng points */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sin2 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(sin2));
}

/** Format elapsed seconds as "Xm Ys ago" */
export function elapsedLabel(detectedAt: Date): string {
  const s = Math.floor((Date.now() - detectedAt.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s ago`;
}
