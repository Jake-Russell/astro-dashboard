import { NextRequest, NextResponse } from "next/server";

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

        const astro = data?.astronomy?.astro;

        // TODO: Remove localTime
        const localTime = data?.location?.localtime;
        const localTimeEpoch = data?.location?.localtime_epoch;

        if (!astro) {
            return NextResponse.json({ error: "Malformed API response" }, { status: 502 });
        }

        return NextResponse.json({ ...astro, localTime, localTimeEpoch });
    } catch (err) {
        return NextResponse.json({ error: `Network error: ${err}` }, { status: 500 });
    }
}
