import { DayData, HourData, WeatherResponse } from "api/weather/route";

const BASE = 1767279600; // 2026-01-01T15:00:00Z

export const mockLat = 51.5074;
export const mockLng = -0.1278;

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
        sunrise: BASE - 9 * 3600, // 6AM
        sunset: BASE + 4 * 3600, // 7PM
        moonrise: BASE - 4 * 3600, // 11AM
        moonset: BASE + 12 * 3600, // 3AM next day
        moon_phase: 0.25,
        clouds: 20,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    {
        dt: BASE + 24 * 3600,
        sunrise: BASE + (24 - 9.5) * 3600, // 5:30AM
        sunset: BASE + (24 + 4.5) * 3600, // 7:30PM
        moonrise: BASE + (24 - 4.5) * 3600, // 11:30AM
        moonset: BASE + (24 + 12.5) * 3600, // 3:30AM next day
        moon_phase: 0.5,
        clouds: 80,
        weather: [{ id: 804, main: "Clouds", description: "overcast clouds", icon: "04d" }],
    },
];

export const mockWeatherResponse: WeatherResponse = {
    lat: mockLat,
    lon: mockLng,
    current: {
        dt: BASE,
        sunrise: BASE - 9 * 3600, // 6AM
        sunset: BASE + 4 * 3600, // 7PM
        clouds: 20,
        visibility: 10000,
        weather: [{ id: 801, main: "Clouds", description: "few clouds", icon: "02d" }],
    },
    hourly: mockHourlyData,
    daily: mockDayData,
};
