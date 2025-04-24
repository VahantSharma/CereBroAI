export interface Facility {
  id: string;
  name: string;
  type: "scan-center" | "hospital" | "both";
  address: string;
  distance: number; // in km
  rating: number;
  phone?: string;
  website?: string;
  services: string[];
  hasEmergency?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
}
