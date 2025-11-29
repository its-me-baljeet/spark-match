export async function getCityFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10&addressdetails=1`,
      { headers: { "User-Agent": "TinderCloneApp/1.0" } } // Required by API
    );

    if (!response.ok) throw new Error("Failed to fetch location");

    const data = await response.json();

    // Extract city-like data
    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.suburb ||
      data.address.state ||
      "Unknown location";

    return city;
  } catch (error) {
    console.error("Error fetching city:", error);
    return "Location unavailable";
  }
}
