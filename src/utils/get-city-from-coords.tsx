export async function getCityFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch city");

    const data = await response.json();

    // Extract city name safely
    const city = data?.[0]?.name ?? "Unknown";
    console.log("Reverse geocode data:", data);

    return city;
  } catch (err) {
    console.error("Reverse geocode failed:", err);
    return "Unknown";
  }
}
