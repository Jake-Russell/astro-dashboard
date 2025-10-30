import { NextRequest, NextResponse } from "next/server";

type WeatherData = {
    id: number;
    main: string;
    description: string;
    icon: string;
};

type MinuteData = {
    dt: number;
    precipitation: number;
};

export type HourData = Pick<MinuteData, "dt"> & {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherData[];
    pop: number;
};

type DayData = HourData & {
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: {
        day: number;
        min: number;
        max: number;
        night: number;
        eve: number;
        morn: number;
    };
    feels_like: {
        day: number;
        night: number;
        eve: number;
        morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherData[];
    clouds: number;
    pop: number;
    rain: number;
    uvi: number;
};

export type WeatherResponse = {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: {
        dt: number;
        sunrise: number;
        sunset: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        dew_point: number;
        uvi: number;
        clouds: number;
        visibility: number;
        wind_speed: number;
        wind_deg: number;
        weather: WeatherData[];
    };
    minutely: MinuteData[];
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
