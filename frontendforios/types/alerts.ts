export interface IncomingAlert {
  type?: string;
  emergencyId?: string;
  victimFirstName?: string;
  distanceMeters?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  ecgId?: string;
  title?: string;
  body?: string;
  confidence?: number | string | null;
  reasoning?: string;
  leadFindings?: string[];
  detectedAt?: string;
  [key: string]: unknown;
}
