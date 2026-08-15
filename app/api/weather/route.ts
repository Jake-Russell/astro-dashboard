import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@vercel/firewall";
import { env } from "../../config/env";
import { getClientIp } from "../utils/getClientIp";
import { parseCoordinates } from "../utils/parseCoordinates";
import { rateLimitedResponse } from "../utils/rateLimitResponse";
import type { WeatherResponse } from "./types";

export async function GET(req: NextRequest) {
    const { rateLimited } = await checkRateLimit("api-rate-limit", {
        request: req,
        rateLimitKey: getClientIp(req),
    });

    if (rateLimited) return rateLimitedResponse();

    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    const parsedCoordinates = parseCoordinates(lat, lon);
    if (!parsedCoordinates.ok) {
        return NextResponse.json({ error: parsedCoordinates.error }, { status: 400 });
    }

    const { latitude, longitude } = parsedCoordinates;

    try {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${env.weatherApiKey}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });

        if (!res.ok) {
            const errorBody = await res.text();
            return NextResponse.json(
                { error: `Weather provider error: ${res.status} ${errorBody || "unknown"}` },
                { status: res.status >= 500 ? 502 : res.status },
            );
        }

        const data: WeatherResponse = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);

        if (message.includes("Missing required environment variable")) {
            return NextResponse.json({ error: message }, { status: 500 });
        }

        return NextResponse.json({ error: `Network error: ${message}` }, { status: 504 });
    }
}
