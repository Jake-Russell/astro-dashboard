import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@vercel/firewall";
import { parseCoordinates } from "../../utils/parseCoordinates";
import { rateLimitedResponse } from "../../utils/rateLimitResponse";
import { NOMINATIM_BASE_URL, NOMINATIM_HEADERS } from "../consts";
import type { LocationReverseResponse, NominatimReverseResponse } from "../types";

export async function GET(request: NextRequest) {
    const { rateLimited } = await checkRateLimit("api-rate-limit", {
        request,
        rateLimitKey: "nominatim", // shared global bucket with the search route
    });

    if (rateLimited) return rateLimitedResponse();

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const parsedCoordinates = parseCoordinates(lat, lon);
    if (!parsedCoordinates.ok) {
        return NextResponse.json({ error: parsedCoordinates.error }, { status: 400 });
    }

    const { latitude, longitude } = parsedCoordinates;

    try {
        const url = `${NOMINATIM_BASE_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json`;
        const res = await fetch(url, {
            headers: NOMINATIM_HEADERS,
            signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
            const errorBody = await res.text();
            return NextResponse.json(
                { error: `Nominatim API error: ${res.status} ${errorBody || "unknown"}` },
                { status: res.status >= 500 ? 502 : res.status },
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
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: `Network error: ${message}` }, { status: 504 });
    }
}
