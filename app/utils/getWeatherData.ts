import { WeatherResponse } from "../api/weather/route";

export async function getWeatherData(lat: string, lng: string): Promise<WeatherResponse> {
    const errorResponse: WeatherResponse = {
        lat: 0,
        lon: 0,
        timezone: "",
        timezone_offset: 0,
        current: {
            dt: 0,
            sunrise: 0,
            sunset: 0,
            temp: 0,
            feels_like: 0,
            pressure: 0,
            humidity: 0,
            dew_point: 0,
            uvi: 0,
            clouds: 0,
            visibility: 0,
            wind_speed: 0,
            wind_deg: 0,
            weather: [],
        },
        minutely: [],
        hourly: [],
        daily: [],
    };

    try {
        const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        if (!res.ok) {
            return {
                ...errorResponse,
                error: data.error || "API error",
            };
        }
        return data;
    } catch {
        return {
            ...errorResponse,
            error: "Network error",
        };
    }
}
