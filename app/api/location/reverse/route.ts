import { NextRequest, NextResponse } from "next/server";
import { NOMINATIM_BASE_URL, NOMINATIM_HEADERS } from "../consts";
import type { LocationReverseResponse, NominatimReverseResponse } from "../types";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon)
        return NextResponse.json({ error: "lat and lon parameters are required" }, { status: 400 });

    const url = `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json`;

    try {
        const res = await fetch(url, { headers: NOMINATIM_HEADERS });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Nominatim API error: ${res.status}` },
                { status: res.status },
            );
        }

        const data: NominatimReverseResponse = await res.json();

        if (!data || !data.display_name) {
            return NextResponse.json(
                { error: "No location found for the given coordinates" },
                { status: 404 },
            );
        }

        const name =
            data.address.village ||
            data.address.town ||
            data.address.city ||
            data.address.county ||
            "Unknown location";
        const displayName = name + `, ${data.address.country}`;

        const response: LocationReverseResponse = { name, displayName };

        return NextResponse.json(response);
    } catch (err) {
        console.error(`Error fetching reverse location data for ${lat}, ${lon}:`, err);
        return NextResponse.json({ error: `Network error: ${err}` }, { status: 500 });
    }
}
