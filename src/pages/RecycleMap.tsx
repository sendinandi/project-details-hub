import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Phone, Star, Navigation, Filter } from "lucide-react";

const locations = [
  {
    id: 1,
    name: "Green Waste Bank Jakarta",
    type: "Waste Bank",
    address: "Jl. Eco Green No. 123, Central Jakarta",
    distance: "1.2 km",
    rating: 4.8,
    hours: "08:00 - 17:00",
    phone: "+62 21 1234 5678",
    acceptedWaste: ["Plastic", "Paper", "Metal", "Glass"],
  },
  {
    id: 2,
    name: "Recycle Hub South",
    type: "Recycling Center",
    address: "Jl. Sustainable Way No. 45, South Jakarta",
    distance: "2.5 km",
    rating: 4.6,
    hours: "09:00 - 18:00",
    phone: "+62 21 2345 6789",
    acceptedWaste: ["Plastic", "E-Waste", "Batteries"],
  },
  {
    id: 3,
    name: "EcoMart Collection Point",
    type: "Drop-off Point",
    address: "Mall Eco Plaza, Jl. Green Ave No. 88",
    distance: "3.1 km",
    rating: 4.5,
    hours: "10:00 - 21:00",
    phone: "+62 21 3456 7890",
    acceptedWaste: ["Plastic", "Paper", "Organic"],
  },
  {
    id: 4,
    name: "Community Compost Center",
    type: "Compost Center",
    address: "Taman Eco Community, West Jakarta",
    distance: "4.2 km",
    rating: 4.9,
    hours: "07:00 - 16:00",
    phone: "+62 21 4567 8901",
    acceptedWaste: ["Organic", "Garden Waste"],
  },
];

const filterOptions = ["All", "Waste Bank", "Recycling Center", "Drop-off Point", "Compost Center"];

const RecycleMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "All" || location.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

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
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search locations..."
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
              {filteredLocations.map((location) => (
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
                      {location.acceptedWaste.map((waste) => (
                        <Badge key={waste} variant="outline" className="text-xs">
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
              ))}
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 bg-muted relative">
            {/* Placeholder Map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  Interactive Map
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Connect to Google Maps API to view recycling locations near you. 
                  Select a location from the list to see details.
                </p>
                <Button variant="outline" className="mt-4">
                  Enable Location
                </Button>
              </div>
            </div>

            {/* Map pins would be rendered here with actual map integration */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecycleMap;
