import { NextRequest, NextResponse } from "next/server";

type ConditionData = {
    text: string;
    icon: string;
    code: number;
};

export type HourData = {
    chance_of_rain: number;
    chance_of_snow: number;
    cloud: 59;
    condition: ConditionData;
    dewpoint_c: number;
    dewpoint_f: number;
    feelslike_c: number;
    feelslike_f: number;
    gust_kph: number;
    gust_mph: number;
    heatindex_c: number;
    heatindex_f: number;
    humidity: number;
    is_day: number;
    precip_in: number;
    precip_mm: number;
    pressure_in: number;
    pressure_mb: number;
    snow_cm: number;
    temp_c: number;
    temp_f: number;
    time: string;
    time_epoch: number;
    uv: number;
    vis_km: number;
    vis_miles: number;
    will_it_rain: number;
    will_it_snow: number;
    wind_degree: number;
    wind_dir: string;
    wind_kph: number;
    wind_mph: number;
    windchill_c: number;
    windchill_f: number;
};

type ForecastData = {
    date: string;
    date_epoch: number;
    astro: {
        is_moon_up: number;
        is_sun_up: number;
        moon_illumination: number;
        moon_phase: string;
        moonrise: string;
        moonset: string;
        sunrise: string;
        sunset: string;
    };
    day: {
        avghumidity: number;
        avgtemp_c: number;
        avgtemp_f: number;
        avgvis_km: number;
        avgvis_miles: number;
        condition: ConditionData;
        daily_chance_of_rain: number;
        daily_chance_of_snow: number;
        daily_will_it_rain: number;
        daily_will_it_snow: number;
        maxtemp_c: number;
        maxtemp_f: number;
        maxwind_kph: number;
        maxwind_mph: number;
        mintemp_c: number;
        mintemp_f: number;
        totalprecip_in: number;
        totalprecip_mm: number;
        totalsnow_cm: number;
        uv: number;
    };
    hour: HourData[];
};

export type WeatherResponse = {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: ConditionData;
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
    };
    forecast: {
        forecastday: ForecastData[];
    };
    error?: string;
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });
    if (!lat || !lng) return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=2`;

    try {
        const res = await fetch(url);
        const data: WeatherResponse = await res.json();

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: `Network error: ${err}` }, { status: 500 });
    }
}
