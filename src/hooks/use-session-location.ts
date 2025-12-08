"use client";

import { useEffect, useState } from "react";

export function useSessionLocation() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    //  Try sessionStorage first
    const cached = sessionStorage.getItem("liveLocation");
    if (cached) {
        setLocation(JSON.parse(cached));
        return;
    }

    // If no cached location → get geolocation once per tab session
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
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
  }, []);

  return location;
}
