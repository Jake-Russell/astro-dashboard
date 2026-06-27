import type { LocationReverseResponse, LocationSearchResponse } from "api/location/types";

export async function getLatLng(location: string): Promise<LocationSearchResponse> {
    const errorResponse: LocationSearchResponse = { lat: 0, lon: 0, displayName: "" };

    try {
        const res = await fetch(`/api/location/search?location=${encodeURIComponent(location)}`);
        const data: LocationSearchResponse = await res.json();

        if (!res.ok) return { ...errorResponse, error: data.error || "API error" };

        return data;
    } catch (err) {
        return { ...errorResponse, error: `Network error: ${err}` };
    }
}

export async function getLocationName(lat: number, lon: number): Promise<LocationReverseResponse> {
    const errorResponse: LocationReverseResponse = { name: "", displayName: "" };

    try {
        const res = await fetch(
            `/api/location/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`,
        );
        const data: LocationReverseResponse = await res.json();

        if (!res.ok) return { ...errorResponse, error: data.error || "API error" };

        return data;
    } catch (err) {
        return { ...errorResponse, error: `Network error: ${err}` };
    }
}
