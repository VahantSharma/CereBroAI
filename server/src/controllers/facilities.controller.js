// Sample facility data (in a real app, this would come from a database)
const facilities = [
  {
    id: "1",
    name: "City MRI & Diagnostic Center",
    type: "scan-center",
    address: "123 Medical Plaza, Delhi",
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
  {
    id: "3",
    name: "Advanced Brain & Spine Center",
    type: "both",
    address: "789 Medical Campus, Gurgaon",
    rating: 4.8,
    phone: "+91 8765432109",
    website: "https://advancedbraincenter.com",
    services: [
      "MRI Scan",
      "Neuro Surgery",
      "Tumor Treatment",
      "Radiation Therapy",
      "Chemotherapy",
    ],
    hasEmergency: true,
    coordinates: {
      lat: 28.4595,
      lng: 77.0266,
    },
  },
  {
    id: "4",
    name: "HealthFirst Imaging",
    type: "scan-center",
    address: "321 Diagnostic Lane, Noida",
    rating: 4.2,
    phone: "+91 7654321098",
    services: ["MRI Scan", "CT Scan"],
    coordinates: {
      lat: 28.5355,
      lng: 77.391,
    },
  },
  {
    id: "5",
    name: "Apex Neurology Hospital",
    type: "hospital",
    address: "555 Brain Way, Delhi",
    rating: 4.6,
    phone: "+91 6543210987",
    website: "https://apexneuro.org",
    services: ["Neuro Surgery", "Tumor Treatment", "Intensive Care"],
    hasEmergency: true,
    coordinates: {
      lat: 28.6304,
      lng: 77.2177,
    },
  },
  {
    id: "6",
    name: "Premier Diagnostic Services",
    type: "scan-center",
    address: "876 Scan Boulevard, Faridabad",
    rating: 4.3,
    phone: "+91 5432109876",
    services: ["MRI Scan", "X-Ray", "Ultrasound"],
    coordinates: {
      lat: 28.4089,
      lng: 77.3178,
    },
  },
  {
    id: "7",
    name: "Comprehensive Cancer Hospital",
    type: "hospital",
    address: "111 Oncology Drive, Ghaziabad",
    rating: 4.9,
    phone: "+91 4321098765",
    website: "https://comprehensivecancer.org",
    services: [
      "Tumor Treatment",
      "Radiation Therapy",
      "Chemotherapy",
      "Surgical Oncology",
    ],
    hasEmergency: true,
    coordinates: {
      lat: 28.6692,
      lng: 77.4538,
    },
  },
  {
    id: "8",
    name: "NeuroScan Plus",
    type: "both",
    address: "222 Brain Scan Road, Delhi",
    rating: 4.4,
    phone: "+91 3210987654",
    website: "https://neuroscanplus.com",
    services: [
      "MRI Scan",
      "CT Scan",
      "Neuro Surgery",
      "Tumor Treatment",
      "Neurology Consultation",
    ],
    coordinates: {
      lat: 28.6129,
      lng: 77.2295,
    },
  },
  {
    id: "9",
    name: "LiveWell Health Center",
    type: "both",
    address: "333 Medical District, Gurgaon",
    rating: 4.6,
    phone: "+91 2109876543",
    website: "https://livewellhealth.com",
    services: [
      "MRI Scan",
      "CT Scan",
      "Tumor Treatment",
      "Oncology",
      "General Medicine",
    ],
    hasEmergency: true,
    coordinates: {
      lat: 28.4741,
      lng: 77.0881,
    },
  },
  {
    id: "10",
    name: "BrainHealth Diagnostics",
    type: "scan-center",
    address: "444 Healthcare Street, Delhi",
    rating: 4.3,
    phone: "+91 1098765432",
    services: ["MRI Scan", "CT Scan", "PET Scan", "Neurological Tests"],
    coordinates: {
      lat: 28.6469,
      lng: 77.176,
    },
  },
  {
    id: "11",
    name: "Unity Memorial Hospital",
    type: "hospital",
    address: "555 Unity Road, Noida",
    rating: 4.7,
    phone: "+91 0987654321",
    website: "https://unitymemorial.org",
    services: [
      "Tumor Treatment",
      "Radiation Therapy",
      "Neurosurgery",
      "Critical Care",
    ],
    hasEmergency: true,
    coordinates: {
      lat: 28.5708,
      lng: 77.326,
    },
  },
  {
    id: "12",
    name: "MedTech Imaging Solutions",
    type: "scan-center",
    address: "777 Technology Park, Ghaziabad",
    rating: 4.2,
    phone: "+91 9876543210",
    services: ["MRI Scan", "Advanced Imaging", "Digital X-Ray"],
    coordinates: {
      lat: 28.6126,
      lng: 77.4237,
    },
  },
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

// Get all facilities
exports.getAllFacilities = (req, res) => {
  try {
    // In a real app, this would query a database
    res.status(200).json(facilities);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch facilities",
      error: error.message,
    });
  }
};

// Get facilities near a location with distance calculation
exports.getNearbyFacilities = (req, res) => {
  try {
    const { lat, lng, radius = 20 } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({
        status: "error",
        message: "Latitude and longitude are required",
      });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    // Calculate distance for each facility and filter by radius
    const nearbyFacilities = facilities
      .map((facility) => {
        const distance = calculateDistance(
          userLat,
          userLng,
          facility.coordinates.lat,
          facility.coordinates.lng
        );

        return {
          ...facility,
          distance,
        };
      })
      .filter((facility) => facility.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(nearbyFacilities);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch nearby facilities",
      error: error.message,
    });
  }
};
