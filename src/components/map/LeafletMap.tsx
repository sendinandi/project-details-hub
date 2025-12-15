import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with bundlers
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  id: number;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  hours: string;
  phone: string;
  acceptedWaste: string[];
}

interface LeafletMapProps {
  locations: Location[];
  selectedLocation: number | null;
  onLocationSelect: (id: number) => void;
  center?: [number, number];
  zoom?: number;
}

const LeafletMap = ({
  locations,
  selectedLocation,
  onLocationSelect,
  center = [-6.2088, 106.8456], // Jakarta default
  zoom = 12,
}: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add new markers
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng])
        .addTo(mapRef.current!)
        .bindPopup(
          `<div class="p-2">
            <h3 class="font-semibold">${location.name}</h3>
            <p class="text-sm text-gray-600">${location.type}</p>
            <p class="text-sm">${location.address}</p>
          </div>`
        );

      marker.on("click", () => {
        onLocationSelect(location.id);
      });

      markersRef.current[location.id] = marker;
    });
  }, [locations, onLocationSelect]);

  // Pan to selected location
  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;

    const location = locations.find((loc) => loc.id === selectedLocation);
    if (location) {
      mapRef.current.setView([location.lat, location.lng], 15);
      markersRef.current[selectedLocation]?.openPopup();
    }
  }, [selectedLocation, locations]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
};

export default LeafletMap;
