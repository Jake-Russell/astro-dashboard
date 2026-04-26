import { WeatherResponse } from "api/weather/route";

export async function getWeatherData(lat: string, lng: string): Promise<WeatherResponse> {
    const errorResponse: WeatherResponse = {
        lat: 0,
        lon: 0,
        current: { dt: 0, sunrise: 0, sunset: 0, clouds: 0, visibility: 0, weather: [] },
        hourly: [],
        daily: [],
    };

    try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const data: WeatherResponse = await res.json();

        if (!res.ok) return { ...errorResponse, error: data.error || "API error" };

        return data;
    } catch (err) {
        return { ...errorResponse, error: `Network error: ${err}` };
    }
}
