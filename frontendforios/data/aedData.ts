export type AEDFloor = "Concourse" | "Floor 1" | "Floor 2";

export interface AEDLocation {
  id: string;
  floor: AEDFloor;
  room: string;
  label: string;
  building: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
}

export const FLOORS: AEDFloor[] = ["Concourse", "Floor 1", "Floor 2"];

// Kline Science Tower, Yale University — 219 Prospect Street
export const AED_LOCATIONS: AEDLocation[] = [
  {
    id: "aed-kt-1",
    floor: "Concourse",
    room: "C90",
    label: "Concourse — C90",
    building: "Kline Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "Near main concourse entrance",
    lat: 41.31768,
    lng: -72.92330,
  },
  {
    id: "aed-kt-2",
    floor: "Concourse",
    room: "C20",
    label: "Marx Library — C20",
    building: "Marx Library",
    address: "219 Prospect Street, New Haven, CT",
    description: "Inside Marx Science Library, concourse level",
    lat: 41.31750,
    lng: -72.92345,
  },
  {
    id: "aed-kt-3",
    floor: "Floor 1",
    room: "190A",
    label: "Floor 1 — Room 190A",
    building: "Kline Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "First floor corridor outside room 190A",
    lat: 41.31755,
    lng: -72.92318,
  },
  {
    id: "aed-kt-4",
    floor: "Floor 2",
    room: "218",
    label: "Floor 2 — Room 218",
    building: "Kline Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "Second floor corridor outside room 218",
    lat: 41.31762,
    lng: -72.92305,
  },
];
