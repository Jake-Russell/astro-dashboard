import { NextRequest, NextResponse } from "next/server";
import { NOMINATIM_BASE_URL, NOMINATIM_HEADERS } from "../consts";
import type { LocationSearchResponse, NominatimSearchResponse } from "../types";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");

    if (!location)
        return NextResponse.json({ error: "Location parameter is required" }, { status: 400 });

    const url = `${NOMINATIM_BASE_URL}/search?q=${location}&format=json&limit=1`;

    try {
        const res = await fetch(url, { headers: NOMINATIM_HEADERS });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Nominatim API Error: ${res.status}` },
                { status: res.status },
            );
        }

        const data: NominatimSearchResponse = await res.json();

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "No location found for the given search term" },
                { status: 404 },
            );
        }

        const displayName = `${data[0].display_name.split(",")[0]},${data[0].display_name.split(",").at(-1)}`;

        const response: LocationSearchResponse = {
            lat: data[0].lat,
            lon: data[0].lon,
            displayName,
        };

        return NextResponse.json(response);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `Network error: ${message}` }, { status: 500 });
    }
}
