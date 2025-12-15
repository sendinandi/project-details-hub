import { useState, useCallback, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Phone, Star, Navigation } from "lucide-react";
import LeafletMap from "@/components/map/LeafletMap";
import AddressSearch from "@/components/map/AddressSearch";
import { supabase } from "@/integrations/supabase/client";

// Tipe data sesuai dengan yang kita harapkan dari Frontend
interface LocationData {
  id: number;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  distance: string; // Kita akan hitung ini secara manual
  rating: number;
  hours: string;
  phone: string;
  acceptedWaste: string[];
}

const filterOptions = ["All", "Waste Bank", "Recycling Center", "Drop-off Point", "Compost Center"];

const RecycleMap = () => {
  const [locations, setLocations] = useState<LocationData[]>([]); // State untuk data dari DB
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]);

  // Fungsi hitung jarak sederhana (Haversine Formula) agar tampilan jarak tetap ada
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1) + " km";
  };

  // Fetch data dari Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) {
          console.error("Error fetching locations:", error);
          return;
        }

        if (data) {
          // Mapping data dari format Database (snake_case) ke format Frontend (camelCase)
          // dan menghitung jarak berdasarkan pusat peta saat ini
          const formattedData: LocationData[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            address: item.address,
            lat: item.latitude, // Pastikan nama kolom di DB 'latitude'
            lng: item.longitude, // Pastikan nama kolom di DB 'longitude'
            distance: calculateDistance(mapCenter[0], mapCenter[1], item.latitude, item.longitude),
            rating: item.rating || 0,
            hours: item.opening_hours || "09:00 - 17:00", // Fallback jika kosong
            phone: item.phone || "-",
            // Handle array accepted_waste (bisa string array atau string biasa tergantung input)
            acceptedWaste: Array.isArray(item.accepted_waste) 
              ? item.accepted_waste 
              : typeof item.accepted_waste === 'string' 
                ? item.accepted_waste.split(',') // jaga-jaga kalau tersimpan sebagai string comma-separated
                : ["General"],
          }));
          setLocations(formattedData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [mapCenter]); // Re-fetch/Re-calc jika map center berubah (opsional, bisa dihapus depedency-nya jika berat)

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "All" || location.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleLocationSelect = useCallback((id: number) => {
    setSelectedLocation(id);
  }, []);

  const handleAddressSelect = useCallback((lat: number, lng: number, _address: string) => {
    setMapCenter([lat, lng]);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="h-[calc(100vh-5rem)] flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-[400px] bg-background border-r border-border flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-border space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-heading font-bold">Recycle Map</h1>
              </div>
              
              {/* Address Search with Autocomplete */}
              <AddressSearch
                onLocationSelect={handleAddressSelect}
                placeholder="Search address on map..."
              />

              {/* Location Filter Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter recycling locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filterOptions.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className="shrink-0 text-xs"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="text-center p-4 text-muted-foreground">Loading locations...</div>
              ) : filteredLocations.length === 0 ? (
                 <div className="text-center p-4 text-muted-foreground">No locations found.</div>
              ) : (
                filteredLocations.map((location) => (
                  <Card
                    key={location.id}
                    variant={selectedLocation === location.id ? "elevated" : "default"}
                    className={`cursor-pointer transition-all ${
                      selectedLocation === location.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedLocation(location.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {location.type}
                          </Badge>
                          <h3 className="font-heading font-semibold text-foreground">
                            {location.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{location.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 flex items-start gap-1">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        {location.address}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {location.acceptedWaste.map((waste, idx) => (
                          <Badge key={`${location.id}-${waste}-${idx}`} variant="outline" className="text-xs">
                            {waste}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {location.hours}
                        </span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <Navigation className="w-3 h-3" />
                          {location.distance}
                        </span>
                      </div>

                      {selectedLocation === location.id && (
                        <div className="mt-4 pt-4 border-t border-border flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Navigation className="w-4 h-4 mr-1" />
                            Directions
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative">
            <LeafletMap
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              center={mapCenter}
              zoom={12}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecycleMap;