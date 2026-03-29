export type AEDFloor = "Concourse" | "Floor 1" | "Floor 2";

export interface AEDLocation {
  id: string;
  floor: AEDFloor;
  room: string;
  label: string;
  building: string;
  address: string;
  description: string;
}

export const FLOORS: AEDFloor[] = ["Concourse", "Floor 1", "Floor 2"];

// Kline Science Tower, Yale University
export const AED_LOCATIONS: AEDLocation[] = [
  {
    id: "aed-kt-1",
    floor: "Concourse",
    room: "C90",
    label: "Concourse — C90",
    building: "Kline Science Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "Near main concourse entrance",
  },
  {
    id: "aed-kt-2",
    floor: "Concourse",
    room: "C20",
    label: "Marx Library — C20",
    building: "Kline Science Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "Inside Marx Science Library, concourse level",
  },
  {
    id: "aed-kt-3",
    floor: "Floor 1",
    room: "190A",
    label: "Floor 1 — Room 190A",
    building: "Kline Science Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "First floor corridor outside room 190A",
  },
  {
    id: "aed-kt-4",
    floor: "Floor 2",
    room: "218",
    label: "Floor 2 — Room 218",
    building: "Kline Science Tower",
    address: "219 Prospect Street, New Haven, CT",
    description: "Second floor corridor outside room 218",
  },
];
