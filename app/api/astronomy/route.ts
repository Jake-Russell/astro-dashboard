import { NextRequest, NextResponse } from "next/server";
import { AstronomyData } from "@/app/components/MoonPhaseTile";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });
    if (!lat || !lng) return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });

    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lng}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok)
            return NextResponse.json(
                { error: data.error?.message || "API error" },
                { status: res.status },
            );

        const locationData = data?.location;
        const astroData = data?.astronomy?.astro;

        if (!locationData || !astroData) {
            return NextResponse.json({ error: "Malformed API response" }, { status: 502 });
        }

        const response: AstronomyData = {
            localTime: locationData.localtime,
            location: `${locationData.name}, ${locationData.country}`,
            ...astroData,
        };

        return NextResponse.json(response);
    } catch (err) {
        return NextResponse.json({ error: `Network error: ${err}` }, { status: 500 });
    }
}
