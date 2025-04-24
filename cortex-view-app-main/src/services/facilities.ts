import { Facility } from "@/types/facility";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Default fallback facilities (used when API fails or in development)
const sampleFacilities: Facility[] = [
  {
    id: "1",
    name: "City MRI & Diagnostic Center",
    type: "scan-center",
    address: "123 Medical Plaza, Delhi",
    distance: 1.2,
    rating: 4.5,
    phone: "+91 1234567890",
    website: "https://citydiagnostics.com",
    services: ["MRI Scan", "CT Scan", "PET Scan"],
    coordinates: {
      lat: 28.6139,
      lng: 77.209,
    },
  },
  {
    id: "2",
    name: "Neuro Care Hospital",
    type: "hospital",
    address: "456 Healthcare Avenue, Delhi",
    distance: 2.8,
    rating: 4.7,
    phone: "+91 9876543210",
    website: "https://neurocarehospital.org",
    services: ["Neuro Surgery", "Tumor Treatment", "Radiation Therapy"],
    hasEmergency: true,
    coordinates: {
      lat: 28.6129,
      lng: 77.2295,
    },
  },
  // More sample facilities...
];

/**
 * Fetches medical facilities near a given location
 * @param lat Latitude of user location
 * @param lng Longitude of user location
 * @param radius Search radius in kilometers
 * @returns Promise with array of facility objects
 */
export const getNearbyFacilities = async (
  lat?: number,
  lng?: number,
  radius: number = 20
): Promise<Facility[]> => {
  try {
    // If no coordinates provided, use API without location filtering
    if (!lat || !lng) {
      const response = await axios.get(`${API_URL}/facilities`);
      return response.data;
    }

    // Otherwise, get facilities near the specified location
    const response = await axios.get(`${API_URL}/facilities/nearby`, {
      params: { lat, lng, radius },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching nearby facilities:", error);

    // Fallback to sample data if API fails (remove in production)
    console.warn("Using sample facilities data as fallback");
    return sampleFacilities;
  }
};

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param lat1 First latitude
 * @param lng1 First longitude
 * @param lat2 Second latitude
 * @param lng2 Second longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return parseFloat(distance.toFixed(1));
};
