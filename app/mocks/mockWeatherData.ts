import { DayData, HourData, WeatherResponse } from "api/weather/types";
import { mockLat, mockLng } from "./mockLocationData";

const BASE = 1767279600; // 2026-01-01T15:00:00Z

export const mockTimestamps = {
    jan2Midnight: BASE + 9 * 3600, // 2026-01-02T00:00:00Z
};

export const mockHourlyData: HourData[] = [
    {
        dt: BASE + 0 * 3600,
        clouds: 13,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    {
        dt: BASE + 1 * 3600,
        clouds: 15,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    {
        dt: BASE + 2 * 3600,
        clouds: 15,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    },
    {
        dt: BASE + 3 * 3600,
        clouds: 14,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    },
    {
        dt: BASE + 4 * 3600,
        clouds: 14,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    },
    {
        dt: BASE + 5 * 3600,
        clouds: 12,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    },
    {
        dt: BASE + 6 * 3600,
        clouds: 15,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02n" }],
    },
    {
        dt: BASE + 7 * 3600,
        clouds: 46,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03n" }],
    },
    {
        dt: BASE + 8 * 3600,
        clouds: 36,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03n" }],
    },
    {
        dt: BASE + 9 * 3600,
        clouds: 47,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03n" }],
    },
    {
        dt: BASE + 10 * 3600,
        clouds: 61,
        weather: [{ id: 803, main: "Clouds", description: "broken clouds", icon: "04n" }],
    },
    {
        dt: BASE + 11 * 3600,
        clouds: 67,
        weather: [{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }],
    },
    {
        dt: BASE + 12 * 3600,
        clouds: 73,
        weather: [{ id: 803, main: "Clouds", description: "broken clouds", icon: "04d" }],
    },
    {
        dt: BASE + 13 * 3600,
        clouds: 100,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
    {
        dt: BASE + 14 * 3600,
        clouds: 100,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
    {
        dt: BASE + 15 * 3600,
        clouds: 100,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
    {
        dt: BASE + 16 * 3600,
        clouds: 100,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
    {
        dt: BASE + 17 * 3600,
        clouds: 100,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
    {
        dt: BASE + 18 * 3600,
        clouds: 100,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
];

export const mockDayData: DayData[] = [
    {
        dt: BASE,
        sunrise: BASE - 9 * 3600, // 2026-01-01T06:00:00Z
        sunset: BASE + 4 * 3600, // 2026-01-01T19:00:00Z
        moonrise: BASE - 4 * 3600, // 2026-01-01T11:00:00Z
        moonset: BASE + 12 * 3600, // 2026-01-02T03:00:00Z
        moon_phase: 0.25,
        clouds: 20,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    {
        dt: BASE + 24 * 3600,
        sunrise: BASE + (24 - 9.5) * 3600, // 2026-01-02T05:30:00Z
        sunset: BASE + (24 + 4.5) * 3600, // 2026-01-02T19:30:00Z
        moonrise: BASE + (24 - 4.5) * 3600, // 2026-01-02T10:30:00Z
        moonset: BASE + (24 + 12.5) * 3600, // 2026-01-03T03:30:00Z
        moon_phase: 0.5,
        clouds: 80,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
    {
        dt: BASE + 48 * 3600,
        sunrise: BASE + (48 - 10) * 3600, // 2026-01-03T05:00:00Z
        sunset: BASE + (48 + 5) * 3600, // 2026-01-03T20:00:00Z
        moonrise: BASE + (48 - 5) * 3600, // 2026-01-03T10:00:00Z
        moonset: BASE + (48 + 13) * 3600, // 2026-01-04T04:00:00Z
        moon_phase: 0.75,
        clouds: 40,
        weather: [{ id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" }],
    },
];

export const mockWeatherResponse: WeatherResponse = {
    latitude: mockLat,
    longitude: mockLng,
    current: {
        dt: BASE,
        sunrise: BASE - 9 * 3600, // 2026-01-01T06:00:00Z
        sunset: BASE + 4 * 3600, // 2026-01-01T19:00:00Z
        clouds: 20,
        visibility: 10000,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    hourly: mockHourlyData,
    daily: mockDayData,
};
