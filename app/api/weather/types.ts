import type { GeoPosition } from "services/geolocationService";

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

export type WeatherResponse = GeoPosition & {
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
