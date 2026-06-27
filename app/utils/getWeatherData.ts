import type { WeatherResponse } from "api/weather/types";

export async function getWeatherData(
    latitude: number,
    longitude: number,
): Promise<WeatherResponse> {
    const errorResponse: WeatherResponse = {
        latitude: 0,
        longitude: 0,
        current: { dt: 0, sunrise: 0, sunset: 0, clouds: 0, visibility: 0, weather: [] },
        hourly: [],
        daily: [],
    };

    try {
        const res = await fetch(
            `/api/weather?lat=${encodeURIComponent(String(latitude))}&lng=${encodeURIComponent(String(longitude))}`,
        );
        const data: WeatherResponse = await res.json();

        if (!res.ok) return { ...errorResponse, error: data.error || "API error" };

        return data;
    } catch (err) {
        return { ...errorResponse, error: `Network error: ${err}` };
    }
}
