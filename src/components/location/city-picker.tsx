"use client";
import { useState, useEffect } from "react";
import { searchCity, CitySuggestion } from "@/utils/search-city";

export function CityPicker({
  onSelect,
}: {
  onSelect: (location: { lat: number; lng: number; display: string }) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced Search
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      const results = await searchCity(query);
      setSuggestions(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition text-foreground"
      />

      {loading && <p className="text-xs text-muted-foreground">Searching...</p>}

      {suggestions.length > 0 && (
        <div className="absolute z-20 bg-card border border-border rounded-xl w-full shadow-lg max-h-48 overflow-auto">
          {suggestions.map((city, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-2 hover:bg-muted/30 cursor-pointer text-sm transition"
              onClick={() => {
                onSelect({
                  lat: city.lat,
                  lng: city.lon,
                  display: `${city.name}, ${city.country}`,
                });
                setQuery(`${city.name}, ${city.country}`);
                setSuggestions([]);
              }}
            >
              {city.name}
              {city.state ? `, ${city.state}` : ""} ({city.country})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
