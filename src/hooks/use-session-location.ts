"use client";

import { useEffect, useState } from "react";

interface StoredLocation {
  lat: number;
  lng: number;
  timestamp: number;
}

const FIVE_MIN = 5 * 60 * 1000;

export function useSessionLocation() {
  const [location, setLocation] = useState<StoredLocation | null>(null);

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: StoredLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        };

        sessionStorage.setItem("liveLocation", JSON.stringify(coords));
        setLocation(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocation(null);
      }
    );
  };

  useEffect(() => {
    const cached = sessionStorage.getItem("liveLocation");

    if (cached) {
      const parsed: StoredLocation = JSON.parse(cached);

      setLocation(parsed);

      if (Date.now() - parsed.timestamp > FIVE_MIN) {
        updateLocation();
      }
    } else {
      updateLocation();
    }

    const interval = setInterval(() => {
      updateLocation();
    }, FIVE_MIN);

    return () => clearInterval(interval);
  }, []);

  return location;
}
