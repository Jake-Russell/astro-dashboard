import type { AstronomyData } from "../components/MoonPhaseTile";

export async function getAstronomyData(lat: string, lng: string): Promise<AstronomyData> {
    const errorResponse: AstronomyData = {
        localTime: "",
        location: "",
        sunrise: "",
        sunset: "",
        moonrise: "",
        moonset: "",
        moon_phase: "",
        moon_illumination: 0,
        is_moon_up: false,
        is_sun_up: false,
        error: "API error",
    };

    try {
        const res = await fetch(`/api/astronomy?lat=${lat}&lng=${lng}`);
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
