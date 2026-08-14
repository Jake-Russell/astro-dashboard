import { describe, expect, it } from "vitest";
import { mockDayData, mockTimestamps, mockWeatherResponse } from "mocks/mockWeatherData";
import { getNightForecastWindow } from "../nightForecastUtils";

const getJanuarySecondWeatherData = (currentTime: number) => ({
    ...mockWeatherResponse,
    current: {
        ...mockWeatherResponse.current,
        dt: currentTime,
        sunset: mockDayData[0].sunset,
        sunrise: mockDayData[1].sunrise,
    },
    daily: [mockDayData[1], mockDayData[2]],
});

describe("getNightForecastWindow", () => {
    it("should use the active night and round the forecast start down to the current hour, given a time before sunrise", () => {
        const currentTime = mockTimestamps.jan2Midnight + 15 * 60;

        const result = getNightForecastWindow(getJanuarySecondWeatherData(currentTime));

        expect(result).toEqual({
            nightStart: mockDayData[0].sunset,
            nightEnd: mockDayData[1].sunrise,
            forecastStart: mockTimestamps.jan2Midnight,
            isActiveNight: true,
        });
    });

    it("should use the upcoming night, given the current time is sunrise", () => {
        const result = getNightForecastWindow(getJanuarySecondWeatherData(mockDayData[1].sunrise));
        expect(result).toEqual({
            nightStart: mockDayData[1].sunset,
            nightEnd: mockDayData[2].sunrise,
            forecastStart: mockDayData[1].sunset,
            isActiveNight: false,
        });
    });

    it("should use the upcoming night, given a time during the day", () => {
        const daytime = mockDayData[1].sunrise + 6 * 3600;

        expect(getNightForecastWindow(getJanuarySecondWeatherData(daytime))).toEqual({
            nightStart: mockDayData[1].sunset,
            nightEnd: mockDayData[2].sunrise,
            forecastStart: mockDayData[1].sunset,
            isActiveNight: false,
        });
    });
});
