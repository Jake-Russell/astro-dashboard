import { describe, expect, it } from "vitest";
import type { WeatherResponse } from "api/weather/types";
import { mockDayData, mockTimestamps, mockWeatherResponse } from "../../mocks/mockWeatherData";
import { getNightForecastHours, getNightForecastWindow } from "../nightForecastUtils";

const getNextDayWeatherData = (currentTime: number): WeatherResponse => ({
    ...mockWeatherResponse,
    current: {
        ...mockWeatherResponse.current,
        dt: currentTime,
        sunset: mockDayData[1].sunset,
        sunrise: mockDayData[1].sunrise,
    },
    daily: [mockDayData[1], mockDayData[2]],
});

describe("getNightForecastWindow", () => {
    it("should use the active night and round the forecast start down to the current hour, given a time before sunrise", () => {
        const currentTime = mockTimestamps.jan2Midnight + 15 * 60;

        const result = getNightForecastWindow(getNextDayWeatherData(currentTime));

        expect(result).toEqual({
            forecastStart: mockTimestamps.jan2Midnight,
            forecastEnd: mockDayData[1].sunrise,
            isActiveNight: true,
        });
    });

    it("should use the upcoming night, given the current time is sunrise", () => {
        const result = getNightForecastWindow(getNextDayWeatherData(mockDayData[1].sunrise));
        expect(result).toEqual({
            forecastStart: mockDayData[1].sunset,
            forecastEnd: mockDayData[2].sunrise,
            isActiveNight: false,
        });
    });

    it("should use the upcoming night, given a time during the day", () => {
        const daytime = mockDayData[1].sunrise + 6 * 3600;

        expect(getNightForecastWindow(getNextDayWeatherData(daytime))).toEqual({
            forecastStart: mockDayData[1].sunset,
            forecastEnd: mockDayData[2].sunrise,
            isActiveNight: false,
        });
    });
});

describe("getNightForecastHours", () => {
    const hourlyForecast = [
        { dt: 1000, clouds: 0, weather: [] },
        { dt: 1500, clouds: 0, weather: [] },
        { dt: 2000, clouds: 0, weather: [] },
        { dt: 4999, clouds: 0, weather: [] },
        { dt: 5000, clouds: 0, weather: [] },
    ];

    it("should return only the remaining hours in the night, given forecast hours on each window boundary", () => {
        const result = getNightForecastHours(hourlyForecast, {
            forecastStart: 2000,
            forecastEnd: 5000,
        });

        expect(result).toEqual([hourlyForecast[2], hourlyForecast[3]]);
    });
});
