import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateDistance, getNearbyFacilities } from "@/services/facilities";
import { Facility } from "@/types/facility";
import {
  AlertCircle,
  Filter,
  Globe,
  Hospital,
  Loader2,
  Locate,
  MapPin,
  Phone,
  Scan,
  Search,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const NearU = () => {
  // State
  const [activeTab, setActiveTab] = useState<string>("all");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxDistance, setMaxDistance] = useState<number>(20);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Filters
  const [filters, setFilters] = useState({
    emergency: false,
    mriScan: false,
    tumorTreatment: false,
    radiationTherapy: false,
    minRating: 0,
  });

  // Fetch facilities on initial load
  useEffect(() => {
    const fetchFacilities = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch all facilities initially (no location filter)
        const data = await getNearbyFacilities();
        setFacilities(data);
        setFilteredFacilities(data);
      } catch (err) {
        console.error("Error fetching facilities:", err);
        setError("Failed to fetch medical facilities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Get user location and update facilities based on it
  const getUserLocation = () => {
    setIsLocating(true);
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        try {
          setIsLoading(true);

          // Fetch facilities near the user's location
          const data = await getNearbyFacilities(
            latitude,
            longitude,
            maxDistance
          );
          setFacilities(data);

          // No need to recalculate distances, API already does that
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching nearby facilities:", err);
          setError("Failed to fetch nearby facilities. Using fallback data.");

          // If API fails, calculate distances manually for existing facilities
          if (facilities.length > 0) {
            const updatedFacilities = facilities
              .map((facility) => {
                const distance = calculateDistance(
                  latitude,
                  longitude,
                  facility.coordinates.lat,
                  facility.coordinates.lng
                );

                return {
                  ...facility,
                  distance,
                };
              })
              .sort((a, b) => a.distance - b.distance);

            setFacilities(updatedFacilities);
          }

          setIsLoading(false);
        }

        setIsLocating(false);
      },
      (error) => {
        setErrorMessage(`Error getting location: ${error.message}`);
        setIsLocating(false);
      }
    );
  };

  // Apply filters to facilities
  useEffect(() => {
    let results = [...facilities];

    // Filter by active tab
    if (activeTab === "scan-centers") {
      results = results.filter(
        (f) => f.type === "scan-center" || f.type === "both"
      );
    } else if (activeTab === "hospitals") {
      results = results.filter(
        (f) => f.type === "hospital" || f.type === "both"
      );
    }

    // Filter by distance
    results = results.filter((f) => f.distance <= maxDistance);

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.address.toLowerCase().includes(query) ||
          f.services.some((s) => s.toLowerCase().includes(query))
      );
    }

    // Apply additional filters
    if (filters.emergency) {
      results = results.filter((f) => f.hasEmergency);
    }

    if (filters.mriScan) {
      results = results.filter((f) =>
        f.services.some((s) => s.toLowerCase().includes("mri"))
      );
    }

    if (filters.tumorTreatment) {
      results = results.filter((f) =>
        f.services.some((s) => s.toLowerCase().includes("tumor"))
      );
    }

    if (filters.radiationTherapy) {
      results = results.filter((f) =>
        f.services.some((s) => s.toLowerCase().includes("radiation"))
      );
    }

    if (filters.minRating > 0) {
      results = results.filter((f) => f.rating >= filters.minRating);
    }

    // Sort by distance
    results.sort((a, b) => a.distance - b.distance);

    setFilteredFacilities(results);
  }, [facilities, activeTab, maxDistance, searchQuery, filters]);

  // When distance changes, refetch data if user location is available
  useEffect(() => {
    if (userLocation) {
      // Debounce to avoid too many requests
      const handler = setTimeout(() => {
        getNearbyFacilities(userLocation.lat, userLocation.lng, maxDistance)
          .then((data) => {
            setFacilities(data);
          })
          .catch((err) => {
            console.error("Error updating for radius change:", err);
          });
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [maxDistance, userLocation]);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-cerebro-darker text-white">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="heading-lg mb-4">Medical Facilities Near You</h1>
            <p className="text-gray-300">
              Find MRI scan centers and hospitals with brain tumor treatment
              facilities in your area.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Location and Search Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-cerebro-dark p-4 rounded-lg flex items-center space-x-4">
                <Button
                  onClick={getUserLocation}
                  variant="outline"
                  className="border-cerebro-accent text-cerebro-accent"
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-cerebro-accent border-t-transparent rounded-full" />
                      Locating...
                    </div>
                  ) : (
                    <>
                      <Locate className="h-4 w-4 mr-2" />
                      Use My Location
                    </>
                  )}
                </Button>

                <div className="flex-1">
                  {userLocation ? (
                    <div className="text-sm flex items-center">
                      <MapPin className="h-4 w-4 text-cerebro-accent mr-2" />
                      <span>Location access granted</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {errorMessage ||
                          "Share your location to find nearby facilities"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for facilities or services..."
                  className="bg-cerebro-dark border-white/10 pl-10 focus-visible:ring-cerebro-accent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              className="border border-white/10 flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <Card className="mb-8 bg-cerebro-dark border-white/10">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Distance</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span>Range</span>
                          <span>{maxDistance} km</span>
                        </div>
                        <Slider
                          value={[maxDistance]}
                          min={1}
                          max={50}
                          step={1}
                          onValueChange={(value) => setMaxDistance(value[0])}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Services</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mri-scan"
                          checked={filters.mriScan}
                          onCheckedChange={(checked) =>
                            handleFilterChange("mriScan", !!checked)
                          }
                        />
                        <Label
                          htmlFor="mri-scan"
                          className="text-sm font-normal"
                        >
                          MRI Scan Available
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="tumor-treatment"
                          checked={filters.tumorTreatment}
                          onCheckedChange={(checked) =>
                            handleFilterChange("tumorTreatment", !!checked)
                          }
                        />
                        <Label
                          htmlFor="tumor-treatment"
                          className="text-sm font-normal"
                        >
                          Tumor Treatment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="radiation-therapy"
                          checked={filters.radiationTherapy}
                          onCheckedChange={(checked) =>
                            handleFilterChange("radiationTherapy", !!checked)
                          }
                        />
                        <Label
                          htmlFor="radiation-therapy"
                          className="text-sm font-normal"
                        >
                          Radiation Therapy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="emergency"
                          checked={filters.emergency}
                          onCheckedChange={(checked) =>
                            handleFilterChange("emergency", !!checked)
                          }
                        />
                        <Label
                          htmlFor="emergency"
                          className="text-sm font-normal"
                        >
                          Emergency Services
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Rating</h3>
                    <div className="space-y-3">
                      {[4, 3, 0].map((rating) => (
                        <div
                          key={rating}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`rating-${rating}`}
                            checked={filters.minRating === rating}
                            onCheckedChange={(checked) => {
                              if (checked)
                                handleFilterChange("minRating", rating);
                              else if (filters.minRating === rating)
                                handleFilterChange("minRating", 0);
                            }}
                          />
                          <Label
                            htmlFor={`rating-${rating}`}
                            className="text-sm font-normal flex items-center"
                          >
                            {rating > 0 ? `${rating}+ stars` : "Any rating"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs and Facilities */}
          <Tabs
            defaultValue="all"
            className="space-y-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-cerebro-dark border border-white/10">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-cerebro-accent"
              >
                All Facilities
              </TabsTrigger>
              <TabsTrigger
                value="scan-centers"
                className="data-[state=active]:bg-cerebro-accent"
              >
                <Scan className="w-4 h-4 mr-2" />
                MRI Scan Centers
              </TabsTrigger>
              <TabsTrigger
                value="hospitals"
                className="data-[state=active]:bg-cerebro-accent"
              >
                <Hospital className="w-4 h-4 mr-2" />
                Hospitals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-cerebro-accent" />
                  <span className="ml-3">Loading facilities...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFacilities.length > 0 ? (
                    filteredFacilities.map((facility) => (
                      <FacilityCard key={facility.id} facility={facility} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-400">
                        No facilities match your filters. Try adjusting your
                        search criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="scan-centers" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-cerebro-accent" />
                  <span className="ml-3">Loading facilities...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFacilities.length > 0 ? (
                    filteredFacilities.map((facility) => (
                      <FacilityCard key={facility.id} facility={facility} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-400">
                        No scan centers match your filters. Try adjusting your
                        search criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="hospitals" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-cerebro-accent" />
                  <span className="ml-3">Loading facilities...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFacilities.length > 0 ? (
                    filteredFacilities.map((facility) => (
                      <FacilityCard key={facility.id} facility={facility} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-400">
                        No hospitals match your filters. Try adjusting your
                        search criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

// Facility Card Component
const FacilityCard = ({ facility }: { facility: Facility }) => {
  return (
    <Card className="bg-cerebro-dark border-white/10 overflow-hidden hover:border-cerebro-accent/50 transition-all">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-medium">{facility.name}</h3>
              <p className="text-sm text-gray-400 flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                {facility.address}
              </p>
            </div>
            <Badge
              className={
                facility.type === "scan-center"
                  ? "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                  : facility.type === "hospital"
                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                  : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
              }
            >
              {facility.type === "scan-center"
                ? "Scan Center"
                : facility.type === "hospital"
                ? "Hospital"
                : "Hospital & Scan Center"}
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-sm">{facility.rating}</span>
            </div>
            <div className="text-sm text-cerebro-accent font-medium">
              {facility.distance} km away
            </div>
          </div>

          <div className="space-y-3">
            {facility.services.slice(0, 3).map((service, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="mr-2 mb-2 bg-gray-800/50"
              >
                {service}
              </Badge>
            ))}
            {facility.services.length > 3 && (
              <Badge variant="outline" className="bg-gray-800/50">
                +{facility.services.length - 3} more
              </Badge>
            )}
          </div>

          {facility.hasEmergency && (
            <div className="mt-3">
              <Badge className="bg-red-500/20 text-red-300 hover:bg-red-500/30">
                24/7 Emergency
              </Badge>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-4 flex justify-between">
          {facility.phone && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm hover:text-cerebro-accent"
              onClick={() => window.open(`tel:${facility.phone}`)}
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              Call
            </Button>
          )}

          {facility.website && (
            <Button
              variant="ghost"
              size="sm"
              className="text-sm hover:text-cerebro-accent"
              onClick={() => window.open(facility.website, "_blank")}
            >
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              Website
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-sm hover:text-cerebro-accent"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates.lat},${facility.coordinates.lng}`,
                "_blank"
              )
            }
          >
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NearU;
