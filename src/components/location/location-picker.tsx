import { useState } from "react";
import { GradientButton } from "../sliders/gradient-button";
import { MapPin } from "lucide-react";
import { Alert } from "../alerts/alert";
import { CityPicker } from "./city-picker";

// 📍 Location Picker Component
export interface Location {
  lat: number;
  lng: number;
}

export interface LocationPickerProps {
  location: Location;
  onChange: (location: Location) => void;
  onLocationFetch: () => void;
}

export default function LocationPicker({
  onChange,
  onLocationFetch,
}: LocationPickerProps) {
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState(false);

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setManualLocation(true);
      return;
    }

    setFetchingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange({ lat: latitude, lng: longitude });
        setFetchingLocation(false);
        onLocationFetch();
      },
      (error) => {
        console.error(error);
        setLocationError("Unable to fetch location. Please enter manually.");
        setManualLocation(true);
        setFetchingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-4">
      {!manualLocation && (
        <div className="flex items-center gap-3">
          <GradientButton
            variant="secondary"
            size="sm"
            onClick={fetchCurrentLocation}
            disabled={fetchingLocation}
            loading={fetchingLocation}
          >
            <MapPin className="h-4 w-4" />
            {fetchingLocation ? "Getting location..." : "Use Current Location"}
          </GradientButton>
          <button
            type="button"
            onClick={() => setManualLocation(true)}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Enter manually
          </button>
        </div>
      )}

      {locationError && <Alert type="error">{locationError}</Alert>}

      {manualLocation && (
        <CityPicker
          onSelect={(loc) => onChange({ lat: loc.lat, lng: loc.lng })}
        />
      )}
    </div>
  );
}