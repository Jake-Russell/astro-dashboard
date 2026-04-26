import { NextRequest, NextResponse } from "next/server";

type WeatherData = {
    id: number;
    main: string;
    description: string;
    icon: string;
};

export type HourData = {
    dt: number;
    clouds: number;
    weather: WeatherData[];
};

export type DayData = HourData & {
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    weather: WeatherData[];
};

export type WeatherResponse = {
    lat: number;
    lon: number;
    current: {
        dt: number;
        sunrise: number;
        sunset: number;
        clouds: number;
        visibility: number;
        weather: WeatherData[];
    };
    hourly: HourData[];
    daily: DayData[];
    error?: string;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const apiKey = process.env.OPEN_WEATHER_MAP_APP_ID;

    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });
    if (!lat || !lng) return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const data: WeatherResponse = await res.json();

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: `Network error: ${err}` }, { status: 500 });
    }
}
