import { LocationReverseResponse, LocationSearchResponse } from "api/location/types";

export async function getLatLng(location: string): Promise<LocationSearchResponse> {
    const errorResponse: LocationSearchResponse = { lat: "", lon: "", displayName: "" };

    try {
        const res = await fetch(`/api/location/search?location=${encodeURIComponent(location)}`);
        const data: LocationSearchResponse = await res.json();

        if (!res.ok) return { ...errorResponse, error: data.error || "API error" };

        return data;
    } catch (err) {
        return { ...errorResponse, error: `Network error: ${err}` };
    }
}

export async function getLocationName(lat: string, lon: string): Promise<LocationReverseResponse> {
    const errorResponse: LocationReverseResponse = { name: "", displayName: "" };

    try {
        const res = await fetch(
            `/api/location/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
        );
        const data: LocationReverseResponse = await res.json();

        if (!res.ok) return { ...errorResponse, error: data.error || "API error" };

        return data;
    } catch (err) {
        return { ...errorResponse, error: `Network error: ${err}` };
    }
}
