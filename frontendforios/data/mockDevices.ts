export type DeviceType = "iPhone" | "Apple Watch";
export type DeviceStatus = "safe" | "alert";

export interface NearbyDevice {
  id: string;
  distanceMeters: number;
  bearing: number; // degrees from north 0–360
  deviceType: DeviceType;
  status: DeviceStatus;
  lastSeen: Date;
}

// Shaped exactly to the real geofencing API contract — drop-in swap when backend ships
export const MOCK_DEVICES: NearbyDevice[] = [
  { id: "d1",  distanceMeters: 18,  bearing: 42,  deviceType: "iPhone",        status: "safe",  lastSeen: new Date() },
  { id: "d2",  distanceMeters: 35,  bearing: 128, deviceType: "Apple Watch",   status: "safe",  lastSeen: new Date() },
  { id: "d3",  distanceMeters: 67,  bearing: 290, deviceType: "iPhone",        status: "safe",  lastSeen: new Date() },
  { id: "d4",  distanceMeters: 82,  bearing: 210, deviceType: "Apple Watch",   status: "alert", lastSeen: new Date() },
  { id: "d5",  distanceMeters: 23,  bearing: 165, deviceType: "iPhone",        status: "safe",  lastSeen: new Date() },
  { id: "d6",  distanceMeters: 91,  bearing: 55,  deviceType: "iPhone",        status: "safe",  lastSeen: new Date() },
  { id: "d7",  distanceMeters: 48,  bearing: 330, deviceType: "Apple Watch",   status: "safe",  lastSeen: new Date() },
  { id: "d8",  distanceMeters: 72,  bearing: 195, deviceType: "iPhone",        status: "safe",  lastSeen: new Date() },
  { id: "d9",  distanceMeters: 15,  bearing: 88,  deviceType: "Apple Watch",   status: "safe",  lastSeen: new Date() },
  { id: "d10", distanceMeters: 56,  bearing: 260, deviceType: "iPhone",        status: "safe",  lastSeen: new Date() },
];
