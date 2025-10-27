import { WeatherResponse } from "../api/weather/route";

export async function getWeatherData(lat: string, lng: string): Promise<WeatherResponse> {
    const errorResponse: WeatherResponse = {
        location: {
            name: "",
            region: "",
            country: "",
            lat: 0,
            lon: 0,
            tz_id: "",
            localtime_epoch: 0,
            localtime: "",
        },
        current: {
            last_updated_epoch: 0,
            last_updated: "",
            temp_c: 0,
            temp_f: 0,
            is_day: 0,
            condition: {
                text: "",
                icon: "",
                code: 0,
            },
            wind_mph: 0,
            wind_kph: 0,
            wind_degree: 0,
        },
        forecast: {
            forecastday: [],
        },
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
