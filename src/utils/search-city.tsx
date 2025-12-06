export interface CitySuggestion {
  name: string;
  lat: number;
  lon: number;
  state?: string;
  country: string;
}

export async function searchCity(query: string): Promise<CitySuggestion[]> {
  if (!query || query.length < 2) return [];

  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        query
      )}&limit=5&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch city suggestions");

    const data = await response.json();

    return data.map((item: CitySuggestion) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      state: item.state,
      country: item.country,
    }));
  } catch (err) {
    console.error("City search error:", err);
    return [];
  }
}
